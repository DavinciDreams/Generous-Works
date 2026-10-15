"use client";
/**
 * @module Timeline
 * @description Zoomable timeline built on HistropediaJS: picture cards hang on
 * stems over a canvas axis the user can pan and zoom, from days to billions of
 * years. Important cards show when zoomed out and sit in front; cards are
 * coloured by category; periods draw as bars, eras as shaded bands and groups
 * as lanes. Hovering a card previews it, clicking opens its details, and
 * filters narrow the cards by category, group, tag or text.
 *
 * Takes the library-neutral Timeline shape (lib/a2ui/timeline-contract.ts):
 * `events` or a spreadsheet-style `table`. The legacy TimelineJS shape
 * (`data.events` with `start_date`) is still accepted and normalized.
 *
 * @example
 * ```tsx
 * <Timeline
 *   title="Space exploration"
 *   events={[
 *     { id: "sputnik", title: "Sputnik 1", start: { year: 1957, month: 10, day: 4 }, importance: 4, category: "Satellites" },
 *     { id: "apollo-11", title: "Apollo 11", start: { year: 1969, month: 7, day: 20 }, importance: 5, category: "Crewed" },
 *   ]}
 * >
 *   <TimelineHeader>
 *     <TimelineTitle />
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
  SearchIcon,
  XIcon,
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
  useSyncExternalStore,
} from "react";
import {
  normalizeTimelineProps,
  TIMELINE_COLOR_TOKENS,
  type LegacyTimelineData,
  type LegacyTimelineOptions,
  type TimelineEraV2,
  type TimelineEventV2,
  type TimelineTable,
  type TimelineV2,
} from "@/lib/a2ui/timeline-contract";
import {
  DEFAULT_THEME,
  EMPTY_FILTER,
  categoryColorAt,
  isFilterActive,
  matchesFilter,
  themeOptions,
  themedStyles,
  toHistropediaModel,
  type HistropediaModel,
  type PlacedEvent,
  type TimelineFilter,
  type TimelineTheme,
} from "./timeline-histropedia";

// --- Types ---

export type {
  TimelineDateV2 as TimelineDate,
  TimelineEventV2 as TimelineEvent,
  TimelineEraV2 as TimelineEra,
  TimelineTable,
  TimelineV2,
  LegacyTimelineData,
  LegacyTimelineOptions,
} from "@/lib/a2ui/timeline-contract";

/** @deprecated The legacy TimelineJS data shape; pass `events` instead. */
export type TimelineData = LegacyTimelineData;
/** @deprecated The legacy TimelineJS options; only `height` is still honoured. */
export type TimelineOptions = LegacyTimelineOptions;

/**
 * Imperative handle exposed via ref. Indexes are the events in chronological
 * order.
 */
export interface TimelineRef {
  goTo: (index: number) => void;
  goToId: (id: string) => void;
  goToNext: () => void;
  goToPrev: () => void;
  goToStart: () => void;
  goToEnd: () => void;
  getData: (index: number) => TimelineEventV2 | null;
  getDataById: (id: string) => TimelineEventV2 | null;
}

// --- Context ---

interface TimelineContextValue {
  timeline: TimelineV2;
  error: string | null;
  setError: (error: string | null) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  copyToClipboard: () => Promise<void>;
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

/** Props for the {@link Timeline} root component: the Timeline contract's shape. */
export interface TimelineProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Heading for the timeline. */
  title?: string;
  /** Canvas height in px (160–1600). */
  height?: number;
  /** The events. Give these or `table`. */
  events?: TimelineEventV2[];
  /** A spreadsheet-style table converted into events. Give this or `events`. */
  table?: TimelineTable;
  /** Shaded periods behind the events. */
  eras?: TimelineEraV2[];
  /** @deprecated Legacy TimelineJS data, normalized to events. */
  data?: LegacyTimelineData;
  /** @deprecated Legacy TimelineJS options; only `height` is used. */
  options?: LegacyTimelineOptions;
  /** Child components (header, content, error). */
  children?: ReactNode;
}

