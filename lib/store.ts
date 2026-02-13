import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ComponentRegistry } from './components/component-registry';
import type { CompactComponent } from './components/types';
import { LLMResponseCache } from './caching/llm-response-cache';
import { ComponentGenerationCache } from './caching/component-generation-cache';
import { EditableComponentManager } from './editing/editable-component-manager';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Generic type for component props and state
 */
type ComponentData = Record<string, unknown>;

/**
 * Message type representing a single message in the conversation
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  jsx?: string; // Optional JSX content for UI components
  timestamp?: number;
  uiComponents?: UIComponent[]; // Optional UI components associated with this message
}

/**
 * UI Component type representing a dynamically generated UI component
 */
export interface UIComponent {
  id: string;
  type: string; // Component type name (e.g., 'Button', 'Card', 'Panel')
  props: ComponentData; // Component props
  children?: UIComponent[]; // Nested child components
  parentId?: string; // Optional parent component reference
  state?: ComponentData; // Component state for interactive elements
}

/**
 * Store state interface
 */
export interface StoreState {
  // Message state
  messages: Message[];
  
  // UI Components state
  uiComponents: Record<string, UIComponent>; // Map of component ID to component
  
  // Component registry state
  componentRegistry: ComponentRegistry; // Component registry instance
  compactedComponents: Record<string, CompactComponent>; // Compacted components for storage
  
  // Loading state
  isLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Caching state
  editableComponentManager: EditableComponentManager; // Editable component manager instance
  llmResponseCache: LLMResponseCache; // LLM response cache instance
  componentGenerationCache: ComponentGenerationCache; // Component generation cache instance
}

/**
 * Store actions interface
 */
export interface StoreActions {
  // Message actions
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
  
  // UI Component actions
  addUIComponent: (component: UIComponent) => void;
  updateUIComponent: (id: string, updates: Partial<UIComponent>) => void;
  removeUIComponent: (id: string) => void;
  clearUIComponents: () => void;
  
  // Component registry actions
  registerComponent: (component: UIComponent) => void;
  getCompactComponent: (id: string) => CompactComponent | undefined;
  getFullComponent: (id: string) => UIComponent | undefined;
  compactAllComponents: () => void;
  
  // State actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Reset action
  reset: () => void;
  
  // Editable component actions
  makeComponentEditable: (id: string) => void;
  updateComponentField: (id: string, fieldPath: string, newValue: unknown, reason?: string) => { success: boolean; error?: string };
  undoComponentEdit: (id: string) => { success: boolean; error?: string };
  redoComponentEdit: (id: string) => { success: boolean; error?: string };
  getEditableComponent: (id: string) => import('./editing/editable-component-manager').EditableComponent | undefined;
  getEditHistory: (id: string) => import('./editing/editable-component-manager').EditHistoryEntry[];
  canUndoEdit: (id: string) => boolean;
  canRedoEdit: (id: string) => boolean;
  markComponentAsSaved: (id: string) => void;
  
  // LLM response cache actions
  getCachedLLMResponse: (messages: import('./caching/llm-response-cache').LLMMessage[], systemPrompt: string) => string | undefined;
  setCachedLLMResponse: (messages: import('./caching/llm-response-cache').LLMMessage[], systemPrompt: string, response: string) => void;
  invalidateLLMCacheBySystemPrompt: (systemPrompt: string) => void;
  invalidateLLMCacheByMessageContent: (content: string) => void;
  getLLMCacheStats: () => import('./caching/component-cache').CacheStats;
  getLLMCacheHitRate: () => number;
  
  // Component generation cache actions
  getCachedComponent: (type: string, props: Record<string, unknown>) => UIComponent | undefined;
  setCachedComponent: (type: string, props: Record<string, unknown>, component: UIComponent) => void;
  invalidateComponentCacheByType: (type: string) => void;
  invalidateComponentCacheByProp: (propName: string, propValue: unknown) => void;
  getComponentsByTypeFromCache: (type: string) => UIComponent[];
  getComponentCacheStats: () => import('./caching/component-cache').CacheStats;
  getComponentCacheHitRate: () => number;
}

/**
 * Complete store interface combining state and actions
 */
