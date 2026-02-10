/**
 * Zod schemas for Latex component
 * Provides runtime type validation for Latex props
 */

import { z } from 'zod';

/**
 * Latex equation
 */
export const LatexEquationSchema = z.object({
  id: z.string().optional(),
  equation: z.string().min(1, 'Equation is required'),
  displayMode: z.boolean().optional(),
  label: z.string().optional()
});

export type LatexEquation = z.infer<typeof LatexEquationSchema>;

/**
 * Latex data structure
 */
export const LatexDataSchema = z.object({
  equations: z.array(LatexEquationSchema).optional(),
  equation: z.string().optional(),
  displayMode: z.boolean().optional()
}).refine(
  (data) => data.equation || (data.equations && data.equations.length > 0),
  {
    message: 'Must provide either equation or equations array'
  }
);

export type LatexData = z.infer<typeof LatexDataSchema>;

/**
 * Latex options
 */
export const LatexOptionsSchema = z.object({
  displayMode: z.boolean().optional(),
  throwOnError: z.boolean().optional(),
  errorColor: z.string().optional(),
  macros: z.record(z.string(), z.string()).optional(),
  trust: z.boolean().optional(),
  strict: z.union([z.boolean(), z.enum(['warn', 'ignore'])]).optional(),
  output: z.enum(['html', 'mathml', 'htmlAndMathml']).optional(),
  fleqn: z.boolean().optional(),
  leqno: z.boolean().optional(),
  minRuleThickness: z.number().optional()
}).passthrough(); // Allow additional KaTeX options

export type LatexOptions = z.infer<typeof LatexOptionsSchema>;

/**
 * Complete Latex props schema
 */
export const LatexPropsSchema = z.object({
  data: LatexDataSchema,
  options: LatexOptionsSchema.optional()
});

export type LatexProps = z.infer<typeof LatexPropsSchema>;
