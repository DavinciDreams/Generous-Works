/**
 * Zod schemas for Phaser component
 * Provides runtime type validation for Phaser game engine props
 */

import { z } from 'zod';

/**
 * Phaser game type
 */
export const PhaserTypeSchema = z.enum(['AUTO', 'CANVAS', 'WEBGL']);

export type PhaserType = z.infer<typeof PhaserTypeSchema>;

/**
 * Phaser physics engine
 */
export const PhaserPhysicsSchema = z.object({
  default: z.enum(['arcade', 'matter', 'impact']).optional(),
}).passthrough(); // Allow additional physics config

export type PhaserPhysics = z.infer<typeof PhaserPhysicsSchema>;

/**
 * Phaser scale mode
 */
export const PhaserScaleSchema = z.object({
  mode: z.enum(['NONE', 'FIT', 'RESIZE']).optional(),
  autoCenter: z.enum(['CENTER_BOTH', 'CENTER_HORIZONTALLY', 'CENTER_VERTICALLY']).optional()
}).passthrough(); // Allow additional scale config

export type PhaserScale = z.infer<typeof PhaserScaleSchema>;

/**
 * Phaser config
 */
export const PhaserConfigSchema = z.object({
  type: PhaserTypeSchema.optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  backgroundColor: z.union([z.number(), z.string()]).optional(),
  physics: PhaserPhysicsSchema.optional(),
  scale: PhaserScaleSchema.optional()
}).passthrough(); // Allow additional Phaser config options

export type PhaserConfig = z.infer<typeof PhaserConfigSchema>;

/**
 * Phaser scene
 */
export const PhaserSceneSchema = z.object({
  key: z.string(),
  preload: z.string().optional(), // JavaScript code as string
  create: z.string().optional(), // JavaScript code as string
  update: z.string().optional() // JavaScript code as string
});

export type PhaserScene = z.infer<typeof PhaserSceneSchema>;

/**
 * Phaser data structure
 */
export const PhaserDataSchema = z.object({
  config: PhaserConfigSchema,
  scenes: z.array(PhaserSceneSchema).min(1, 'At least one scene is required')
});

export type PhaserData = z.infer<typeof PhaserDataSchema>;

/**
 * Phaser options
 */
export const PhaserOptionsSchema = z.object({
  autoStart: z.boolean().optional(),
  showControls: z.boolean().optional()
}).passthrough(); // Allow additional options

export type PhaserOptions = z.infer<typeof PhaserOptionsSchema>;

/**
 * Complete Phaser props schema
 */
export const PhaserPropsSchema = z.object({
  data: PhaserDataSchema,
  options: PhaserOptionsSchema.optional()
});

export type PhaserProps = z.infer<typeof PhaserPropsSchema>;
