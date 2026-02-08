import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  uiComponents: {},
  isLoading: false,
  error: null,
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
    }),
    {
      name: 'generative-ui-storage', // Storage key for localStorage
      partialize: (state) => ({
        // Only persist messages and UI components, not loading/error states
        messages: state.messages,
        uiComponents: state.uiComponents,
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
};

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
