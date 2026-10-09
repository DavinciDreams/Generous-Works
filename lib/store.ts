import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { A2UIMessage } from '@/lib/a2ui/types';
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
  /** Raw assistant transport retained for future model context, not direct display. */
  modelContent?: string;
  jsx?: string; // Optional JSX content for UI components
  a2ui?: A2UIMessage[]; // Reconciled structured surfaces from a JSONL stream
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
 * A saved chat session
 */
export interface SavedChatSummary {
  id: string;
  title: string;
  createdAt: number | string;
  messageCount: number;
}

export interface SavedChat extends SavedChatSummary {
  messages: Message[];
}

/**
 * A saved UI artifact (component generated in chat, pinned to the canvas)
 */
export interface Artifact {
  id: string;
  name: string;
  type: 'jsx' | 'a2ui';
  content: string;   // JSX code string or serialized JSON string
  spec?: unknown;    // parsed A2UI spec (for a2ui type)
  createdAt: number;
  isOpen: boolean;
  windowX: number;
  windowY: number;
  color: string;     // hex accent color for icon
  emoji: string;     // display emoji
}

/**
 * Component layout state for draggable/resizable components
 */
export interface ComponentLayoutState {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isLocked: boolean;
  zIndex?: number;
  maintainAspectRatio?: boolean;
}

/**
 * Store state interface
 */
export interface StoreState {
  // Message state
  messages: Message[];

  // Saved chat history
  savedChats: SavedChatSummary[];

  // UI Components state
  uiComponents: Record<string, UIComponent>; // Map of component ID to component
  
  // Component registry state
  componentRegistry: ComponentRegistry; // Component registry instance
  compactedComponents: Record<string, CompactComponent>; // Compacted components for storage
  
  // Component layout state
  componentLayouts: Record<string, ComponentLayoutState>; // Map of component ID to layout state
  
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
  
  // Saved chat actions
  fetchChats: () => Promise<void>;
  saveCurrentChat: () => Promise<void>;
  loadChat: (id: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;

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
  
  // Component layout actions
  getComponentLayout: (id: string) => ComponentLayoutState | undefined;
  setComponentLayout: (id: string, layout: ComponentLayoutState) => void;
  updateComponentLayout: (id: string, updates: Partial<ComponentLayoutState>) => void;
  removeComponentLayout: (id: string) => void;
  clearComponentLayouts: () => void;
  getAllComponentLayouts: () => Record<string, ComponentLayoutState>;
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
  savedChats: [],
  uiComponents: {},
  componentRegistry: new ComponentRegistry(),
  compactedComponents: {},
  componentLayouts: {},
  isLoading: false,
  error: null,
  editableComponentManager: new EditableComponentManager(),
  llmResponseCache: new LLMResponseCache(),
  componentGenerationCache: new ComponentGenerationCache(),
};

/**
 * Create the transient application store. Messages and chat history are kept
 * out of synchronous localStorage so streaming updates stay cheap.
 */
export const useGenerativeUIStore = create<GenerativeUIStore>((set, get) => ({
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
       * Fetch saved chats from Postgres and sync into local state.
       */
      fetchChats: async () => {
        try {
          const res = await fetch('/api/chats');
          if (!res.ok) return;
          const rows: SavedChatSummary[] = await res.json();
          set({ savedChats: rows });
        } catch {
          // silently ignore — user may be offline or unauthenticated
        }
      },

      /**
       * Save the current messages as a named chat entry, persist to Postgres, then reset.
       */
      saveCurrentChat: async () => {
        const { messages } = get();
        if (messages.length === 0) return;
        const firstUser = messages.find((m) => m.role === 'user');
        const title = firstUser
          ? firstUser.content.slice(0, 60) + (firstUser.content.length > 60 ? '…' : '')
          : 'Chat';
        const saved: SavedChat = {
          id: crypto.randomUUID(),
          title,
          messages,
          createdAt: Date.now(),
          messageCount: messages.length,
        };
        set((state) => ({
          ...initialState,
          savedChats: [{
            id: saved.id,
            title: saved.title,
            createdAt: saved.createdAt,
            messageCount: saved.messageCount,
          }, ...state.savedChats],
        }));
        try {
          await fetch('/api/chats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saved),
          });
        } catch {
          // already in local state; Postgres sync failed silently
        }
      },

      /**
       * Load a previously saved chat into the current session.
       * The current session (if non-empty) is saved first.
       */
      loadChat: async (id) => {
        const { savedChats, messages } = get();
        const summary = savedChats.find((c) => c.id === id);
        if (!summary) return;

        let chat: SavedChat;
        try {
          const response = await fetch(`/api/chats/${id}`);
          if (!response.ok) throw new Error('Failed to load chat');
          chat = await response.json() as SavedChat;
        } catch {
          set({ error: 'Unable to load that chat. Please try again.' });
          return;
        }

        let updatedChats = savedChats.filter((c) => c.id !== id);
        if (messages.length > 0) {
          const firstUser = messages.find((m) => m.role === 'user');
          const title = firstUser
            ? firstUser.content.slice(0, 60) + (firstUser.content.length > 60 ? '…' : '')
            : 'Chat';
          const current: SavedChat = {
            id: crypto.randomUUID(),
            title,
            messages,
            createdAt: Date.now(),
            messageCount: messages.length,
          };
          updatedChats = [{
            id: current.id,
            title: current.title,
            createdAt: current.createdAt,
            messageCount: current.messageCount,
          }, ...updatedChats];
          fetch('/api/chats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(current),
          }).catch(() => {});
        }
        set({ messages: chat.messages, savedChats: updatedChats, isLoading: false, error: null, uiComponents: {} });
      },

      /**
       * Delete a saved chat from Postgres and local state.
       */
      deleteChat: async (id) => {
        set((state) => ({ savedChats: state.savedChats.filter((c) => c.id !== id) }));
        try {
          await fetch(`/api/chats/${id}`, { method: 'DELETE' });
        } catch {
          // already removed from local state
        }
      },

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

    // =====================
    // Component Layout Actions
    // =====================

    /**
     * Get component layout state
     */
    getComponentLayout: (id) => {
      const state = get();
      return state.componentLayouts[id];
    },

    /**
     * Set component layout state
     */
    setComponentLayout: (id, layout) => {
      set((state) => ({
        componentLayouts: {
          ...state.componentLayouts,
          [id]: layout,
        },
      }));
    },

    /**
     * Update component layout state
     */
    updateComponentLayout: (id, updates) => {
      set((state) => {
        const existingLayout = state.componentLayouts[id];
        const newLayout: ComponentLayoutState = existingLayout
          ? { ...existingLayout, ...updates }
          : {
              id,
              position: updates.position ?? { x: 0, y: 0 },
              size: updates.size ?? { width: 400, height: 300 },
              isLocked: updates.isLocked ?? false,
              zIndex: updates.zIndex ?? 10,
              maintainAspectRatio: updates.maintainAspectRatio ?? false,
            };
        return {
          componentLayouts: {
            ...state.componentLayouts,
            [id]: newLayout,
          },
        };
      });
    },

    /**
     * Remove component layout state
     */
    removeComponentLayout: (id) => {
      set((state) => {
        const newLayouts = { ...state.componentLayouts };
        delete newLayouts[id];
        return { componentLayouts: newLayouts };
      });
    },

    /**
     * Clear all component layout states
     */
    clearComponentLayouts: () => {
      set({ componentLayouts: {} });
    },

    /**
     * Get all component layout states
     */
    getAllComponentLayouts: () => {
      const state = get();
      return state.componentLayouts;
    },
}));

