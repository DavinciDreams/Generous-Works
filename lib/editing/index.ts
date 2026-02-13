/**
 * Editing Module
 * 
 * Provides editable component management with field-level validation,
 * edit history tracking, and undo/redo functionality.
 */

// ============================================================================
// Exports
// ============================================================================

// Editable component manager
export { EditableComponentManager } from './editable-component-manager';
export type {
  EditableField,
  FieldValidation,
  EditHistoryEntry,
  EditableComponent,
  FieldUpdateResult,
  ChangeListener,
} from './editable-component-manager';
