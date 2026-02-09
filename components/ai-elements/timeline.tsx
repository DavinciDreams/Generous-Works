"use client";

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";

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

// --- Types ---

export interface TimelineDate {
  year: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
  display_date?: string;
}

export interface TimelineText {
  headline?: string;
  text?: string;
}

export interface TimelineMedia {
  url: string;
  caption?: string;
  credit?: string;
  thumbnail?: string;
  alt?: string;
  title?: string;
  link?: string;
  link_target?: string;
}

export interface TimelineSlide {
  start_date?: TimelineDate;
  end_date?: TimelineDate;
  text?: TimelineText;
  media?: TimelineMedia;
  group?: string;
  display_date?: string;
  background?: {
    url?: string;
    color?: string;
  };
  autolink?: boolean;
  unique_id?: string;
}

export interface TimelineEra {
  start_date: TimelineDate;
  end_date: TimelineDate;
  text?: TimelineText;
}

export interface TimelineData {
  title?: TimelineSlide;
  events: TimelineSlide[];
  eras?: TimelineEra[];
  scale?: "human" | "cosmological";
}

export interface TimelineOptions {
  height?: number | string;
  width?: number | string;
  language?: string;
  start_at_end?: boolean;
  start_at_slide?: number;
  timenav_position?: "top" | "bottom";
  hash_bookmark?: boolean;
  default_bg_color?: string;
  scale_factor?: number;
  initial_zoom?: number;
  zoom_sequence?: number[];
  marker_height_min?: number;
  marker_width_min?: number;
  marker_padding?: number;
  timenav_height?: number;
  timenav_height_percentage?: number;
  timenav_mobile_height_percentage?: number;
  timenav_height_min?: number;
  slide_padding_lr?: number;
  slide_default_fade?: string;
  duration?: number;
  ease?: string;
  dragging?: boolean;
  trackResize?: boolean;
}

export type TimelineProps = HTMLAttributes<HTMLDivElement> & {
  data: TimelineData;
  options?: TimelineOptions;
  title?: string;
};

interface TimelineContextType {
  data: TimelineData;
  options?: TimelineOptions;
  title?: string;
  error: Error | null;
  setError: (error: Error | null) => void;
  isFullscreen: boolean;
  setIsFullscreen: (isFullscreen: boolean) => void;
}

// --- Context ---

const TimelineContext = createContext<TimelineContextType | null>(null);

export const useTimeline = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("Timeline components must be used within Timeline");
  }
  return context;
};

// --- Utilities ---

const validateTimelineData = (data: TimelineData): boolean => {
  if (!data.events || !Array.isArray(data.events)) {
    return false;
  }
  if (data.events.length === 0) {
    return false;
  }
  // Check that at least one event has a start_date
  return data.events.some((event) => event.start_date);
};

// --- Main Component ---

export const Timeline = memo(
  ({
    data,
    options,
    title,
    className,
    children,
    ...props
  }: TimelineProps) => {
    const [error, setError] = useState<Error | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [prevData, setPrevData] = useState(data);

    // Clear error when data changes (derived state pattern)
    if (data !== prevData) {
      setPrevData(data);
      setError(null);
    }

    const contextValue = useMemo<TimelineContextType>(
      () => ({
        data,
        error,
        isFullscreen,
        options,
        setError,
        setIsFullscreen,
        title,
      }),
      [data, options, title, error, isFullscreen]
    );

    return (
      <TimelineContext.Provider value={contextValue}>
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
      </TimelineContext.Provider>
    );
  }
);

Timeline.displayName = "Timeline";

// --- Header Component ---

export type TimelineHeaderProps = HTMLAttributes<HTMLDivElement>;

export const TimelineHeader = memo(
  ({ className, children, ...props }: TimelineHeaderProps) => (
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

TimelineHeader.displayName = "TimelineHeader";

// --- Title Component ---

export type TimelineTitleProps = HTMLAttributes<HTMLDivElement>;

export const TimelineTitle = memo(
  ({ className, children, ...props }: TimelineTitleProps) => {
    const { title, data } = useTimeline();

    return (
      <div className={cn("flex items-center gap-2", className)} {...props}>
        <span className="font-mono">
          {children ?? title ?? data.title?.text?.headline ?? "Timeline"}
        </span>
      </div>
    );
  }
);

TimelineTitle.displayName = "TimelineTitle";

// --- Actions Component ---

export type TimelineActionsProps = HTMLAttributes<HTMLDivElement>;

export const TimelineActions = memo(
  ({ className, children, ...props }: TimelineActionsProps) => (
    <div
      className={cn("-my-1 -mr-1 flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);

TimelineActions.displayName = "TimelineActions";

// --- Copy Button Component ---

export type TimelineCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const TimelineCopyButton = memo(
  ({
    onCopy,
    onError,
    timeout = 2000,
    children,
    className,
    ...props
  }: TimelineCopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<number>(0);
    const { data } = useTimeline();

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

TimelineCopyButton.displayName = "TimelineCopyButton";

// --- Fullscreen Button Component ---

export type TimelineFullscreenButtonProps = ComponentProps<typeof Button>;

export const TimelineFullscreenButton = memo(
  ({ children, className, ...props }: TimelineFullscreenButtonProps) => {
    const { isFullscreen, setIsFullscreen } = useTimeline();

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

TimelineFullscreenButton.displayName = "TimelineFullscreenButton";

// --- Content Component ---

export type TimelineContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const TimelineContent = memo(
  ({ className, ...props }: TimelineContentProps) => {
    const { data, options, setError } = useTimeline();
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineInstanceRef = useRef<{ goTo?: (n: number) => void } | null>(
      null
    );

    // Validate timeline data
    useEffect(() => {
      if (!validateTimelineData(data)) {
        setError(
          new Error(
            "Invalid timeline data: must have events array with at least one event containing start_date"
          )
        );
      }
    }, [data, setError]);

    // Initialize TimelineJS
    useEffect(() => {
      const container = containerRef.current;
      if (!container || !validateTimelineData(data)) {
        return;
      }

      // Dynamically import TimelineJS to avoid SSR issues
      import("@knight-lab/timelinejs")
        .then(({ Timeline: TL }) => {
          // Clean up previous instance
          if (timelineInstanceRef.current && container) {
            // TimelineJS doesn't have a proper destroy method, so we clear the container
            container.innerHTML = "";
          }

          // Create new timeline instance
          const defaultOptions: TimelineOptions = {
            height: options?.height ?? "100%",
            timenav_position: "bottom",
            ...options,
          };

          timelineInstanceRef.current = new TL(container, data, defaultOptions);
        })
        .catch((err) => {
          console.error("Failed to load TimelineJS:", err);
          setError(new Error("Failed to load timeline library"));
        });

      // Cleanup function
      return () => {
        if (container) {
          container.innerHTML = "";
        }
        timelineInstanceRef.current = null;
      };
    }, [data, options, setError]);

    return (
      <div
        ref={containerRef}
        className={cn("timeline-container relative min-h-[400px]", className)}
        {...props}
      />
    );
  }
);

TimelineContent.displayName = "TimelineContent";

// --- Error Component ---

export type TimelineErrorProps = Omit<
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

export const TimelineError = memo(
  ({ className, children, ...props }: TimelineErrorProps) => {
    const { error } = useTimeline();

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

TimelineError.displayName = "TimelineError";
