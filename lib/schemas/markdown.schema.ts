import { z } from 'zod';

/**
 * Markdown editor mode
 */
export const MarkdownModeSchema = z.enum([
  'edit',      // Editor only
  'preview',   // Preview only
  'live',      // Side-by-side editor and preview
]);

export type MarkdownMode = z.infer<typeof MarkdownModeSchema>;

/**
 * Markdown data structure
 */
export const MarkdownDataSchema = z.object({
  content: z.string(), // The markdown content
  title: z.string().optional(), // Optional title for the document
});

export type MarkdownData = z.infer<typeof MarkdownDataSchema>;

/**
 * Markdown display options
 */
export const MarkdownOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(), // Editor height
  width: z.union([z.number(), z.string()]).optional(), // Editor width
  mode: MarkdownModeSchema.optional(), // Display mode (default: 'live')
  preview: z.enum(['edit', 'live', 'preview']).optional(), // Preview mode
  hideToolbar: z.boolean().optional(), // Hide the toolbar (default: false)
  enableScroll: z.boolean().optional(), // Enable scroll sync between editor and preview (default: true)
  highlightEnable: z.boolean().optional(), // Enable syntax highlighting in preview (default: true)
  visiableDragbar: z.boolean().optional(), // Show the dragbar between editor and preview (default: true)
}).optional();

export type MarkdownOptions = z.infer<typeof MarkdownOptionsSchema>;

/**
 * Complete Markdown props schema
 * Note: onChange callback is not included in schema (it's a client-side callback)
 */
export const MarkdownPropsSchema = z.object({
  data: MarkdownDataSchema,
  options: MarkdownOptionsSchema,
});

export type MarkdownProps = z.infer<typeof MarkdownPropsSchema>;
