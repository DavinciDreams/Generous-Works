"use client";

import { useCallback, useEffect, useRef } from "react";

// ============================================================================
// Type Definitions
// ============================================================================

export interface ComponentLayoutState {
  position: { x: number; y: number };
  size: { width: number; height: number };
  isLocked: boolean;
  zIndex?: number;
}

export interface ComponentStatePreservationOptions {
  /** Component ID for state identification */
  id: string;
  /** Storage key prefix (default: 'component-layout') */
  storageKey?: string;
  /** Whether to persist to localStorage (default: true) */
  persistToStorage?: boolean;
  /** Callback when state is loaded */
  onStateLoad?: (state: ComponentLayoutState) => void;
  /** Callback when state is saved */
  onStateSave?: (state: ComponentLayoutState) => void;
  /** Debounce delay in milliseconds (default: 300) */
  debounceDelay?: number;
}

export interface UseComponentStatePreservationReturn {
  /** Current layout state */
  state: ComponentLayoutState | null;
  /** Update layout state */
  updateState: (updates: Partial<ComponentLayoutState>) => void;
  /** Reset to initial state */
  resetState: () => void;
  /** Clear persisted state */
  clearPersistedState: () => void;
  /** Check if state is persisted */
  isPersisted: boolean;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * useComponentStatePreservation - Hook for preserving component layout state
 * 
 * Features:
 * - Persist component position, size, and lock status
 * - Save to localStorage
 * - Restore state on component mount
 * - Debounced updates to avoid excessive storage writes
 * - Optional callbacks for state changes
 */
export const useComponentStatePreservation = ({
  id,
  storageKey = "component-layout",
  persistToStorage = true,
  onStateLoad,
  onStateSave,
  debounceDelay = 300,
}: ComponentStatePreservationOptions): UseComponentStatePreservationReturn => {
  // Refs for state management
  const stateRef = useRef<ComponentLayoutState | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPersistedRef = useRef(false);

  // Get storage key for this component
  const getStorageKey = useCallback(() => {
    return `${storageKey}:${id}`;
  }, [storageKey, id]);

  // Load state from storage
  const loadState = useCallback((): ComponentLayoutState | null => {
    if (!persistToStorage) return null;

    try {
      const key = getStorageKey();
      const serialized = localStorage.getItem(key);
      if (serialized) {
        const parsed = JSON.parse(serialized) as ComponentLayoutState;
        stateRef.current = parsed;
        isPersistedRef.current = true;
        onStateLoad?.(parsed);
        return parsed;
      }
    } catch (error) {
      console.error(`[useComponentStatePreservation] Failed to load state for ${id}:`, error);
    }

    return null;
  }, [id, persistToStorage, getStorageKey, onStateLoad]);

  // Save state to storage (debounced)
  const saveState = useCallback(
    (state: ComponentLayoutState) => {
      if (!persistToStorage) return;

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        try {
          const key = getStorageKey();
          const serialized = JSON.stringify(state);
          localStorage.setItem(key, serialized);
          isPersistedRef.current = true;
          onStateSave?.(state);
        } catch (error) {
          console.error(`[useComponentStatePreservation] Failed to save state for ${id}:`, error);
        }
      }, debounceDelay);
    },
    [id, persistToStorage, getStorageKey, onStateSave, debounceDelay]
  );

  // Update layout state
  const updateState = useCallback(
    (updates: Partial<ComponentLayoutState>) => {
      const currentState = stateRef.current;
      const newState: ComponentLayoutState = currentState
        ? { ...currentState, ...updates }
        : {
            position: updates.position ?? { x: 0, y: 0 },
            size: updates.size ?? { width: 400, height: 300 },
            isLocked: updates.isLocked ?? false,
            zIndex: updates.zIndex ?? 10,
          };

      stateRef.current = newState;
      saveState(newState);
    },
    [saveState]
  );

  // Reset to initial state
  const resetState = useCallback(() => {
    const initialState: ComponentLayoutState = {
      position: { x: 0, y: 0 },
      size: { width: 400, height: 300 },
      isLocked: false,
      zIndex: 10,
    };

    stateRef.current = initialState;
    saveState(initialState);
  }, [saveState]);

  // Clear persisted state
  const clearPersistedState = useCallback(() => {
    try {
      const key = getStorageKey();
      localStorage.removeItem(key);
      stateRef.current = null;
      isPersistedRef.current = false;
    } catch (error) {
      console.error(`[useComponentStatePreservation] Failed to clear state for ${id}:`, error);
    }
  }, [id, getStorageKey]);

  // Load state on mount
  useEffect(() => {
    const loadedState = loadState();
    if (loadedState) {
      stateRef.current = loadedState;
    }

    // Cleanup debounce timer on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [loadState]);

  return {
    state: stateRef.current,
    updateState,
    resetState,
    clearPersistedState,
    isPersisted: isPersistedRef.current,
  };
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get all persisted component layout states
 */
export const getAllPersistedStates = (
  storageKey = "component-layout"
): Record<string, ComponentLayoutState> => {
  const states: Record<string, ComponentLayoutState> = {};

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${storageKey}:`)) {
        const serialized = localStorage.getItem(key);
        if (serialized) {
          const componentId = key.replace(`${storageKey}:`, "");
          states[componentId] = JSON.parse(serialized) as ComponentLayoutState;
        }
      }
    }
  } catch (error) {
    console.error("[useComponentStatePreservation] Failed to get all persisted states:", error);
  }

  return states;
};

/**
 * Clear all persisted component layout states
 */
export const clearAllPersistedStates = (storageKey = "component-layout"): void => {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${storageKey}:`)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("[useComponentStatePreservation] Failed to clear all persisted states:", error);
  }
};

/**
 * Export all persisted states as JSON
 */
export const exportPersistedStates = (
  storageKey = "component-layout"
): string => {
  const states = getAllPersistedStates(storageKey);
  return JSON.stringify(states, null, 2);
};

/**
 * Import persisted states from JSON
 */
export const importPersistedStates = (
  json: string,
  storageKey = "component-layout"
): void => {
  try {
    const states = JSON.parse(json) as Record<string, ComponentLayoutState>;

    Object.entries(states).forEach(([id, state]) => {
      const key = `${storageKey}:${id}`;
      localStorage.setItem(key, JSON.stringify(state));
    });
  } catch (error) {
    console.error("[useComponentStatePreservation] Failed to import persisted states:", error);
    throw new Error("Invalid JSON format");
  }
};

// ============================================================================
// Exports
// ============================================================================

export default useComponentStatePreservation;
