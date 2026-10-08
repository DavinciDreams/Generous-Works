"use client";
/**
 * @module Timeline
 * @description AI-powered interactive timeline component built on HistropediaJS.
 * Draws events as cards on a zoomable canvas axis, from milliseconds to billions
 * of years, with eras as time bands and groups as lanes. Selecting an event shows
 * its full text and media below the canvas. Data keeps the TimelineJS3 shape the
 * AI catalog and saved surfaces already use.
 *
 * Uses a compound component pattern: Timeline (root), TimelineHeader, TimelineContent,
 * TimelineError, and action buttons.
 *
 * @example
 * ```tsx
 * <Timeline
 *   data={{
 *     title: { text: { headline: "History of AI" } },
 *     events: [
 *       { start_date: { year: 1950 }, text: { headline: "Turing Test", text: "Alan Turing proposes..." } }
 *     ]
 *   }}
 * >
 *   <TimelineHeader>
 *     <TimelineTitle>AI Timeline</TimelineTitle>
 *   </TimelineHeader>
 *   <TimelineContent />
 * </Timeline>
 * ```
 */

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import type { Timeline as HistropediaTimeline } from "histropediajs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
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
  useMemo,
  useRef,
  useState,
} from "react";
import {
  looksLikeImage,
  safeHttpUrl,
  themeOptions,
  toHistropediaModel,
  toPlainText,
  type HistropediaModel,
  type PlacedEvent,
  type TimelineTheme,
} from "./timeline-histropedia";

// --- Types (TimelineJS3 data format, rendered with HistropediaJS) ---

/** A date object matching TimelineJS3 date format with year, month, day, and time components. */
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

/** Text content for a timeline slide with headline and body text. */
export interface TimelineText {
  headline?: string;
  text?: string;
}

/** Media attachment for a timeline slide supporting images, video, and audio URLs. */
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

/** A single timeline event (slide) with date range, text, media, and display options. */
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

/** An era marker spanning a date range on the timeline navigation bar. */
export interface TimelineEra {
  start_date: TimelineDate;
  end_date: TimelineDate;
  text?: TimelineText;
}

/** Data payload for the Timeline component including title slide, events, and optional eras. */
export interface TimelineData {
  title?: TimelineSlide;
  events: TimelineSlide[];
  eras?: TimelineEra[];
  scale?: "human" | "cosmological";
}

/**
 * Configuration options for the Timeline renderer and navigation. Histropedia
 * honours `height`, `width`, `start_at_slide` and `start_at_end`; the other
 * TimelineJS options are accepted so existing data still validates.
 */
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

/**
 * Imperative handle exposed by the Timeline component via ref for navigation
 * control. Slide indexes follow TimelineJS: the title slide (when `data.title`
 * is set) is 0, then the dated events in chronological order. Going to the
 * title slide fits every event in view.
 */
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
  timelineInstanceRef: React.RefObject<TimelineRef | null>;
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

/** Props for the {@link Timeline} root component. */
export interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  /** Timeline data including title, events, eras, and time scale. */
  data: TimelineData;
  /** Optional configuration for dimensions, language, navigation, and zoom. */
  options?: TimelineOptions;
  /** Child components (header, content, error). */
  children?: ReactNode;
}

