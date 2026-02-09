/**
 * Zod schemas for ThreeScene component
 * Provides runtime type validation for ThreeScene props
 */

import { z } from 'zod';

/**
 * 3D Vector
 */
export const Vector3Schema = z.object({
  x: z.number().optional(),
  y: z.number().optional(),
  z: z.number().optional()
});

export type Vector3 = z.infer<typeof Vector3Schema>;

/**
 * Camera configuration
 */
export const ThreeSceneCameraSchema = z.object({
  type: z.enum(['perspective', 'orthographic']),
  position: Vector3Schema.optional(),
  fov: z.number().min(1).max(180).optional(), // Field of view (perspective only)
  near: z.number().positive().optional(),
  far: z.number().positive().optional()
});

export type ThreeSceneCamera = z.infer<typeof ThreeSceneCameraSchema>;

/**
 * Light configuration
 */
export const ThreeSceneLightSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['ambient', 'directional', 'point', 'spot', 'hemisphere']),
  color: z.number().optional(), // Hex color (e.g., 0xffffff)
  intensity: z.number().min(0).optional(),
  position: Vector3Schema.optional()
});

export type ThreeSceneLight = z.infer<typeof ThreeSceneLightSchema>;

/**
 * 3D Object (simplified - actual Three.js objects created client-side)
 *
 * Note: A2UI can only transmit JSON, not Three.js object instances.
 * This schema defines the object metadata. The actual Three.js mesh
 * must be created on the client side based on this data.
 */
export const ThreeSceneObjectSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['box', 'sphere', 'cylinder', 'cone', 'torus', 'plane']).optional(),
  position: Vector3Schema.optional(),
  rotation: Vector3Schema.optional(),
  scale: z.union([
    z.number(),
    Vector3Schema
  ]).optional(),
  color: z.number().optional(), // Hex color
  wireframe: z.boolean().optional()
});

export type ThreeSceneObject = z.infer<typeof ThreeSceneObjectSchema>;

/**
 * Fog configuration
 */
export const ThreeSceneFogSchema = z.object({
  color: z.number(),
  near: z.number(),
  far: z.number()
});

export type ThreeSceneFog = z.infer<typeof ThreeSceneFogSchema>;

/**
 * ThreeScene data structure
 */
export const ThreeSceneDataSchema = z.object({
  objects: z.array(ThreeSceneObjectSchema).optional(),
  lights: z.array(ThreeSceneLightSchema).optional(),
  camera: ThreeSceneCameraSchema.optional(),
  background: z.union([
    z.number(), // Hex color
    z.literal('transparent')
  ]).optional(),
  fog: ThreeSceneFogSchema.optional()
});

export type ThreeSceneData = z.infer<typeof ThreeSceneDataSchema>;

/**
 * ThreeScene options
 */
export const ThreeSceneOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  antialias: z.boolean().optional(),
  alpha: z.boolean().optional(),
  autoRotate: z.boolean().optional(),
  enableControls: z.boolean().optional(),
  controlsType: z.enum(['orbit', 'trackball', 'fly']).optional(),
  gridHelper: z.boolean().optional(),
  axesHelper: z.boolean().optional()
}).passthrough(); // Allow additional options

export type ThreeSceneOptions = z.infer<typeof ThreeSceneOptionsSchema>;

/**
 * Complete ThreeScene props schema
 */
export const ThreeScenePropsSchema = z.object({
  data: ThreeSceneDataSchema,
  options: ThreeSceneOptionsSchema.optional()
});

export type ThreeSceneProps = z.infer<typeof ThreeScenePropsSchema>;
