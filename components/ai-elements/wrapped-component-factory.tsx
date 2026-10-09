"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef, useEffect, useState } from "react";
import { DraggableWrapper } from "./draggable-wrapper";
import { ResizableWrapper } from "./resizable-wrapper";
import { useComponentStatePreservation } from "@/hooks/use-component-state-preservation";

// ============================================================================
// Type Definitions
// ============================================================================

export interface WrappedComponentProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onDragStart" | "onDragEnd"> {
  /** Component ID for state preservation */
  id: string;
  /** Initial position */
  initialPosition?: { x: number; y: number };
  /** Initial size */
  initialSize?: { width: number; height: number };
  /** Minimum size */
  minSize?: { width: number; height: number };
  /** Maximum size */
  maxSize?: { width: number; height: number };
  /** Initially locked */
  initiallyLocked?: boolean;
  /** Show lock toggle */
  showLockToggle?: boolean;
  /** Z-index */
  zIndex?: number;
  /** Boundary element ID */
  boundaryId?: string;
  /** Maintain aspect ratio */
  maintainAspectRatio?: boolean;
}

export interface WrappedComponentConfig {
  /** Default initial size */
  defaultInitialSize: { width: number; height: number };
  /** Default minimum size */
  defaultMinSize: { width: number; height: number };
  /** Default maximum size */
  defaultMaxSize: { width: number; height: number };
  /** Whether to maintain aspect ratio by default */
  defaultMaintainAspectRatio?: boolean;
  /** Responsive breakpoints */
  responsiveBreakpoints?: {
    sm?: { width: number; height: number };
    md?: { width: number; height: number };
    lg?: { width: number; height: number };
    xl?: { width: number; height: number };
  };
}

// ============================================================================
// Component Factory
// ============================================================================

/**
 * Creates a wrapped component with draggable and resizable functionality
 * @param Component The component to wrap
 * @param config Configuration for the wrapped component
 * @returns A wrapped component with drag/resize capabilities
 */
export function createWrappedComponent<P extends WrappedComponentProps>(
  Component: React.ComponentType<P>,
  config: WrappedComponentConfig
) {
  const WrappedComponent = forwardRef<HTMLDivElement, P>(
    (
      {
        id,
        initialPosition = { x: 0, y: 0 },
        initialSize = config.defaultInitialSize,
        minSize = config.defaultMinSize,
        maxSize = config.defaultMaxSize,
        initiallyLocked = false,
        showLockToggle = true,
        zIndex = 10,
        boundaryId,
        maintainAspectRatio = config.defaultMaintainAspectRatio || false,
        className,
        ...props
      },
      ref
    ) => {
      const { state, updateState } = useComponentStatePreservation({ id });

      const [position, setPosition] = useState(initialPosition);
      const [size, setSize] = useState(initialSize);
      const [isLocked, setIsLocked] = useState(initiallyLocked);

      // Restore state on mount
      useEffect(() => {
        if (state) {
          setPosition(state.position);
          setSize(state.size);
          setIsLocked(state.isLocked);
        }
      }, [state]);

      // Handle position changes
      const handlePositionChange = (newPosition: { x: number; y: number }) => {
        setPosition(newPosition);
        updateState({ position: newPosition });
      };

      // Handle size changes
      const handleSizeChange = (newSize: { width: number; height: number }) => {
        setSize(newSize);
        updateState({ size: newSize });
      };

      // Handle lock toggle
      const handleLockToggle = () => {
        const newLocked = !isLocked;
        setIsLocked(newLocked);
        updateState({ isLocked: newLocked });
      };

      return (
        <DraggableWrapper
          id={id}
          initialPosition={position}
          initiallyLocked={isLocked}
          showLockToggle={false}
          onPositionChange={handlePositionChange}
          boundaryId={boundaryId}
          zIndex={zIndex}
          className={className}
          {...props}
        >
          <ResizableWrapper
            id={id}
            initialSize={size}
            minSize={minSize}
            maxSize={maxSize}
            initiallyLocked={isLocked}
            showLockToggle={showLockToggle}
            onSizeChange={handleSizeChange}
            maintainAspectRatio={maintainAspectRatio}
          >
            <Component {...(props as unknown as P)} />
          </ResizableWrapper>
        </DraggableWrapper>
      );
    }
  );

  WrappedComponent.displayName = `Wrapped${Component.displayName || Component.name}`;
  return WrappedComponent;
}

