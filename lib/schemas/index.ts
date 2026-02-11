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

// Geospatial schemas
export * from './geospatial.schema';

// ToolUI schemas
export * from './toolui.schema';

// Charts schemas
export * from './charts.schema';

// WYSIWYG schemas
export * from './wysiwyg.schema';

// VRM schemas
export * from './vrm.schema';

// Calendar schemas
export * from './calendar.schema';

// JSONViewer schemas
export * from './jsonviewer.schema';

// CodeEditor schemas
export * from './codeeditor.schema';

// Markdown schemas
export * from './markdown.schema';

// DataTable schemas
export * from './datatable.schema';

// ImageGallery schemas
export * from './imagegallery.schema';

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
  RemotionPropsSchema,
  GeospatialPropsSchema,
  ToolUIPropsSchema,
  ChartsPropsSchema,
  WYSIWYGPropsSchema,
  VRMPropsSchema,
  CalendarPropsSchema,
  JSONViewerPropsSchema,
  CodeEditorPropsSchema,
  MarkdownPropsSchema,
  DataTablePropsSchema,
  ImageGalleryPropsSchema
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
  Remotion: RemotionPropsSchema,
  Geospatial: GeospatialPropsSchema,
  ToolUI: ToolUIPropsSchema,
  Charts: ChartsPropsSchema,
  WYSIWYG: WYSIWYGPropsSchema,
  VRM: VRMPropsSchema,
  Calendar: CalendarPropsSchema,
  JSONViewer: JSONViewerPropsSchema,
  CodeEditor: CodeEditorPropsSchema,
  Markdown: MarkdownPropsSchema,
  DataTable: DataTablePropsSchema,
  ImageGallery: ImageGalleryPropsSchema
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
