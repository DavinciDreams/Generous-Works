"use client";

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import type {
  Edge,
  EdgeTypes,
  Node,
  NodeTypes,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckIcon,
  CopyIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// --- Types ---

export interface NodeEditorData {
  nodes: Node[];
  edges: Edge[];
}

export interface NodeEditorOptions {
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  fitView?: boolean;
  showMiniMap?: boolean;
  showControls?: boolean;
  showBackground?: boolean;
  interactive?: boolean;
  panOnScroll?: boolean;
  zoomOnScroll?: boolean;
  zoomOnDoubleClick?: boolean;
  deleteKeyCode?: string | string[];
  selectionKeyCode?: string | string[];
}

export type NodeEditorProps = HTMLAttributes<HTMLDivElement> & {
  data: NodeEditorData;
  options?: NodeEditorOptions;
  title?: string;
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onConnect?: OnConnect;
};

interface NodeEditorContextType {
  data: NodeEditorData;
  options?: NodeEditorOptions;
  title?: string;
  error: Error | null;
  setError: (error: Error | null) => void;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
  nodes: Node[];
  edges: Edge[];
  onNodesChangeInternal: OnNodesChange;
  onEdgesChangeInternal: OnEdgesChange;
  onConnectInternal: OnConnect;
}

// --- Context ---

const NodeEditorContext = createContext<NodeEditorContextType | null>(null);

export const useNodeEditor = () => {
  const context = useContext(NodeEditorContext);
  if (!context) {
    throw new Error("NodeEditor components must be used within NodeEditor");
  }
  return context;
};

// --- Utilities ---

const validateNodeEditorData = (data: NodeEditorData): boolean => {
  if (!data.nodes || !Array.isArray(data.nodes)) {
    return false;
  }
  if (!data.edges || !Array.isArray(data.edges)) {
    return false;
  }
  return true;
};

// --- Main Component ---

export const NodeEditor = memo(
  ({
    data,
    options,
    title,
    onNodesChange,
    onEdgesChange,
    onConnect,
    className,
    children,
    ...props
  }: NodeEditorProps) => {
    const [error, setError] = useState<Error | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [prevData, setPrevData] = useState(data);

    // Use React Flow state management
    const [nodes, setNodes, onNodesChangeInternal] = useNodesState(data.nodes);
    const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(data.edges);

    // Clear error when data changes (derived state pattern)
    if (data !== prevData) {
      setPrevData(data);
      setError(null);
      // Update nodes and edges when data changes
      setNodes(data.nodes);
      setEdges(data.edges);
    }

    // Handle connection
    const onConnectInternal = useCallback<OnConnect>(
      (params) => {
        setEdges((eds) => addEdge(params, eds));
        onConnect?.(params);
      },
      [setEdges, onConnect]
    );

    // Wrap internal handlers with user-provided handlers
    const handleNodesChange = useCallback<OnNodesChange>(
      (changes) => {
        onNodesChangeInternal(changes);
        onNodesChange?.(changes);
      },
      [onNodesChangeInternal, onNodesChange]
    );

    const handleEdgesChange = useCallback<OnEdgesChange>(
      (changes) => {
        onEdgesChangeInternal(changes);
        onEdgesChange?.(changes);
      },
      [onEdgesChangeInternal, onEdgesChange]
    );

    const contextValue = useMemo<NodeEditorContextType>(
      () => ({
        data,
        edges,
        error,
        isFullscreen,
        nodes,
        onConnectInternal,
        onEdgesChangeInternal: handleEdgesChange,
        onNodesChangeInternal: handleNodesChange,
        options,
        setError,
        setIsFullscreen,
        title,
      }),
      [
        data,
        options,
        title,
        error,
        isFullscreen,
        nodes,
        edges,
        handleNodesChange,
        handleEdgesChange,
        onConnectInternal,
      ]
    );

    return (
      <NodeEditorContext.Provider value={contextValue}>
        <div
          className={cn(
            "node-editor group relative overflow-hidden rounded-md border bg-background",
            isFullscreen && "fixed inset-0 z-50 rounded-none",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </NodeEditorContext.Provider>
    );
  }
);

NodeEditor.displayName = "NodeEditor";

// --- Header Component ---

export type NodeEditorHeaderProps = HTMLAttributes<HTMLDivElement>;

export const NodeEditorHeader = memo(
  ({ className, children, ...props }: NodeEditorHeaderProps) => (
    <div
      className={cn(
        "flex items-center justify-between border-b bg-muted/80 px-3 py-2 text-muted-foreground text-xs",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

NodeEditorHeader.displayName = "NodeEditorHeader";

// --- Title Component ---

export type NodeEditorTitleProps = HTMLAttributes<HTMLDivElement>;

export const NodeEditorTitle = memo(
  ({ className, children, ...props }: NodeEditorTitleProps) => {
    const { title, nodes } = useNodeEditor();

    return (
      <div className={cn("flex items-center gap-2", className)} {...props}>
        <span className="font-mono">
          {children ?? title ?? `Node Editor (${nodes.length} nodes)`}
        </span>
      </div>
    );
  }
);

NodeEditorTitle.displayName = "NodeEditorTitle";

// --- Actions Component ---

export type NodeEditorActionsProps = HTMLAttributes<HTMLDivElement>;

export const NodeEditorActions = memo(
  ({ className, children, ...props }: NodeEditorActionsProps) => (
    <div
      className={cn("-my-1 -mr-1 flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);

NodeEditorActions.displayName = "NodeEditorActions";

// --- Copy Button Component ---

export type NodeEditorCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const NodeEditorCopyButton = memo(
  ({
    onCopy,
    onError,
    timeout = 2000,
    children,
    className,
    ...props
  }: NodeEditorCopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<number>(0);
    const { nodes, edges } = useNodeEditor();

    const copyToClipboard = useCallback(async () => {
      if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
        onError?.(new Error("Clipboard API not available"));
        return;
      }

      try {
        if (!isCopied) {
          const data = { edges, nodes };
          await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
          setIsCopied(true);
          onCopy?.();
          timeoutRef.current = window.setTimeout(
            () => setIsCopied(false),
            timeout
          );
        }
      } catch (error) {
        onError?.(error as Error);
      }
    }, [nodes, edges, onCopy, onError, timeout, isCopied]);

    useEffect(
      () => () => {
        window.clearTimeout(timeoutRef.current);
      },
      []
    );

    const Icon = isCopied ? CheckIcon : CopyIcon;

    return (
      <Button
        className={cn("shrink-0", className)}
        onClick={copyToClipboard}
        size="icon"
        variant="ghost"
        {...props}
      >
        {children ?? <Icon size={14} />}
      </Button>
    );
  }
);

NodeEditorCopyButton.displayName = "NodeEditorCopyButton";

// --- Fullscreen Button Component ---

export type NodeEditorFullscreenButtonProps = ComponentProps<typeof Button>;

export const NodeEditorFullscreenButton = memo(
  ({ children, className, ...props }: NodeEditorFullscreenButtonProps) => {
    const { isFullscreen, setIsFullscreen } = useNodeEditor();

    const toggleFullscreen = useCallback(() => {
      setIsFullscreen(!isFullscreen);
    }, [isFullscreen, setIsFullscreen]);

    const Icon = isFullscreen ? MinimizeIcon : MaximizeIcon;

    return (
      <Button
        className={cn("shrink-0", className)}
        onClick={toggleFullscreen}
        size="icon"
        variant="ghost"
        {...props}
      >
        {children ?? <Icon size={14} />}
      </Button>
    );
  }
);

NodeEditorFullscreenButton.displayName = "NodeEditorFullscreenButton";

// --- Content Component ---

export type NodeEditorContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const NodeEditorContent = memo(
  ({ className, ...props }: NodeEditorContentProps) => {
    const {
      nodes,
      edges,
      options,
      setError,
      onNodesChangeInternal,
      onEdgesChangeInternal,
      onConnectInternal,
    } = useNodeEditor();

    // Validate node editor data
    useEffect(() => {
      if (!validateNodeEditorData({ edges, nodes })) {
        setError(
          new Error("Invalid node editor data: must have nodes and edges arrays")
        );
      }
    }, [nodes, edges, setError]);

    const defaultOptions: Partial<NodeEditorOptions> = {
      deleteKeyCode: ["Backspace", "Delete"],
      fitView: true,
      interactive: true,
      panOnScroll: true,
      showBackground: true,
      showControls: true,
      showMiniMap: false,
      zoomOnDoubleClick: false,
      zoomOnScroll: true,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return (
      <div
        className={cn("node-editor-content relative h-[600px]", className)}
        {...props}
      >
        <ReactFlow
          deleteKeyCode={mergedOptions.deleteKeyCode}
          edgeTypes={mergedOptions.edgeTypes}
          edges={edges}
          fitView={mergedOptions.fitView}
          nodeTypes={mergedOptions.nodeTypes}
          nodes={nodes}
          onConnect={onConnectInternal}
          onEdgesChange={onEdgesChangeInternal}
          onNodesChange={onNodesChangeInternal}
          panOnScroll={mergedOptions.panOnScroll}
          zoomOnDoubleClick={mergedOptions.zoomOnDoubleClick}
          zoomOnScroll={mergedOptions.zoomOnScroll}
        >
          {mergedOptions.showBackground && (
            <Background bgColor="var(--background)" />
          )}
          {mergedOptions.showControls && <Controls />}
          {mergedOptions.showMiniMap && (
            <MiniMap
              nodeColor="var(--primary)"
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
          )}
        </ReactFlow>
      </div>
    );
  }
);

NodeEditorContent.displayName = "NodeEditorContent";

// --- Error Component ---

export type NodeEditorErrorProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: ReactNode | ((error: Error) => ReactNode);
};

const renderChildren = (
  children: ReactNode | ((error: Error) => ReactNode),
  error: Error
): ReactNode => {
  if (typeof children === "function") {
    return children(error);
  }
  return children;
};

export const NodeEditorError = memo(
  ({ className, children, ...props }: NodeEditorErrorProps) => {
    const { error } = useNodeEditor();

    if (!error) {
      return null;
    }

    return (
      <div
        className={cn(
          "m-4 flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm",
          className
        )}
        {...props}
      >
        {children ? (
          renderChildren(children, error)
        ) : (
          <>
            <AlertCircle className="size-4 shrink-0" />
            <span>{error.message}</span>
          </>
        )}
      </div>
    );
  }
);

NodeEditorError.displayName = "NodeEditorError";
