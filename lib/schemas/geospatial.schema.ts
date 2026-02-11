/**
 * Geospatial Component Schema
 * Advanced geospatial visualizations using deck.gl + MapLibre GL
 * Temporal visualizations using kepler.gl
 */

import { z } from "zod";

// Coordinates schema
export const GeospatialCoordinatesSchema = z.object({
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
});

// Path point schema for trips layer
const PathPointSchema = z.object({
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
  timestamp: z.union([z.number(), z.string()]).optional(),
});

// Standard data point schema (for point, line, polygon, heatmap, hexagon, arc)
const StandardDataPointSchema = z.object({
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
  value: z.number().optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
  // Arc layer fields
  targetLng: z.number().min(-180).max(180).optional(),
  targetLat: z.number().min(-90).max(90).optional(),
  // Temporal fields (for time-series)
  timestamp: z.union([z.number(), z.string()]).optional(),
});

// Trips data point schema (has path array instead of lng/lat)
const TripsDataPointSchema = z.object({
  path: z.array(PathPointSchema),
  properties: z.record(z.string(), z.unknown()).optional(),
});

// Layer schema
export const GeospatialLayerSchema = z.object({
  id: z.string(),
  type: z.enum(['point', 'line', 'polygon', 'heatmap', 'hexagon', 'arc', 'trips']),
  data: z.array(z.union([StandardDataPointSchema, TripsDataPointSchema])),
  style: z.object({
    color: z.union([z.string(), z.array(z.string())]),
    size: z.number().positive().optional(),
    opacity: z.number().min(0).max(1).optional(),
    // 3D fields
    extruded: z.boolean().optional(),
    elevation: z.number().optional(),
    // Trips layer fields
    trailLength: z.number().optional(),
  }),
  visible: z.boolean().optional(),
  // Temporal configuration
  temporal: z.boolean().optional(),
});

// Data schema
export const GeospatialDataSchema = z.object({
  center: GeospatialCoordinatesSchema,
  zoom: z.number().min(0).max(22),
  layers: z.array(GeospatialLayerSchema),
  basemap: z.enum(['light', 'dark', 'satellite', 'voyager']).optional(),
  // 3D perspective
  pitch: z.number().min(0).max(60).optional(),
  bearing: z.number().min(-180).max(180).optional(),
  // Temporal configuration
  timeline: z.object({
    enabled: z.boolean(),
    startTime: z.union([z.number(), z.string()]),
    endTime: z.union([z.number(), z.string()]),
    step: z.number().optional(),
    autoPlay: z.boolean().optional(),
    speed: z.number().optional(),
  }).optional(),
});

// Options schema
export const GeospatialOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  interactive: z.boolean().optional(),
  showControls: z.boolean().optional(),
}).passthrough().optional();

// Props schema
export const GeospatialPropsSchema = z.object({
  data: GeospatialDataSchema,
  options: GeospatialOptionsSchema,
});

// TypeScript types
export type GeospatialCoordinates = z.infer<typeof GeospatialCoordinatesSchema>;
export type PathPoint = z.infer<typeof PathPointSchema>;
export type StandardDataPoint = z.infer<typeof StandardDataPointSchema>;
export type TripsDataPoint = z.infer<typeof TripsDataPointSchema>;
export type GeospatialDataPoint = StandardDataPoint | TripsDataPoint;
export type GeospatialLayer = z.infer<typeof GeospatialLayerSchema>;
export type GeospatialData = z.infer<typeof GeospatialDataSchema>;
export type GeospatialOptions = z.infer<typeof GeospatialOptionsSchema>;
export type GeospatialProps = z.infer<typeof GeospatialPropsSchema>;
