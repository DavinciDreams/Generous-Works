/**
 * Maps Timeline data (TimelineJS-shaped, which the AI catalog, saved surfaces
 * and the Galaxy contract all speak) onto HistropediaJS articles, lanes and
 * time bands. Pure functions only, so the mapping is testable without a canvas.
 */

import type {
  ArticleData,
  ArticleStyle,
  DateInput,
  LaneData,
  TimeBandData,
  TimelineOptions as HistropediaOptions,
} from "histropediajs";
import type { TimelineData, TimelineDate, TimelineSlide } from "./timeline";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const UNGROUPED_LANE = "lane:";

/** One dated event, in chronological order, with the id it has on the canvas. */
export interface PlacedEvent {
  id: string;
  slide: TimelineSlide;
  /** Plain-text headline (TimelineJS headlines may contain HTML). */
  headline: string;
  /** Human-readable date or date range. */
  dateLabel: string;
}

export interface HistropediaModel {
  articles: ArticleData[];
  lanes: LaneData[];
  timeBands: TimeBandData[];
  /** Dated events in chronological order; `articles[i]` draws `events[i]`. */
  events: PlacedEvent[];
}

/**
 * Converts a Timeline date to a Histropedia date. Histropedia treats a
 * year-only date as day precision unless told otherwise, so the precision is
 * always stated. Very old dates use million-year precision: Histropedia draws
 * a date as the whole span of its precision, so billion-year precision would
 * turn the Big Bang into a billion-year bar.
 */
export function toDateInput(date: TimelineDate): DateInput {
  const input: DateInput = { year: date.year };
  const parts = ["month", "day", "hour", "minute", "second", "millisecond"] as const;
  for (const part of parts) {
    if (typeof date[part] === "number") input[part] = date[part];
  }

  if (input.millisecond !== undefined) input.precision = "millisecond";
  else if (input.second !== undefined) input.precision = "second";
  else if (input.minute !== undefined) input.precision = "minute";
  else if (input.hour !== undefined) input.precision = "hour";
  else if (input.day !== undefined) input.precision = "day";
  else if (input.month !== undefined) input.precision = "month";
  else if (Math.abs(date.year) >= 1e6) input.precision = "million-years";
  else input.precision = "year";

  return input;
}

const trimNumber = (value: number) => String(Number(value.toFixed(2)));

/** Formats one Timeline date for display, e.g. "15 Jun 2024", "500 BCE", "13.8 billion years ago". */
export function formatTimelineDate(date: TimelineDate): string {
  if (date.display_date) return date.display_date;

  const { year } = date;
  const magnitude = Math.abs(year);
  if (year < 0 && magnitude >= 1e9) return `${trimNumber(magnitude / 1e9)} billion years ago`;
  if (year < 0 && magnitude >= 1e6) return `${trimNumber(magnitude / 1e6)} million years ago`;

  const yearText = year < 0 ? `${magnitude} BCE` : String(year);
  const monthText = date.month ? MONTHS[date.month - 1] : undefined;
  return [date.day && monthText ? date.day : undefined, monthText, yearText]
    .filter((part) => part !== undefined)
    .join(" ");
}

