"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useResponsiveLayout, type ResponsiveLayoutState, type Breakpoint } from "./use-responsive-layout";

// ============================================================================
// Type Definitions
// ============================================================================

export interface ComponentLayout {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
}

export interface AdaptiveLayoutOptions {
  /** Enable automatic layout adjustment */
  enableAutoLayout?: boolean;
  /** Layout mode */
  layoutMode?: "grid" | "stack" | "masonry" | "free";
  /** Gap between components in pixels */
  gap?: number;
  /** Padding around layout in pixels */
  padding?: number;
  /** Maximum columns for grid layout */
  maxColumns?: number;
  /** Minimum component width */
  minComponentWidth?: number;
  /** Transition duration in milliseconds */
  transitionDuration?: number;
  /** Enable layout animations */
  enableAnimations?: boolean;
}

export interface UseAdaptiveLayoutReturn {
  /** Current layout for all components */
  layout: ComponentLayout[];
  /** Update layout for a specific component */
  updateComponentLayout: (id: string, layout: Partial<ComponentLayout>) => void;
  /** Recalculate layout for all components */
  recalculateLayout: () => void;
  /** Get layout for a specific component */
  getComponentLayout: (id: string) => ComponentLayout | undefined;
  /** Current breakpoint */
  breakpoint: Breakpoint;
  /** Whether layout is transitioning */
  isTransitioning: boolean;
}

// ============================================================================
// Layout Algorithms
// ============================================================================

/**
 * Calculate grid layout
 */
const calculateGridLayout = (
  components: Array<{ id: string; baseWidth: number; baseHeight: number }>,
  viewportWidth: number,
  viewportHeight: number,
  options: AdaptiveLayoutOptions
): ComponentLayout[] => {
  const {
    gap = 10,
    padding = 20,
    maxColumns = 3,
    minComponentWidth = 200,
  } = options;

  // Calculate available width
  const availableWidth = viewportWidth - padding * 2;
  
  // Calculate number of columns based on viewport width
  const columns = Math.min(
    maxColumns,
    Math.max(1, Math.floor((availableWidth + gap) / (minComponentWidth + gap)))
  );
  
  // Calculate component width
  const componentWidth = Math.floor((availableWidth - (columns - 1) * gap) / columns);
  
  // Calculate layout
  const layout: ComponentLayout[] = [];
  const columnHeights = new Array(columns).fill(padding);
  
  components.forEach((component, index) => {
    // Find column with minimum height
    const minColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    
    const x = padding + minColumnIndex * (componentWidth + gap);
    const y = columnHeights[minColumnIndex];
    
    // Scale height to match width
    const aspectRatio = component.baseHeight / component.baseWidth;
    const componentHeight = Math.floor(componentWidth * aspectRatio);
    
    layout.push({
      id: component.id,
      x,
      y,
      width: componentWidth,
      height: componentHeight,
    });
    
    // Update column height
    columnHeights[minColumnIndex] += componentHeight + gap;
  });
  
  return layout;
};

/**
 * Calculate stacked layout (for mobile)
 */
const calculateStackedLayout = (
  components: Array<{ id: string; baseWidth: number; baseHeight: number }>,
  viewportWidth: number,
  options: AdaptiveLayoutOptions
): ComponentLayout[] => {
  const {
    gap = 10,
    padding = 20,
  } = options;

  const layout: ComponentLayout[] = [];
  let currentY = padding;
  const componentWidth = viewportWidth - padding * 2;
  
  components.forEach((component) => {
    // Scale height to match width
    const aspectRatio = component.baseHeight / component.baseWidth;
    const componentHeight = Math.floor(componentWidth * aspectRatio);
    
    layout.push({
      id: component.id,
      x: padding,
      y: currentY,
      width: componentWidth,
      height: componentHeight,
    });
    
    currentY += componentHeight + gap;
  });
  
  return layout;
};

/**
 * Calculate masonry layout
 */