export interface GenerativeUIStore extends StoreState, StoreActions {
  // Selectors (computed values)
  getMessages: () => Message[];
  getUIComponents: () => UIComponent[];
  getIsLoading: () => boolean;
  getError: () => string | null;
  getMessageById: (id: string) => Message | undefined;
  getUIComponentById: (id: string) => UIComponent | undefined;
  getUIComponentsByType: (type: string) => UIComponent[];
  getRegistryStats: () => ReturnType<ComponentRegistry['getStats']>;
}

// ============================================================================
// Store Implementation
// ============================================================================

/**
 * Initial state values
 */
const initialState: StoreState = {
  messages: [],
  uiComponents: {},
  componentRegistry: new ComponentRegistry(),
  compactedComponents: {},
  isLoading: false,
  error: null,
  editableComponentManager: new EditableComponentManager(),
  llmResponseCache: new LLMResponseCache(),
  componentGenerationCache: new ComponentGenerationCache(),
};

/**
 * Create the Zustand store with persistence middleware
 */
export const useGenerativeUIStore = create<GenerativeUIStore>()(
  persist(
    (set, get) => ({
      // =====================
      // Initial State
      // =====================
      ...initialState,

      // =====================
      // Message Actions
      // =====================
      
      /**
       * Add a new message to the conversation
       */
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      /**
       * Update an existing message (useful for streaming responses)
       */
      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        })),

      /**
       * Replace all messages with a new array
       */
      setMessages: (messages) => set({ messages }),

      /**
       * Clear all messages from the conversation
       */
      clearMessages: () => {
        const state = get();
        // Clear LLM response cache
        state.llmResponseCache.clear();
        // Clear messages
        set({ messages: [] });
      },

      // =====================
      // UI Component Actions
      // =====================
      
      /**
       * Add a new UI component to the store
       */
      addUIComponent: (component) =>
        set((state) => ({
          uiComponents: {
            ...state.uiComponents,
            [component.id]: component,
          },
        })),

      /**
       * Update an existing UI component
       */
      updateUIComponent: (id, updates) =>
        set((state) => ({
          uiComponents: {
            ...state.uiComponents,
            [id]: {
              ...state.uiComponents[id],
              ...updates,
            },
          },
        })),

      /**
       * Remove a UI component from the store
       */
      removeUIComponent: (id) =>
        set((state) => {
          const newComponents = { ...state.uiComponents };
          delete newComponents[id];
          return { uiComponents: newComponents };
        }),

      /**
       * Clear all UI components from the store
       */
      clearUIComponents: () => {
        const state = get();
        // Clear component generation cache
        state.componentGenerationCache.clear();
        // Clear component registry
        state.componentRegistry.clear();
        // Clear compacted components
        set((currentState) => ({
          ...currentState,
          uiComponents: {},
          compactedComponents: {},
        }));
      },

      // =====================
      // Component Registry Actions
      // =====================
      
      /**
       * Register a component in the registry
       */
      registerComponent: (component) =>
        set((state) => {
          const entry = state.componentRegistry.registerComponent(component);
          const compactedComponents = { ...state.compactedComponents };
          compactedComponents[component.id] = entry.compactSpec;
          return { compactedComponents };
        }),

      /**
       * Get compact component representation
       */
      getCompactComponent: (id) => {
        const state = get();
        return state.componentRegistry.getCompactComponent(id);
      },

      /**
       * Get full component specification
       */
      getFullComponent: (id) => {
        const state = get();
        return state.componentRegistry.getFullComponent(id);
      },

      /**
       * Compact all components in the store
       */
      compactAllComponents: () =>
        set((state) => {
          const compactedComponents: Record<string, CompactComponent> = {};
          for (const [id, component] of Object.entries(state.uiComponents)) {
            const entry = state.componentRegistry.registerComponent(component);
            compactedComponents[id] = entry.compactSpec;
          }
          return { compactedComponents };
        }),

      // =====================
      // State Actions
      // =====================
      
      /**
       * Set the loading state
       */
      setLoading: (isLoading) => set({ isLoading }),

      /**
       * Set the error state
       */
      setError: (error) => set({ error }),

      // =====================
      // Reset Action
      // =====================
      
      /**
       * Reset the entire store to initial state
       */
      reset: () => {
        const state = get();
        // Clear all caches
        state.llmResponseCache.clear();
        state.componentGenerationCache.clear();
        // Clear component registry
        state.componentRegistry.clear();
        // Clear editable component manager
        state.editableComponentManager.clear();
        // Reset to initial state
        set(initialState);
      },

      // =====================
      // Selectors
      // =====================
      
      /**
       * Get all messages
       */
      getMessages: () => get().messages,

      /**
       * Get all UI components as an array
       */
      getUIComponents: () => Object.values(get().uiComponents),

      /**
       * Get the current loading state
       */
      getIsLoading: () => get().isLoading,

      /**
       * Get the current error state
       */
      getError: () => get().error,

      /**
       * Get a specific message by ID
       */
      getMessageById: (id) => get().messages.find((msg) => msg.id === id),

      /**
       * Get a specific UI component by ID
       */
      getUIComponentById: (id) => get().uiComponents[id],

      /**
       * Get all UI components of a specific type
       */
      getUIComponentsByType: (type) =>
        Object.values(get().uiComponents).filter((comp) => comp.type === type),

      /**
       * Get registry statistics
       */
      getRegistryStats: () => {
        const state = get();
        return state.componentRegistry.getStats();
      },

    // =====================
    // Editable Component Actions
    // =====================

    /**
     * Make a component editable
     */
    makeComponentEditable: (id) => {
      const state = get();
      const component = state.uiComponents[id];
      if (component) {
        state.editableComponentManager.makeEditable(component);
      }
    },

    /**
     * Update a component field
     */
    updateComponentField: (id, fieldPath, newValue, reason) => {
      const state = get();
      const result = state.editableComponentManager.updateField(id, fieldPath, newValue, reason);
      
      if (result.success && result.component) {
        // Update the component in the store with the new spec
        set((currentState) => ({
          uiComponents: {
            ...currentState.uiComponents,
            [id]: result.component.fullSpec,
          },
        }));
      }
      
      return result;
    },

    /**
     * Undo the last edit for a component
     */
    undoComponentEdit: (id) => {
      const state = get();
      const result = state.editableComponentManager.undo(id);
      
      if (result.success && result.component) {
        // Update the component in the store with the reverted spec
        set((currentState) => ({
          uiComponents: {
            ...currentState.uiComponents,
            [id]: result.component.fullSpec,
          },
        }));
      }
      
      return result;
    },

    /**
     * Redo the last undone edit for a component
     */
    redoComponentEdit: (id) => {
      const state = get();
      const result = state.editableComponentManager.redo(id);
      
      if (result.success && result.component) {
        // Update the component in the store with the redone spec
        set((currentState) => ({
          uiComponents: {
            ...currentState.uiComponents,
            [id]: result.component.fullSpec,
          },
        }));
      }
      
      return result;
    },

    /**
     * Get an editable component
     */
    getEditableComponent: (id) => {
      const state = get();
      return state.editableComponentManager.getEditableComponent(id);
    },

    /**
     * Get edit history for a component
     */
    getEditHistory: (id) => {
      const state = get();
      return state.editableComponentManager.getEditHistory(id);
    },

    /**
     * Check if undo is available
     */
    canUndoEdit: (id) => {
      const state = get();
      return state.editableComponentManager.canUndo(id);
    },

    /**
     * Check if redo is available
     */
    canRedoEdit: (id) => {
      const state = get();
      return state.editableComponentManager.canRedo(id);
    },

    /**
     * Mark a component as saved
     */
    markComponentAsSaved: (id) => {
      const state = get();
      state.editableComponentManager.markAsSaved(id);
    },

    // =====================
    // LLM Response Cache Actions
    // =====================

    /**
     * Get a cached LLM response
     */
    getCachedLLMResponse: (messages, systemPrompt) => {
      const state = get();
      return state.llmResponseCache.getResponse(messages, systemPrompt);
    },

    /**
     * Cache an LLM response
     */
    setCachedLLMResponse: (messages, systemPrompt, response) => {
      const state = get();
      state.llmResponseCache.setResponse(messages, systemPrompt, response);
    },

    /**
     * Invalidate LLM cache by system prompt
     */
    invalidateLLMCacheBySystemPrompt: (systemPrompt) => {
      const state = get();
      state.llmResponseCache.invalidateBySystemPrompt(systemPrompt);
    },

    /**
     * Invalidate LLM cache by message content
     */
    invalidateLLMCacheByMessageContent: (content) => {
      const state = get();
      state.llmResponseCache.invalidateByMessageContent(content);
    },

    /**
     * Get LLM cache statistics
     */
    getLLMCacheStats: () => {
      const state = get();
      return state.llmResponseCache.getStats();
    },

    /**
     * Get LLM cache hit rate
     */
    getLLMCacheHitRate: () => {
      const state = get();
      return state.llmResponseCache.getHitRate();
    },

    // =====================
    // Component Generation Cache Actions
    // =====================

    /**
     * Get a cached component
     */
    getCachedComponent: (type, props) => {
      const state = get();
      return state.componentGenerationCache.getGeneratedComponent(type, props);
    },

    /**
     * Cache a generated component
     */
    setCachedComponent: (type, props, component) => {
      const state = get();
      state.componentGenerationCache.setGeneratedComponent(type, props, component);
    },

    /**
     * Invalidate component cache by type
     */
    invalidateComponentCacheByType: (type) => {
      const state = get();
      state.componentGenerationCache.invalidateByType(type);
    },

    /**
     * Invalidate component cache by prop
     */
    invalidateComponentCacheByProp: (propName, propValue) => {
      const state = get();
      state.componentGenerationCache.invalidateByProp(propName, propValue);
    },

    /**
     * Get components by type from cache
     */
    getComponentsByTypeFromCache: (type) => {
      const state = get();
      return state.componentGenerationCache.getComponentsByType(type);
    },

    /**
     * Get component cache statistics
     */
    getComponentCacheStats: () => {
      const state = get();
      return state.componentGenerationCache.getStats();
    },

    /**
     * Get component cache hit rate
     */
    getComponentCacheHitRate: () => {
      const state = get();
      return state.componentGenerationCache.getHitRate();
    },
    }),
    {
      name: 'generative-ui-storage', // Storage key for localStorage
      partialize: (state) => ({
        // Only persist messages, UI components, and compacted components
        // Not loading/error states or the registry itself (which is recreated)
        messages: state.messages,
        uiComponents: state.uiComponents,
        compactedComponents: state.compactedComponents,
      }),
    }
  )
);

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook to access message-related state and actions
 */