export const Timeline = forwardRef<TimelineRef, TimelineProps>(
  ({ title, height, events, table, eras, data, options, children, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const timelineInstanceRef = useRef<TimelineRef | null>(null);
    // Generate ID only on client to avoid hydration mismatch
    const [timelineId] = useState(() =>
      typeof window !== "undefined"
        ? `timeline-${Math.random().toString(36).slice(2, 11)}`
        : "timeline-ssr"
    );

    // Normalize when the content changes, not on every new object identity.
    const inputKey = JSON.stringify(
      data ? { data, options } : { title, height, events, table, eras }
    );
    const timeline = useMemo(() => normalizeTimelineProps(JSON.parse(inputKey)), [inputKey]);

    // Delegate to timelineInstanceRef so the handle is valid immediately at
    // mount, before the canvas library has loaded.
    useImperativeHandle(ref, () => ({
      goTo: (index: number) => timelineInstanceRef.current?.goTo(index),
      goToId: (id: string) => timelineInstanceRef.current?.goToId(id),
      goToNext: () => timelineInstanceRef.current?.goToNext(),
      goToPrev: () => timelineInstanceRef.current?.goToPrev(),
      goToStart: () => timelineInstanceRef.current?.goToStart(),
      goToEnd: () => timelineInstanceRef.current?.goToEnd(),
      getData: (index: number) => timelineInstanceRef.current?.getData(index) ?? null,
      getDataById: (id: string) => timelineInstanceRef.current?.getDataById(id) ?? null,
    }), []);

    const copyToClipboard = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(timeline, null, 2));
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }, [timeline]);

    const contextValue: TimelineContextValue = {
      timeline,
      error,
      setError,
      fullscreen,
      setFullscreen,
      copyToClipboard,
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
  const { timeline } = useTimelineContext();

  return (
    <div ref={ref} className={cn("flex-1", className)} {...props}>
      <h3 className="text-lg font-semibold">
        {children || timeline.title || "Timeline"}
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
      aria-label="Copy timeline data"
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
      aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
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

// --- Theme ---

/** Canvas height when neither the data nor fullscreen sets one: taller with lanes, so each has room for its cards. */
const defaultCanvasHeight = (lanes: number) => (lanes <= 1 ? 460 : Math.min(900, 220 + 150 * lanes));

/**
 * Resolves any CSS colour (the theme uses oklch) to hex or rgba by painting
 * it, so card colours can be mixed and given legible text.
 */
function createColorResolver(): (color: string) => string {
  let context: CanvasRenderingContext2D | null = null;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    context = canvas.getContext("2d", { willReadFrequently: true });
  } catch {
    context = null;
  }
  return (color) => {
    if (!context) return color;
    try {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = "#000000";
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
      if (a === 255) return `#${[r, g, b].map((part) => part.toString(16).padStart(2, "0")).join("")}`;
      return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
    } catch {
      return color;
    }
  };
}

/** The theme's colours, read from the page's CSS variables; a canvas can't read CSS itself. */
function readTheme(element: HTMLElement): TimelineTheme {
  const style = getComputedStyle(element);
  const resolve = createColorResolver();
  const token = (name: string, fallback: string) =>
    resolve(style.getPropertyValue(`--${name}`).trim() || fallback);
  const tokens = Object.fromEntries(
    TIMELINE_COLOR_TOKENS.map((name) => [name, token(name, DEFAULT_THEME.tokens[name])])
  ) as TimelineTheme["tokens"];
  return {
    background: token("background", DEFAULT_THEME.background),
    card: token("card", DEFAULT_THEME.card),
    cardForeground: token("card-foreground", DEFAULT_THEME.cardForeground),
    muted: token("muted", DEFAULT_THEME.muted),
    mutedForeground: token("muted-foreground", DEFAULT_THEME.mutedForeground),
    border: token("border", DEFAULT_THEME.border),
    primary: token("primary", DEFAULT_THEME.primary),
    tokens,
  };
}

/** A CSS colour for UI chips: hex as is, theme tokens via their variable. */
const cssColor = (color: string) => (color.startsWith("#") ? color : `var(--${color})`);

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

/** The event to open with: the most important, earliest first. */
function leadEvent(events: PlacedEvent[]): PlacedEvent | undefined {
  return events.reduce<PlacedEvent | undefined>(
    (best, placed) =>
      !best || (placed.event.importance ?? 0) > (best.event.importance ?? 0) ? placed : best,
    undefined
  );
}

interface HoverPreview {
  id: string;
  x: number;
  y: number;
  /** The stage's width when the pointer moved, to keep the preview inside it. */
  width: number;
}

const subscribeToNothing = () => () => {};

/** False during server rendering and hydration, true once on the client: the canvas is client-only. */
function useIsClient(): boolean {
  return useSyncExternalStore(subscribeToNothing, () => true, () => false);
}

// --- Timeline Content ---

export const TimelineContent = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const {
        timeline: data,
        error,
        setError,
        fullscreen,
        timelineId,
        timelineInstanceRef,
      } = useTimelineContext();

      const containerRef = useRef<HTMLDivElement>(null);
      const stageRef = useRef<HTMLDivElement>(null);
      const histropediaRef = useRef<HistropediaTimeline | null>(null);
      const isMounted = useIsClient();
      const [selectedId, setSelectedId] = useState<string | null>(null);
      const [hover, setHover] = useState<HoverPreview | null>(null);
      const [filter, setFilter] = useState<TimelineFilter>(EMPTY_FILTER);
      // Read by the canvas setup, which is async, so it sees the latest filter.
      const filterRef = useRef(filter);
      useEffect(() => {
        filterRef.current = filter;
      }, [filter]);

      // Structure only (ids, order, categories); the canvas styles cards from the live theme.
      const model: HistropediaModel = useMemo(() => toHistropediaModel(data), [data]);
      const dataKey = useMemo(() => JSON.stringify(data), [data]);
      const hasEvents = model.events.length > 0;
      const visibleIds = useMemo(
        () => new Set(model.events.filter((placed) => matchesFilter(placed, filter)).map(({ id }) => id)),
        [model, filter]
      );

      useEffect(() => {
        const container = containerRef.current;
        if (!isMounted || !container || !hasEvents) {
          return;
        }

        let cancelled = false;
        let timeline: HistropediaTimeline | null = null;
        let resizeObserver: ResizeObserver | null = null;
        let themeObserver: MutationObserver | null = null;

        const lastIndex = model.events.length - 1;
        let current = 0;
        // Until the user pans, zooms or navigates, keep every card in view as the canvas resizes.
        let interacted = false;
        const markInteracted = () => {
          interacted = true;
        };
        const indexOfId = (id: string) => model.events.findIndex((placed) => placed.id === id);

        const focusEvent = (index: number, animate: boolean) => {
          const placed = model.events[index];
          if (!timeline || !placed) return;
          interacted = true;
          current = index;
          timeline.select(placed.id);
          setSelectedId(placed.id);
          timeline.setStartDate(model.articles[index].from, {
            padding: Math.round(timeline.getWidth() / 2),
            animation: { active: animate, duration: 600 },
          });
        };

        const controller: TimelineRef = {
          goTo: (index) => focusEvent(index, true),
          goToId: (id) => {
            const index = indexOfId(id);
            if (index >= 0) focusEvent(index, true);
          },
          goToNext: () => focusEvent(Math.min(current + 1, lastIndex), true),
          goToPrev: () => focusEvent(Math.max(current - 1, 0), true),
          goToStart: () => focusEvent(0, true),
          goToEnd: () => focusEvent(lastIndex, true),
          getData: (index) => model.events[index]?.event ?? null,
          getDataById: (id) => model.events[indexOfId(id)]?.event ?? null,
        };

        const previewAt = (id: string, event: PointerEvent) => {
          const stage = stageRef.current;
          if (!stage) return;
          const rect = stage.getBoundingClientRect();
          setHover({ id, x: event.clientX - rect.left, y: event.clientY - rect.top, width: rect.width });
        };

        const init = async () => {
          try {
            // Dynamic import keeps the canvas library out of the server bundle
            const { Timeline: Histropedia } = await import("histropediajs");
            if (cancelled) return;

            const theme = readTheme(container);
            const themed = toHistropediaModel(data, theme);
            timeline = new Histropedia(container, {
              ...themeOptions(theme),
              width: Math.max(container.clientWidth, 1),
              height: Math.max(container.clientHeight, 1),
              // Negative years are BCE as people write them: -500 is 500 BCE.
              shiftBceDates: true,
              // Defence in depth: the normalizer already keeps only http(s) images.
              image: { sanitizer: { allowedSchemes: ["http", "https"] } },
              article: {
                draggable: false,
                star: { visible: false },
                autoStacking: { active: true },
              },
              on: {
                "article-select": (article) => {
                  const id = String(article.id);
                  const index = indexOfId(id);
                  if (index >= 0) current = index;
                  setSelectedId(id);
                },
                "article-pointerenter": (article, event) => previewAt(String(article.id), event),
                "article-pointermove": (article, event) => previewAt(String(article.id), event),
                "article-pointerleave": () => setHover(null),
                "viewport-drag-start": () => {
                  markInteracted();
                  setHover(null);
                },
                "zoom-wheel": markInteracted,
                "zoom-pinch-start": markInteracted,
              },
            });

            if (themed.lanes.length > 0) timeline.loadLanes(themed.lanes);
            if (themed.timeBands.length > 0) timeline.loadTimeBands(themed.timeBands);
            const activeFilter = filterRef.current;
            timeline.load(
              themed.articles.map((article, index) => ({
                ...article,
                hiddenByFilter: !matchesFilter(model.events[index], activeFilter),
              }))
            );

            timeline.fitArticles({ padding: 40, animation: { active: false } });
            const lead = leadEvent(model.events);
            if (lead) {
              current = indexOfId(lead.id);
              timeline.select(lead.id);
              setSelectedId(lead.id);
            }

            if (typeof ResizeObserver !== "undefined") {
              resizeObserver = new ResizeObserver(() => {
                const { clientWidth, clientHeight } = container;
                if (timeline && clientWidth > 0 && clientHeight > 0) {
                  timeline.setSize(clientWidth, clientHeight);
                  if (!interacted) timeline.fitArticles({ padding: 40, animation: { active: false } });
                }
              });
              resizeObserver.observe(container);
            }

            // Dark mode is a class on <html>; recolour the canvas and cards when it flips.
            themeObserver = new MutationObserver(() => {
              if (!timeline) return;
              const nextTheme = readTheme(container);
              const restyled = themedStyles(data, nextTheme);
              for (const { id, ...styles } of restyled.articles) {
                timeline.getArticleById(id)?.setOption(styles);
              }
              for (const { id, style } of restyled.timeBands) {
                timeline.timeBands.find((band) => band.id === id)?.setStyle(style);
              }
              timeline.setOption(themeOptions(nextTheme));
              timeline.defaultRedraw();
            });
            themeObserver.observe(document.documentElement, {
              attributes: true,
              attributeFilter: ["class", "style", "data-theme"],
            });

            histropediaRef.current = timeline;
            timelineInstanceRef.current = controller;
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
          histropediaRef.current = null;
          container.replaceChildren();
          timelineInstanceRef.current = null;
          setSelectedId(null);
          setHover(null);
        };
      // model and data are derived from dataKey; setError and refs are stable.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isMounted, dataKey, hasEvents]);

      // Filtering hides cards with Histropedia's own article filter, so the
      // remaining cards restack and the density filter reconsiders them.
      const visibleKey = [...visibleIds].join("\u0000");
      useEffect(() => {
        const timeline = histropediaRef.current;
        if (!timeline) return;
        for (const placed of model.events) {
          timeline.getArticleById(placed.id)?.setOption({ hiddenByFilter: !visibleIds.has(placed.id) });
        }
        timeline.defaultRedraw();
      // visibleIds is derived from visibleKey.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [visibleKey]);

      if (error) {
        return <TimelineError error={error} />;
      }

      const height = data.height ?? (fullscreen ? undefined : defaultCanvasHeight(model.lanes.length));
      const sizeStyle = { height: height === undefined ? undefined : `${height}px` };
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
              className={cn("flex w-full items-center justify-center text-muted-foreground text-sm", fillsHeight)}
              style={sizeStyle}
            >
              Loading timeline...
            </div>
          </div>
        );
      }

      const selected = model.events.find((placed) => placed.id === selectedId) ?? null;
      const hovered = hover ? model.events.find((placed) => placed.id === hover.id) ?? null : null;
      const colorOf = (category?: string) =>
        category ? cssColor(categoryColorAt(model.categories.indexOf(category))) : undefined;

      return (
        <div
          ref={ref}
          className={cn("relative flex min-h-0 flex-1 flex-col gap-3 p-4", className)}
          {...props}
        >
          {hasEvents ? (
            <>
              <TimelineFilters
                model={model}
                filter={filter}
                onChange={setFilter}
                visibleCount={visibleIds.size}
                colorOf={colorOf}
              />
              <div ref={stageRef} className={cn("relative w-full", fillsHeight)} style={sizeStyle}>
                <div
                  ref={containerRef}
                  id={timelineId}
                  role="region"
                  aria-label={`Timeline of ${model.events.length} events`}
                  className="relative h-full w-full overflow-hidden [&_canvas]:block"
                />
                {hovered && hover && (
                  <TimelineHoverPreview
                    placed={hovered}
                    x={hover.x}
                    y={hover.y}
                    stageWidth={hover.width}
                    color={hovered.event.style?.color ? cssColor(hovered.event.style.color) : colorOf(hovered.event.category)}
                  />
                )}
              </div>
              {/* The canvas isn't focusable: the same events, for keyboards and screen readers. */}
              <ul className="sr-only" aria-label="Timeline events">
                {model.events.map((placed, index) => (
                  <li key={placed.id}>
                    <button type="button" onClick={() => timelineInstanceRef.current?.goTo(index)}>
                      {placed.dateLabel}: {placed.event.title}
                    </button>
                  </li>
                ))}
              </ul>
              {selected && (
                // Keyed so a failed image is retried for the next event.
                <TimelineEventDetails key={selected.id} placed={selected} color={colorOf(selected.event.category)} />
              )}
            </>
          ) : (
            <div
              className={cn("flex w-full items-center justify-center text-muted-foreground text-sm", fillsHeight)}
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

// --- Timeline Filters ---

interface TimelineFiltersProps {
  model: HistropediaModel;
  filter: TimelineFilter;
  onChange: (filter: TimelineFilter) => void;
  visibleCount: number;
  colorOf: (category?: string) => string | undefined;
}

const toggle = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

const chipClass = (active: boolean) =>
  cn(
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs transition-colors",
    active ? "border-primary bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted"
  );

/**
 * Category chips, a group picker, tag chips and a search box, shown when the
 * data has something to filter by, like Histropedia's article filter example.
 */
const TimelineFilters = ({ model, filter, onChange, visibleCount, colorOf }: TimelineFiltersProps) => {
  const hasFacets = model.categories.length > 1 || model.groups.length > 1 || model.tags.length > 0;
  if (!hasFacets && model.events.length < 8) return null;
  const active = isFilterActive(filter);

  return (
    <div className="flex flex-col gap-2 text-sm" role="group" aria-label="Filter timeline">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex min-w-40 flex-1 items-center sm:max-w-64">
          <SearchIcon className="pointer-events-none absolute left-2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="search"
            value={filter.query}
            onChange={(event) => onChange({ ...filter, query: event.target.value })}
            placeholder="Search events"
            aria-label="Search events"
            className="h-8 w-full rounded-md border bg-background pr-2 pl-7 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        {model.groups.length > 1 && (
          <select
            value={filter.group ?? ""}
            onChange={(event) => onChange({ ...filter, group: event.target.value || null })}
            aria-label="Group"
            className="h-8 rounded-md border bg-background px-2 text-sm"
          >
            <option value="">All groups</option>
            {model.groups.map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        )}
        <span className="text-muted-foreground text-xs" aria-live="polite">
          {visibleCount} of {model.events.length} events
        </span>
        {active && (
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => onChange(EMPTY_FILTER)}>
            <XIcon className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>
      {model.categories.length > 1 && (
        <div className="flex flex-wrap gap-1.5" aria-label="Categories">
          {model.categories.map((category) => {
            const pressed = filter.categories.includes(category);
            return (
              <button
                key={category}
                type="button"
                aria-pressed={pressed}
                className={chipClass(pressed)}
                onClick={() => onChange({ ...filter, categories: toggle(filter.categories, category) })}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: colorOf(category) }} />
                {category}
              </button>
            );
          })}
        </div>
      )}
      {model.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-label="Tags">
          {model.tags.map((tag) => {
            const pressed = filter.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={pressed}
                className={chipClass(pressed)}
                onClick={() => onChange({ ...filter, tags: toggle(filter.tags, tag) })}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// --- Timeline Hover Preview ---

const PREVIEW_WIDTH = 264;

/** A preview card that follows the pointer over a card; clicking the card opens its details. */
const TimelineHoverPreview = ({
  placed,
  x,
  y,
  stageWidth,
  color,
}: {
  placed: PlacedEvent;
  x: number;
  y: number;
  stageWidth: number;
  color?: string;
}) => {
  const { event, dateLabel } = placed;
  const left = stageWidth > 0 && x + 16 + PREVIEW_WIDTH > stageWidth ? Math.max(0, x - 16 - PREVIEW_WIDTH) : x + 16;
  const snippet = event.description && event.description.length > 180
    ? `${event.description.slice(0, 180).trimEnd()}…`
    : event.description;

  return (
    <div
      role="tooltip"
      className="pointer-events-none absolute z-10 rounded-md border bg-popover p-3 text-popover-foreground text-sm shadow-lg"
      style={{ left, top: Math.max(0, y + 16), width: PREVIEW_WIDTH }}
    >
      <p className="flex items-center gap-1.5 text-muted-foreground text-xs">
        {color && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />}
        {[dateLabel, event.category].filter(Boolean).join(" · ")}
      </p>
      <p className="mt-1 font-semibold leading-snug">{event.title}</p>
      {event.subtitle && <p className="text-muted-foreground text-xs">{event.subtitle}</p>}
      {snippet && <p className="mt-1 whitespace-pre-line text-xs">{snippet}</p>}
      <p className="mt-2 text-muted-foreground text-[11px]">Click the card for details</p>
    </div>
  );
};

// --- Timeline Event Details ---

/**
 * The selected event's full text, picture and link. Text is rendered as plain
 * text, never as HTML, because timeline data can come from the model or from
 * Galaxy; links and images are http(s) only (the normalizer drops others).
 */
const TimelineEventDetails = ({ placed, color }: { placed: PlacedEvent; color?: string }) => {
  const { event, dateLabel } = placed;
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = imageFailed ? undefined : event.media?.url;
  const credit = [event.media?.caption, event.media?.credit].filter(Boolean).join(" — ");
  const badges = [event.category, event.group].filter(Boolean);

  return (
    <div aria-live="polite" className="flex max-h-64 gap-4 overflow-y-auto border-t pt-3">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote URLs from timeline data
        <img
          src={imageUrl}
          alt={event.media?.alt || event.media?.caption || event.title}
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="h-28 w-auto max-w-[40%] shrink-0 rounded-md object-cover"
        />
      )}
      <div className="min-w-0 space-y-1">
        <p className="flex flex-wrap items-center gap-1.5 text-muted-foreground text-xs">
          {color && <span className="h-2 w-2 rounded-full" style={{ background: color }} />}
          {[dateLabel, ...badges].filter(Boolean).join(" · ")}
        </p>
        <h4 className="font-semibold">{event.title}</h4>
        {event.subtitle && <p className="text-muted-foreground text-sm">{event.subtitle}</p>}
        {event.description && <p className="whitespace-pre-line text-sm">{event.description}</p>}
        {event.tags && event.tags.length > 0 && (
          <p className="text-muted-foreground text-xs">{event.tags.map((tag) => `#${tag}`).join(" ")}</p>
        )}
        {credit && <p className="text-muted-foreground text-xs">{credit}</p>}
        {event.link && (
          <a
            href={event.link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
          >
            {event.link.label || "Read more"}
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
>(() => {
  console.warn("TimelineControls is deprecated - the timeline canvas has built-in zoom and pan");
  return null;
});

TimelineControls.displayName = "TimelineControls";
