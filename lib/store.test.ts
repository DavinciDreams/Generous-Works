import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useGenerativeUIStore,
  useArtifactStore,
  useMessages,
  useUIComponents,
  useAppState,
  type Message,
  type UIComponent,
} from './store';

const initialState = {
  messages: [] as Message[],
  savedChats: [],
  uiComponents: {} as Record<string, UIComponent>,
  isLoading: false,
  error: null as string | null,
};

beforeEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
  act(() => {
    useGenerativeUIStore.setState(initialState);
    useArtifactStore.setState({ artifacts: [] });
  });
  localStorage.clear();
});

describe('initial state', () => {
  it('has empty messages array', () => {
    const { result } = renderHook(() => useGenerativeUIStore((s) => s.messages));
    expect(result.current).toEqual([]);
  });

  it('has empty uiComponents map', () => {
    const { result } = renderHook(() => useGenerativeUIStore((s) => s.uiComponents));
    expect(result.current).toEqual({});
  });

  it('is not loading', () => {
    const { result } = renderHook(() => useGenerativeUIStore((s) => s.isLoading));
    expect(result.current).toBe(false);
  });

  it('has no error', () => {
    const { result } = renderHook(() => useGenerativeUIStore((s) => s.error));
    expect(result.current).toBeNull();
  });
});

describe('addMessage', () => {
  it('adds a message to the messages array', () => {
    const { result } = renderHook(() => useGenerativeUIStore());
    const msg: Message = { id: 'msg-1', role: 'user', content: 'Hello' };

    act(() => { result.current.addMessage(msg); });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toEqual(msg);
  });

  it('appends messages in order', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addMessage({ id: 'msg-1', role: 'user', content: 'First' });
      result.current.addMessage({ id: 'msg-2', role: 'assistant', content: 'Second' });
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[1].id).toBe('msg-2');
  });
});

describe('updateMessage', () => {
  it("updates the target message's content", () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addMessage({ id: 'msg-1', role: 'user', content: 'Original' });
      result.current.addMessage({ id: 'msg-2', role: 'assistant', content: 'Old response' });
    });

    act(() => { result.current.updateMessage('msg-2', { content: 'Updated response' }); });

    const last = result.current.messages[result.current.messages.length - 1];
    expect(last.content).toBe('Updated response');
    expect(last.id).toBe('msg-2');
  });

  it('does not affect other messages', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addMessage({ id: 'msg-1', role: 'user', content: 'First' });
      result.current.addMessage({ id: 'msg-2', role: 'assistant', content: 'Second' });
    });
    act(() => { result.current.updateMessage('msg-2', { content: 'Updated' }); });

    expect(result.current.messages[0].content).toBe('First');
  });
});

describe('clearMessages', () => {
  it('empties the messages array', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => { result.current.addMessage({ id: 'msg-1', role: 'user', content: 'Hello' }); });
    act(() => { result.current.clearMessages(); });

    expect(result.current.messages).toEqual([]);
  });
});

describe('chat persistence', () => {
  it('stores only lightweight chat summaries from the history endpoint', async () => {
    const summaries = [{
      id: 'chat-1',
      title: 'Earlier chat',
      createdAt: '2026-09-23T00:00:00.000Z',
      messageCount: 12,
    }];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => summaries,
    }));

    await act(async () => {
      await useGenerativeUIStore.getState().fetchChats();
    });

    expect(useGenerativeUIStore.getState().savedChats).toEqual(summaries);
    expect(useGenerativeUIStore.getState().savedChats[0]).not.toHaveProperty('messages');
  });

  it('loads a full chat only when the user opens it', async () => {
    const messages: Message[] = [
      { id: 'msg-1', role: 'user', content: 'Open me' },
      { id: 'msg-2', role: 'assistant', content: 'Loaded' },
    ];
    useGenerativeUIStore.setState({
      savedChats: [{ id: 'chat-1', title: 'Earlier chat', createdAt: 1, messageCount: 2 }],
    });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'chat-1',
        title: 'Earlier chat',
        createdAt: 1,
        messageCount: 2,
        messages,
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await act(async () => {
      await useGenerativeUIStore.getState().loadChat('chat-1');
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/chats/chat-1');
    expect(useGenerativeUIStore.getState().messages).toEqual(messages);
  });

  it('does not write streaming messages to localStorage', () => {
    useGenerativeUIStore.getState().addMessage({ id: 'msg-1', role: 'assistant', content: '' });
    useGenerativeUIStore.getState().updateMessage('msg-1', { content: 'streamed content' });

    expect(localStorage.getItem('generative-ui-storage')).toBeNull();
  });

  it('persists saved artifacts without reopening them on startup', () => {
    useArtifactStore.getState().saveArtifact({
      name: 'Chart',
      type: 'jsx',
      content: '<Card />',
      color: '#3b82f6',
      emoji: '📊',
    });

    const persisted = JSON.parse(localStorage.getItem('generative-ui-storage') ?? '{}');
    expect(persisted.state).toEqual({
      artifacts: [expect.objectContaining({ name: 'Chart', isOpen: false })],
    });
    expect(persisted.state).not.toHaveProperty('messages');
    expect(persisted.state).not.toHaveProperty('savedChats');
    expect(useArtifactStore.getState().artifacts[0].isOpen).toBe(true);
  });

  it('migrates the legacy localStorage blob down to closed artifacts only', async () => {
    localStorage.setItem('generative-ui-storage', JSON.stringify({
      version: 0,
      state: {
        messages: [{ id: 'old-message', role: 'user', content: 'large history' }],
        savedChats: [{ id: 'old-chat', title: 'Old', messages: [] }],
        uiComponents: { old: { id: 'old', type: 'Card', props: {} } },
        artifacts: [{
          id: 'artifact-1',
          name: 'Saved card',
          type: 'jsx',
          content: '<Card />',
          createdAt: 1,
          isOpen: true,
          windowX: 80,
          windowY: 64,
          color: '#3b82f6',
          emoji: '📌',
        }],
      },
    }));

    await act(async () => {
      await useArtifactStore.persist.rehydrate();
    });

    const persisted = JSON.parse(localStorage.getItem('generative-ui-storage') ?? '{}');
    expect(persisted.version).toBe(2);
    expect(persisted.state).toEqual({
      artifacts: [expect.objectContaining({ id: 'artifact-1', isOpen: false })],
    });
    expect(useArtifactStore.getState().artifacts[0].isOpen).toBe(false);
  });
});

