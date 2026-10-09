/**
 * Phase 9: Responsive Behavior Tests
 * 
 * Tests for responsive layout functionality including:
 * - Breakpoint detection
 * - Touch device detection
 * - Responsive size adjustment
 * - Safe area handling
 * - Adaptive layouts
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, cleanup } from "@testing-library/react";
import {
  useResponsiveLayout,
  detectTouchDevice,
  getBreakpoint,
  getSafeAreaInsets,
  BREAKPOINTS,
  DEFAULT_SIZES,
} from "./use-responsive-layout";
import { useAdaptiveLayout, getLayoutModeForBreakpoint, getColumnsForBreakpoint } from "./use-adaptive-layout";

// ============================================================================
// Setup and Teardown
// ============================================================================

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

// ============================================================================
// Touch Device Detection Tests
// ============================================================================

describe("detectTouchDevice", () => {
  it("should return a boolean value", () => {
    const result = detectTouchDevice();
    expect(typeof result).toBe("boolean");
  });
});

// ============================================================================
// Breakpoint Detection Tests
// ============================================================================

describe("getBreakpoint", () => {
  it("should return mobile for width < 768px", () => {
    expect(getBreakpoint(767, BREAKPOINTS)).toBe("mobile");
    expect(getBreakpoint(320, BREAKPOINTS)).toBe("mobile");
    expect(getBreakpoint(600, BREAKPOINTS)).toBe("mobile");
  });

  it("should return tablet for width between 768px and 1023px", () => {
    expect(getBreakpoint(768, BREAKPOINTS)).toBe("tablet");
    expect(getBreakpoint(800, BREAKPOINTS)).toBe("tablet");
    expect(getBreakpoint(1023, BREAKPOINTS)).toBe("tablet");
  });

  it("should return desktop for width between 1024px and 1439px", () => {
    expect(getBreakpoint(1024, BREAKPOINTS)).toBe("desktop");
    expect(getBreakpoint(1200, BREAKPOINTS)).toBe("desktop");
    expect(getBreakpoint(1439, BREAKPOINTS)).toBe("desktop");
  });

  it("should return large-desktop for width >= 1440px", () => {
    expect(getBreakpoint(1440, BREAKPOINTS)).toBe("large-desktop");
    expect(getBreakpoint(1920, BREAKPOINTS)).toBe("large-desktop");
    expect(getBreakpoint(2560, BREAKPOINTS)).toBe("large-desktop");
  });
});

// ============================================================================
// Safe Area Tests
// ============================================================================

describe("getSafeAreaInsets", () => {
  it("should return zero insets when env() is not supported", () => {
    const insets = getSafeAreaInsets();
    expect(insets).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
  });
});

// ============================================================================
// useResponsiveLayout Hook Tests
// ============================================================================

describe("useResponsiveLayout", () => {
  it("should initialize with valid layout state", () => {
    const { result } = renderHook(() => useResponsiveLayout());

    expect(result.current.layout).toBeDefined();
    expect(result.current.layout.width).toBeGreaterThan(0);
    expect(result.current.layout.height).toBeGreaterThan(0);
    expect(result.current.layout.breakpoint).toBeDefined();
    expect(result.current.layout.orientation).toBeDefined();
  });

  it("should provide adjustPosition method", () => {
    const { result } = renderHook(() => useResponsiveLayout());

    expect(typeof result.current.adjustPosition).toBe("function");
    const adjusted = result.current.adjustPosition({ x: 100, y: 100 });
    expect(adjusted).toBeDefined();
    expect(typeof adjusted.x).toBe("number");
    expect(typeof adjusted.y).toBe("number");
  });

  it("should provide adjustSize method", () => {
    const { result } = renderHook(() => useResponsiveLayout());

    expect(typeof result.current.adjustSize).toBe("function");
    const adjusted = result.current.adjustSize({ width: 800, height: 600 });
    expect(adjusted).toBeDefined();
    expect(typeof adjusted.width).toBe("number");
    expect(typeof adjusted.height).toBe("number");
  });

  it("should provide fitsInViewport method", () => {
    const { result } = renderHook(() => useResponsiveLayout());

    expect(typeof result.current.fitsInViewport).toBe("function");
    const fits = result.current.fitsInViewport({ width: 100, height: 100 });
    expect(typeof fits).toBe("boolean");
  });

  it("should provide getScaleFactor method", () => {
    const { result } = renderHook(() => useResponsiveLayout());

    expect(typeof result.current.getScaleFactor).toBe("function");
    const scale = result.current.getScaleFactor({ width: 800, height: 600 });
    expect(typeof scale).toBe("number");
    expect(scale).toBeGreaterThan(0);
  });

  it("should provide isTouchDevice property", () => {
    const { result } = renderHook(() => useResponsiveLayout());

    expect(typeof result.current.isTouchDevice).toBe("boolean");
  });

  it("should provide getSafeArea method", () => {
    const { result } = renderHook(() => useResponsiveLayout());

    expect(typeof result.current.getSafeArea).toBe("function");
    const safeArea = result.current.getSafeArea();
    expect(safeArea).toBeDefined();
    expect(typeof safeArea.top).toBe("number");
    expect(typeof safeArea.bottom).toBe("number");
  });

  it("should provide getOptimalSize method", () => {
    const { result } = renderHook(() => useResponsiveLayout());

    expect(typeof result.current.getOptimalSize).toBe("function");
    const size = result.current.getOptimalSize("medium");
    expect(size).toBeDefined();
    expect(typeof size.width).toBe("number");
    expect(typeof size.height).toBe("number");
  });

  it("should adjust size to minimum constraints", () => {
    const { result } = renderHook(() => useResponsiveLayout());

    const adjusted = result.current.adjustSize({ width: 800, height: 600 });
    expect(adjusted.width).toBeGreaterThanOrEqual(200);
    expect(adjusted.height).toBeGreaterThanOrEqual(150);
  });
});

// ============================================================================
// Adaptive Layout Tests
// ============================================================================

describe("useAdaptiveLayout", () => {
  const mockComponents = [
    { id: "1", baseWidth: 400, baseHeight: 300 },
    { id: "2", baseWidth: 400, baseHeight: 300 },
    { id: "3", baseWidth: 400, baseHeight: 300 },
  ];

  it("should initialize with empty layout when auto-layout is disabled", () => {
    const { result } = renderHook(() =>
      useAdaptiveLayout(mockComponents, {
        layoutMode: "grid",
        enableAutoLayout: false,
      })
    );

    expect(result.current.layout).toBeDefined();
    expect(Array.isArray(result.current.layout)).toBe(true);
  });

  it("should provide updateComponentLayout method", () => {
    const { result } = renderHook(() =>
      useAdaptiveLayout(mockComponents, {
        layoutMode: "grid",
        enableAutoLayout: false,
      })
    );

    expect(typeof result.current.updateComponentLayout).toBe("function");

    act(() => {
      result.current.updateComponentLayout("1", { x: 100, y: 100 });
    });

    const layout = result.current.getComponentLayout("1");
    expect(layout).toBeDefined();
    expect(layout?.x).toBe(100);
    expect(layout?.y).toBe(100);
  });

  it("should provide recalculateLayout method", () => {
    const { result } = renderHook(() =>
      useAdaptiveLayout(mockComponents, {
        layoutMode: "grid",
        enableAutoLayout: false,
      })
    );

    expect(typeof result.current.recalculateLayout).toBe("function");
  });

  it("should provide getComponentLayout method", () => {
    const { result } = renderHook(() =>
      useAdaptiveLayout(mockComponents, {
        layoutMode: "grid",
        enableAutoLayout: false,
      })
    );

    expect(typeof result.current.getComponentLayout).toBe("function");
  });

  it("should return undefined for non-existent component", () => {
    const { result } = renderHook(() =>
      useAdaptiveLayout(mockComponents, {
        layoutMode: "grid",
        enableAutoLayout: false,
      })
    );

    expect(result.current.getComponentLayout("999")).toBeUndefined();
  });

  it("should provide breakpoint property", () => {
    const { result } = renderHook(() =>
      useAdaptiveLayout(mockComponents, {
        layoutMode: "grid",
        enableAutoLayout: false,
      })
    );

    expect(result.current.breakpoint).toBeDefined();
    expect(typeof result.current.breakpoint).toBe("string");
  });

  it("should provide isTransitioning property", () => {
    const { result } = renderHook(() =>
      useAdaptiveLayout(mockComponents, {
        layoutMode: "grid",
        enableAutoLayout: false,
      })
    );

    expect(typeof result.current.isTransitioning).toBe("boolean");
  });
});

// ============================================================================
// Layout Mode Utility Tests
// ============================================================================

describe("getLayoutModeForBreakpoint", () => {
  it("should return stack for mobile", () => {
    expect(getLayoutModeForBreakpoint("mobile")).toBe("stack");
  });

  it("should return grid for tablet", () => {
    expect(getLayoutModeForBreakpoint("tablet")).toBe("grid");
  });

  it("should return grid for desktop", () => {
    expect(getLayoutModeForBreakpoint("desktop")).toBe("grid");
  });

  it("should return grid for large-desktop", () => {
    expect(getLayoutModeForBreakpoint("large-desktop")).toBe("grid");
  });

  it("should use custom mode if provided", () => {
    const customModes = {
      mobile: "grid" as const,
      tablet: "masonry" as const,
    };

    expect(getLayoutModeForBreakpoint("mobile", customModes)).toBe("grid");
    expect(getLayoutModeForBreakpoint("tablet", customModes)).toBe("masonry");
  });
});

// ============================================================================
// Columns Utility Tests
// ============================================================================

describe("getColumnsForBreakpoint", () => {
  it("should return 1 column for mobile", () => {
    expect(getColumnsForBreakpoint("mobile")).toBe(1);
  });

  it("should return 2 columns for tablet", () => {
    expect(getColumnsForBreakpoint("tablet")).toBe(2);
  });

  it("should return 3 columns for desktop", () => {
    expect(getColumnsForBreakpoint("desktop")).toBe(3);
  });

  it("should return 4 columns for large-desktop", () => {
    expect(getColumnsForBreakpoint("large-desktop")).toBe(4);
  });

  it("should use custom columns if provided", () => {
    const customColumns = {
      mobile: 2,
      tablet: 3,
      desktop: 4,
      "large-desktop": 6,
    };

    expect(getColumnsForBreakpoint("mobile", customColumns)).toBe(2);
    expect(getColumnsForBreakpoint("tablet", customColumns)).toBe(3);
    expect(getColumnsForBreakpoint("desktop", customColumns)).toBe(4);
    expect(getColumnsForBreakpoint("large-desktop", customColumns)).toBe(6);
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe("Responsive Behavior Integration", () => {
  it("should maintain aspect ratio when adjusting size", () => {
    const { result } = renderHook(() => useResponsiveLayout());

    const originalSize = { width: 800, height: 600 };
    const adjusted = result.current.adjustSize(originalSize);

    const originalRatio = originalSize.width / originalSize.height;
    const adjustedRatio = adjusted.width / adjusted.height;

    // Ratio should be approximately maintained
    expect(Math.abs(originalRatio - adjustedRatio)).toBeLessThan(0.5);
  });

  it("should return valid optimal sizes for all breakpoints", () => {
    const { result } = renderHook(() => useResponsiveLayout());

    const small = result.current.getOptimalSize("small");
    const medium = result.current.getOptimalSize("medium");
    const large = result.current.getOptimalSize("large");

    expect(small.width).toBeGreaterThan(0);
    expect(small.height).toBeGreaterThan(0);
    expect(medium.width).toBeGreaterThan(small.width);
    expect(medium.height).toBeGreaterThan(small.height);
    expect(large.width).toBeGreaterThan(medium.width);
    expect(large.height).toBeGreaterThan(medium.height);
  });
});
