"use client";

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import type { Edge, Node, NodeTypes } from "@xyflow/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckIcon,
  CopyIcon,
  MaximizeIcon,
  MinimizeIcon,
  SearchIcon,
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
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// --- Types ---

export type EntityType =
  | "person"
  | "organization"
  | "concept"
  | "location"
  | "event"
  | "document"
  | "custom";

export interface KnowledgeGraphEntity {
  id: string;
  label: string;
  type: EntityType;
  description?: string;
  properties?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface KnowledgeGraphRelationship {
  id: string;
  source: string;
  target: string;
  type: string;
  label?: string;
  properties?: Record<string, unknown>;
  bidirectional?: boolean;
  [key: string]: unknown;
}

export interface KnowledgeGraphData {
  entities: KnowledgeGraphEntity[];
  relationships: KnowledgeGraphRelationship[];
}

export interface KnowledgeGraphOptions {
  layout?: "force" | "hierarchical" | "radial" | "manual";
  showLabels?: boolean;
  showTypes?: boolean;
  interactive?: boolean;
  colorScheme?: Record<EntityType, string>;
}

export type KnowledgeGraphProps = HTMLAttributes<HTMLDivElement> & {
  data: KnowledgeGraphData;
  options?: KnowledgeGraphOptions;
  title?: string;
};

interface KnowledgeGraphContextType {
  data: KnowledgeGraphData;
  options?: KnowledgeGraphOptions;
  title?: string;
  error: Error | null;
  setError: (error: Error | null) => void;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
  nodes: Node[];
  edges: Edge[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredNodes: Node[];
  filteredEdges: Edge[];
}

// --- Context ---

const KnowledgeGraphContext = createContext<KnowledgeGraphContextType | null>(
  null
);

export const useKnowledgeGraph = () => {
  const context = useContext(KnowledgeGraphContext);
  if (!context) {
    throw new Error(
      "KnowledgeGraph components must be used within KnowledgeGraph"
    );
  }
  return context;
};

// --- Utilities ---

const DEFAULT_COLORS: Record<EntityType, string> = {
  concept: "hsl(var(--chart-1))",
  custom: "hsl(var(--muted))",
  document: "hsl(var(--chart-4))",
  event: "hsl(var(--chart-5))",
  location: "hsl(var(--chart-3))",
  organization: "hsl(var(--chart-2))",
  person: "hsl(var(--primary))",
};

const validateKnowledgeGraphData = (data: KnowledgeGraphData): boolean => {
  if (!data.entities || !Array.isArray(data.entities)) {
    return false;
  }
  if (!data.relationships || !Array.isArray(data.relationships)) {
    return false;
  }
  if (data.entities.length === 0) {
    return false;
  }
  return true;
};

// Convert entities and relationships to React Flow nodes and edges
const convertToReactFlowFormat = (
  data: KnowledgeGraphData,
  colorScheme: Record<EntityType, string>
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = data.entities.map((entity, index) => ({
    id: entity.id,
    position: {
      // Simple circular layout as default
      x: 300 + 250 * Math.cos((2 * Math.PI * index) / data.entities.length),
      y: 300 + 250 * Math.sin((2 * Math.PI * index) / data.entities.length),
    },
    data: {
      ...entity,
      color: colorScheme[entity.type] || colorScheme.custom,
    },
    type: "knowledgeNode",
  }));

  const edges: Edge[] = data.relationships.map((rel) => ({
    id: rel.id,
    source: rel.source,
    target: rel.target,
    label: rel.label || rel.type,
    type: rel.bidirectional ? "default" : "default",
    animated: false,
    data: rel,
  }));

  return { nodes, edges };
};

// --- Custom Node Component ---

interface KnowledgeNodeData {
  id: string;
  label: string;
  type: EntityType;
  description?: string;
  color: string;
}

const KnowledgeNode = ({ data }: { data: KnowledgeNodeData }) => (
  <div
    className="group relative rounded-lg border-2 bg-background p-3 shadow-lg transition-all hover:shadow-xl"
    style={{ borderColor: data.color, minWidth: 150 }}
  >
    <Handle
      className="opacity-0 group-hover:opacity-100"
      position={Position.Top}
      type="target"
    />
    <Handle
      className="opacity-0 group-hover:opacity-100"
      position={Position.Bottom}
      type="source"
    />
    <Handle
      className="opacity-0 group-hover:opacity-100"
      position={Position.Left}
      type="target"
    />
    <Handle
      className="opacity-0 group-hover:opacity-100"
      position={Position.Right}
      type="source"
    />

    <div className="flex flex-col gap-1">
      <Badge
        className="w-fit text-xs"
        style={{ backgroundColor: data.color }}
        variant="default"
      >
        {data.type}
      </Badge>
      <div className="font-semibold text-sm">{data.label}</div>
      {data.description && (
        <div className="text-muted-foreground text-xs">{data.description}</div>
      )}
    </div>
  </div>
);

const nodeTypes: NodeTypes = {
  knowledgeNode: KnowledgeNode,
};

// --- Main Component ---

export const KnowledgeGraph = memo(
  ({
    data,
    options,
    title,
    className,
    children,
    ...props
  }: KnowledgeGraphProps) => {
    const [error, setError] = useState<Error | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [prevData, setPrevData] = useState(data);

    const colorScheme = options?.colorScheme || DEFAULT_COLORS;

    // Convert data to React Flow format
    const { nodes: initialNodes, edges: initialEdges } = useMemo(
      () => convertToReactFlowFormat(data, colorScheme),
      [data, colorScheme]
    );

    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);

    // Clear error when data changes
    if (data !== prevData) {
      setPrevData(data);
      setError(null);
      setNodes(initialNodes);
      setEdges(initialEdges);
    }

    // Filter nodes and edges based on search query
    const { filteredNodes, filteredEdges } = useMemo(() => {
      if (!searchQuery.trim()) {
        return { filteredNodes: nodes, filteredEdges: edges };
      }

      const query = searchQuery.toLowerCase();
      const matchingNodeIds = new Set(
        nodes
          .filter((node) => {
            const entity = node.data as unknown as KnowledgeNodeData;
            return (
              entity.label.toLowerCase().includes(query) ||
              entity.type.toLowerCase().includes(query) ||
              entity.description?.toLowerCase().includes(query)
            );
          })
          .map((n) => n.id)
      );

      const filteredNodes = nodes.map((node) => ({
        ...node,
        hidden: !matchingNodeIds.has(node.id),
      }));

      const filteredEdges = edges.map((edge) => ({
        ...edge,
        hidden:
          !matchingNodeIds.has(edge.source) ||
          !matchingNodeIds.has(edge.target),
      }));

      return { filteredNodes, filteredEdges };
    }, [nodes, edges, searchQuery]);

    const contextValue = useMemo<KnowledgeGraphContextType>(
      () => ({
        data,
        edges,
        error,
        filteredEdges,
        filteredNodes,
        isFullscreen,
        nodes,
        options,
        searchQuery,
        setError,
        setIsFullscreen,
        setSearchQuery,
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
        searchQuery,
        filteredNodes,
        filteredEdges,
      ]
    );

    return (
      <KnowledgeGraphContext.Provider value={contextValue}>
        <div
          className={cn(
            "knowledge-graph group relative overflow-hidden rounded-md border bg-background",
            isFullscreen && "fixed inset-0 z-50 rounded-none",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </KnowledgeGraphContext.Provider>
    );
  }
);

KnowledgeGraph.displayName = "KnowledgeGraph";

// --- Header Component ---

export type KnowledgeGraphHeaderProps = HTMLAttributes<HTMLDivElement>;

export const KnowledgeGraphHeader = memo(
  ({ className, children, ...props }: KnowledgeGraphHeaderProps) => (
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

KnowledgeGraphHeader.displayName = "KnowledgeGraphHeader";

// --- Title Component ---

export type KnowledgeGraphTitleProps = HTMLAttributes<HTMLDivElement>;

export const KnowledgeGraphTitle = memo(
  ({ className, children, ...props }: KnowledgeGraphTitleProps) => {
    const { title, data } = useKnowledgeGraph();

    return (
      <div className={cn("flex items-center gap-2", className)} {...props}>
        <span className="font-mono">
          {children ??
            title ??
            `Knowledge Graph (${data.entities.length} entities, ${data.relationships.length} relationships)`}
        </span>
      </div>
    );
  }
);

KnowledgeGraphTitle.displayName = "KnowledgeGraphTitle";

// --- Actions Component ---

export type KnowledgeGraphActionsProps = HTMLAttributes<HTMLDivElement>;

export const KnowledgeGraphActions = memo(
  ({ className, children, ...props }: KnowledgeGraphActionsProps) => (
    <div
      className={cn("-my-1 -mr-1 flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);

KnowledgeGraphActions.displayName = "KnowledgeGraphActions";

// --- Search Component ---

export type KnowledgeGraphSearchProps = Omit<
  ComponentProps<typeof Input>,
  "value" | "onChange"
>;

export const KnowledgeGraphSearch = memo(
  ({ className, ...props }: KnowledgeGraphSearchProps) => {
    const { searchQuery, setSearchQuery } = useKnowledgeGraph();

    return (
      <div className="relative">
        <SearchIcon className="absolute top-1/2 left-2 size-3 -translate-y-1/2 text-muted-foreground" />
        <Input
          className={cn("h-7 w-48 pl-7 text-xs", className)}
          placeholder="Search entities..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          {...props}
        />
      </div>
    );
  }
);

KnowledgeGraphSearch.displayName = "KnowledgeGraphSearch";

// --- Copy Button Component ---

export type KnowledgeGraphCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const KnowledgeGraphCopyButton = memo(
  ({
    onCopy,
    onError,
    timeout = 2000,
    children,
    className,
    ...props
  }: KnowledgeGraphCopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<number>(0);
    const { data } = useKnowledgeGraph();

    const copyToClipboard = useCallback(async () => {
      if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
        onError?.(new Error("Clipboard API not available"));
        return;
      }

      try {
        if (!isCopied) {
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
    }, [data, onCopy, onError, timeout, isCopied]);

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

KnowledgeGraphCopyButton.displayName = "KnowledgeGraphCopyButton";

// --- Fullscreen Button Component ---

export type KnowledgeGraphFullscreenButtonProps = ComponentProps<typeof Button>;

export const KnowledgeGraphFullscreenButton = memo(
  ({ children, className, ...props }: KnowledgeGraphFullscreenButtonProps) => {
    const { isFullscreen, setIsFullscreen } = useKnowledgeGraph();

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

KnowledgeGraphFullscreenButton.displayName = "KnowledgeGraphFullscreenButton";

// --- Content Component ---

export type KnowledgeGraphContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const KnowledgeGraphContent = memo(
  ({ className, ...props }: KnowledgeGraphContentProps) => {
    const { filteredNodes, filteredEdges, setError } =
      useKnowledgeGraph();

    // Validate knowledge graph data
    useEffect(() => {
      if (
        !validateKnowledgeGraphData({
          entities: filteredNodes.map((n) => n.data as unknown as KnowledgeGraphEntity),
          relationships: filteredEdges.map((e) => (e.data ?? {}) as unknown as KnowledgeGraphRelationship),
        })
      ) {
        setError(
          new Error(
            "Invalid knowledge graph data: must have entities and relationships arrays"
          )
        );
      }
    }, [filteredNodes, filteredEdges, setError]);

    // Options are handled via the options prop passed to the component

    return (
      <div
        className={cn(
          "knowledge-graph-content relative h-[600px]",
          className
        )}
        {...props}
      >
        <ReactFlow
          edges={filteredEdges}
          fitView
          nodeTypes={nodeTypes}
          nodes={filteredNodes}
          panOnScroll
          zoomOnScroll
        >
          <Background bgColor="var(--background)" />
          <Controls />
        </ReactFlow>
      </div>
    );
  }
);

KnowledgeGraphContent.displayName = "KnowledgeGraphContent";

// --- Error Component ---

export type KnowledgeGraphErrorProps = Omit<
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

export const KnowledgeGraphError = memo(
  ({ className, children, ...props }: KnowledgeGraphErrorProps) => {
    const { error } = useKnowledgeGraph();

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

KnowledgeGraphError.displayName = "KnowledgeGraphError";

// --- Legend Component ---

export type KnowledgeGraphLegendProps = HTMLAttributes<HTMLDivElement>;

export const KnowledgeGraphLegend = memo(
  ({ className, ...props }: KnowledgeGraphLegendProps) => {
    const { data, options } = useKnowledgeGraph();
    const colorScheme = options?.colorScheme || DEFAULT_COLORS;

    // Get unique entity types from data
    const entityTypes = useMemo(() => {
      const types = new Set(data.entities.map((e) => e.type));
      return Array.from(types);
    }, [data.entities]);

    return (
      <div
        className={cn(
          "absolute right-4 bottom-4 z-10 rounded-md border bg-background/95 p-3 shadow-lg backdrop-blur",
          className
        )}
        {...props}
      >
        <div className="mb-2 font-semibold text-xs">Entity Types</div>
        <div className="flex flex-col gap-1">
          {entityTypes.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="size-3 rounded-full"
                style={{ backgroundColor: colorScheme[type] }}
              />
              <span className="text-xs capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

KnowledgeGraphLegend.displayName = "KnowledgeGraphLegend";