export const Timeline = forwardRef<TimelineRef, TimelineProps>(
  ({ data, options, children, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [copied, setCopied] = useState(false);
    const timelineInstanceRef = useRef<TimelineRef | null>(null);
    const timelineRef = useRef<TimelineRef | null>(null);
    // Generate ID only on client to avoid hydration mismatch
    const [timelineId] = useState(() =>
      typeof window !== 'undefined'
        ? `timeline-${Math.random().toString(36).substr(2, 9)}`
        : 'timeline-ssr'
    );

    // Expose ref — delegate to timelineInstanceRef so the handle is valid
    // immediately at mount (before async initialization completes).
    useImperativeHandle(ref, () => ({
      goTo: (slideIndex: number) => timelineInstanceRef.current?.goTo(slideIndex),
      goToId: (id: string) => timelineInstanceRef.current?.goToId(id),
      goToNext: () => timelineInstanceRef.current?.goToNext(),
      goToPrev: () => timelineInstanceRef.current?.goToPrev(),
      goToStart: () => timelineInstanceRef.current?.goToStart(),
      goToEnd: () => timelineInstanceRef.current?.goToEnd(),
      getData: (slideIndex: number) =>
        timelineInstanceRef.current?.getData(slideIndex) ?? null,
      getDataById: (id: string) =>
        timelineInstanceRef.current?.getDataById(id) ?? null,
    }), []);

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

/** Canvas height when neither `options.height` nor fullscreen sets one. */
const DEFAULT_CANVAS_HEIGHT = 460;

const cssLength = (value: number | string) =>
  typeof value === "number" ? `${value}px` : value;

/** Resolves the theme variables the canvas draws with; a canvas can't read CSS itself. */
function readTheme(element: HTMLElement): TimelineTheme {
  const style = getComputedStyle(element);
  const token = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;
  return {
    card: token("--card", "#ffffff"),
    cardForeground: token("--card-foreground", "#111111"),
    muted: token("--muted", "#e5e5e5"),
    mutedForeground: token("--muted-foreground", "#666666"),
    border: token("--border", "#dddddd"),
    primary: token("--primary", "#0097b2"),
  };
}

/**
 * Histropedia has no public teardown, and its drag tracker listens on
 * `window`. Release it so an unmounted timeline isn't kept alive.
 */
function disposeHistropedia(timeline: HistropediaTimeline) {
  timeline.disableZoomByWheel();
  // Private field: the only handle on the window listeners in histropediajs 1.6.
  const internals = timeline as unknown as {
    _dragPointerTracker?: { destroy: () => void };
  };
  internals._dragPointerTracker?.destroy();
}

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
      const [isMounted, setIsMounted] = useState(false);
      const [selectedId, setSelectedId] = useState<string | null>(null);

      const model: HistropediaModel = useMemo(() => toHistropediaModel(data), [data]);
      // Rebuild the canvas when the content changes, not on every new object identity.
      const dataKey = useMemo(() => JSON.stringify(data), [data]);
      const startAtSlide = options?.start_at_slide;
      const startAtEnd = options?.start_at_end === true;
      const hasEvents = model.events.length > 0;

      // Only render on client to avoid SSR issues
      useEffect(() => {
        setIsMounted(true);
      }, []);

      useEffect(() => {
        const container = containerRef.current;
        if (!isMounted || !container || !hasEvents) {
          return;
        }

        let cancelled = false;
        let timeline: HistropediaTimeline | null = null;
        let resizeObserver: ResizeObserver | null = null;
        let themeObserver: MutationObserver | null = null;

        const titleOffset = data.title ? 1 : 0;
        const lastSlide = model.events.length - 1 + titleOffset;
        let currentSlide = 0;
        const indexOfId = (id: string) => model.events.findIndex((event) => event.id === id);

        // Histropedia always has one active (front-most) card, so the overview
        // selects the first event rather than leaving the panel and canvas out of step.
        const showOverview = (animate: boolean) => {
          if (!timeline) return;
          timeline.fitArticles({ padding: 40, animation: { active: animate } });
          timeline.select(model.events[0].id);
          setSelectedId(model.events[0].id);
          currentSlide = 0;
        };

        const focusEvent = (eventIndex: number, animate: boolean) => {
          const event = model.events[eventIndex];
          if (!timeline || !event) return;
          currentSlide = eventIndex + titleOffset;
          timeline.select(event.id);
          setSelectedId(event.id);
          timeline.setStartDate(model.articles[eventIndex].from, {
            padding: Math.round(timeline.getWidth() / 2),
            animation: { active: animate, duration: 600 },
          });
        };

        const goTo = (slideIndex: number, animate = true) => {
          if (titleOffset && slideIndex === 0) {
            showOverview(animate);
          } else {
            focusEvent(slideIndex - titleOffset, animate);
          }
        };

        const controller: TimelineRef = {
          goTo: (slideIndex) => goTo(slideIndex),
          goToId: (id) => {
            const index = indexOfId(id);
            if (index >= 0) focusEvent(index, true);
          },
          goToNext: () => goTo(Math.min(currentSlide + 1, lastSlide)),
          goToPrev: () => goTo(Math.max(currentSlide - 1, 0)),
          goToStart: () => goTo(0),
          goToEnd: () => goTo(lastSlide),
          getData: (slideIndex) =>
            titleOffset && slideIndex === 0
              ? data.title ?? null
              : model.events[slideIndex - titleOffset]?.slide ?? null,
          getDataById: (id) => model.events[indexOfId(id)]?.slide ?? null,
        };

        const init = async () => {
          try {
            // Dynamic import keeps the canvas library out of the server bundle
            const { Timeline: Histropedia } = await import("histropediajs");
            if (cancelled) return;

            const theme = themeOptions(readTheme(container));
            timeline = new Histropedia(container, {
              ...theme,
              width: Math.max(container.clientWidth, 1),
              height: Math.max(container.clientHeight, 1),
              article: { ...theme.article, draggable: false },
              on: {
                "article-select": (article) => {
                  const id = String(article.id);
                  const index = indexOfId(id);
                  if (index >= 0) currentSlide = index + titleOffset;
                  setSelectedId(id);
                },
              },
            });

            if (model.lanes.length > 0) timeline.loadLanes(model.lanes);
            if (model.timeBands.length > 0) timeline.loadTimeBands(model.timeBands);
            timeline.load(model.articles);

            if (typeof startAtSlide === "number" && startAtSlide >= 0 && startAtSlide <= lastSlide) {
              goTo(startAtSlide, false);
            } else if (startAtEnd) {
              goTo(lastSlide, false);
            } else {
              showOverview(false);
            }

            if (typeof ResizeObserver !== "undefined") {
              resizeObserver = new ResizeObserver(() => {
                const { clientWidth, clientHeight } = container;
                if (timeline && clientWidth > 0 && clientHeight > 0) {
                  timeline.setSize(clientWidth, clientHeight);
                }
              });
              resizeObserver.observe(container);
            }

            // Dark mode is a class on <html>; recolour the canvas when it flips.
            themeObserver = new MutationObserver(() => {
              if (!timeline) return;
              timeline.setOption(themeOptions(readTheme(container)));
              timeline.redraw();
            });
            themeObserver.observe(document.documentElement, {
              attributes: true,
              attributeFilter: ["class", "style", "data-theme"],
            });

            timelineInstanceRef.current = controller;
            timelineRef.current = controller;
          } catch (err) {
            if (cancelled) return;
            console.error("Failed to initialize timeline:", err);
            setError(err instanceof Error ? err.message : "Failed to initialize timeline");
          }
        };

        void init();

        return () => {
          cancelled = true;
          resizeObserver?.disconnect();
          themeObserver?.disconnect();
          if (timeline) disposeHistropedia(timeline);
          timeline = null;
          container.replaceChildren();
          timelineInstanceRef.current = null;
          timelineRef.current = null;
          setSelectedId(null);
        };
      // model and data are derived from dataKey; setError and refs are stable.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isMounted, dataKey, hasEvents, startAtSlide, startAtEnd]);

      if (error) {
        return <TimelineError error={error} />;
      }

      const height = options?.height || (fullscreen ? undefined : DEFAULT_CANVAS_HEIGHT);
      const width = options?.width || "100%";
      const sizeStyle = {
        width: cssLength(width),
        height: height === undefined ? undefined : cssLength(height),
      };
      const fillsHeight = height === undefined && "min-h-0 flex-1";

      // Don't render timeline container until mounted on client
      if (!isMounted) {
        return (
          <div
            ref={ref}
            className={cn("relative flex min-h-0 flex-1 flex-col p-4", className)}
            {...props}
          >
            <div
              className={cn("flex items-center justify-center text-muted-foreground text-sm", fillsHeight)}
              style={sizeStyle}
            >
              Loading timeline...
            </div>
          </div>
        );
      }

      const selectedEvent = model.events.find((event) => event.id === selectedId) ?? null;
      const intro = toPlainText(data.title?.text?.text);

      return (
        <div
          ref={ref}
          className={cn("relative flex min-h-0 flex-1 flex-col gap-3 p-4", className)}
          {...props}
        >
          {intro && (
            <p className="whitespace-pre-line text-muted-foreground text-sm">{intro}</p>
          )}
          {hasEvents ? (
            <>
              <div
                ref={containerRef}
                id={timelineId}
                role="region"
                aria-label={`Timeline of ${model.events.length} events`}
                className={cn("relative overflow-hidden [&_canvas]:block", fillsHeight)}
                style={sizeStyle}
              />
              {selectedEvent && <TimelineEventDetails event={selectedEvent} />}
            </>
          ) : (
            <div
              className={cn("flex items-center justify-center text-muted-foreground text-sm", fillsHeight)}
              style={sizeStyle}
            >
              No dated events to show.
            </div>
          )}
        </div>
      );
    }
  )
);

TimelineContent.displayName = "TimelineContent";

// --- Timeline Event Details ---

/**
 * Cards on the canvas show only a headline, date and image, so the selected
 * event's full text and media are shown here. Text is rendered as plain text,
 * never as HTML, because timeline data can come from the model or from Galaxy.
 */
const TimelineEventDetails = ({ event }: { event: PlacedEvent }) => {
  const { slide, headline: heading, dateLabel } = event;
  const body = toPlainText(slide.text?.text);
  const mediaUrl = safeHttpUrl(slide.media?.url);
  const imageUrl = mediaUrl && looksLikeImage(mediaUrl) ? mediaUrl : undefined;
  const linkUrl = safeHttpUrl(slide.media?.link) ?? (imageUrl ? undefined : mediaUrl);
  const caption = toPlainText(slide.media?.caption);
  const credit = toPlainText(slide.media?.credit);

  return (
    <div aria-live="polite" className="flex max-h-56 gap-4 overflow-y-auto border-t pt-3">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote URLs from timeline data
        <img
          src={imageUrl}
          alt={slide.media?.alt || caption || heading}
          className="h-28 w-auto max-w-[40%] shrink-0 rounded-md object-cover"
        />
      )}
      <div className="min-w-0 space-y-1">
        {dateLabel && <p className="text-muted-foreground text-xs">{dateLabel}</p>}
        <h4 className="font-semibold">{heading}</h4>
        {body && <p className="whitespace-pre-line text-sm">{body}</p>}
        {(caption || credit) && (
          <p className="text-muted-foreground text-xs">
            {[caption, credit].filter(Boolean).join(" — ")}
          </p>
        )}
        {linkUrl && (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
          >
            Open media
            <ExternalLinkIcon className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
};

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
  console.warn("TimelineControls is deprecated - the timeline canvas has built-in zoom and pan");
  return null;
});

TimelineControls.displayName = "TimelineControls";