function formatSlideDate(slide: TimelineSlide): string {
  if (slide.display_date) return slide.display_date;
  if (!slide.start_date) return "";
  const start = formatTimelineDate(slide.start_date);
  if (!slide.end_date) return start;
  const end = formatTimelineDate(slide.end_date);
  return end === start ? start : `${start} – ${end}`;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  ndash: "–", mdash: "—", hellip: "…", deg: "°", minus: "−",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (match, body: string) => {
    if (body[0] === "#") {
      const codePoint = body[1].toLowerCase() === "x"
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      return codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

/**
 * Reduces TimelineJS's HTML text to plain text, keeping paragraph and line
 * breaks as newlines. The result is only ever drawn on canvas or rendered as a
 * React text node, never injected as HTML.
 */
export function toPlainText(html: string | undefined): string {
  if (!html) return "";
  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, "");
  return decodeEntities(text)
    .split("\n")
    .map((line) => line.replace(/[ \t\f\v ]+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

/** Only http(s) URLs are linked or loaded; `javascript:` and friends parse as valid URLs too. */
export function safeHttpUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : undefined;
  } catch {
    return undefined;
  }
}

/** TimelineJS media can be video, audio or a web page; only images go on a card. */
export function looksLikeImage(url: string | undefined): boolean {
  if (!url) return false;
  try {
    return /\.(png|jpe?g|gif|webp|avif|svg|bmp)$/i.test(new URL(url).pathname);
  } catch {
    return false;
  }
}

function eventImage(slide: TimelineSlide): string | undefined {
  const thumbnail = safeHttpUrl(slide.media?.thumbnail);
  if (thumbnail) return thumbnail;
  return looksLikeImage(slide.media?.url) ? safeHttpUrl(slide.media?.url) : undefined;
}

/** Sort key matching TimelineJS's chronological slide order. */
function dateSortKey(date: TimelineDate): number[] {
  return [
    date.year,
    date.month ?? 1,
    date.day ?? 1,
    date.hour ?? 0,
    date.minute ?? 0,
    date.second ?? 0,
    date.millisecond ?? 0,
  ];
}

function compareDates(a: TimelineDate, b: TimelineDate): number {
  const keyA = dateSortKey(a);
  const keyB = dateSortKey(b);
  for (let i = 0; i < keyA.length; i++) {
    if (keyA[i] !== keyB[i]) return keyA[i] - keyB[i];
  }
  return 0;
}

/**
 * Builds the Histropedia model for a Timeline. Events without a start date
 * cannot be placed on the axis and are left out, as TimelineJS also requires
 * one. Event ids come from `unique_id`, made unique if the data repeats one.
 */
export function toHistropediaModel(data: TimelineData): HistropediaModel {
  const seen = new Set<string>();
  const dated = (data.events ?? [])
    .map((slide, index) => ({ slide, index }))
    .filter(({ slide }) => typeof slide.start_date?.year === "number")
    .sort((a, b) => compareDates(a.slide.start_date, b.slide.start_date) || a.index - b.index);

  const events: PlacedEvent[] = dated.map(({ slide, index }) => {
    let id = slide.unique_id || `event-${index}`;
    while (seen.has(id)) id = `${id}-${index}`;
    seen.add(id);
    const dateLabel = formatSlideDate(slide);
    return {
      id,
      slide,
      dateLabel,
      headline: toPlainText(slide.text?.headline).replace(/\n/g, " ") || dateLabel || "Untitled event",
    };
  });

  const groups: string[] = [];
  for (const { slide } of events) {
    if (slide.group && !groups.includes(slide.group)) groups.push(slide.group);
  }
  const hasUngrouped = events.some(({ slide }) => !slide.group);
  const lanes: LaneData[] = groups.length === 0
    ? []
    : [
        ...groups.map((group) => ({ id: `lane:${group}`, title: group })),
        ...(hasUngrouped ? [{ id: UNGROUPED_LANE }] : []),
      ];

  const articles: ArticleData[] = events.map(({ id, slide, headline, dateLabel }) => {
    const article: ArticleData = {
      id,
      title: headline,
      subtitle: dateLabel,
      from: toDateInput(slide.start_date),
    };
    if (slide.end_date) article.to = toDateInput(slide.end_date);
    const imageUrl = eventImage(slide);
    if (imageUrl) article.imageUrl = imageUrl;
    if (slide.background?.color) article.style = { color: slide.background.color };
    if (lanes.length > 0) article.lane = slide.group ? `lane:${slide.group}` : UNGROUPED_LANE;
    return article;
  });

  const timeBands: TimeBandData[] = (data.eras ?? [])
    .filter((era) => typeof era.start_date?.year === "number" && typeof era.end_date?.year === "number")
    .map((era, index) => ({
      id: `era-${index}`,
      title: toPlainText(era.text?.headline).replace(/\n/g, " "),
      from: toDateInput(era.start_date),
      to: toDateInput(era.end_date),
    }));

  return { articles, lanes, timeBands, events };
}

/** The colours the canvas needs, read from the page's theme variables. */
export interface TimelineTheme {
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  primary: string;
}

/**
 * Canvas options that make the timeline follow the app theme. Histropedia
 * draws on a canvas, so CSS variables have to be resolved and passed in.
 */
export function themeOptions(theme: TimelineTheme): HistropediaOptions {
  const cardStyle: ArticleStyle = {
    color: theme.muted,
    backgroundColor: theme.card,
    header: { text: { color: theme.cardForeground } },
    subheader: { color: theme.card, text: { color: theme.mutedForeground } },
    border: { color: theme.border },
  };
  return {
    style: {
      mainLine: { color: theme.border },
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
    article: {
      defaultStyle: cardStyle,
      defaultActiveStyle: {
        color: theme.primary,
        border: { color: theme.primary },
        subheader: { color: theme.card },
      },
    },
    timeBand: {
      defaultStyle: {
        backgroundColor: theme.muted,
        text: { color: theme.mutedForeground },
      },
    },
  };
}
