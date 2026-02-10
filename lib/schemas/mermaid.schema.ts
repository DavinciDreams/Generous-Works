/**
 * Zod schemas for Mermaid component
 * Provides runtime type validation for Mermaid diagram renderer props
 */

import { z } from 'zod';

/**
 * Mermaid theme
 */
export const MermaidThemeSchema = z.enum(['default', 'dark', 'forest', 'neutral']);

export type MermaidTheme = z.infer<typeof MermaidThemeSchema>;

/**
 * Mermaid data structure
 */
export const MermaidDataSchema = z.object({
  diagram: z.string().min(1, 'Diagram text is required'),
  theme: MermaidThemeSchema.optional()
});

export type MermaidData = z.infer<typeof MermaidDataSchema>;

/**
 * Mermaid options
 */
export const MermaidOptionsSchema = z.object({
  theme: MermaidThemeSchema.optional(),
  securityLevel: z.enum(['strict', 'loose', 'antiscript', 'sandbox']).optional(),
  startOnLoad: z.boolean().optional()
}).passthrough(); // Allow additional Mermaid config options

export type MermaidOptions = z.infer<typeof MermaidOptionsSchema>;

/**
 * Complete Mermaid props schema
 */
export const MermaidPropsSchema = z.object({
  data: MermaidDataSchema,
  options: MermaidOptionsSchema.optional(),
  title: z.string().optional()
});

export type MermaidProps = z.infer<typeof MermaidPropsSchema>;
