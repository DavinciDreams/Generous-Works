/**
 * Component Registry Module
 * 
 * Exports all public APIs and types from the component registry system.
 * This module provides:
 * - Component registry for deduplication and lazy loading
 * - Compact component representations for memory efficiency
 * - Type definitions for component management
 * 
 * @module lib/components
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  /** Editable field metadata for component editing */
  EditableField,
  /** Compact component representation for memory-efficient storage */
  CompactComponent,
  /** Full component registry entry with complete component data */
  ComponentRegistryEntry,
  /** Component reference for linking to registered components */
  ComponentReference,
  /** Registry statistics */
  RegistryStats,
  /** Component complexity assessment result */
  ComplexityAssessment,
  /** Hash generation options */
  HashOptions,
  /** Component summary options */
  SummaryOptions,
  /** Token estimation options */
  TokenEstimationOptions,
} from './types';

// ============================================================================
// Class Exports
// ============================================================================

export {
  /** Component registry class for managing UI components */
  ComponentRegistry,
  /** Factory function to create a new component registry */
  createComponentRegistry,
} from './component-registry';

// ============================================================================
// Re-exports from Store
// ============================================================================

export type {
  /** UI Component type from store */
  UIComponent,
} from '../store';