export const useMessages = () => {
  const messages = useGenerativeUIStore((state) => state.messages);
  const addMessage = useGenerativeUIStore((state) => state.addMessage);
  const updateMessage = useGenerativeUIStore((state) => state.updateMessage);
  const setMessages = useGenerativeUIStore((state) => state.setMessages);
  const clearMessages = useGenerativeUIStore((state) => state.clearMessages);
  const getMessageById = useGenerativeUIStore((state) => state.getMessageById);

  return {
    messages,
    addMessage,
    updateMessage,
    setMessages,
    clearMessages,
    getMessageById,
  };
};

/**
 * Hook to access UI component-related state and actions
 */
export const useUIComponents = () => {
  const uiComponents = useGenerativeUIStore((state) => state.uiComponents);
  const addUIComponent = useGenerativeUIStore((state) => state.addUIComponent);
  const updateUIComponent = useGenerativeUIStore((state) => state.updateUIComponent);
  const removeUIComponent = useGenerativeUIStore((state) => state.removeUIComponent);
  const clearUIComponents = useGenerativeUIStore((state) => state.clearUIComponents);
  const getUIComponents = useGenerativeUIStore((state) => state.getUIComponents);
  const getUIComponentById = useGenerativeUIStore((state) => state.getUIComponentById);
  const getUIComponentsByType = useGenerativeUIStore((state) => state.getUIComponentsByType);

  return {
    uiComponents,
    uiComponentsArray: getUIComponents(),
    addUIComponent,
    updateUIComponent,
    removeUIComponent,
    clearUIComponents,
    getUIComponents,
    getUIComponentById,
    getUIComponentsByType,
  };
}
console.log('[DEBUG] lib/store.ts - useUIComponents hook created');

