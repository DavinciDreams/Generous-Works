/**
 * Schema exports
 * Central export point for all Zod schemas
 */

// Timeline schemas
export * from './timeline.schema';

// Maps schemas
export * from './maps.schema';

// ThreeScene schemas
export * from './threescene.schema';

/**
 * Registry of all component schemas
 * Maps component type to its props schema
 */
import {
  TimelinePropsSchema,
  MapsPropsSchema,
  ThreeScenePropsSchema
} from '.';

import type { ZodSchema } from 'zod';

export const schemaRegistry: Record<string, ZodSchema> = {
  Timeline: TimelinePropsSchema,
  Maps: MapsPropsSchema,
  ThreeScene: ThreeScenePropsSchema
};

/**
 * Get schema for a component type
 */
export function getSchema(componentType: string): ZodSchema | undefined {
  return schemaRegistry[componentType];
}

/**
 * Validate props for a component type
 */
export function validateProps<T>(
  componentType: string,
  props: unknown
): { success: true; data: T } | { success: false; error: Error } {
  const schema = getSchema(componentType);

  if (!schema) {
    return {
      success: false,
      error: new Error(`No schema found for component type: ${componentType}`)
    };
  }

  try {
    const validated = schema.parse(props);
    return { success: true, data: validated as T };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}
