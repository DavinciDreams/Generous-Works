"use client";
/**
 * @module JSONViewer
 * @description AI-powered JSON viewer component built on @uiw/react-json-view.
 * Renders JSON data with collapsible nodes, syntax highlighting, and dark/light
 * theme support. Includes copy-to-clipboard, JSON download, and fullscreen mode.
 *
 * Uses a compound component pattern: JSONViewer (root), JSONViewerHeader,
 * JSONViewerContent, and action buttons.
 *
 * @example
 * ```tsx
 * <JSONViewer data={{ json: { name: "Alice", age: 30, hobbies: ["reading", "coding"] } }}>
 *   <JSONViewerHeader>
 *     <JSONViewerTitle>API Response</JSONViewerTitle>
 *   </JSONViewerHeader>
 *   <JSONViewerContent />
 * </JSONViewer>
 * ```
 */

import type { ComponentProps, HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  MaximizeIcon,
  MinimizeIcon,
  FileJson2Icon,
} from "lucide-react";
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useState,
} from "react";

// @uiw/react-json-view imports
import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";

// Import schemas
import type {
  JSONViewerData,
  JSONViewerOptions,
  JSONViewerTheme,
} from "@/lib/schemas/jsonviewer.schema";

// --- Types ---

/** Props for the {@link JSONViewer} root component. */
export type JSONViewerProps = ComponentProps<"div"> & {
  /** JSON data to display in the viewer. */
  data: JSONViewerData;
  /** Optional configuration for theme, collapsed state, and display options. */
  options?: JSONViewerOptions;
};

interface JSONViewerContextValue {
  data: JSONViewerData;
  options: JSONViewerOptions;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
}

const JSONViewerContext = createContext<JSONViewerContextValue | null>(null);

export const useJSONViewer = () => {
  const context = useContext(JSONViewerContext);
  if (!context) {
    throw new Error("JSONViewer components must be used within JSONViewer");
  }
  return context;
};

// Helper to get theme object from theme name
const getTheme = (themeName?: JSONViewerTheme) => {
  switch (themeName) {
    case "dark":
    case "github":
    case "vscode":
      return darkTheme; // All dark themes use darkTheme
    case "light":
    default:
      return undefined; // Use default light theme
  }
};

// --- JSONViewer Root Component ---

export const JSONViewer = memo(
  forwardRef<HTMLDivElement, JSONViewerProps>(
    ({ data, options = {}, className, children, ...props }, ref) => {
      const [isFullscreen, setIsFullscreen] = useState(false);
      const compact = options.mode === "compact";

      const value: JSONViewerContextValue = {
        data,
        options,
        isFullscreen,
        setIsFullscreen,
      };

      return (
        <JSONViewerContext.Provider value={value}>
          <div
            ref={ref}
            className={cn(
              "jsonviewer-container flex flex-col rounded-lg border bg-card",
              compact && "text-xs",
              isFullscreen && "fixed inset-0 z-50 m-0 rounded-none",
              className
            )}
            style={{
              width: options.width || "100%",
              height: isFullscreen ? "100vh" : (options.height ?? (compact ? 320 : 600)),
            }}
            {...props}
          >
            {children}
          </div>
        </JSONViewerContext.Provider>
      );
    }
  )
);

JSONViewer.displayName = "JSONViewer";

// --- JSONViewer Header ---

export type JSONViewerHeaderProps = HTMLAttributes<HTMLDivElement>;