/**
 * Hook to access loading and error state
 */
export const useAppState = () => {
  const isLoading = useGenerativeUIStore((state) => state.isLoading);
  const error = useGenerativeUIStore((state) => state.error);
  const setLoading = useGenerativeUIStore((state) => state.setLoading);
  const setError = useGenerativeUIStore((state) => state.setError);

  return {
    isLoading,
    error,
    setLoading,
    setError,
  };
};

/**
 * Hook to access component registry state and actions
 */
export const useComponentRegistry = () => {
  const componentRegistry = useGenerativeUIStore((state) => state.componentRegistry);
  const compactedComponents = useGenerativeUIStore((state) => state.compactedComponents);
  const registerComponent = useGenerativeUIStore((state) => state.registerComponent);
  const getCompactComponent = useGenerativeUIStore((state) => state.getCompactComponent);
  const getFullComponent = useGenerativeUIStore((state) => state.getFullComponent);
  const compactAllComponents = useGenerativeUIStore((state) => state.compactAllComponents);
  const getRegistryStats = useGenerativeUIStore((state) => state.getRegistryStats);

  return {
    componentRegistry,
    compactedComponents,
    registerComponent,
    getCompactComponent,
    getFullComponent,
    compactAllComponents,
    getRegistryStats,
  };
};

