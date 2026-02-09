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

export type SVGPreviewProps = HTMLAttributes<HTMLDivElement> & {
  svg: string;
  title?: string;
  filename?: string;
  width?: string | number;
  height?: string | number;
};

export type SVGPreviewMode = "preview" | "code";

interface SVGPreviewContextType {
  svg: string;
  title?: string;
  filename?: string;
  width?: string | number;
  height?: string | number;
  error: Error | null;
  setError: (error: Error | null) => void;
  mode: SVGPreviewMode;
  setMode: (mode: SVGPreviewMode) => void;
}

// --- Context ---

const SVGPreviewContext = createContext<SVGPreviewContextType | null>(null);

export const useSVGPreview = () => {
  const context = useContext(SVGPreviewContext);
  if (!context) {
    throw new Error("SVGPreview components must be used within SVGPreview");
  }
  return context;
};

// --- Utilities ---

const validateSVG = (svg: string): boolean => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");
    const parserError = doc.querySelector("parsererror");
    return !parserError;
  } catch {
    return false;
  }
};

const extractSVGDimensions = (
  svg: string
): { width?: string; height?: string } => {
  const widthMatch = svg.match(/width=["']([^"']+)["']/);
  const heightMatch = svg.match(/height=["']([^"']+)["']/);
  return {
    height: heightMatch?.[1],
    width: widthMatch?.[1],
  };
};

// --- Main Component ---