describe('addUIComponent', () => {
  it('adds a component to the uiComponents map', () => {
    const { result } = renderHook(() => useGenerativeUIStore());
    const component: UIComponent = { id: 'comp-1', type: 'Button', props: { label: 'Click me' } };

    act(() => { result.current.addUIComponent(component); });

    expect(result.current.uiComponents['comp-1']).toEqual(component);
  });

  it('stores multiple components independently', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addUIComponent({ id: 'a', type: 'Button', props: {} });
      result.current.addUIComponent({ id: 'b', type: 'Card', props: {} });
    });

    expect(Object.keys(result.current.uiComponents)).toHaveLength(2);
  });
});

describe('updateUIComponent', () => {
  it('merges updates into an existing component', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addUIComponent({ id: 'comp-1', type: 'Button', props: { label: 'Old' } });
    });
    act(() => {
      result.current.updateUIComponent('comp-1', { props: { label: 'New', disabled: true } });
    });

    expect(result.current.uiComponents['comp-1'].props).toEqual({ label: 'New', disabled: true });
  });

  it('preserves fields not included in the update', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addUIComponent({ id: 'comp-1', type: 'Button', props: { label: 'Keep' } });
    });
    act(() => { result.current.updateUIComponent('comp-1', { state: { active: true } }); });

    expect(result.current.uiComponents['comp-1'].type).toBe('Button');
    expect(result.current.uiComponents['comp-1'].props).toEqual({ label: 'Keep' });
  });
});

describe('removeUIComponent', () => {
  it('removes a component by id', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addUIComponent({ id: 'comp-1', type: 'Button', props: {} });
      result.current.addUIComponent({ id: 'comp-2', type: 'Card', props: {} });
    });
    act(() => { result.current.removeUIComponent('comp-1'); });

    expect(result.current.uiComponents['comp-1']).toBeUndefined();
    expect(result.current.uiComponents['comp-2']).toBeDefined();
  });
});

describe('clearUIComponents', () => {
  it('empties the uiComponents map', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => { result.current.addUIComponent({ id: 'comp-1', type: 'Button', props: {} }); });
    act(() => { result.current.clearUIComponents(); });

    expect(result.current.uiComponents).toEqual({});
  });
});

describe('setLoading', () => {
  it('sets isLoading to true', () => {
    const { result } = renderHook(() => useGenerativeUIStore());
    act(() => { result.current.setLoading(true); });
    expect(result.current.isLoading).toBe(true);
  });

  it('sets isLoading back to false', () => {
    const { result } = renderHook(() => useGenerativeUIStore());
    act(() => { result.current.setLoading(true); });
    act(() => { result.current.setLoading(false); });
    expect(result.current.isLoading).toBe(false);
  });
});

describe('setError', () => {
  it('sets an error string', () => {
    const { result } = renderHook(() => useGenerativeUIStore());
    act(() => { result.current.setError('oops'); });
    expect(result.current.error).toBe('oops');
  });

  it('clears the error when set to null', () => {
    const { result } = renderHook(() => useGenerativeUIStore());
    act(() => { result.current.setError('oops'); });
    act(() => { result.current.setError(null); });
    expect(result.current.error).toBeNull();
  });
});

describe('useMessages hook', () => {
  it('exposes messages and actions', () => {
    const { result } = renderHook(() => useMessages());
    expect(Array.isArray(result.current.messages)).toBe(true);
    expect(typeof result.current.addMessage).toBe('function');
    expect(typeof result.current.clearMessages).toBe('function');
  });
});

describe('useUIComponents hook', () => {
  it('exposes uiComponents and actions', () => {
    const { result } = renderHook(() => useUIComponents());
    expect(typeof result.current.uiComponents).toBe('object');
    expect(typeof result.current.addUIComponent).toBe('function');
    expect(typeof result.current.getUIComponentsByType).toBe('function');
  });

  it('getUIComponentsByType filters by type', () => {
    act(() => {
      useGenerativeUIStore.getState().addUIComponent({ id: 'b1', type: 'Button', props: {} });
      useGenerativeUIStore.getState().addUIComponent({ id: 'c1', type: 'Card', props: {} });
      useGenerativeUIStore.getState().addUIComponent({ id: 'b2', type: 'Button', props: {} });
    });

    const { result } = renderHook(() => useUIComponents());
    const buttons = result.current.getUIComponentsByType('Button');
    expect(buttons).toHaveLength(2);
    expect(buttons.every((c) => c.type === 'Button')).toBe(true);
  });
});

describe('useAppState hook', () => {
  it('exposes isLoading, error, and setters', () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.setLoading).toBe('function');
    expect(typeof result.current.setError).toBe('function');
  });
});
