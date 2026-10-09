"use client";

import { useCallback, useEffect, useState, useMemo } from "react";

// ============================================================================
// Type Definitions
// ============================================================================

export type Breakpoint = "mobile" | "tablet" | "desktop" | "large-desktop";

export interface ResponsiveLayoutState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  orientation: "portrait" | "landscape";
  breakpoint: Breakpoint;
}

export interface ResponsiveLayoutOptions {
  /** Mobile breakpoint (default: 768px) */
  mobileBreakpoint?: number;
  /** Tablet breakpoint (default: 1024px) */
  tabletBreakpoint?: number;
  /** Large desktop breakpoint (default: 1440px) */
  largeDesktopBreakpoint?: number;
  /** Debounce delay in milliseconds (default: 100) */
  debounceDelay?: number;
  /** Enable touch detection (default: true) */
  enableTouchDetection?: boolean;
}

export interface UseResponsiveLayoutReturn {
  /** Current layout state */
  layout: ResponsiveLayoutState;
  /** Adjust position for current screen size */
  adjustPosition: (position: { x: number; y: number }) => { x: number; y: number };
  /** Adjust size for current screen size */
  adjustSize: (size: { width: number; height: number }) => { width: number; height: number };
  /** Check if component fits in viewport */
  fitsInViewport: (size: { width: number; height: number }) => boolean;
  /** Get responsive scale factor */
  getScaleFactor: (baseSize: { width: number; height: number }) => number;
  /** Check if touch device */
  isTouchDevice: boolean;
  /** Get safe area for mobile (notch, home indicator, etc.) */
  getSafeArea: () => { top: number; bottom: number; left: number; right: number };
  /** Get optimal component size for current breakpoint */
  getOptimalSize: (componentType?: "small" | "medium" | "large") => { width: number; height: number };
}

// ============================================================================
// Breakpoint Configuration
// ============================================================================

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

