/**
 * Maps a normalized Timeline (lib/a2ui/timeline-contract.ts) onto
 * HistropediaJS articles, lanes and time bands, and styles the cards from the
 * app theme. Pure functions only, so the mapping is testable without a canvas.
 *
 * What each field becomes:
 * - importance -> article rank: Histropedia's density filter keeps the
 *   highest-ranked cards when zoomed out, and auto-stacking gives them the
 *   front rows. Card size, shadow and colour also follow importance, so minor
 *   cards recede behind major ones.
 * - category -> card colour, from the theme's chart palette in order of first
 *   appearance. style.color overrides it.
 * - group -> lanes. end -> a period. eras -> shaded time bands.
 * - media.url -> the card picture. style.card / style.font -> card shape and font.
 */

import type {
  ArticleData,
  ArticleStyle,
  CardLayoutName,
  DateInput,
  LaneData,
  TimeBandData,
  TimeBandStyle,
  TimelineOptions as HistropediaOptions,
} from "histropediajs";
import {
  formatEventDate,
  safeHttpUrl,
  type TimelineColor,
  type TimelineColorToken,
  type TimelineDateV2,
  type TimelineEraV2,
  type TimelineEventV2,
  type TimelineFont,
  type TimelineV2,
} from "@/lib/a2ui/timeline-contract";

const UNGROUPED_LANE = "lane:";
export const DEFAULT_IMPORTANCE = 3;

/** One event in chronological order, with the label its card shows. */
export interface PlacedEvent {
  id: string;
  event: TimelineEventV2;
  /** Human-readable date or date range. */
  dateLabel: string;
}

export interface HistropediaModel {
  articles: ArticleData[];
  lanes: LaneData[];
  timeBands: TimeBandData[];
  /** Events in chronological order; `articles[i]` draws `events[i]`. */
  events: PlacedEvent[];
  /** Distinct values in order of first appearance, for colours and filters. */
  categories: string[];
  groups: string[];
  tags: string[];
}

// --- Theme and colour -------------------------------------------------------

/**
 * The colours the canvas draws with. A canvas can't read CSS variables, so
 * the component resolves them (to hex where it can) and passes them in.
 */
export interface TimelineTheme {
  background: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  primary: string;
  tokens: Record<TimelineColorToken, string>;
}

/** Light-theme fallbacks, used before the page's theme can be read and in tests. */
export const DEFAULT_THEME: TimelineTheme = {
  background: "#f5f8fa",
  card: "#ffffff",
  cardForeground: "#111827",
  muted: "#e8ecf0",
  mutedForeground: "#5f6b78",
  border: "#d9dee4",
  primary: "#0097b2",
  tokens: {
    "chart-1": "#0097b2",
    "chart-2": "#7fd34e",
    "chart-3": "#2aa694",
    "chart-4": "#e8913a",
    "chart-5": "#6f73c4",
    primary: "#0097b2",
    secondary: "#dde9ec",
    muted: "#e8ecf0",
    accent: "#d6e9ee",
    destructive: "#d63c3c",
  },
};

/** Category colours: the theme's chart palette, then fixed hues for more categories. */
const CATEGORY_TOKENS: TimelineColorToken[] = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];
const EXTRA_CATEGORY_COLORS = ["#c2417a", "#8d6e4c", "#4f7cac", "#9c4fc2", "#5c8a3a"];

/** The colour for the nth category, as a theme token or hex. */
export function categoryColorAt(index: number): TimelineColor {
  const palette: TimelineColor[] = [...CATEGORY_TOKENS, ...EXTRA_CATEGORY_COLORS];
  return palette[index % palette.length];
}

/** A hex colour or theme token as a colour the canvas can draw. */
export function resolveColor(color: TimelineColor, theme: TimelineTheme): string {
  return color.startsWith("#") ? color : theme.tokens[color as TimelineColorToken] ?? theme.primary;
}

type Rgba = [number, number, number, number];

