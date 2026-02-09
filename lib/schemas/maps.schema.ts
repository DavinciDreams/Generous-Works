/**
 * Zod schemas for Maps component
 * Provides runtime type validation for Maps props
 */

import { z } from 'zod';

/**
 * Geographic coordinates (longitude, latitude)
 * IMPORTANT: Order is longitude first, then latitude (NOT lat/lon)
 */
export const MapsCoordinatesSchema = z.object({
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90)
});

export type MapsCoordinates = z.infer<typeof MapsCoordinatesSchema>;

/**
 * Map marker
 */
export const MapsMarkerSchema = z.object({
  id: z.string(),
  coordinates: MapsCoordinatesSchema,
  label: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(), // Color name or hex
  popup: z.string().optional() // HTML content for popup
});

export type MapsMarker = z.infer<typeof MapsMarkerSchema>;

/**
 * View state (center and zoom)
 */
export const MapsViewStateSchema = z.object({
  center: MapsCoordinatesSchema,
  zoom: z.number().min(0).max(20).optional(),
  pitch: z.number().min(0).max(60).optional(),
  bearing: z.number().min(0).max(360).optional()
});

export type MapsViewState = z.infer<typeof MapsViewStateSchema>;

/**
 * Maps data structure
 */
export const MapsDataSchema = z.object({
  center: MapsCoordinatesSchema.optional(),
  zoom: z.number().min(0).max(20).optional(),
  markers: z.array(MapsMarkerSchema).optional(),
  viewState: MapsViewStateSchema.optional()
});

export type MapsData = z.infer<typeof MapsDataSchema>;

/**
 * Maps options
 */
export const MapsOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  enable3D: z.boolean().optional(), // Future: 3D objects support
  enableFullscreen: z.boolean().optional(),
  enableNavigation: z.boolean().optional(),
  style: z.string().optional() // Future: custom tile styles
}).passthrough(); // Allow additional options

export type MapsOptions = z.infer<typeof MapsOptionsSchema>;

/**
 * Complete Maps props schema
 */
export const MapsPropsSchema = z.object({
  data: MapsDataSchema,
  options: MapsOptionsSchema.optional()
});

export type MapsProps = z.infer<typeof MapsPropsSchema>;
