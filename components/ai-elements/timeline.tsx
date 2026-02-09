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
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// Import TimelineJS3
import "@knight-lab/timelinejs/dist/css/timeline.css";

// --- Types (Matching TimelineJS3 format) ---

export interface TimelineDate {
  year: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
  display_date?: string;
  format?: string;
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
  [key: string]: unknown;
}

export interface TimelineRef {
  goTo: (slideIndex: number) => void;
  goToId: (id: string) => void;
  goToNext: () => void;
  goToPrev: () => void;
  goToStart: () => void;
  goToEnd: () => void;
  getData: (slideIndex: number) => TimelineSlide | null;
  getDataById: (id: string) => TimelineSlide | null;
}

// --- Context ---

interface TimelineContextValue {
  data: TimelineData;
  options?: TimelineOptions;
  error: string | null;
  setError: (error: string | null) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  copyToClipboard: () => Promise<void>;
  timelineRef: React.RefObject<TimelineRef | null>;
  timelineInstanceRef: React.RefObject<any>;
  timelineId: string;
}

const TimelineContext = createContext<TimelineContextValue | null>(null);

const useTimelineContext = () => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error("Timeline components must be used within Timeline");
  }
  return context;
};

// --- Timeline Component ---

export interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  data: TimelineData;
  options?: TimelineOptions;
  children?: ReactNode;
}

export const Timeline = forwardRef<TimelineRef, TimelineProps>(
  ({ data, options, children, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [copied, setCopied] = useState(false);
    const timelineInstanceRef = useRef<any>(null);
    const timelineRef = useRef<TimelineRef | null>(null);
    // Generate ID only on client to avoid hydration mismatch
    const [timelineId] = useState(() =>
      typeof window !== 'undefined'
        ? `timeline-${Math.random().toString(36).substr(2, 9)}`
        : 'timeline-ssr'
    );

    // Expose ref
    useImperativeHandle(ref, () => timelineRef.current as TimelineRef, []);

    const copyToClipboard = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }, [data]);

    const contextValue: TimelineContextValue = {
      data,
      options,
      error,
      setError,
      fullscreen,
      setFullscreen,
      copyToClipboard,
      timelineRef,
      timelineInstanceRef,
      timelineId,
    };

    return (
      <TimelineContext.Provider value={contextValue}>
        <div
          className={cn(
            "flex flex-col gap-2 rounded-lg border bg-card text-card-foreground shadow-sm",
            fullscreen && "fixed inset-0 z-50 rounded-none",
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

// --- Timeline Header ---

export const TimelineHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-between gap-2 p-4 pb-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});

TimelineHeader.displayName = "TimelineHeader";

// --- Timeline Title ---

export const TimelineTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { data } = useTimelineContext();

  return (
    <div ref={ref} className={cn("flex-1", className)} {...props}>
      <h3 className="text-lg font-semibold">
        {children || data.title?.text?.headline || "Timeline"}
      </h3>
    </div>
  );
});

TimelineTitle.displayName = "TimelineTitle";

// --- Timeline Actions ---

export const TimelineActions = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
});

TimelineActions.displayName = "TimelineActions";

// --- Timeline Copy Button ---

