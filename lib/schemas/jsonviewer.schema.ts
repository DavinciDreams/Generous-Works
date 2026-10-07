/**
 * Zod schemas for JSONViewer component
 * Provides runtime type validation for @uiw/react-json-view props
 */

import { z } from 'zod';

/**
 * JSON value can be any valid JSON type
 */
export const JSONValueSchema: z.ZodType<any> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JSONValueSchema),
    z.record(z.string(), JSONValueSchema),
  ])
);

/**
 * Theme options for JSON viewer
 */
export const JSONViewerThemeSchema = z.enum([
  'light',
  'dark',
  'github',
  'vscode'
]);

export type JSONViewerTheme = z.infer<typeof JSONViewerThemeSchema>;

/**
 * JSON Viewer data structure
 */
export const JSONViewerDataSchema = z.object({
  value: JSONValueSchema,
  rootName: z.string().optional(), // Root node name (default: "root")
  collapsed: z.union([z.boolean(), z.number()]).optional(), // Collapse depth or boolean
});

export type JSONViewerData = z.infer<typeof JSONViewerDataSchema>;

/**
 * JSON Viewer display options
 */
export const JSONViewerOptionsSchema = z.object({
  mode: z.enum(['default', 'compact']).optional(),
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  theme: JSONViewerThemeSchema.optional(),
  displayDataTypes: z.boolean().optional(), // Show data type labels
  displayObjectSize: z.boolean().optional(), // Show object/array size
  enableClipboard: z.boolean().optional(), // Enable copy to clipboard
  maxStringLength: z.number().int().positive().max(100_000).optional(),
}).optional();

export type JSONViewerOptions = z.infer<typeof JSONViewerOptionsSchema>;

/**
 * Complete JSONViewer props schema
 */
export const JSONViewerPropsSchema = z.object({
  data: JSONViewerDataSchema,
  options: JSONViewerOptionsSchema,
});

export type JSONViewerProps = z.infer<typeof JSONViewerPropsSchema>;
