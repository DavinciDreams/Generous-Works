/**
 * Zod schemas for Remotion component
 * Provides runtime type validation for Remotion video composition props
 */

import { z } from 'zod';

/**
 * Remotion composition
 */
export const RemotionCompositionSchema = z.object({
  id: z.string(),
  component: z.string(), // Serialized React component or composition
  width: z.number().positive(),
  height: z.number().positive(),
  fps: z.number().positive(),
  durationInFrames: z.number().positive().int(),
  defaultProps: z.record(z.string(), z.unknown()).optional()
});

export type RemotionComposition = z.infer<typeof RemotionCompositionSchema>;

/**
 * Remotion data structure
 */
export const RemotionDataSchema = z.object({
  composition: RemotionCompositionSchema,
  inputProps: z.record(z.string(), z.unknown()).optional()
});

export type RemotionData = z.infer<typeof RemotionDataSchema>;

/**
 * Remotion options
 */
export const RemotionOptionsSchema = z.object({
  autoPlay: z.boolean().optional(),
  loop: z.boolean().optional(),
  controls: z.boolean().optional(),
  muted: z.boolean().optional(),
  playbackRate: z.number().positive().optional()
}).passthrough(); // Allow additional options

export type RemotionOptions = z.infer<typeof RemotionOptionsSchema>;

/**
 * Complete Remotion props schema
 */
export const RemotionPropsSchema = z.object({
  data: RemotionDataSchema,
  options: RemotionOptionsSchema.optional()
});

export type RemotionProps = z.infer<typeof RemotionPropsSchema>;
