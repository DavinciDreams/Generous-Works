/**
 * Editable Component Manager
 * 
 * Manages editable components with field-level validation,
 * edit history tracking, undo/redo functionality, and change listeners.
 */

import type { UIComponent } from '../store';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Represents an editable field within a component
 */
export interface EditableField {
  /** Field name/path (e.g., 'props.title' or 'props.data[0].value') */
  name: string;
  /** Field type */
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'null';
  /** Current value of the field */
  value: unknown;
  /** Validation function or rule */
  validation?: FieldValidation;
  /** Whether the field is required */
  required?: boolean;
  /** Field label for UI display */
  label?: string;
  /** Field description */
  description?: string;
}

/**
 * Field validation rule
 */
export interface FieldValidation {
  /** Type of validation */
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom' | 'range';
  /** Validation value (for min, max, pattern, range) */
  value?: unknown;
  /** Custom validator function */
  validator?: (value: unknown) => boolean | string;
  /** Error message */
  message?: string;
}

/**
 * Edit history entry tracking changes to a component
 */
export interface EditHistoryEntry {
  /** Unique ID for this edit */
  id: string;
  /** Component ID */
  componentId: string;
  /** Field path that was changed */
  fieldPath: string;
  /** Previous value */
  oldValue: unknown;
  /** New value */
  newValue: unknown;
  /** Reason for the change */
  reason?: string;
  /** Timestamp of the change */
  timestamp: number;
  /** User who made the change */
  user?: string;
}

/**
 * Represents an editable component
 */
export interface EditableComponent {
  /** Component ID */
  id: string;
  /** Component type */
  type: string;
  /** Full component specification */
  fullSpec: UIComponent;
  /** Editable fields extracted from the component */
  editableFields: Record<string, EditableField>;
  /** Current version number */
  version: number;
  /** Timestamp of last modification */
  lastModified: number;
  /** Edit history for this component */
  editHistory: EditHistoryEntry[];
  /** Current position in edit history (for undo/redo) */
  historyPosition: number;
  /** Whether the component has unsaved changes */
  isDirty: boolean;
}

/**
 * Result of a field update operation
 */
export interface FieldUpdateResult {
  /** Whether the update was successful */
  success: boolean;
  /** Error message if unsuccessful */
  error?: string;
  /** The updated editable component */
  component?: EditableComponent;
}

/**
 * Change listener callback type
 */
export type ChangeListener = (componentId: string, fieldPath: string, oldValue: unknown, newValue: unknown) => void;

// ============================================================================
// Editable Component Manager Class
// ============================================================================

/**
 * Manages editable components with validation and history tracking
 */
export class EditableComponentManager {
  private editableComponents: Map<string, EditableComponent>;
  private changeListeners: Set<ChangeListener>;

  constructor() {
    this.editableComponents = new Map();
    this.changeListeners = new Set();
  }

  /**
   * Make a component editable
   * 
   * @param component - The component to make editable
   * @returns The editable component
   */
  makeEditable(component: UIComponent): EditableComponent {
    const existing = this.editableComponents.get(component.id);
    
    if (existing) {
      // Update existing editable component with new spec
      existing.fullSpec = component;
      existing.lastModified = Date.now();
      return existing;
    }

    // Create new editable component
    const editable: EditableComponent = {
      id: component.id,
      type: component.type,
      fullSpec: component,
      editableFields: this.extractEditableFields(component),
      version: 1,
      lastModified: Date.now(),
      editHistory: [],
      historyPosition: -1,
      isDirty: false,
    };

    this.editableComponents.set(component.id, editable);
    return editable;
  }

  /**
   * Update a specific field in an editable component
   * 
   * @param componentId - The component ID
   * @param fieldPath - The field path (e.g., 'props.title')
   * @param newValue - The new value
   * @param reason - Optional reason for the change
   * @returns Result of the update operation
   */
  updateField(
    componentId: string,
    fieldPath: string,
    newValue: unknown,
    reason?: string
  ): FieldUpdateResult {
    const editable = this.editableComponents.get(componentId);
    
    if (!editable) {
      return { success: false, error: `Component ${componentId} not found or not editable` };
    }

    // Get the current value
    const oldValue = this.getFieldValue(editable, fieldPath);
    
    // Validate the new value
    const field = this.getFieldByPath(editable, fieldPath);
    if (field) {
      const validation = this.validateField(newValue, field);
      if (!validation.valid) {
        return { success: false, error: validation.errors.join(', ') };
      }
    }

    // Update the value
    this.setFieldValue(editable, fieldPath, newValue);
    
    // Create edit history entry
    const historyEntry: EditHistoryEntry = {
      id: this.generateId(),
      componentId,
      fieldPath,
      oldValue,
      newValue,
      reason,
      timestamp: Date.now(),
    };

    // Add to history (truncate any redo history)
    editable.editHistory = editable.editHistory.slice(0, editable.historyPosition + 1);
    editable.editHistory.push(historyEntry);
    editable.historyPosition = editable.editHistory.length - 1;
    
    // Update metadata
    editable.version++;
    editable.lastModified = Date.now();
    editable.isDirty = true;

    // Notify change listeners
    this.notifyChangeListeners(componentId, fieldPath, oldValue, newValue);

    return { success: true, component: editable };
  }

