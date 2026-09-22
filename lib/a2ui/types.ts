/**
 * A2UI (Agent-to-User Interface) Type Definitions
 * Based on Google's A2UI v0.8 specification
 * https://a2ui.org/
 */

export interface A2UIMessage {
  /** Update the surface (UI components) */
  surfaceUpdate?: SurfaceUpdate;
  /** Update the data model (application state) */
  dataModelUpdate?: DataModelUpdate;
  /** Signal to begin rendering (the boolean form is Generous' legacy envelope). */
  beginRendering?: boolean | BeginRendering;
}

export interface SurfaceUpdate {
  /** List of components to render */
  components: A2UIComponent[];
  /** Optional surface ID */
  surfaceId?: string;
}

export interface A2UIComponent {
  /** Unique identifier for this component instance */
  id: string;
  /** Component definition with type and props */
  component: {
    [componentType: string]: Record<string, unknown>;
  };
  /** Optional parent ID for nesting */
  parentId?: string;
  /** Optional child component IDs */
  children?: string[];
}

/** Generous' original complete-message data model shape. */
export interface LegacyDataModelUpdate {
  /** Path to the data (e.g., "/user/name") */
  path: string;
  /** Value to set at the path */
  value: unknown;
  /** Optional operation type */
  operation?: 'set' | 'delete' | 'merge';
  /** Optional surface ID when the update is consumed as a stream event. */
  surfaceId?: string;
}

/** A typed A2UI v0.8 value. */
export interface A2UITypedValue {
  valueString?: string;
  valueNumber?: number;
  valueBoolean?: boolean;
  valueMap?: A2UIDataEntry[];
  valueList?: A2UITypedValue[];
}

/** A typed entry, including the wrapped value form used by some v0.8 bridges. */
export interface A2UIDataEntry extends A2UITypedValue {
  key: string;
  value?: A2UITypedValue;
}

/** A2UI v0.8 stream update. Data models are isolated by surface. */
export interface StreamDataModelUpdate {
  surfaceId?: string;
  path?: string;
  contents: A2UIDataEntry[];
}

export type DataModelUpdate = LegacyDataModelUpdate | StreamDataModelUpdate;

/** A2UI v0.8 render signal. */
export interface BeginRendering {
  surfaceId?: string;
  root: string;
  catalogId?: string;
  styles?: Record<string, unknown>;
}

/**
 * Component catalog definition
 * Defines available components for AI agents
 */
export interface ComponentCatalogEntry {
  /** Component type identifier */
  type: string;
  /** Human-readable description for AI */
  description: string;
  /** List of available props */
  props: string[];
  /** Example usage (for AI prompt generation) */
  examples?: ComponentExample[];
  /** Optional: Zod schema for validation */
  schema?: unknown;
}

export interface ComponentExample {
  /** Description of what this example demonstrates */
  description: string;
  /** Example A2UI component specification */
  spec: A2UIComponent;
}

/**
 * Component catalog - maps component types to their definitions
 */
export type ComponentCatalog = Record<string, ComponentCatalogEntry>;

/**
 * Renderer configuration
 */
export interface A2UIRendererConfig {
  /** Component catalog */
  catalog: ComponentCatalog;
  /** Fallback component for unknown types */
  fallback?: React.ComponentType<{ type: string }>;
  /** Enable validation (default: true) */
  validate?: boolean;
  /** Error handler */
  onError?: (error: Error, component: A2UIComponent) => void;
}

/**
 * Component props passed to rendered components
 */
export interface A2UIComponentProps<T = Record<string, unknown>> {
  /** Component ID */
  id: string;
  /** Validated props */
  props: T;
  /** Child components (for layout components) */
  children?: React.ReactNode;
  /** Data model (application state) */
  dataModel?: Record<string, unknown>;
}