export const JSONViewerHeader = memo(
  forwardRef<HTMLDivElement, JSONViewerHeaderProps>(
    ({ className, children, ...props }, ref) => {
      const { options } = useJSONViewer();
      const compact = options.mode === "compact";

      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-between gap-2 border-b",
            compact ? "px-3 py-2" : "p-4",
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

JSONViewerHeader.displayName = "JSONViewerHeader";

// --- JSONViewer Title ---

export type JSONViewerTitleProps = HTMLAttributes<HTMLDivElement>;

export const JSONViewerTitle = memo(
  forwardRef<HTMLDivElement, JSONViewerTitleProps>(
    ({ className, children, ...props }, ref) => {
      const { data, options } = useJSONViewer();

      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          <FileJson2Icon className={cn("text-muted-foreground", options.mode === "compact" ? "size-4" : "size-5")} />
          <h3 className={cn("font-semibold", options.mode === "compact" ? "text-sm" : "text-lg")}>
            {children || (options.mode === "compact"
              ? "JSON Inspector"
              : data.rootName || "JSON Viewer")}
          </h3>
        </div>
      );
    }
  )
);

JSONViewerTitle.displayName = "JSONViewerTitle";

// --- JSONViewer Actions ---

export type JSONViewerActionsProps = HTMLAttributes<HTMLDivElement>;

export const JSONViewerActions = memo(
  forwardRef<HTMLDivElement, JSONViewerActionsProps>(
    ({ className, children, ...props }, ref) => {
      return (
        <div
          ref={ref}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          {children}
        </div>
      );
    }
  )
);

JSONViewerActions.displayName = "JSONViewerActions";

// --- JSONViewer Copy Button ---

export const JSONViewerCopyButton = memo(() => {
  const [copied, setCopied] = useState(false);
  const { data, options } = useJSONViewer();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data.value, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  }, [data.value]);

  return (
    <Button
      variant="outline"
      size={options.mode === "compact" ? "icon-xs" : "icon"}
      onClick={handleCopy}
      aria-label="Copy JSON"
    >
      {copied ? (
        <CheckIcon className="h-4 w-4 text-green-600" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

JSONViewerCopyButton.displayName = "JSONViewerCopyButton";

// --- JSONViewer Download Button ---

export const JSONViewerDownloadButton = memo(() => {
  const { data, options } = useJSONViewer();

  const handleDownload = useCallback(() => {
    try {
      const jsonString = JSON.stringify(data.value, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.rootName || "data"}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download JSON:", err);
    }
  }, [data]);

  return (
    <Button
      variant="outline"
      size={options.mode === "compact" ? "icon-xs" : "icon"}
      onClick={handleDownload}
      aria-label="Download JSON"
    >
      <DownloadIcon className="h-4 w-4" />
    </Button>
  );
});

JSONViewerDownloadButton.displayName = "JSONViewerDownloadButton";

// --- JSONViewer Fullscreen Button ---

export const JSONViewerFullscreenButton = memo(() => {
  const { isFullscreen, setIsFullscreen, options } = useJSONViewer();

  return (
    <Button
      variant="outline"
      size={options.mode === "compact" ? "icon-xs" : "icon"}
      onClick={() => setIsFullscreen(!isFullscreen)}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
    >
      {isFullscreen ? (
        <MinimizeIcon className="h-4 w-4" />
      ) : (
        <MaximizeIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

JSONViewerFullscreenButton.displayName = "JSONViewerFullscreenButton";

// --- JSONViewer Content ---

export type JSONViewerContentProps = HTMLAttributes<HTMLDivElement>;

export const JSONViewerContent = memo(
  forwardRef<HTMLDivElement, JSONViewerContentProps>(
    ({ className, ...props }, ref) => {
      const { data, options } = useJSONViewer();

      const theme = getTheme(options?.theme);
      const compact = options?.mode === "compact";

      return (
        <div
          ref={ref}
          className={cn(
            "jsonviewer-content flex-1 overflow-auto",
            compact ? "p-3" : "p-4",
            className
          )}
          {...props}
        >
          <JsonView
            value={data.value}
            keyName={data.rootName}
            collapsed={data.collapsed ?? (compact ? 2 : false)}
            style={theme as React.CSSProperties}
            displayDataTypes={options?.displayDataTypes ?? !compact}
            displayObjectSize={options?.displayObjectSize ?? true}
            enableClipboard={options?.enableClipboard ?? true}
            shortenTextAfterLength={options?.maxStringLength ?? (compact ? 120 : undefined)}
          />
        </div>
      );
    }
  )
);

JSONViewerContent.displayName = "JSONViewerContent";

// --- Exports ---

export type {
  JSONViewerData,
  JSONViewerOptions,
  JSONViewerTheme,
} from "@/lib/schemas/jsonviewer.schema";