/** Parses #rgb, #rrggbb, #rrggbbaa and rgb()/rgba(); other CSS colours give null. */
export function parseColor(color: string): Rgba | null {
  const value = color.trim().toLowerCase();
  let match = /^#([0-9a-f]{3})$/.exec(value);
  if (match) {
    const [r, g, b] = match[1].split("").map((digit) => parseInt(digit + digit, 16));
    return [r, g, b, 1];
  }
  match = /^#([0-9a-f]{6})([0-9a-f]{2})?$/.exec(value);
  if (match) {
    const int = parseInt(match[1], 16);
    const alpha = match[2] ? parseInt(match[2], 16) / 255 : 1;
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255, alpha];
  }
  match = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/.exec(value);
  if (match) {
    const alpha = match[4] === undefined
      ? 1
      : match[4].endsWith("%") ? parseFloat(match[4]) / 100 : parseFloat(match[4]);
    return [Number(match[1]), Number(match[2]), Number(match[3]), alpha];
  }
  return null;
}

const hex = ([r, g, b]: Rgba) =>
  `#${[r, g, b].map((part) => Math.round(Math.min(255, Math.max(0, part))).toString(16).padStart(2, "0")).join("")}`;

/** `color` moved `amount` (0–1) of the way to `target`; unparseable colours are returned as they are. */
export function mixColors(color: string, target: string, amount: number): string {
  const from = parseColor(color);
  const to = parseColor(target);
  if (!from || !to || amount <= 0) return color;
  return hex(from.map((part, i) => part + (to[i] - part) * Math.min(1, amount)) as Rgba);
}