export const TimelineCopyButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { copyToClipboard } = useTimelineContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={handleCopy}
      {...props}
    >
      {copied ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

TimelineCopyButton.displayName = "TimelineCopyButton";

// --- Timeline Fullscreen Button ---

export const TimelineFullscreenButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { fullscreen, setFullscreen } = useTimelineContext();

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={() => setFullscreen(!fullscreen)}
      {...props}
    >
      {fullscreen ? (
        <MinimizeIcon className="h-4 w-4" />
      ) : (
        <MaximizeIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

TimelineFullscreenButton.displayName = "TimelineFullscreenButton";

// --- Timeline Content ---

export const TimelineContent = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const {
        data,
        options,
        error,
        setError,
        fullscreen,
        timelineId,
        timelineRef,
        timelineInstanceRef,
      } = useTimelineContext();

      const containerRef = useRef<HTMLDivElement>(null);
      const [isInitialized, setIsInitialized] = useState(false);
      const [isMounted, setIsMounted] = useState(false);

      // Only render on client to avoid SSR issues
      useEffect(() => {
        setIsMounted(true);
      }, []);

      // Initialize TimelineJS3 when container is mounted
      useEffect(() => {
        if (typeof window === "undefined" || !containerRef.current || isInitialized) {
          return;
        }

        const initTimeline = async () => {
          try {
            // Ensure container has dimensions before initializing
            const container = containerRef.current;
            if (!container) return;

            // Wait for container to have dimensions
            const checkDimensions = () => {
              return container.offsetWidth > 0 && container.offsetHeight > 0;
            };

            if (!checkDimensions()) {
              console.warn("Container not ready, waiting for dimensions...");
              // Wait a bit for layout
              await new Promise(resolve => setTimeout(resolve, 100));
              if (!checkDimensions()) {
                setError("Timeline container has no dimensions");
                return;
              }
            }

            // Dynamic import to avoid SSR issues
            const { Timeline: TLTimeline } = await import("@knight-lab/timelinejs");

            if (!timelineInstanceRef.current && containerRef.current) {
              // Create Timeline instance
              timelineInstanceRef.current = new (TLTimeline as any)(
                timelineId,
                data,
                options
              );

              // Create ref API
              timelineRef.current = {
                goTo: (slideIndex: number) => timelineInstanceRef.current?.goTo(slideIndex),
                goToId: (id: string) => timelineInstanceRef.current?.goToId(id),
                goToNext: () => timelineInstanceRef.current?.goToNext(),
                goToPrev: () => timelineInstanceRef.current?.goToPrev(),
                goToStart: () => timelineInstanceRef.current?.goToStart(),
                goToEnd: () => timelineInstanceRef.current?.goToEnd(),
                getData: (slideIndex: number) =>
                  timelineInstanceRef.current?.getData(slideIndex) || null,
                getDataById: (id: string) =>
                  timelineInstanceRef.current?.getDataById(id) || null,
              };

              setIsInitialized(true);
            }
          } catch (err) {
            console.error("Failed to initialize timeline:", err);
            setError(err instanceof Error ? err.message : "Failed to initialize timeline");
          }
        };

        // Small delay to ensure layout is complete
        const timer = setTimeout(initTimeline, 50);

        // Cleanup
        return () => {
          clearTimeout(timer);
          if (timelineInstanceRef.current) {
            timelineInstanceRef.current = null;
            timelineRef.current = null;
            setIsInitialized(false);
          }
        };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isMounted, timelineId]);

      if (error) {
        return <TimelineError error={error} />;
      }

      const height = options?.height || (fullscreen ? "100%" : 600);
      const width = options?.width || "100%";

      // Don't render timeline container until mounted on client
      if (!isMounted) {
        return (
          <div
            ref={ref}
            className={cn("relative flex-1 p-4", className)}
            {...props}
          >
            <div
              style={{
                width: typeof width === "number" ? `${width}px` : width,
                height: typeof height === "number" ? `${height}px` : height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Loading timeline...
            </div>
          </div>
        );
      }

      return (
        <div
          ref={ref}
          className={cn("relative flex-1 p-4", className)}
          {...props}
        >
          <div
            ref={containerRef}
            id={timelineId}
            style={{
              width: typeof width === "number" ? `${width}px` : width,
              height: typeof height === "number" ? `${height}px` : height,
            }}
          />
        </div>
      );
    }
  )
);

TimelineContent.displayName = "TimelineContent";

// --- Timeline Error ---

export const TimelineError = forwardRef<
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

TimelineError.displayName = "TimelineError";

// --- Timeline Controls (deprecated, kept for compatibility) ---

export const TimelineControls = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  console.warn("TimelineControls is deprecated with TimelineJS3 - controls are built-in");
  return null;
});

TimelineControls.displayName = "TimelineControls";