interface ArtifactStore {
  artifacts: Artifact[];
  saveArtifact: (data: Omit<Artifact, 'id' | 'createdAt' | 'isOpen' | 'windowX' | 'windowY'>) => void;
  openArtifact: (id: string) => void;
  closeArtifact: (id: string) => void;
  updateArtifact: (id: string, updates: Partial<Artifact>) => void;
  deleteArtifact: (id: string) => void;
}

/**
 * Persist only user-saved artifacts. Reusing the legacy key lets the versioned
 * migration discard previously persisted chats, messages, and UI components.
 * Open windows are deliberately serialized as closed to avoid mounting every
 * saved artifact during startup.
 */
export const useArtifactStore = create<ArtifactStore>()(
  persist(
    (set, get) => ({
      artifacts: [],
      saveArtifact: (data) => {
        const idx = get().artifacts.length;
        const artifact: Artifact = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          isOpen: true,
          windowX: 80 + (idx % 6) * 36,
          windowY: 64 + (idx % 6) * 36,
        };
        set((state) => ({ artifacts: [...state.artifacts, artifact] }));
      },
      openArtifact: (id) =>
        set((state) => ({
          artifacts: state.artifacts.map((artifact) =>
            artifact.id === id ? { ...artifact, isOpen: true } : artifact
          ),
        })),
      closeArtifact: (id) =>
        set((state) => ({
          artifacts: state.artifacts.map((artifact) =>
            artifact.id === id ? { ...artifact, isOpen: false } : artifact
          ),
        })),
      updateArtifact: (id, updates) =>
        set((state) => ({
          artifacts: state.artifacts.map((artifact) =>
            artifact.id === id ? { ...artifact, ...updates } : artifact
          ),
        })),
      deleteArtifact: (id) =>
        set((state) => ({
          artifacts: state.artifacts.filter((artifact) => artifact.id !== id),
        })),
    }),
    {
      name: 'generative-ui-storage',
      version: 2,
      migrate: (persistedState) => {
        const legacy = persistedState as { artifacts?: Artifact[] } | undefined;
        return {
          artifacts: Array.isArray(legacy?.artifacts)
            ? legacy.artifacts.map((artifact) => ({ ...artifact, isOpen: false }))
            : [],
        };
      },
      partialize: (state) => ({
        artifacts: state.artifacts.map((artifact) => ({ ...artifact, isOpen: false })),
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

/**
 * Hook to access component layout state and actions
 */
export const useComponentLayouts = () => {
  const componentLayouts = useGenerativeUIStore((state) => state.componentLayouts);
  const getComponentLayout = useGenerativeUIStore((state) => state.getComponentLayout);
  const setComponentLayout = useGenerativeUIStore((state) => state.setComponentLayout);
  const updateComponentLayout = useGenerativeUIStore((state) => state.updateComponentLayout);
  const removeComponentLayout = useGenerativeUIStore((state) => state.removeComponentLayout);
  const clearComponentLayouts = useGenerativeUIStore((state) => state.clearComponentLayouts);
  const getAllComponentLayouts = useGenerativeUIStore((state) => state.getAllComponentLayouts);

  return {
    componentLayouts,
    getComponentLayout,
    setComponentLayout,
    updateComponentLayout,
    removeComponentLayout,
    clearComponentLayouts,
    getAllComponentLayouts,
  };
};

// ============================================================================
// Type Exports
// ============================================================================

// GenerativeUIStore is already exported as an interface above