/**
 * Hook to access editable component state and actions
 */
export const useEditableComponents = () => {
  const makeComponentEditable = useGenerativeUIStore((state) => state.makeComponentEditable);
  const updateComponentField = useGenerativeUIStore((state) => state.updateComponentField);
  const undoComponentEdit = useGenerativeUIStore((state) => state.undoComponentEdit);
  const redoComponentEdit = useGenerativeUIStore((state) => state.redoComponentEdit);
  const getEditableComponent = useGenerativeUIStore((state) => state.getEditableComponent);
  const getEditHistory = useGenerativeUIStore((state) => state.getEditHistory);
  const canUndoEdit = useGenerativeUIStore((state) => state.canUndoEdit);
  const canRedoEdit = useGenerativeUIStore((state) => state.canRedoEdit);
  const markComponentAsSaved = useGenerativeUIStore((state) => state.markComponentAsSaved);

  return {
    makeComponentEditable,
    updateComponentField,
    undoComponentEdit,
    redoComponentEdit,
    getEditableComponent,
    getEditHistory,
    canUndoEdit,
    canRedoEdit,
    markComponentAsSaved,
  };
};

/**
 * Hook to access caching state and actions
 */
export const useCaching = () => {
  // LLM response cache
  const getCachedLLMResponse = useGenerativeUIStore((state) => state.getCachedLLMResponse);
  const setCachedLLMResponse = useGenerativeUIStore((state) => state.setCachedLLMResponse);
  const invalidateLLMCacheBySystemPrompt = useGenerativeUIStore((state) => state.invalidateLLMCacheBySystemPrompt);
  const invalidateLLMCacheByMessageContent = useGenerativeUIStore((state) => state.invalidateLLMCacheByMessageContent);
  const getLLMCacheStats = useGenerativeUIStore((state) => state.getLLMCacheStats);
  const getLLMCacheHitRate = useGenerativeUIStore((state) => state.getLLMCacheHitRate);

  // Component generation cache
  const getCachedComponent = useGenerativeUIStore((state) => state.getCachedComponent);
  const setCachedComponent = useGenerativeUIStore((state) => state.setCachedComponent);
  const invalidateComponentCacheByType = useGenerativeUIStore((state) => state.invalidateComponentCacheByType);
  const invalidateComponentCacheByProp = useGenerativeUIStore((state) => state.invalidateComponentCacheByProp);
  const getComponentsByTypeFromCache = useGenerativeUIStore((state) => state.getComponentsByTypeFromCache);
  const getComponentCacheStats = useGenerativeUIStore((state) => state.getComponentCacheStats);
  const getComponentCacheHitRate = useGenerativeUIStore((state) => state.getComponentCacheHitRate);

  return {
    // LLM response cache
    getCachedLLMResponse,
    setCachedLLMResponse,
    invalidateLLMCacheBySystemPrompt,
    invalidateLLMCacheByMessageContent,
    getLLMCacheStats,
    getLLMCacheHitRate,
    // Component generation cache
    getCachedComponent,
    setCachedComponent,
    invalidateComponentCacheByType,
    invalidateComponentCacheByProp,
    getComponentsByTypeFromCache,
    getComponentCacheStats,
    getComponentCacheHitRate,
  };
};

// ============================================================================
// Type Exports
// ============================================================================

// GenerativeUIStore is already exported as an interface above