  /**
   * Get an editable component by ID
   * 
   * @param componentId - The component ID
   * @returns The editable component or undefined
   */
  getEditableComponent(componentId: string): EditableComponent | undefined {
    return this.editableComponents.get(componentId);
  }

  /**
   * Undo the last edit for a component
   * 
   * @param componentId - The component ID
   * @returns Result of the undo operation
   */
  undo(componentId: string): FieldUpdateResult {
    const editable = this.editableComponents.get(componentId);
    
    if (!editable) {
      return { success: false, error: `Component ${componentId} not found or not editable` };
    }

    if (editable.historyPosition < 0) {
      return { success: false, error: 'Nothing to undo' };
    }

    const entry = editable.editHistory[editable.historyPosition];
    
    // Revert to old value
    const result = this.updateField(componentId, entry.fieldPath, entry.oldValue, `Undo: ${entry.reason || 'Previous edit'}`);
    
    if (result.success) {
      // Move history position back
      editable.historyPosition--;
      editable.isDirty = true;
    }

    return result;
  }

  /**
   * Redo the last undone edit for a component
   * 
   * @param componentId - The component ID
   * @returns Result of the redo operation
   */
  redo(componentId: string): FieldUpdateResult {
    const editable = this.editableComponents.get(componentId);
    
    if (!editable) {
      return { success: false, error: `Component ${componentId} not found or not editable` };
    }

    if (editable.historyPosition >= editable.editHistory.length - 1) {
      return { success: false, error: 'Nothing to redo' };
    }

    const entry = editable.editHistory[editable.historyPosition + 1];
    
    // Revert to new value
    const result = this.updateField(componentId, entry.fieldPath, entry.newValue, `Redo: ${entry.reason || 'Previous edit'}`);
    
    if (result.success) {
      // Move history position forward
      editable.historyPosition++;
      editable.isDirty = true;
    }

    return result;
  }

  /**
   * Get the edit history for a component
   * 
   * @param componentId - The component ID
   * @returns Array of edit history entries
   */
  getEditHistory(componentId: string): EditHistoryEntry[] {
    const editable = this.editableComponents.get(componentId);
    return editable?.editHistory ?? [];
  }

  /**
   * Check if undo is available for a component
   * 
   * @param componentId - The component ID
   * @returns True if undo is available
   */
  canUndo(componentId: string): boolean {
    const editable = this.editableComponents.get(componentId);
    return editable !== undefined && editable.historyPosition >= 0;
  }

  /**
   * Check if redo is available for a component
   * 
   * @param componentId - The component ID
   * @returns True if redo is available
   */
  canRedo(componentId: string): boolean {
    const editable = this.editableComponents.get(componentId);
    return editable !== undefined && editable.historyPosition < editable.editHistory.length - 1;
  }

  /**
   * Mark a component as saved (clears dirty flag)
   * 
   * @param componentId - The component ID
   */
  markAsSaved(componentId: string): void {
    const editable = this.editableComponents.get(componentId);
    if (editable) {
      editable.isDirty = false;
    }
  }

  /**
   * Get all editable components
   * 
   * @returns Array of all editable components
   */
  getAllEditableComponents(): EditableComponent[] {
    return Array.from(this.editableComponents.values());
  }

  /**
   * Get all dirty (unsaved) components
   * 
   * @returns Array of dirty editable components
   */
  getDirtyComponents(): EditableComponent[] {
    return this.getAllEditableComponents().filter(c => c.isDirty);
  }

  /**
   * Add a change listener
   * 
   * @param listener - The listener callback
   * @returns Function to remove the listener
   */
  addChangeListener(listener: ChangeListener): () => void {
    this.changeListeners.add(listener);
    return () => this.changeListeners.delete(listener);
  }

  /**
   * Remove a component from editable management
   * 
   * @param componentId - The component ID
   */
  removeEditableComponent(componentId: string): void {
    this.editableComponents.delete(componentId);
  }