export const SVGPreview = memo(
  ({
    svg,
    title,
    filename = "image.svg",
    width,
    height,
    className,
    children,
    ...props
  }: SVGPreviewProps) => {
    const [error, setError] = useState<Error | null>(null);
    const [mode, setMode] = useState<SVGPreviewMode>("preview");
    const [prevSvg, setPrevSvg] = useState(svg);

    // Clear error when svg changes (derived state pattern)
    if (svg !== prevSvg) {
      setPrevSvg(svg);
      setError(null);
    }

    const contextValue = useMemo<SVGPreviewContextType>(
      () => ({
        error,
        filename,
        height,
        mode,
        setError,
        setMode,
        svg,
        title,
        width,
      }),
      [svg, title, filename, width, height, error, mode]
    );

    return (
      <SVGPreviewContext.Provider value={contextValue}>
        <div
          className={cn(
            "group relative overflow-hidden rounded-md border bg-background",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </SVGPreviewContext.Provider>
    );
  }
);

SVGPreview.displayName = "SVGPreview";

// --- Header Component ---

export type SVGPreviewHeaderProps = HTMLAttributes<HTMLDivElement>;

export const SVGPreviewHeader = memo(
  ({ className, children, ...props }: SVGPreviewHeaderProps) => (
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

SVGPreviewHeader.displayName = "SVGPreviewHeader";

// --- Title Component ---

export type SVGPreviewTitleProps = HTMLAttributes<HTMLDivElement>;

export const SVGPreviewTitle = memo(
  ({ className, children, ...props }: SVGPreviewTitleProps) => {
    const { title, filename } = useSVGPreview();

    return (
      <div className={cn("flex items-center gap-2", className)} {...props}>
        <span className="font-mono">{children ?? title ?? filename}</span>
      </div>
    );
  }
);

SVGPreviewTitle.displayName = "SVGPreviewTitle";

// --- Actions Component ---

export type SVGPreviewActionsProps = HTMLAttributes<HTMLDivElement>;

export const SVGPreviewActions = memo(
  ({ className, children, ...props }: SVGPreviewActionsProps) => (
    <div
      className={cn("-my-1 -mr-1 flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);

SVGPreviewActions.displayName = "SVGPreviewActions";

// --- Mode Toggle Component ---

export type SVGPreviewModeToggleProps = ComponentProps<typeof Select>;

export const SVGPreviewModeToggle = memo(
  ({ onValueChange, ...props }: SVGPreviewModeToggleProps) => {
    const { mode, setMode } = useSVGPreview();

    const handleValueChange = useCallback(
      (value: string) => {
        setMode(value as SVGPreviewMode);
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

SVGPreviewModeToggle.displayName = "SVGPreviewModeToggle";

// --- Copy Button Component ---

export type SVGPreviewCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const SVGPreviewCopyButton = memo(
  ({
    onCopy,
    onError,
    timeout = 2000,
    children,
    className,
    ...props
  }: SVGPreviewCopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<number>(0);
    const { svg } = useSVGPreview();

    const copyToClipboard = useCallback(async () => {
      if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
        onError?.(new Error("Clipboard API not available"));
        return;
      }

      try {
        if (!isCopied) {
          await navigator.clipboard.writeText(svg);
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
    }, [svg, onCopy, onError, timeout, isCopied]);

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

SVGPreviewCopyButton.displayName = "SVGPreviewCopyButton";

// --- Download Button Component ---

export type SVGPreviewDownloadButtonProps = ComponentProps<typeof Button> & {
  onDownload?: () => void;
  onError?: (error: Error) => void;
};

export const SVGPreviewDownloadButton = memo(
  ({
    onDownload,
    onError,
    children,
    className,
    ...props
  }: SVGPreviewDownloadButtonProps) => {
    const { svg, filename } = useSVGPreview();

    const downloadSVG = useCallback(() => {
      try {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename ?? "image.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        onDownload?.();
      } catch (error) {
        onError?.(error as Error);
      }
    }, [svg, filename, onDownload, onError]);

    return (
      <Button
        className={cn("shrink-0", className)}
        onClick={downloadSVG}
        size="icon"
        variant="ghost"
        {...props}
      >
        {children ?? <DownloadIcon size={14} />}
      </Button>
    );
  }
);

SVGPreviewDownloadButton.displayName = "SVGPreviewDownloadButton";

// --- Content Component ---

export type SVGPreviewContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  showSource?: boolean;
  isolate?: boolean;
};

export const SVGPreviewContent = memo(
  ({
    showSource = false,
    isolate = false,
    className,
    ...props
  }: SVGPreviewContentProps) => {
    const { svg, mode, width, height, setError } = useSVGPreview();

    // Show source if mode is "code" or showSource prop is true
    const shouldShowSource = mode === "code" || showSource;

    // Extract dimensions from SVG if not provided - must be before early return
    const dimensions = useMemo(() => extractSVGDimensions(svg), [svg]);
    const svgWidth = width ?? dimensions.width ?? "100%";
    const svgHeight = height ?? dimensions.height ?? "auto";

    // Validate SVG when rendering preview mode
    useEffect(() => {
      if (!shouldShowSource && !validateSVG(svg)) {
        setError(new Error("Invalid SVG markup"));
      }
    }, [svg, shouldShowSource, setError]);

    if (shouldShowSource) {
      return (
        <div className={cn("relative overflow-auto", className)} {...props}>
          <pre className="m-0 p-4 text-sm">
            <code className="font-mono text-sm">{svg}</code>
          </pre>
        </div>
      );
    }

    if (isolate) {
      // Render in iframe for isolation
      return (
        <div
          className={cn("relative flex items-center justify-center p-4", className)}
          {...props}
        >
          <iframe
            className="border-0"
            srcDoc={`<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    svg { max-width: 100%; height: auto; }
  </style>
</head>
<body>${svg}</body>
</html>`}
            style={{ height: svgHeight, width: svgWidth }}
            title="SVG Preview"
          />
        </div>
      );
    }

    // Render inline
    return (
      <div
        className={cn(
          "relative flex items-center justify-center bg-muted/30 p-4",
          className
        )}
        {...props}
      >
        <div
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{ height: svgHeight, width: svgWidth }}
        />
      </div>
    );
  }
);

SVGPreviewContent.displayName = "SVGPreviewContent";

// --- Error Component ---

export type SVGPreviewErrorProps = Omit<
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

export const SVGPreviewError = memo(
  ({ className, children, ...props }: SVGPreviewErrorProps) => {
    const { error } = useSVGPreview();

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

SVGPreviewError.displayName = "SVGPreviewError";

// --- Fullscreen Button Component ---

export type SVGPreviewFullscreenButtonProps = ComponentProps<typeof Button> & {
  onFullscreen?: () => void;
};

export const SVGPreviewFullscreenButton = memo(
  ({
    onFullscreen,
    children,
    className,
    ...props
  }: SVGPreviewFullscreenButtonProps) => {
    const handleFullscreen = useCallback(() => {
      onFullscreen?.();
    }, [onFullscreen]);

    return (
      <Button
        className={cn("shrink-0", className)}
        onClick={handleFullscreen}
        size="icon"
        variant="ghost"
        {...props}
      >
        {children ?? <MaximizeIcon size={14} />}
      </Button>
    );
  }
);

SVGPreviewFullscreenButton.displayName = "SVGPreviewFullscreenButton";