const calculateMasonryLayout = (
  components: Array<{ id: string; baseWidth: number; baseHeight: number }>,
  viewportWidth: number,
  options: AdaptiveLayoutOptions
): ComponentLayout[] => {
  const {
    gap = 10,
    padding = 20,
    maxColumns = 3,
    minComponentWidth = 200,
  } = options;

  // Calculate available width
  const availableWidth = viewportWidth - padding * 2;
  
  // Calculate number of columns
  const columns = Math.min(
    maxColumns,
    Math.max(1, Math.floor((availableWidth + gap) / (minComponentWidth + gap)))
  );
  
  // Calculate component width
  const componentWidth = Math.floor((availableWidth - (columns - 1) * gap) / columns);
  
  // Calculate layout
  const layout: ComponentLayout[] = [];
  const columnHeights = new Array(columns).fill(padding);
  
  components.forEach((component, index) => {
    // Distribute components across columns
    const columnIndex = index % columns;
    
    const x = padding + columnIndex * (componentWidth + gap);
    const y = columnHeights[columnIndex];
    
    // Scale height to match width
    const aspectRatio = component.baseHeight / component.baseWidth;
    const componentHeight = Math.floor(componentWidth * aspectRatio);
    
    layout.push({
      id: component.id,
      x,
      y,
      width: componentWidth,
      height: componentHeight,
    });
    
    // Update column height
    columnHeights[columnIndex] += componentHeight + gap;
  });
  
  return layout;
};

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * useAdaptiveLayout - Hook for adaptive component layouts
 * 
 * Features:
 * - Automatic layout adjustment based on screen size
 * - Multiple layout modes (grid, stack, masonry, free)
 * - Smooth transitions between breakpoints
 * - Layout animations
 * - Configurable spacing and constraints
 */
export const useAdaptiveLayout = (
  components: Array<{ id: string; baseWidth: number; baseHeight: number }>,
  options: AdaptiveLayoutOptions = {}
): UseAdaptiveLayoutReturn => {
  const {
    enableAutoLayout = true,
    layoutMode = "grid",
    gap = 10,
    padding = 20,
    maxColumns = 3,
    minComponentWidth = 200,
    transitionDuration = 300,
    enableAnimations = true,
  } = options;

  const { layout: responsiveLayout } = useResponsiveLayout();
  const [layout, setLayout] = useState<ComponentLayout[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Calculate layout based on breakpoint
  const calculateLayout = useCallback(() => {
    const { width, height, breakpoint } = responsiveLayout;

    // On mobile, always use stacked layout
    const effectiveLayoutMode = breakpoint === "mobile" ? "stack" : layoutMode;

    switch (effectiveLayoutMode) {
      case "stack":
        return calculateStackedLayout(components, width, { gap, padding });
      case "masonry":
        return calculateMasonryLayout(components, width, { gap, padding, maxColumns, minComponentWidth });
      case "grid":
      default:
        return calculateGridLayout(components, width, height, { gap, padding, maxColumns, minComponentWidth });
    }
  }, [components, responsiveLayout, layoutMode, gap, padding, maxColumns, minComponentWidth]);

  // Recalculate layout when viewport changes
  useEffect(() => {
    if (!enableAutoLayout) return;

    setIsTransitioning(true);
    const newLayout = calculateLayout();
    
    // Apply transition
    if (enableAnimations) {
      setTimeout(() => {
        setLayout(newLayout);
        setTimeout(() => {
          setIsTransitioning(false);
        }, transitionDuration);
      }, 50);
    } else {
      setLayout(newLayout);
      setIsTransitioning(false);
    }
  }, [calculateLayout, enableAutoLayout, enableAnimations, transitionDuration]);

  // Update layout for a specific component
  const updateComponentLayout = useCallback(
    (id: string, updates: Partial<ComponentLayout>) => {
      setLayout((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
    },
    []
  );

  // Recalculate layout for all components
  const recalculateLayout = useCallback(() => {
    const newLayout = calculateLayout();
    setLayout(newLayout);
  }, [calculateLayout]);

  // Get layout for a specific component
  const getComponentLayout = useCallback(
    (id: string) => {
      return layout.find((item) => item.id === id);
    },
    [layout]
  );

  return {
    layout,
    updateComponentLayout,
    recalculateLayout,
    getComponentLayout,
    breakpoint: responsiveLayout.breakpoint,
    isTransitioning,
  };
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get layout mode for breakpoint
 */
export const getLayoutModeForBreakpoint = (
  breakpoint: Breakpoint,
  customModes?: Partial<Record<Breakpoint, "grid" | "stack" | "masonry" | "free">>
): "grid" | "stack" | "masonry" | "free" => {
  if (customModes?.[breakpoint]) {
    return customModes[breakpoint]!;
  }

  // Default modes
  switch (breakpoint) {
    case "mobile":
      return "stack";
    case "tablet":
      return "grid";
    case "desktop":
    case "large-desktop":
    default:
      return "grid";
  }
};

/**
 * Get columns for breakpoint
 */
export const getColumnsForBreakpoint = (
  breakpoint: Breakpoint,
  customColumns?: Partial<Record<Breakpoint, number>>
): number => {
  if (customColumns?.[breakpoint]) {
    return customColumns[breakpoint]!;
  }

  // Default columns
  switch (breakpoint) {
    case "mobile":
      return 1;
    case "tablet":
      return 2;
    case "desktop":
      return 3;
    case "large-desktop":
    default:
      return 4;
  }
};
