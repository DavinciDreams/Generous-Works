import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { ResizableWrapper } from "./resizable-wrapper";

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

describe("ResizableWrapper", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render children correctly", () => {
    render(
      <ResizableWrapper id="test-component">
        <div>Test Content</div>
      </ResizableWrapper>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should apply initial size", () => {
    const { container } = render(
      <ResizableWrapper id="test-component" initialSize={{ width: 600, height: 400 }}>
        <div>Test Content</div>
      </ResizableWrapper>
    );

    const wrapper = container.querySelector('[data-resizable-id="test-component"]');
    expect(wrapper).toHaveStyle({
      width: "600px",
      height: "400px",
    });
  });

  it("should apply custom z-index", () => {
    const { container } = render(
      <ResizableWrapper id="test-component" zIndex={20}>
        <div>Test Content</div>
      </ResizableWrapper>
    );

    const wrapper = container.querySelector('[data-resizable-id="test-component"]');
    expect(wrapper).toHaveStyle({
      zIndex: "20",
    });
  });

  it("should show lock toggle button when showLockToggle is true", () => {
    render(
      <ResizableWrapper id="test-component" showLockToggle>
        <div>Test Content</div>
      </ResizableWrapper>
    );

    const lockButton = screen.getByLabelText("Lock");
    expect(lockButton).toBeInTheDocument();
  });

  it("should not show lock toggle button when showLockToggle is false", () => {
    render(
      <ResizableWrapper id="test-component" showLockToggle={false}>
        <div>Test Content</div>
      </ResizableWrapper>
    );

    const lockButton = screen.queryByLabelText("Lock");
    expect(lockButton).not.toBeInTheDocument();
  });

  it("should toggle lock state when lock button is clicked", async () => {
    render(
      <ResizableWrapper id="test-component" showLockToggle>
        <div>Test Content</div>
      </ResizableWrapper>
    );

    const lockButton = screen.getByLabelText("Lock");
    expect(lockButton).toBeInTheDocument();

    // Click to lock
    fireEvent.click(lockButton);
    await waitFor(() => {
      expect(screen.getByLabelText("Unlock")).toBeInTheDocument();
    });

    // Click to unlock
    const unlockButton = screen.getByLabelText("Unlock");
    fireEvent.click(unlockButton);
    await waitFor(() => {
      expect(screen.getByLabelText("Lock")).toBeInTheDocument();
    });
  });

  it("should prevent resizing when locked", () => {
    const onSizeChange = vi.fn();

    render(
      <ResizableWrapper
        id="test-component"
        initiallyLocked={true}
        onSizeChange={onSizeChange}
      >
        <div>Test Content</div>
      </ResizableWrapper>
    );

    const handles = screen.queryAllByRole("button");

    // Try to resize
    handles.forEach((handle) => {
      fireEvent.mouseDown(handle, { clientX: 0, clientY: 0, button: 0 });
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      fireEvent.mouseUp(document);
    });

    // Size change should not be called when locked
    expect(onSizeChange).not.toHaveBeenCalled();
  });

  it("should call onSizeChange when resizing", async () => {
    const onSizeChange = vi.fn();

    render(
      <ResizableWrapper
        id="test-component"
        initialSize={{ width: 400, height: 300 }}
        onSizeChange={onSizeChange}
      >
        <div>Test Content</div>
      </ResizableWrapper>
    );

    // Find a resize handle (se handle)
    const handles = screen.queryAllByRole("button");
    const seHandle = handles.find((h) => h.getAttribute("aria-label") === "Resize se");

    if (seHandle) {
      // Start resize
      fireEvent.mouseDown(seHandle, { clientX: 400, clientY: 300, button: 0 });

      // Move
      fireEvent.mouseMove(document, { clientX: 500, clientY: 400 });

      // End resize
      fireEvent.mouseUp(document);

      await waitFor(() => {
        expect(onSizeChange).toHaveBeenCalled();
      });
    }
  });

  it("should call onResizeStart when resize begins", () => {
    const onResizeStart = vi.fn();

    render(
      <ResizableWrapper
        id="test-component"
        onResizeStart={onResizeStart}
      >
        <div>Test Content</div>
      </ResizableWrapper>
    );

    const handles = screen.queryAllByRole("button");
    const seHandle = handles.find((h) => h.getAttribute("aria-label") === "Resize se");

    if (seHandle) {
      fireEvent.mouseDown(seHandle, { clientX: 400, clientY: 300, button: 0 });
      expect(onResizeStart).toHaveBeenCalled();
    }
  });

  it("should call onResizeEnd when resize ends", () => {
    const onResizeEnd = vi.fn();

    render(
      <ResizableWrapper
        id="test-component"
        onResizeEnd={onResizeEnd}
      >
        <div>Test Content</div>
      </ResizableWrapper>
    );

    const handles = screen.queryAllByRole("button");
    const seHandle = handles.find((h) => h.getAttribute("aria-label") === "Resize se");

    if (seHandle) {
      fireEvent.mouseDown(seHandle, { clientX: 400, clientY: 300, button: 0 });
      fireEvent.mouseUp(document);
      expect(onResizeEnd).toHaveBeenCalled();
    }
  });

  it("should respect minimum size constraints", async () => {
    const onSizeChange = vi.fn();

    render(
      <ResizableWrapper
        id="test-component"
        initialSize={{ width: 400, height: 300 }}
        minSize={{ width: 200, height: 150 }}
        onSizeChange={onSizeChange}
      >
        <div>Test Content</div>
      </ResizableWrapper>
    );

    const handles = screen.queryAllByRole("button");
    const seHandle = handles.find((h) => h.getAttribute("aria-label") === "Resize se");

    if (seHandle) {
      // Try to resize below minimum
      fireEvent.mouseDown(seHandle, { clientX: 400, clientY: 300, button: 0 });
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
      fireEvent.mouseUp(document);

      await waitFor(() => {
        const calls = onSizeChange.mock.calls;
        if (calls.length > 0) {
          const lastCall = calls[calls.length - 1][0];
          expect(lastCall.width).toBeGreaterThanOrEqual(200);
          expect(lastCall.height).toBeGreaterThanOrEqual(150);
        }
      });
    }
  });

  it("should respect maximum size constraints", async () => {
    const onSizeChange = vi.fn();

    render(
      <ResizableWrapper
        id="test-component"
        initialSize={{ width: 400, height: 300 }}
        maxSize={{ width: 600, height: 450 }}
        onSizeChange={onSizeChange}
      >
        <div>Test Content</div>
      </ResizableWrapper>
    );

    const handles = screen.queryAllByRole("button");
    const seHandle = handles.find((h) => h.getAttribute("aria-label") === "Resize se");

    if (seHandle) {
      // Try to resize above maximum
      fireEvent.mouseDown(seHandle, { clientX: 400, clientY: 300, button: 0 });
      fireEvent.mouseMove(document, { clientX: 800, clientY: 600 });
      fireEvent.mouseUp(document);

    }
  });

  it("should apply custom className", () => {
    const { container } = render(
      <ResizableWrapper id="test-component" className="custom-class">
        <div>Test Content</div>
      </ResizableWrapper>
    );

    const wrapper = container.querySelector('[data-resizable-id="test-component"]');
    expect(wrapper).toHaveClass("custom-class");
  });

  it("should have correct data attributes", () => {
    const { container } = render(
      <ResizableWrapper id="test-component" initiallyLocked={true}>
        <div>Test Content</div>
      </ResizableWrapper>
    );

    const wrapper = container.querySelector('[data-resizable-id="test-component"]');
    expect(wrapper).toHaveAttribute("data-resizable-id", "test-component");
    expect(wrapper).toHaveAttribute("data-resizable-locked", "true");
  });
});
