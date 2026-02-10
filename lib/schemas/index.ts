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

// SVGPreview schemas
export * from './svgpreview.schema';

// NodeEditor schemas
export * from './nodeeditor.schema';

// KnowledgeGraph schemas
export * from './knowledgegraph.schema';

// Latex schemas
export * from './latex.schema';

// ModelViewer schemas
export * from './modelviewer.schema';

// Phaser schemas
export * from './phaser.schema';

// Mermaid schemas
export * from './mermaid.schema';

// Remotion schemas
export * from './remotion.schema';

/**
 * Registry of all component schemas
 * Maps component type to its props schema
 */
import {
  TimelinePropsSchema,
  MapsPropsSchema,
  ThreeScenePropsSchema,
  SVGPreviewPropsSchema,
  NodeEditorPropsSchema,
  KnowledgeGraphPropsSchema,
  LatexPropsSchema,
  ModelViewerPropsSchema,
  PhaserPropsSchema,
  MermaidPropsSchema,
  RemotionPropsSchema
} from '.';

import type { ZodSchema } from 'zod';

export const schemaRegistry: Record<string, ZodSchema> = {
  Timeline: TimelinePropsSchema,
  Maps: MapsPropsSchema,
  ThreeScene: ThreeScenePropsSchema,
  SVGPreview: SVGPreviewPropsSchema,
  NodeEditor: NodeEditorPropsSchema,
  KnowledgeGraph: KnowledgeGraphPropsSchema,
  Latex: LatexPropsSchema,
  ModelViewer: ModelViewerPropsSchema,
  Phaser: PhaserPropsSchema,
  Mermaid: MermaidPropsSchema,
  Remotion: RemotionPropsSchema
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
