/**
 * Zod schemas for SVGPreview component
 * Provides runtime type validation for SVGPreview props
 */

import { z } from 'zod';

/**
 * SVGPreview data structure
 */
export const SVGPreviewDataSchema = z.object({
  svg: z.string().min(1, 'SVG content is required'),
  title: z.string().optional(),
  filename: z.string().optional()
});

export type SVGPreviewData = z.infer<typeof SVGPreviewDataSchema>;

/**
 * SVGPreview options
 */
export const SVGPreviewOptionsSchema = z.object({
  width: z.union([z.number(), z.string()]).optional(),
  height: z.union([z.number(), z.string()]).optional(),
  showSource: z.boolean().optional(),
  isolate: z.boolean().optional()
}).passthrough(); // Allow additional options

export type SVGPreviewOptions = z.infer<typeof SVGPreviewOptionsSchema>;

/**
 * Complete SVGPreview props schema
 */
export const SVGPreviewPropsSchema = z.object({
  svg: z.string().min(1, 'SVG content is required'),
  title: z.string().optional(),
  filename: z.string().optional(),
  width: z.union([z.number(), z.string()]).optional(),
  height: z.union([z.number(), z.string()]).optional()
});

export type SVGPreviewProps = z.infer<typeof SVGPreviewPropsSchema>;
