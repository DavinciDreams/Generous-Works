import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { DraggableWrapper } from "./draggable-wrapper";

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

describe("DraggableWrapper", () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render children correctly", () => {
    render(
      <DraggableWrapper id="test-component">
        <div>Test Content</div>
      </DraggableWrapper>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should apply initial position", () => {
    const { container } = render(
      <DraggableWrapper id="test-component" initialPosition={{ x: 100, y: 200 }}>
        <div>Test Content</div>
      </DraggableWrapper>
    );

    const wrapper = container.querySelector('[data-draggable-id="test-component"]');
    expect(wrapper).toHaveStyle({
      transform: "translate(100px, 200px)",
    });
  });

  it("should apply custom z-index", () => {
    const { container } = render(
      <DraggableWrapper id="test-component" zIndex={20}>
        <div>Test Content</div>
      </DraggableWrapper>
    );

    const wrapper = container.querySelector('[data-draggable-id="test-component"]');
    expect(wrapper).toHaveStyle({
      zIndex: "20",
    });
  });

  it("should show lock toggle button when showLockToggle is true", () => {
    render(
      <DraggableWrapper id="test-component" showLockToggle>
        <div>Test Content</div>
      </DraggableWrapper>
    );

    const lockButton = screen.getByLabelText("Lock");
    expect(lockButton).toBeInTheDocument();
  });

  it("should not show lock toggle button when showLockToggle is false", () => {
    render(
      <DraggableWrapper id="test-component" showLockToggle={false}>
        <div>Test Content</div>
      </DraggableWrapper>
    );

    const lockButton = screen.queryByLabelText("Lock");
    expect(lockButton).not.toBeInTheDocument();
  });

  it("should toggle lock state when lock button is clicked", async () => {
    render(
      <DraggableWrapper id="test-component" showLockToggle>
        <div>Test Content</div>
      </DraggableWrapper>
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

  it("should prevent dragging when locked", () => {
    const onPositionChange = vi.fn();

    render(
      <DraggableWrapper
        id="test-component"
        initiallyLocked={true}
        onPositionChange={onPositionChange}
      >
        <div>Test Content</div>
      </DraggableWrapper>
    );

    const wrapper = screen.getByText("Test Content").parentElement;

    // Try to drag
    fireEvent.mouseDown(wrapper!, { clientX: 0, clientY: 0, button: 0 });
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(document);

    // Position change should not be called when locked
    expect(onPositionChange).not.toHaveBeenCalled();
  });

  it("should call onPositionChange when dragging", async () => {
    const onPositionChange = vi.fn();

    render(
      <DraggableWrapper
        id="test-component"
        initialPosition={{ x: 0, y: 0 }}
        onPositionChange={onPositionChange}
      >
        <div>Test Content</div>
      </DraggableWrapper>
    );

    const wrapper = screen.getByText("Test Content").parentElement;

    // Start drag
    fireEvent.mouseDown(wrapper!, { clientX: 0, clientY: 0, button: 0 });

    // Move
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });

    // End drag
    fireEvent.mouseUp(document);

    await waitFor(() => {
      expect(onPositionChange).toHaveBeenCalled();
    });
  });

  it("should call onDragStart when drag begins", () => {
    const onDragStart = vi.fn();

    render(
      <DraggableWrapper
        id="test-component"
        onDragStart={onDragStart}
      >
        <div>Test Content</div>
      </DraggableWrapper>
    );

    const wrapper = screen.getByText("Test Content").parentElement;

    fireEvent.mouseDown(wrapper!, { clientX: 0, clientY: 0, button: 0 });

    expect(onDragStart).toHaveBeenCalled();
  });

  it("should call onDragEnd when drag ends", () => {
    const onDragEnd = vi.fn();

    render(
      <DraggableWrapper
        id="test-component"
        onDragEnd={onDragEnd}
      >
        <div>Test Content</div>
      </DraggableWrapper>
    );

    const wrapper = screen.getByText("Test Content").parentElement;

    fireEvent.mouseDown(wrapper!, { clientX: 0, clientY: 0, button: 0 });
    fireEvent.mouseUp(document);

    expect(onDragEnd).toHaveBeenCalled();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <DraggableWrapper id="test-component" className="custom-class">
        <div>Test Content</div>
      </DraggableWrapper>
    );

    const wrapper = container.querySelector('[data-draggable-id="test-component"]');
    expect(wrapper).toHaveClass("custom-class");
  });

  it("should have correct data attributes", () => {
    const { container } = render(
      <DraggableWrapper id="test-component" initiallyLocked={true}>
        <div>Test Content</div>
      </DraggableWrapper>
    );

    const wrapper = container.querySelector('[data-draggable-id="test-component"]');
    expect(wrapper).toHaveAttribute("data-draggable-id", "test-component");
    expect(wrapper).toHaveAttribute("data-draggable-locked", "true");
  });
});
