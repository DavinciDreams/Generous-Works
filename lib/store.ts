import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { A2UIMessage } from '@/lib/a2ui/types';

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
 * Store state interface
 */
export interface StoreState {
  // Message state
  messages: Message[];

  // Saved chat history
  savedChats: SavedChatSummary[];

  // UI Components state
  uiComponents: Record<string, UIComponent>; // Map of component ID to component

  // Loading state
  isLoading: boolean;

  // Error state
  error: string | null;
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
  isLoading: false,
  error: null,
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
      clearMessages: () => set({ messages: [] }),

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
      clearUIComponents: () => set({ uiComponents: {} }),

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
      reset: () => set(initialState),

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

// ============================================================================
// Type Exports
// ============================================================================

// GenerativeUIStore is already exported as an interface above
