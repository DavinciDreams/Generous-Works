import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import { useComponentStatePreservation } from "./use-component-state-preservation";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

describe("useComponentStatePreservation", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.runAllTimers();
  });

  it("should initialize with null state when no persisted state exists", () => {
    const { result } = renderHook(() =>
      useComponentStatePreservation({ id: "test-component" })
    );

    expect(result.current.state).toBeNull();
    expect(result.current.isPersisted).toBe(false);
  });

  it("should load persisted state from localStorage", () => {
    const persistedState = {
      position: { x: 100, y: 200 },
      size: { width: 600, height: 400 },
      isLocked: true,
      zIndex: 15,
    };

    localStorageMock.setItem("component-layout:test-component", JSON.stringify(persistedState));

    const { result } = renderHook(() =>
      useComponentStatePreservation({ id: "test-component" })
    );

    expect(result.current.state).toEqual(persistedState);
    expect(result.current.isPersisted).toBe(true);
  });

  it("should call onStateLoad when loading persisted state", () => {
    const onStateLoad = vi.fn();
    const persistedState = {
      position: { x: 100, y: 200 },
      size: { width: 600, height: 400 },
      isLocked: false,
    };

    localStorageMock.setItem("component-layout:test-component", JSON.stringify(persistedState));

    renderHook(() =>
      useComponentStatePreservation({ id: "test-component", onStateLoad })
    );

    expect(onStateLoad).toHaveBeenCalledWith(persistedState);
  });

  it("should update state and persist to localStorage", () => {
    const { result } = renderHook(() =>
      useComponentStatePreservation({ id: "test-component" })
    );

    const newState = {
      position: { x: 150, y: 250 },
      size: { width: 700, height: 500 },
      isLocked: true,
    };

    act(() => {
      result.current.updateState(newState);
    });

    // Advance timers to allow debounced save
    vi.advanceTimersByTime(300);

    const stored = localStorageMock.getItem("component-layout:test-component");
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toEqual(expect.objectContaining(newState));
    expect(result.current.isPersisted).toBe(true);
  });

  it("should debounce state updates", () => {
    const { result } = renderHook(() =>
      useComponentStatePreservation({ id: "test-component" })
    );

    const onStateSave = vi.fn();
    renderHook(() =>
      useComponentStatePreservation({ id: "test-component", onStateSave })
    );

    act(() => {
      result.current.updateState({ position: { x: 100, y: 200 } });
      result.current.updateState({ position: { x: 150, y: 250 } });
      result.current.updateState({ position: { x: 200, y: 300 } });
    });

    // Should not save immediately
    expect(onStateSave).not.toHaveBeenCalled();

    // Advance timers partially
    vi.advanceTimersByTime(100);
    expect(onStateSave).not.toHaveBeenCalled();

    // Advance timers to debounce delay
    vi.advanceTimersByTime(200);
    expect(onStateSave).toHaveBeenCalledTimes(1);
  });

  it("should call onStateSave after debounce delay", () => {
    const onStateSave = vi.fn();

    renderHook(() =>
      useComponentStatePreservation({ id: "test-component", onStateSave })
    );

    const { result } = renderHook(() =>
      useComponentStatePreservation({ id: "test-component", onStateSave })
    );

    act(() => {
      result.current.updateState({ position: { x: 100, y: 200 } });
    });

    vi.advanceTimersByTime(300);

    expect(onStateSave).toHaveBeenCalled();
  });

  it("should reset state to initial values", () => {
    const { result } = renderHook(() =>
      useComponentStatePreservation({ id: "test-component" })
    );

    // Set some state
    act(() => {
      result.current.updateState({
        position: { x: 100, y: 200 },
        size: { width: 600, height: 400 },
        isLocked: true,
      });
    });

    vi.advanceTimersByTime(300);

    // Reset
    act(() => {
      result.current.resetState();
    });

    vi.advanceTimersByTime(300);

    const stored = localStorageMock.getItem("component-layout:test-component");
    const parsed = JSON.parse(stored!);

    expect(parsed.position).toEqual({ x: 0, y: 0 });
    expect(parsed.size).toEqual({ width: 400, height: 300 });
    expect(parsed.isLocked).toBe(false);
  });

  it("should clear persisted state", () => {
    const { result } = renderHook(() =>
      useComponentStatePreservation({ id: "test-component" })
    );

    // Set some state
    act(() => {
      result.current.updateState({
        position: { x: 100, y: 200 },
        size: { width: 600, height: 400 },
        isLocked: true,
      });
    });

    vi.advanceTimersByTime(300);

    expect(localStorageMock.getItem("component-layout:test-component")).toBeTruthy();

    // Clear
    act(() => {
      result.current.clearPersistedState();
    });

    expect(localStorageMock.getItem("component-layout:test-component")).toBeNull();
    expect(result.current.isPersisted).toBe(false);
  });

  it("should use custom storage key", () => {
    const { result } = renderHook(() =>
      useComponentStatePreservation({ id: "test-component", storageKey: "custom-key" })
    );

    act(() => {
      result.current.updateState({ position: { x: 100, y: 200 } });
    });

    vi.advanceTimersByTime(300);

    expect(localStorageMock.getItem("custom-key:test-component")).toBeTruthy();
    expect(localStorageMock.getItem("component-layout:test-component")).toBeNull();
  });

  it("should not persist when persistToStorage is false", () => {
    const { result } = renderHook(() =>
      useComponentStatePreservation({ id: "test-component", persistToStorage: false })
    );

    act(() => {
      result.current.updateState({ position: { x: 100, y: 200 } });
    });

    vi.advanceTimersByTime(300);

    expect(localStorageMock.getItem("component-layout:test-component")).toBeNull();
  });

  it("should handle partial updates correctly", () => {
    const { result } = renderHook(() =>
      useComponentStatePreservation({ id: "test-component" })
    );

    // Set initial state
    act(() => {
      result.current.updateState({
        position: { x: 100, y: 200 },
        size: { width: 600, height: 400 },
        isLocked: false,
      });
    });

    vi.advanceTimersByTime(300);

    // Update only position
    act(() => {
      result.current.updateState({ position: { x: 150, y: 250 } });
    });

    vi.advanceTimersByTime(300);

    const stored = JSON.parse(localStorageMock.getItem("component-layout:test-component")!);
    expect(stored.position).toEqual({ x: 150, y: 250 });
    expect(stored.size).toEqual({ width: 600, height: 400 });
    expect(stored.isLocked).toBe(false);
  });

  it("should handle localStorage errors gracefully", () => {
    // Mock localStorage to throw error
    const originalSetItem = localStorageMock.setItem;
    localStorageMock.setItem = vi.fn(() => {
      throw new Error("Storage quota exceeded");
    });

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() =>
      useComponentStatePreservation({ id: "test-component" })
    );

    act(() => {
      result.current.updateState({ position: { x: 100, y: 200 } });
    });

    vi.advanceTimersByTime(300);

    expect(consoleErrorSpy).toHaveBeenCalled();

    // Restore original
    localStorageMock.setItem = originalSetItem;
    consoleErrorSpy.mockRestore();
  });
});
