/**
 * Zod schemas for ModelViewer component
 * Provides runtime type validation for ModelViewer props
 */

import { z } from 'zod';

/**
 * Model formats
 */
export const ModelFormatSchema = z.enum(['gltf', 'glb', 'obj', 'fbx', 'stl', 'dae']);

export type ModelFormat = z.infer<typeof ModelFormatSchema>;

/**
 * 3D Vector for ModelViewer
 */
export const ModelViewerVector3Schema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number()
});

export type ModelViewerVector3 = z.infer<typeof ModelViewerVector3Schema>;

/**
 * ModelViewer data structure
 */
export const ModelViewerDataSchema = z.object({
  url: z.string().url('Valid model URL is required'),
  format: ModelFormatSchema,
  scale: z.number().positive().optional(),
  position: ModelViewerVector3Schema.optional(),
  rotation: ModelViewerVector3Schema.optional()
});

export type ModelViewerData = z.infer<typeof ModelViewerDataSchema>;

/**
 * ModelViewer options
 */
export const ModelViewerOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  enableControls: z.boolean().optional(),
  autoRotate: z.boolean().optional(),
  autoRotateSpeed: z.number().optional(),
  cameraPosition: ModelViewerVector3Schema.optional(),
  backgroundColor: z.number().optional(),
  showGrid: z.boolean().optional(),
  showAxes: z.boolean().optional(),
  antialias: z.boolean().optional()
}).passthrough(); // Allow additional Three.js options

export type ModelViewerOptions = z.infer<typeof ModelViewerOptionsSchema>;

/**
 * Complete ModelViewer props schema
 */
export const ModelViewerPropsSchema = z.object({
  data: ModelViewerDataSchema,
  options: ModelViewerOptionsSchema.optional()
});

export type ModelViewerProps = z.infer<typeof ModelViewerPropsSchema>;