/** The colour with the given opacity, for shading era bands; a neutral grey when the colour can't be parsed. */
export function withAlpha(color: string, alpha: number): string {
  const [r, g, b] = parseColor(color) ?? [128, 128, 128];
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function luminance([r, g, b]: Rgba): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

const DARK_TEXT = "#111827";
const LIGHT_TEXT = "#ffffff";

/** Near-black or white, whichever contrasts more with the background (WCAG luminance). */
export function readableTextColor(background: string, fallback = DARK_TEXT): string {
  const rgba = parseColor(background);
  if (!rgba) return fallback;
  const lum = luminance(rgba);
  const onDark = (1.05) / (lum + 0.05);
  const onLight = (lum + 0.05) / (luminance(parseColor(DARK_TEXT) as Rgba) + 0.05);
  return onDark >= onLight ? LIGHT_TEXT : DARK_TEXT;
}

// --- Cards ------------------------------------------------------------------

/**
 * How a card looks at each importance. Histropedia has no perspective option,
 * so depth is approximated: major cards are larger, cast a deeper shadow and
 * keep their full colour; minor cards are smaller and fade toward the page.
 * Auto-stacking already puts lower-ranked cards in the rows behind.
 */
const DEPTH: Record<number, { width: number; font: number; header: number; recede: number; shadow: number }> = {
  5: { width: 196, font: 15, header: 56, recede: 0, shadow: 16 },
  4: { width: 172, font: 14, header: 50, recede: 0, shadow: 10 },
  3: { width: 150, font: 13, header: 46, recede: 0, shadow: 5 },
  2: { width: 132, font: 12, header: 40, recede: 0.28, shadow: 2 },
  1: { width: 116, font: 11, header: 36, recede: 0.46, shadow: 0 },
};

const FONT_FAMILIES: Record<TimelineFont, { family: string; weight: string }> = {
  sans: { family: "'Segoe UI', system-ui, -apple-system, sans-serif", weight: "600" },
  serif: { family: "Georgia, 'Times New Roman', serif", weight: "600" },
  script: { family: "'Segoe Script', 'Brush Script MT', 'Comic Sans MS', cursive", weight: "normal" },
  mono: { family: "ui-monospace, 'Cascadia Mono', Consolas, monospace", weight: "600" },
  display: { family: "'Trebuchet MS', 'Segoe UI', sans-serif", weight: "800" },
};

const NOTE_COLOR = "#facc15";
const DARK_CARD = "#111827";

export interface CardStyles {
  style: ArticleStyle;
  hoverStyle: ArticleStyle;
  activeStyle: ArticleStyle;
  cardLayout: CardLayoutName;
}

/**
 * The card styles for one event: colour from style.color, else its category,
 * else the theme's neutral; shape from style.card; font from style.font; size
 * and depth from importance. Text colour is chosen for contrast with whatever
 * it sits on.
 */
export function cardStyles(
  event: TimelineEventV2,
  theme: TimelineTheme,
  categoryColor?: TimelineColor,
  { compact = false }: { compact?: boolean } = {},
): CardStyles {
  const importance = event.importance ?? DEFAULT_IMPORTANCE;
  const depth = DEPTH[importance] ?? DEPTH[DEFAULT_IMPORTANCE];
  const card = event.style?.card ?? "classic";
  const font = FONT_FAMILIES[event.style?.font ?? "sans"];
  const chosen = event.style?.color ?? categoryColor;
  const base = chosen ? resolveColor(chosen, theme) : undefined;

  let header = base ?? theme.muted;
  if (card === "dark") header = base ? mixColors(base, DARK_CARD, 0.65) : DARK_CARD;
  if (card === "note") header = event.style?.color ? header : mixColors(base ?? NOTE_COLOR, "#ffffff", 0.55);
  header = mixColors(header, theme.background, depth.recede);
  const headerText = readableTextColor(header, theme.cardForeground);
  const band = card === "dark" ? "#05070c" : mixColors(header, "#000000", 0.32);
  const bandText = readableTextColor(band, theme.mutedForeground);

  const shadow = {
    x: 0,
    y: Math.round(depth.shadow / 3),
    amount: depth.shadow,
    color: "rgba(0, 0, 0, 0.35)",
  };
  const headerFont = `${font.weight} ${depth.font}px ${font.family}`;
  const bandFont = `normal ${depth.font - 2}px ${font.family}`;
  const border = { color: card === "dark" ? "#374151" : theme.border, width: 1 };

  if (card === "note" || compact) {
    // The landscape layout, one colour with the picture beside the text: a
    // sticky note, or any card in a lane, where portrait cards would not fit.
    const note: ArticleStyle = {
      width: depth.width + 34,
      height: 60 + (importance - DEFAULT_IMPORTANCE) * 6,
      // `color` also colours the stem, period bar and axis tick.
      color: header,
      backgroundColor: header,
      borderRadius: card === "rounded" ? 10 : 3,
      image: { margin: 6, borderRadius: card === "rounded" ? 6 : 2 },
      header: { text: { font: headerFont, color: headerText, numberOfLines: 2 } },
      subheader: { text: { font: bandFont, color: headerText } },
      shadow: { x: 2, y: 3, amount: Math.max(6, depth.shadow), color: "rgba(0, 0, 0, 0.3)" },
      border,
    };
    return {
      cardLayout: "landscape",
      style: note,
      hoverStyle: { color: header, backgroundColor: header, border: { color: theme.primary, width: 2 } },
      activeStyle: {
        color: header,
        backgroundColor: header,
        header: { text: { color: headerText } },
        border: { color: theme.primary, width: 3 },
        shadow: { x: 2, y: 6, amount: 18, color: "rgba(0, 0, 0, 0.4)" },
      },
    };
  }

  const style: ArticleStyle = {
    width: card === "image" ? depth.width + 40 : depth.width,
    color: header,
    backgroundColor: card === "dark" ? DARK_CARD : theme.card,
    topRadius: card === "rounded" ? 12 : 3,
    image: card === "rounded"
      ? { shape: "natural", margin: 6, borderRadius: 10, maxHeight: 200 }
      : card === "image"
        ? { shape: "natural", margin: 0, maxHeight: 300 }
        : { shape: "natural", margin: 0, maxHeight: 200 },
    header: {
      height: card === "image" ? depth.header - 8 : depth.header,
      text: { font: headerFont, color: headerText, lineHeight: depth.font + 4, numberOfLines: 2 },
    },
    subheader: {
      height: card === "image" ? 22 : 26,
      color: band,
      text: { font: bandFont, color: bandText },
    },
    shadow,
    border,
  };
  return {
    cardLayout: "portrait",
    style,
    // Histropedia's default hover and active styles recolour the card; keep the
    // category colour and mark the state with the border and shadow instead.
    hoverStyle: {
      color: header,
      header: { text: { color: headerText } },
      border: { color: theme.primary, width: 2 },
    },
    activeStyle: {
      color: header,
      header: { text: { color: headerText } },
      subheader: { color: band, text: { color: bandText } },
      border: { color: theme.primary, width: 3 },
      shadow: { x: 0, y: 6, amount: 18, color: "rgba(0, 0, 0, 0.4)" },
      connectorLine: { thickness: 2 },
    },
  };
}

// --- Dates ------------------------------------------------------------------

/** A Timeline date as a Histropedia date; precision is always stated, since Histropedia would otherwise assume day. */
export function toDateInput(date: TimelineDateV2): DateInput {
  const input: DateInput = { year: date.year, precision: date.precision ?? "year" };
  if (date.month !== undefined) input.month = date.month;
  if (date.day !== undefined) input.day = date.day;
  return input;
}

function compareDates(a: TimelineDateV2, b: TimelineDateV2): number {
  return a.year - b.year || (a.month ?? 1) - (b.month ?? 1) || (a.day ?? 1) - (b.day ?? 1);
}

// --- Model ------------------------------------------------------------------

function distinct(values: Array<string | undefined>): string[] {
  const seen: string[] = [];
  for (const value of values) if (value && !seen.includes(value)) seen.push(value);
  return seen;
}

/** The card's lower band: the date, then the subtitle when there is one. */
export function cardSubtitle(event: TimelineEventV2, dateLabel: string): string {
  return event.subtitle ? [dateLabel, event.subtitle].filter(Boolean).join(" · ") : dateLabel;
}

function eraStyle(era: TimelineEraV2, index: number, theme: TimelineTheme, colorOf: (category?: string) => TimelineColor | undefined): TimeBandStyle {
  const chosen = era.color ?? colorOf(era.category);
  const color = chosen ? resolveColor(chosen, theme) : theme.mutedForeground;
  return {
    // Uncoloured eras alternate in strength so neighbours stay distinct.
    backgroundColor: withAlpha(color, chosen ? 0.16 : index % 2 === 0 ? 0.08 : 0.14),
    text: { color: theme.mutedForeground },
  };
}

/**
 * Builds the Histropedia model for a normalized timeline. Events keep the
 * ids the normalizer gave them, which are unique.
 */
export function toHistropediaModel(timeline: TimelineV2, theme: TimelineTheme = DEFAULT_THEME): HistropediaModel {
  const events: PlacedEvent[] = timeline.events
    .map((event, index) => ({ event, index }))
    .sort((a, b) => compareDates(a.event.start, b.event.start) || a.index - b.index)
    .map(({ event }) => ({ id: event.id, event, dateLabel: formatEventDate(event) }));

  // Categories are coloured in order of first appearance in the data, so the
  // same data always gets the same colours, and eras share their events' colours.
  const categories = distinct([
    ...timeline.events.map((event) => event.category),
    ...(timeline.eras ?? []).map((era) => era.category),
  ]);
  const colorOf = (category?: string) =>
    category ? categoryColorAt(categories.indexOf(category)) : undefined;

  const groups = distinct(events.map(({ event }) => event.group));
  const tags = distinct(events.flatMap(({ event }) => event.tags ?? []));
  const hasUngrouped = events.some(({ event }) => !event.group);
  const lanes: LaneData[] = groups.length === 0
    ? []
    : [
        ...groups.map((group) => ({ id: `lane:${group}`, title: group })),
        ...(hasUngrouped ? [{ id: UNGROUPED_LANE }] : []),
      ];

  const articles: ArticleData[] = events.map(({ id, event, dateLabel }) => {
    const { cardLayout, style, hoverStyle, activeStyle } = cardStyles(event, theme, colorOf(event.category), {
      compact: lanes.length > 0,
    });
    const article: ArticleData = {
      id,
      title: event.title,
      subtitle: cardSubtitle(event, dateLabel),
      from: toDateInput(event.start),
      rank: event.importance ?? DEFAULT_IMPORTANCE,
      cardLayout,
      style,
      hoverStyle,
      activeStyle,
    };
    if (event.end) article.to = toDateInput(event.end);
    const imageUrl = safeHttpUrl(event.media?.url);
    if (imageUrl) article.imageUrl = imageUrl;
    if (lanes.length > 0) article.lane = event.group ? `lane:${event.group}` : UNGROUPED_LANE;
    return article;
  });

  const timeBands: TimeBandData[] = (timeline.eras ?? []).map((era, index) => ({
    id: `era-${index}`,
    title: era.title,
    from: toDateInput(era.start),
    to: toDateInput(era.end),
    style: eraStyle(era, index, theme, colorOf),
  }));

  return { articles, lanes, timeBands, events, categories, groups, tags };
}

/** Restyles the cards and bands of a model for a new theme (dark mode flipping). */
export function themedStyles(timeline: TimelineV2, theme: TimelineTheme) {
  const model = toHistropediaModel(timeline, theme);
  return {
    articles: model.articles.map(({ id, style, hoverStyle, activeStyle }) => ({ id, style, hoverStyle, activeStyle })),
    timeBands: model.timeBands.map(({ id, style }) => ({ id, style })),
  };
}

// --- Filtering --------------------------------------------------------------

export interface TimelineFilter {
  /** Show only these categories; empty shows all. */
  categories: string[];
  /** Show only this group; null shows all. */
  group: string | null;
  /** Show only events with any of these tags; empty shows all. */
  tags: string[];
  /** Case-insensitive text to find in the event's text, date, category, group or tags. */
  query: string;
}

export const EMPTY_FILTER: TimelineFilter = { categories: [], group: null, tags: [], query: "" };

export function isFilterActive(filter: TimelineFilter): boolean {
  return filter.categories.length > 0 || filter.group !== null || filter.tags.length > 0 || filter.query.trim() !== "";
}

export function matchesFilter(placed: PlacedEvent, filter: TimelineFilter): boolean {
  const { event } = placed;
  if (filter.categories.length > 0 && !(event.category && filter.categories.includes(event.category))) return false;
  if (filter.group !== null && event.group !== filter.group) return false;
  if (filter.tags.length > 0 && !(event.tags ?? []).some((tag) => filter.tags.includes(tag))) return false;
  const query = filter.query.trim().toLowerCase();
  if (!query) return true;
  return [event.title, event.subtitle, event.description, placed.dateLabel, event.category, event.group, ...(event.tags ?? [])]
    .some((text) => text?.toLowerCase().includes(query));
}

// --- Timeline-wide options --------------------------------------------------

/**
 * Canvas options that make the axis, markers and labels follow the app
 * theme. Card styles are per article (see cardStyles).
 */
export function themeOptions(theme: TimelineTheme): HistropediaOptions {
  return {
    style: {
      mainLine: {
        color: theme.border,
        // Each event's tick on the axis takes its card's colour.
        dateIndicators: { visible: true, color: "article", hiddenStyle: { opacity: 0.25 } },
      },
      draggingHighlight: { visible: false },
      marker: {
        minor: { color: theme.mutedForeground, futureColor: theme.mutedForeground },
        major: { color: theme.mutedForeground, futureColor: theme.mutedForeground },
      },
      dateLabel: {
        minor: { color: theme.mutedForeground, futureColor: theme.mutedForeground },
        major: { color: theme.cardForeground, futureColor: theme.cardForeground },
      },
    },
    timeBand: {
      defaultStyle: {
        backgroundColor: withAlpha(theme.mutedForeground, 0.1),
        text: { color: theme.mutedForeground },
      },
    },
  };
}
