"use client";

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
} from "lucide-react";
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  startTransition,
  useState,
} from "react";
import type {
  WYSIWYGData,
  WYSIWYGOptions,
  FeaturesConfig,
  ContentFormat,
} from "@/lib/schemas/wysiwyg.schema";

// --- Re-export types for convenience ---

export type {
  WYSIWYGData,
  WYSIWYGOptions,
  FeaturesConfig,
  ContentFormat,
}

// --- Context ---

interface WYSIWYGContextValue {
  data: WYSIWYGData;
  options?: WYSIWYGOptions;
  error: string | null;
  setError: (error: string | null) => void;
  content: string;
  setContent: (content: string) => void;
}

const WYSIWYGContext = createContext<WYSIWYGContextValue | null>(null);

const useWYSIWYGContext = () => {
  const context = useContext(WYSIWYGContext);
  if (!context) {
    throw new Error("WYSIWYG components must be used within WYSIWYG");
  }
  return context;
};

// --- WYSIWYG Component ---

export interface WYSIWYGProps extends HTMLAttributes<HTMLDivElement> {
  data: WYSIWYGData;
  options?: WYSIWYGOptions;
  children?: ReactNode;
}

export const WYSIWYG = forwardRef<HTMLDivElement, WYSIWYGProps>(
  ({ data, options, children, className, ...props }, ref) => {
    // Defensive check for data
    const safeData = data || { content: '' };
    const [error, setError] = useState<string | null>(null);
    const [content, setContent] = useState(safeData.content);

    const contextValue: WYSIWYGContextValue = {
      data,
      options,
      error,
      setError,
      content,
      setContent,
    };

    return (
      <WYSIWYGContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "flex flex-col gap-2 rounded-lg border bg-card text-card-foreground shadow-sm",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </WYSIWYGContext.Provider>
    );
  }
);

WYSIWYG.displayName = "WYSIWYG";

// --- WYSIWYG Header ---

export const WYSIWYGHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between border-b bg-muted/80 px-3 py-2 text-muted-foreground text-xs",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

WYSIWYGHeader.displayName = "WYSIWYGHeader";

// --- WYSIWYG Title ---

export const WYSIWYGTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { data } = useWYSIWYGContext();

  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      <span className="font-mono">
        {children || `WYSIWYG Editor (${data.format.toUpperCase()})`}
      </span>
    </div>
  );
});

WYSIWYGTitle.displayName = "WYSIWYGTitle";

// --- WYSIWYG Actions ---

export const WYSIWYGActions = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("-my-1 -mr-1 flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});

WYSIWYGActions.displayName = "WYSIWYGActions";

// --- WYSIWYG Export Button ---

export const WYSIWYGExportButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button> & { format?: 'markdown' | 'html' }
>(({ className, format = 'markdown', ...props }, ref) => {
  const { content, data } = useWYSIWYGContext();

  const handleExport = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document.${format === 'markdown' ? 'md' : 'html'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, format]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 hover:bg-muted", className)}
      onClick={handleExport}
      title={`Export as ${format.toUpperCase()}`}
      {...props}
    >
      <DownloadIcon className="h-3.5 w-3.5" />
    </Button>
  );
});

WYSIWYGExportButton.displayName = "WYSIWYGExportButton";

// --- WYSIWYG Copy Button ---

export const WYSIWYGCopyButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { content } = useWYSIWYGContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 hover:bg-muted", className)}
      onClick={handleCopy}
      {...props}
    >
      {copied ? (
        <CheckIcon className="h-3.5 w-3.5" />
      ) : (
        <CopyIcon className="h-3.5 w-3.5" />
      )}
    </Button>
  );
});

WYSIWYGCopyButton.displayName = "WYSIWYGCopyButton";

// --- WYSIWYG Content ---

export const WYSIWYGContent = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const { data, options, error, setError, content, setContent } =
        useWYSIWYGContext();

      const [isMounted, setIsMounted] = useState(false);

      // Only render on client
      useEffect(() => {
        startTransition(() => {
          setIsMounted(true);
        });
      }, []);

      if (error) {
        return <WYSIWYGError error={error} />;
      }

      const height = options?.height || 500;
      const width = options?.width || '100%';

      if (!isMounted) {
        return (
          <div
            ref={ref}
            className={cn("relative flex-1 p-4", className)}
            {...props}
          >
            <div
              style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Loading editor...
            </div>
          </div>
        );
      }

      // For now, render a simple textarea or div based on editable state
      // In a real implementation, you would integrate Novel editor here
      return (
        <div
          ref={ref}
          className={cn("relative flex-1", className)}
          {...props}
        >
          {data.editable ? (
            <textarea
              className={cn(
                "w-full resize-none border-0 bg-transparent p-4 focus:outline-none focus:ring-0",
                options?.className
              )}
              style={{
                height: typeof height === 'number' ? `${height}px` : height,
              }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={options?.placeholder || "Start typing..."}
            />
          ) : (
            <div
              className={cn("prose prose-sm max-w-none p-4 dark:prose-invert", options?.className)}
              style={{
                minHeight: typeof height === 'number' ? `${height}px` : height,
              }}
            >
              {data.format === 'markdown' ? (
                <div className="whitespace-pre-wrap">{content}</div>
              ) : data.format === 'html' ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <pre className="whitespace-pre-wrap text-sm">{content}</pre>
              )}
            </div>
          )}
        </div>
      );
    }
  )
);

WYSIWYGContent.displayName = "WYSIWYGContent";

// --- WYSIWYG Error ---

export const WYSIWYGError = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { error: string }
>(({ className, error, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive",
        className
      )}
      {...props}
    >
      <AlertCircle className="h-5 w-5" />
      <p className="text-sm font-medium">{error}</p>
    </div>
  );
});

WYSIWYGError.displayName = "WYSIWYGError";
