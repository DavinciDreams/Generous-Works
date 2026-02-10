"use client";

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckIcon,
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
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

// --- Types ---

export type MermaidMode = "preview" | "code";

export interface MermaidData {
  diagram: string;
  theme?: "default" | "dark" | "forest" | "neutral";
}

export interface MermaidOptions {
  theme?: "default" | "dark" | "forest" | "neutral";
  securityLevel?: "strict" | "loose" | "antiscript" | "sandbox";
  startOnLoad?: boolean;
  [key: string]: unknown;
}

export type MermaidProps = HTMLAttributes<HTMLDivElement> & {
  data: MermaidData;
  options?: MermaidOptions;
  title?: string;
};

interface MermaidContextType {
  data: MermaidData;
  options?: MermaidOptions;
  title?: string;
  error: Error | null;
  setError: (error: Error | null) => void;
  mode: MermaidMode;
  setMode: (mode: MermaidMode) => void;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
}

// --- Context ---

const MermaidContext = createContext<MermaidContextType | null>(null);

export const useMermaid = () => {
  const context = useContext(MermaidContext);
  if (!context) {
    throw new Error("Mermaid components must be used within Mermaid");
  }
  return context;
};

// --- Main Component ---

export const Mermaid = memo(
  ({
    data,
    options,
    title,
    className,
    children,
    ...props
  }: MermaidProps) => {
    const [error, setError] = useState<Error | null>(null);
    const [mode, setMode] = useState<MermaidMode>("preview");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [prevDiagram, setPrevDiagram] = useState(data.diagram);

    // Clear error when diagram changes
    if (data.diagram !== prevDiagram) {
      setPrevDiagram(data.diagram);
      setError(null);
    }

    const contextValue = useMemo<MermaidContextType>(
      () => ({
        data,
        options,
        title,
        error,
        setError,
        mode,
        setMode,
        isFullscreen,
        setIsFullscreen,
      }),
      [data, options, title, error, mode, isFullscreen]
    );

    return (
      <MermaidContext.Provider value={contextValue}>
        <div
          className={cn(
            "group relative overflow-hidden rounded-md border bg-background",
            isFullscreen && "fixed inset-0 z-50 rounded-none",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </MermaidContext.Provider>
    );
  }
);

Mermaid.displayName = "Mermaid";

// --- Header Component ---

export type MermaidHeaderProps = HTMLAttributes<HTMLDivElement>;

export const MermaidHeader = memo(
  ({ className, children, ...props }: MermaidHeaderProps) => (
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

MermaidHeader.displayName = "MermaidHeader";

// --- Title Component ---

export type MermaidTitleProps = HTMLAttributes<HTMLDivElement>;

export const MermaidTitle = memo(
  ({ className, children, ...props }: MermaidTitleProps) => {
    const { title } = useMermaid();

    return (
      <div className={cn("flex items-center gap-2", className)} {...props}>
        <span className="font-mono">{children ?? title ?? "Mermaid Diagram"}</span>
      </div>
    );
  }
);

MermaidTitle.displayName = "MermaidTitle";

// --- Actions Component ---

export type MermaidActionsProps = HTMLAttributes<HTMLDivElement>;

export const MermaidActions = memo(
  ({ className, children, ...props }: MermaidActionsProps) => (
    <div
      className={cn("-my-1 -mr-1 flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);

MermaidActions.displayName = "MermaidActions";

// --- Mode Toggle Component ---

export type MermaidModeToggleProps = ComponentProps<typeof Select>;

export const MermaidModeToggle = memo(
  ({ onValueChange, ...props }: MermaidModeToggleProps) => {
    const { mode, setMode } = useMermaid();

    const handleValueChange = useCallback(
      (value: string) => {
        setMode(value as MermaidMode);
        onValueChange?.(value);
      },
      [setMode, onValueChange]
    );

    return (
      <Select value={mode} onValueChange={handleValueChange} {...props}>
        <SelectTrigger className="h-7 border-none bg-transparent px-2 text-xs shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="preview">
            <div className="flex items-center gap-2">
              <EyeIcon size={14} />
              <span>Preview</span>
            </div>
          </SelectItem>
          <SelectItem value="code">
            <div className="flex items-center gap-2">
              <CodeIcon size={14} />
              <span>Source</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }
);

MermaidModeToggle.displayName = "MermaidModeToggle";

// --- Copy Button Component ---

export type MermaidCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const MermaidCopyButton = memo(
  ({
    onCopy,
    onError,
    timeout = 2000,
    children,
    className,
    ...props
  }: MermaidCopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<number>(0);
    const { data } = useMermaid();

    const copyToClipboard = useCallback(async () => {
      if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
        onError?.(new Error("Clipboard API not available"));
        return;
      }

      try {
        if (!isCopied) {
          await navigator.clipboard.writeText(data.diagram);
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
    }, [data.diagram, onCopy, onError, timeout, isCopied]);

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

MermaidCopyButton.displayName = "MermaidCopyButton";

// --- Download Button Component ---

export type MermaidDownloadButtonProps = ComponentProps<typeof Button> & {
  onDownload?: () => void;
  onError?: (error: Error) => void;
};

export const MermaidDownloadButton = memo(
  ({
    onDownload,
    onError,
    children,
    className,
    ...props
  }: MermaidDownloadButtonProps) => {
    const { data } = useMermaid();

    const downloadDiagram = useCallback(() => {
      try {
        const blob = new Blob([data.diagram], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "diagram.mmd";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        onDownload?.();
      } catch (error) {
        onError?.(error as Error);
      }
    }, [data.diagram, onDownload, onError]);

    return (
      <Button
        className={cn("shrink-0", className)}
        onClick={downloadDiagram}
        size="icon"
        variant="ghost"
        {...props}
      >
        {children ?? <DownloadIcon size={14} />}
      </Button>
    );
  }
);

MermaidDownloadButton.displayName = "MermaidDownloadButton";

// --- Fullscreen Button Component ---

export type MermaidFullscreenButtonProps = ComponentProps<typeof Button>;

export const MermaidFullscreenButton = memo(
  ({ children, className, ...props }: MermaidFullscreenButtonProps) => {
    const { isFullscreen, setIsFullscreen } = useMermaid();

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

MermaidFullscreenButton.displayName = "MermaidFullscreenButton";

// --- Content Component ---

export type MermaidContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const MermaidContent = memo(
  ({ className, ...props }: MermaidContentProps) => {
    const { data, options, mode, setError } = useMermaid();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Only render on client
    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Show source if mode is "code"
    const shouldShowSource = mode === "code";

    // Render diagram with Mermaid
    useEffect(() => {
      if (!isMounted || shouldShowSource || !containerRef.current) return;

      const renderDiagram = async () => {
        try {
          const mermaid = (await import("mermaid")).default;

          // Initialize mermaid
          mermaid.initialize({
            startOnLoad: false,
            theme: options?.theme || data.theme || "default",
            securityLevel: options?.securityLevel || "strict",
            ...options,
          });

          // Clear previous content
          if (containerRef.current) {
            containerRef.current.innerHTML = "";
          }

          // Generate unique ID
          const id = `mermaid-${Date.now()}`;

          // Render diagram
          const { svg } = await mermaid.render(id, data.diagram);

          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        } catch (err) {
          console.error("Failed to render Mermaid diagram:", err);
          setError(
            err instanceof Error ? err : new Error("Failed to render diagram")
          );
        }
      };

      renderDiagram();
    }, [isMounted, data.diagram, data.theme, options, shouldShowSource, setError]);

    if (!isMounted) {
      return (
        <div className={cn("relative p-4", className)} {...props}>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            Loading Mermaid renderer...
          </div>
        </div>
      );
    }

    if (shouldShowSource) {
      return (
        <div className={cn("relative overflow-auto", className)} {...props}>
          <pre className="m-0 p-4 text-sm">
            <code className="font-mono text-sm">{data.diagram}</code>
          </pre>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "relative flex items-center justify-center bg-muted/30 p-4",
          className
        )}
        {...props}
      >
        <div ref={containerRef} className="mermaid-container" />
      </div>
    );
  }
);

MermaidContent.displayName = "MermaidContent";

// --- Error Component ---

export type MermaidErrorProps = Omit<
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

export const MermaidError = memo(
  ({ className, children, ...props }: MermaidErrorProps) => {
    const { error } = useMermaid();

    if (!error) {
      return null;
    }

    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm",
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

MermaidError.displayName = "MermaidError";
