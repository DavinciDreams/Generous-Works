/**
 * Component Registry Types
 * 
 * Type definitions for the component registry system, including
 * compact representations, registry entries, and editable fields.
 */

import type { UIComponent } from '../store';

/**
 * Editable field metadata for component editing
 */
export interface EditableField {
  /** Field name/path */
  name: string;
  /** Field type */
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  /** Current value */
  value: unknown;
  /** Whether field is editable */
  editable: boolean;
  /** Validation rules */
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    enum?: unknown[];
  };
  /** Human-readable label */
  label?: string;
  /** Field description */
  description?: string;
}

/**
 * Compact component representation for memory-efficient storage
 * Contains only essential information for context building
 */
export interface CompactComponent {
  /** Component ID */
  id: string;
  /** Component type name */
  type: string;
  /** Content-based hash for deduplication */
  hash: string;
  /** Natural language summary for LLM context */
  summary: string;
  /** Estimated token count */
  estimatedTokens: number;
  /** Component complexity level */
  complexity: 'low' | 'medium' | 'high';
  /** Dependencies (component IDs this component references) */
  dependencies: string[];
  /** Usage statistics */
  usageStats: {
    /** Number of times accessed */
    accessCount: number;
    /** Last access timestamp */
    lastAccessed: number;
    /** Creation timestamp */
    createdAt: number;
  };
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Full component registry entry with complete component data
 */
export interface ComponentRegistryEntry {
  /** Component ID */
  id: string;
  /** Component type name */
  type: string;
  /** Full component specification */
  fullSpec: UIComponent;
  /** Compact representation */
  compactSpec: CompactComponent;
  /** Content-based hash */
  hash: string;
  /** Dependencies (component IDs this component references) */
  dependencies: string[];
  /** Editable fields for component modification */
  editableFields?: EditableField[];
  /** Usage statistics */
  usageStats: {
    /** Number of times accessed */
    accessCount: number;
    /** Last access timestamp */
    lastAccessed: number;
    /** Creation timestamp */
    createdAt: number;
  };
  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Component reference for linking to registered components
 */
export interface ComponentReference {
  /** Component ID */
  id: string;
  /** Component type */
  type: string;
  /** Component hash */
  hash: string;
  /** Component summary */
  summary: string;
}

/**
 * Registry statistics
 */
export interface RegistryStats {
  /** Total number of registered components */
  totalComponents: number;
  /** Number of unique components (deduplicated) */
  uniqueComponents: number;
  /** Number of duplicates avoided */
  duplicatesAvoided: number;
  /** Average access count */
  avgAccessCount: number;
  /** Total estimated tokens */
  totalEstimatedTokens: number;
  /** Complexity distribution */
  complexityDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

/**
 * Component complexity assessment result
 */
export interface ComplexityAssessment {
  /** Complexity level */
  level: 'low' | 'medium' | 'high';
  /** Complexity score (0-100) */
  score: number;
  /** Factors contributing to complexity */
  factors: {
    /** Number of properties */
    propertyCount: number;
    /** Depth of nesting */
    nestingDepth: number;
    /** Number of children */
    childCount: number;
    /** Number of dependencies */
    dependencyCount: number;
  };
}

/**
 * Hash generation options
 */
export interface HashOptions {
  /** Include component ID in hash */
  includeId?: boolean;
  /** Include timestamp in hash */
  includeTimestamp?: boolean;
  /** Custom hash algorithm */
  algorithm?: 'djb2' | 'sdbm' | 'fnv1a';
}

/**
 * Component summary options
 */
export interface SummaryOptions {
  /** Maximum summary length in characters */
  maxLength?: number;
  /** Include component type in summary */
  includeType?: boolean;
  /** Include key properties in summary */
  includeKeyProps?: boolean;
  /** Number of key properties to include */
  keyPropsCount?: number;
}

/**
 * Token estimation options
 */
export interface TokenEstimationOptions {
  /** Tokens per character approximation */
  tokensPerChar?: number;
  /** Include overhead for JSON structure */
  includeOverhead?: boolean;
}
