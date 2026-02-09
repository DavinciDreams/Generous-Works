/**
 * Zod schemas for Timeline component
 * Provides runtime type validation for Timeline props
 */

import { z } from 'zod';

/**
 * Timeline date format
 */
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

/**
 * Timeline text content
 */
export const TimelineTextSchema = z.object({
  headline: z.string().optional(),
  text: z.string().optional()
});

export type TimelineText = z.infer<typeof TimelineTextSchema>;

/**
 * Timeline media (images, etc.)
 */
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

/**
 * Timeline slide (event)
 */
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
  unique_id: z.string().optional() // Required for proper rendering
});

export type TimelineSlide = z.infer<typeof TimelineSlideSchema>;

/**
 * Timeline era (time period)
 */
export const TimelineEraSchema = z.object({
  start_date: TimelineDateSchema,
  end_date: TimelineDateSchema,
  text: TimelineTextSchema.optional()
});

export type TimelineEra = z.infer<typeof TimelineEraSchema>;

/**
 * Timeline data structure
 */
export const TimelineDataSchema = z.object({
  title: TimelineSlideSchema.optional(),
  events: z.array(TimelineSlideSchema),
  eras: z.array(TimelineEraSchema).optional(),
  scale: z.enum(['human', 'cosmological']).optional()
});

export type TimelineData = z.infer<typeof TimelineDataSchema>;

/**
 * Timeline options
 */
export const TimelineOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  language: z.string().optional(),
  start_at_end: z.boolean().optional(),
  start_at_slide: z.number().optional(),
  timenav_position: z.enum(['top', 'bottom']).optional(),
  hash_bookmark: z.boolean().optional(),
  default_bg_color: z.string().optional(),
  scale_factor: z.number().optional(),
  initial_zoom: z.number().optional(),
  zoom_sequence: z.array(z.number()).optional(),
  marker_height_min: z.number().optional(),
  marker_width_min: z.number().optional()
}).passthrough(); // Allow additional options

export type TimelineOptions = z.infer<typeof TimelineOptionsSchema>;

/**
 * Complete Timeline props schema
 */
export const TimelinePropsSchema = z.object({
  data: TimelineDataSchema,
  options: TimelineOptionsSchema.optional()
});

export type TimelineProps = z.infer<typeof TimelinePropsSchema>;
