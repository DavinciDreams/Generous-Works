/**
 * Zod schemas for the Timeline component.
 *
 * The current shape is the library-neutral one in
 * lib/a2ui/timeline-contract.ts, matching Galaxy's gb.surface.v1 contract
 * (`$defs.timeline`): `events` or a spreadsheet-style `table`, plus optional
 * eras. The legacy TimelineJS shape (`data.events` with `start_date`) is still
 * accepted. Either way the component normalizes the props, so these schemas
 * check structure and types; the normalizer applies the contract's length
 * bounds and drops unsafe URLs and colours.
 */

import { z } from 'zod';
import {
  TIMELINE_CARD_STYLES,
  TIMELINE_COLOR_PATTERN,
  TIMELINE_FONTS,
  TIMELINE_LIMITS,
  TIMELINE_PRECISIONS,
} from '@/lib/a2ui/timeline-contract';

// --- Current shape ----------------------------------------------------------

export const TimelineV2DateSchema = z.object({
  year: z.number().int().min(TIMELINE_LIMITS.minYear).max(TIMELINE_LIMITS.maxYear),
  month: z.number().int().min(1).max(12).optional(),
  day: z.number().int().min(1).max(31).optional(),
  precision: z.enum(TIMELINE_PRECISIONS).optional(),
});

export const TimelineColorSchema = z.string().regex(TIMELINE_COLOR_PATTERN, {
  message: 'Colour must be #RRGGBB or one of chart-1..chart-5, primary, secondary, muted, accent, destructive',
});

export const TimelineV2EventSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  start: TimelineV2DateSchema,
  end: TimelineV2DateSchema.optional(),
  dateLabel: z.string().optional(),
  importance: z.number().int().min(1).max(5).optional(),
  category: z.string().optional(),
  group: z.string().optional(),
  tags: z.array(z.string()).optional(),
  media: z.object({
    url: z.string(),
    caption: z.string().optional(),
    credit: z.string().optional(),
    alt: z.string().optional(),
  }).optional(),
  link: z.object({
    url: z.string(),
    label: z.string().optional(),
  }).optional(),
  style: z.object({
    card: z.enum(TIMELINE_CARD_STYLES).optional(),
    color: TimelineColorSchema.optional(),
    font: z.enum(TIMELINE_FONTS).optional(),
  }).optional(),
});

export const TimelineV2EraSchema = z.object({
  title: z.string().min(1),
  start: TimelineV2DateSchema,
  end: TimelineV2DateSchema,
  category: z.string().optional(),
  color: TimelineColorSchema.optional(),
});

const columnName = z.string().min(1);

export const TimelineTableSchema = z.object({
  columns: z.array(columnName).min(1),
  rows: z.array(z.array(z.union([z.string(), z.number(), z.null()]))),
  map: z.object({
    title: columnName,
    start: columnName,
    id: columnName.optional(),
    subtitle: columnName.optional(),
    description: columnName.optional(),
    end: columnName.optional(),
    dateLabel: columnName.optional(),
    importance: columnName.optional(),
    category: columnName.optional(),
    group: columnName.optional(),
    tags: columnName.optional(),
    image: columnName.optional(),
    imageCaption: columnName.optional(),
    imageCredit: columnName.optional(),
    link: columnName.optional(),
    linkLabel: columnName.optional(),
    color: columnName.optional(),
  }),
});

export const TimelineV2PropsSchema = z.object({
  title: z.string().optional(),
  height: z.number().int().min(TIMELINE_LIMITS.minHeight).max(TIMELINE_LIMITS.maxHeight).optional(),
  events: z.array(TimelineV2EventSchema).optional(),
  table: TimelineTableSchema.optional(),
  eras: z.array(TimelineV2EraSchema).optional(),
}).refine((props) => (props.events === undefined) !== (props.table === undefined), {
  message: 'Timeline needs either events or table, not both',
});

export type TimelineV2Props = z.infer<typeof TimelineV2PropsSchema>;

// --- Legacy TimelineJS shape ------------------------------------------------

export const TimelineDateSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12).optional(),
  day: z.number().int().min(1).max(31).optional(),
  hour: z.number().int().min(0).max(23).optional(),
  minute: z.number().int().min(0).max(59).optional(),
  second: z.number().int().min(0).max(59).optional(),
  millisecond: z.number().int().min(0).max(999).optional(),
  display_date: z.string().optional(),
  format: z.string().optional()
});

export type TimelineDate = z.infer<typeof TimelineDateSchema>;

export const TimelineTextSchema = z.object({
  headline: z.string().optional(),
  text: z.string().optional()
});

export type TimelineText = z.infer<typeof TimelineTextSchema>;

export const TimelineMediaSchema = z.object({
  url: z.string().url(),
  caption: z.string().optional(),
  credit: z.string().optional(),
  thumbnail: z.string().url().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
  link: z.string().url().optional(),
  link_target: z.string().optional()
});

export type TimelineMedia = z.infer<typeof TimelineMediaSchema>;

export const TimelineSlideSchema = z.object({
  start_date: TimelineDateSchema.optional(),
  end_date: TimelineDateSchema.optional(),
  text: TimelineTextSchema.optional(),
  media: TimelineMediaSchema.optional(),
  group: z.string().optional(),
  display_date: z.string().optional(),
  background: z.object({
    url: z.string().url().optional(),
    color: z.string().optional()
  }).optional(),
  autolink: z.boolean().optional(),
  unique_id: z.string().optional()
});

export type TimelineSlide = z.infer<typeof TimelineSlideSchema>;

export const TimelineEraSchema = z.object({
  start_date: TimelineDateSchema,
  end_date: TimelineDateSchema,
  text: TimelineTextSchema.optional()
});

export type TimelineEra = z.infer<typeof TimelineEraSchema>;

export const TimelineDataSchema = z.object({
  title: TimelineSlideSchema.optional(),
  events: z.array(TimelineSlideSchema),
  eras: z.array(TimelineEraSchema).optional(),
  scale: z.enum(['human', 'cosmological']).optional()
});

export type TimelineData = z.infer<typeof TimelineDataSchema>;

/** Legacy options; only `height` is still used. */
export const TimelineOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  language: z.string().optional(),
  start_at_end: z.boolean().optional(),
  start_at_slide: z.number().optional(),
  timenav_position: z.enum(['top', 'bottom']).optional(),
}).passthrough();

export type TimelineOptions = z.infer<typeof TimelineOptionsSchema>;

export const LegacyTimelinePropsSchema = z.object({
  data: TimelineDataSchema,
  options: TimelineOptionsSchema.optional()
});

export type LegacyTimelineProps = z.infer<typeof LegacyTimelinePropsSchema>;

// --- Either shape -----------------------------------------------------------

/** Timeline props: the current shape (preferred) or the legacy TimelineJS shape. */
export const TimelinePropsSchema = z.union([TimelineV2PropsSchema, LegacyTimelinePropsSchema]);

export type TimelineProps = z.infer<typeof TimelinePropsSchema>;