export const DEFAULT_SIZES = {
  mobile: { small: { width: 300, height: 200 }, medium: { width: 350, height: 250 }, large: { width: 400, height: 300 } },
  tablet: { small: { width: 400, height: 300 }, medium: { width: 500, height: 350 }, large: { width: 600, height: 400 } },
  desktop: { small: { width: 500, height: 350 }, medium: { width: 600, height: 400 }, large: { width: 800, height: 600 } },
  "large-desktop": { small: { width: 600, height: 400 }, medium: { width: 800, height: 500 }, large: { width: 1000, height: 700 } },
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Detect if device supports touch
 */
export const detectTouchDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - deprecated but still useful for detection
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Get current breakpoint from width
 */
export const getBreakpoint = (width: number, breakpoints: { mobile: number; tablet: number; desktop: number }): Breakpoint => {
  if (width < breakpoints.mobile) return "mobile";
  if (width < breakpoints.tablet) return "tablet";
  if (width < breakpoints.desktop) return "desktop";
  return "large-desktop";
};

/**
 * Get safe area insets for mobile devices
 */
export const getSafeAreaInsets = (): { top: number; bottom: number; left: number; right: number } => {
  if (typeof window === "undefined") {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  const style = window.getComputedStyle(document.documentElement);
  const top = parseInt(style.getPropertyValue("env(safe-area-inset-top)") || "0", 10);
  const bottom = parseInt(style.getPropertyValue("env(safe-area-inset-bottom)") || "0", 10);
  const left = parseInt(style.getPropertyValue("env(safe-area-inset-left)") || "0", 10);
  const right = parseInt(style.getPropertyValue("env(safe-area-inset-right)") || "0", 10);

  return { top, bottom, left, right };
};

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * useResponsiveLayout - Hook for responsive layout behavior
 * 
 * Features:
 * - Track viewport dimensions
 * - Detect device type (mobile, tablet, desktop)
 * - Detect orientation
 * - Adjust component positions/sizes for responsive behavior
 * - Debounced resize handling
 * - Touch device detection
 * - Safe area support for mobile notches
 * - Adaptive layout presets
 */
export const useResponsiveLayout = ({
  mobileBreakpoint = BREAKPOINTS.mobile,
  tabletBreakpoint = BREAKPOINTS.tablet,
  largeDesktopBreakpoint = BREAKPOINTS.desktop,
  debounceDelay = 100,
  enableTouchDetection = true,
}: ResponsiveLayoutOptions = {}): UseResponsiveLayoutReturn => {
  const breakpoints = useMemo(
    () => ({ mobile: mobileBreakpoint, tablet: tabletBreakpoint, desktop: largeDesktopBreakpoint }),
    [mobileBreakpoint, tabletBreakpoint, largeDesktopBreakpoint]
  );

  const [layout, setLayout] = useState<ResponsiveLayoutState>(() => {
    if (typeof window === "undefined") {
      return {
        width: 1920,
        height: 1080,
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        isLargeDesktop: true,
        orientation: "landscape",
        breakpoint: "large-desktop",
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const breakpoint = getBreakpoint(width, breakpoints);

    return {
      width,
      height,
      isMobile: width < mobileBreakpoint,
      isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
      isDesktop: width >= tabletBreakpoint && width < largeDesktopBreakpoint,
      isLargeDesktop: width >= largeDesktopBreakpoint,
      orientation: width > height ? "landscape" : "portrait",
      breakpoint,
    };
  });

  const isTouchDevice = useMemo(() => {
    return enableTouchDetection ? detectTouchDevice() : false;
  }, [enableTouchDetection]);

  // Update layout state
  const updateLayout = useCallback(() => {
    if (typeof window === "undefined") return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const breakpoint = getBreakpoint(width, breakpoints);

    setLayout({
      width,
      height,
      isMobile: width < mobileBreakpoint,
      isTablet: width >= mobileBreakpoint && width < tabletBreakpoint,
      isDesktop: width >= tabletBreakpoint && width < largeDesktopBreakpoint,
      isLargeDesktop: width >= largeDesktopBreakpoint,
      orientation: width > height ? "landscape" : "portrait",
      breakpoint,
    });
  }, [mobileBreakpoint, tabletBreakpoint, largeDesktopBreakpoint, breakpoints]);

  // Debounced resize handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        updateLayout();
      }, debounceDelay);
    };

    window.addEventListener("resize", handleResize);

    // Initial update
    updateLayout();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [updateLayout, debounceDelay]);

  // Adjust position for current screen size
  const adjustPosition = useCallback(
    (position: { x: number; y: number }): { x: number; y: number } => {
      const { width, height } = layout;
      const safeArea = getSafeAreaInsets();

      // Ensure position is within viewport bounds, accounting for safe areas
      const adjustedX = Math.max(safeArea.left, Math.min(position.x, width - 100 - safeArea.right));
      const adjustedY = Math.max(safeArea.top, Math.min(position.y, height - 100 - safeArea.bottom));

      return { x: adjustedX, y: adjustedY };
    },
    [layout]
  );

  // Adjust size for current screen size
  const adjustSize = useCallback(
    (size: { width: number; height: number }): { width: number; height: number } => {
      const { width: viewportWidth, height: viewportHeight, breakpoint } = layout;
      const safeArea = getSafeAreaInsets();

      // Calculate available space
      const availableWidth = viewportWidth - safeArea.left - safeArea.right - 40;
      const availableHeight = viewportHeight - safeArea.top - safeArea.bottom - 40;

      // Calculate scale factor based on viewport size
      const scaleX = Math.min(1, availableWidth / size.width);
      const scaleY = Math.min(1, availableHeight / size.height);
      const scale = Math.min(scaleX, scaleY);

      // Apply breakpoint-specific scaling
      let finalScale = scale;
      if (breakpoint === "mobile") {
        finalScale = Math.min(scale, 0.9);
      } else if (breakpoint === "tablet") {
        finalScale = Math.min(scale, 0.95);
      }

      // Apply minimum sizes
      const minWidth = breakpoint === "mobile" ? 280 : breakpoint === "tablet" ? 350 : 400;
      const minHeight = breakpoint === "mobile" ? 200 : breakpoint === "tablet" ? 250 : 300;

      return {
        width: Math.max(minWidth, Math.round(size.width * finalScale)),
        height: Math.max(minHeight, Math.round(size.height * finalScale)),
      };
    },
    [layout]
  );

  // Check if component fits in viewport
  const fitsInViewport = useCallback(
    (size: { width: number; height: number }): boolean => {
      const { width: viewportWidth, height: viewportHeight } = layout;
      const safeArea = getSafeAreaInsets();
      const availableWidth = viewportWidth - safeArea.left - safeArea.right;
      const availableHeight = viewportHeight - safeArea.top - safeArea.bottom;
      
      return size.width <= availableWidth && size.height <= availableHeight;
    },
    [layout]
  );

  // Get scale factor for a given base size
  const getScaleFactor = useCallback(
    (baseSize: { width: number; height: number }): number => {
      const { width: viewportWidth, height: viewportHeight } = layout;
      const safeArea = getSafeAreaInsets();
      
      const availableWidth = viewportWidth - safeArea.left - safeArea.right - 40;
      const availableHeight = viewportHeight - safeArea.top - safeArea.bottom - 40;
      
      const scaleX = Math.min(1, availableWidth / baseSize.width);
      const scaleY = Math.min(1, availableHeight / baseSize.height);
      
      return Math.min(scaleX, scaleY);
    },
    [layout]
  );

  // Get safe area for mobile
  const getSafeArea = useCallback(() => {
    return getSafeAreaInsets();
  }, []);

  // Get optimal size for current breakpoint
  const getOptimalSize = useCallback(
    (componentType: "small" | "medium" | "large" = "medium"): { width: number; height: number } => {
      const sizes = DEFAULT_SIZES[layout.breakpoint];
      return sizes[componentType];
    },
    [layout.breakpoint]
  );

  return {
    layout,
    adjustPosition,
    adjustSize,
    fitsInViewport,
    getScaleFactor,
    isTouchDevice,
    getSafeArea,
    getOptimalSize,
  };
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get responsive props for a component based on viewport
 */
export const getResponsiveProps = (
  layout: ResponsiveLayoutState,
  baseProps: {
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    minSize?: { width: number; height: number };
    maxSize?: { width: number; height: number };
  }
) => {
  const { adjustPosition, adjustSize } = useResponsiveLayout({});

  return {
    position: baseProps.position ? adjustPosition(baseProps.position) : undefined,
    size: baseProps.size ? adjustSize(baseProps.size) : undefined,
    minSize: baseProps.minSize ? adjustSize(baseProps.minSize) : undefined,
    maxSize: baseProps.maxSize ? adjustSize(baseProps.maxSize) : undefined,
  };
};

/**
 * Get adaptive layout preset for multiple components
 */
export const getAdaptiveLayout = (
  layout: ResponsiveLayoutState,
  componentCount: number
): Array<{ x: number; y: number; width: number; height: number }> => {
  const { width, height, breakpoint } = layout;
  const safeArea = getSafeAreaInsets();
  
  const availableWidth = width - safeArea.left - safeArea.right - 20;
  const availableHeight = height - safeArea.top - safeArea.bottom - 20;
  
  // Calculate grid layout based on component count and breakpoint
  let columns = 1;
  let rows = 1;
  
  if (breakpoint === "mobile") {
    columns = 1;
    rows = Math.ceil(componentCount / columns);
  } else if (breakpoint === "tablet") {
    columns = Math.min(2, componentCount);
    rows = Math.ceil(componentCount / columns);
  } else {
    columns = Math.min(3, componentCount);
    rows = Math.ceil(componentCount / columns);
  }
  
  const componentWidth = Math.floor((availableWidth - (columns - 1) * 10) / columns);
  const componentHeight = Math.floor((availableHeight - (rows - 1) * 10) / rows);
  
  const positions: Array<{ x: number; y: number; width: number; height: number }> = [];
  
  for (let i = 0; i < componentCount; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    
    positions.push({
      x: safeArea.left + col * (componentWidth + 10),
      y: safeArea.top + row * (componentHeight + 10),
      width: componentWidth,
      height: componentHeight,
    });
  }
  
  return positions;
};