  /**
   * Clear all editable components
   */
  clear(): void {
    this.editableComponents.clear();
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Extract editable fields from a component
   * 
   * @param component - The component to extract fields from
   * @returns Record of editable fields
   */
  private extractEditableFields(component: UIComponent): Record<string, EditableField> {
    const fields: Record<string, EditableField> = {};

    // Extract props as editable fields
    if (component.props) {
      for (const [key, value] of Object.entries(component.props)) {
        fields[`props.${key}`] = {
          name: `props.${key}`,
          type: this.getValueType(value),
          value,
          label: this.formatLabel(key),
        };
      }
    }

    // Extract state as editable fields
    if (component.state) {
      for (const [key, value] of Object.entries(component.state)) {
        fields[`state.${key}`] = {
          name: `state.${key}`,
          type: this.getValueType(value),
          value,
          label: this.formatLabel(key),
        };
      }
    }

    return fields;
  }

  /**
   * Get the type of a value
   * 
   * @param value - The value to check
   * @returns The type string
   */
  private getValueType(value: unknown): EditableField['type'] {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return typeof value as EditableField['type'];
  }

  /**
   * Format a label from a field name
   * 
   * @param name - The field name
   * @returns A formatted label
   */
  private formatLabel(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Get a field by its path
   * 
   * @param editable - The editable component
   * @param fieldPath - The field path
   * @returns The field or undefined
   */
  private getFieldByPath(editable: EditableComponent, fieldPath: string): EditableField | undefined {
    return editable.editableFields[fieldPath];
  }

  /**
   * Get a field value by its path
   * 
   * @param editable - The editable component
   * @param fieldPath - The field path
   * @returns The field value
   */
  private getFieldValue(editable: EditableComponent, fieldPath: string): unknown {
    const parts = fieldPath.split('.');
    let current: any = editable.fullSpec;
    
    for (const part of parts) {
      if (current === undefined || current === null) {
        return undefined;
      }
      current = current[part];
    }
    
    return current;
  }

  /**
   * Set a field value by its path
   * 
   * @param editable - The editable component
   * @param fieldPath - The field path
   * @param value - The value to set
   */
  private setFieldValue(editable: EditableComponent, fieldPath: string, value: unknown): void {
    const parts = fieldPath.split('.');
    const lastPart = parts.pop()!;
    let current: any = editable.fullSpec;
    
    // Navigate to the parent object
    for (const part of parts) {
      if (current[part] === undefined) {
        current[part] = {};
      }
      current = current[part];
    }
    
    // Set the value
    current[lastPart] = value;
    
    // Update the editable field
    const field = editable.editableFields[fieldPath];
    if (field) {
      field.value = value;
      field.type = this.getValueType(value);
    }
  }

  /**
   * Validate a field value
   * 
   * @param value - The value to validate
   * @param field - The field definition
   * @returns Validation result
   */
  private validateField(value: unknown, field: EditableField): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required
    if (field.required && (value === null || value === undefined || value === '')) {
      errors.push(field.label ? `${field.label} is required` : 'This field is required');
    }

    // Check type
    if (value !== null && value !== undefined) {
      const expectedType = field.type;
      const actualType = this.getValueType(value);
      
      if (expectedType !== actualType && expectedType !== 'null') {
        errors.push(`Expected type ${expectedType}, got ${actualType}`);
      }
    }

    // Check validation rules
    if (field.validation) {
      const rule = field.validation;
      
      switch (rule.type) {
        case 'min':
          if (typeof value === 'number' && value < (rule.value as number)) {
            errors.push(rule.message || `Minimum value is ${rule.value}`);
          }
          if (typeof value === 'string' && value.length < (rule.value as number)) {
            errors.push(rule.message || `Minimum length is ${rule.value}`);
          }
          break;
        case 'max':
          if (typeof value === 'number' && value > (rule.value as number)) {
            errors.push(rule.message || `Maximum value is ${rule.value}`);
          }
          if (typeof value === 'string' && value.length > (rule.value as number)) {
            errors.push(rule.message || `Maximum length is ${rule.value}`);
          }
          break;
        case 'pattern':
          if (typeof value === 'string' && !new RegExp(rule.value as string).test(value)) {
            errors.push(rule.message || 'Invalid format');
          }
          break;
        case 'custom':
          if (rule.validator) {
            const result = rule.validator(value);
            if (result !== true) {
              errors.push(typeof result === 'string' ? result : (rule.message || 'Validation failed'));
            }
          }
          break;
        case 'range':
          if (typeof value === 'number') {
            const [min, max] = rule.value as [number, number];
            if (value < min || value > max) {
              errors.push(rule.message || `Value must be between ${min} and ${max}`);
            }
          }
          break;
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Notify all change listeners
   * 
   * @param componentId - The component ID
   * @param fieldPath - The field path
   * @param oldValue - The old value
   * @param newValue - The new value
   */
  private notifyChangeListeners(
    componentId: string,
    fieldPath: string,
    oldValue: unknown,
    newValue: unknown
  ): void {
    for (const listener of this.changeListeners) {
      try {
        listener(componentId, fieldPath, oldValue, newValue);
      } catch (error) {
        console.error('Error in change listener:', error);
      }
    }
  }

  /**
   * Generate a unique ID
   * 
   * @returns A unique ID string
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