// ============================================================================
// Default Configurations
// ============================================================================

export const defaultConfigs: Record<string, WrappedComponentConfig> = {
  // Calendar - needs larger size for calendar views
  Calendar: {
    defaultInitialSize: { width: 800, height: 600 },
    defaultMinSize: { width: 400, height: 300 },
    defaultMaxSize: { width: Infinity, height: Infinity },
  },

  // Geospatial - needs larger size for map visualization
  Geospatial: {
    defaultInitialSize: { width: 800, height: 600 },
    defaultMinSize: { width: 400, height: 300 },
    defaultMaxSize: { width: Infinity, height: Infinity },
  },

  // ImageGallery - flexible size for image grids
  ImageGallery: {
    defaultInitialSize: { width: 800, height: 600 },
    defaultMinSize: { width: 300, height: 200 },
    defaultMaxSize: { width: Infinity, height: Infinity },
  },

  // JSONViewer - needs reasonable size for JSON display
  JSONViewer: {
    defaultInitialSize: { width: 600, height: 400 },
    defaultMinSize: { width: 300, height: 200 },
    defaultMaxSize: { width: Infinity, height: Infinity },
  },

  // Latex - needs reasonable size for equation display
  Latex: {
    defaultInitialSize: { width: 600, height: 400 },
    defaultMinSize: { width: 300, height: 200 },
    defaultMaxSize: { width: Infinity, height: Infinity },
  },

  // Mermaid - needs larger size for diagrams
  Mermaid: {
    defaultInitialSize: { width: 800, height: 600 },
    defaultMinSize: { width: 400, height: 300 },
    defaultMaxSize: { width: Infinity, height: Infinity },
  },

  // ModelViewer - needs reasonable size for 3D model
  ModelViewer: {
    defaultInitialSize: { width: 600, height: 500 },
    defaultMinSize: { width: 300, height: 250 },
    defaultMaxSize: { width: Infinity, height: Infinity },
  },

  // NodeEditor - needs larger size for node graphs
  NodeEditor: {
    defaultInitialSize: { width: 800, height: 600 },
    defaultMinSize: { width: 400, height: 300 },
    defaultMaxSize: { width: Infinity, height: Infinity },
  },

  // Phaser - needs specific aspect ratio for games
  Phaser: {
    defaultInitialSize: { width: 800, height: 600 },
    defaultMinSize: { width: 400, height: 300 },
    defaultMaxSize: { width: Infinity, height: Infinity },
    defaultMaintainAspectRatio: true,
  },

  // Remotion - needs specific aspect ratio for videos
  Remotion: {
    defaultInitialSize: { width: 800, height: 450 },
    defaultMinSize: { width: 400, height: 225 },
    defaultMaxSize: { width: Infinity, height: Infinity },
    defaultMaintainAspectRatio: true,
  },

  // SVGPreview - flexible size for SVG display
  SVGPreview: {
    defaultInitialSize: { width: 600, height: 400 },
    defaultMinSize: { width: 300, height: 200 },
    defaultMaxSize: { width: Infinity, height: Infinity },
  },

  // VRM - needs reasonable size for 3D avatar
  VRM: {
    defaultInitialSize: { width: 600, height: 700 },
    defaultMinSize: { width: 300, height: 350 },
    defaultMaxSize: { width: Infinity, height: Infinity },
  },

  // WYSIWYG - needs larger size for rich text editing
  WYSIWYG: {
    defaultInitialSize: { width: 800, height: 600 },
    defaultMinSize: { width: 400, height: 300 },
    defaultMaxSize: { width: Infinity, height: Infinity },
  },
};
