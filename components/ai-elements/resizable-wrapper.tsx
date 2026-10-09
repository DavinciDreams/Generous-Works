"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Lock, Unlock } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// ============================================================================
// Type Definitions
// ============================================================================

export type ResizeHandlePosition =
  | "nw"
  | "n"
  | "ne"
  | "e"
  | "se"
  | "s"
  | "sw"
  | "w";

export interface ResizableWrapperProps extends HTMLAttributes<HTMLDivElement> {
  /** Component ID for state preservation */
  id: string;
  /** Child component to wrap */
  children: ReactNode;
  /** Initial size */
  initialSize?: { width: number; height: number };
  /** Minimum size constraints */
  minSize?: { width: number; height: number };
  /** Maximum size constraints */
  maxSize?: { width: number; height: number };
  /** Whether resize is initially locked */
  initiallyLocked?: boolean;
  /** Which resize handles to show */
  resizeHandles?: ResizeHandlePosition[];
  /** Callback when size changes */
  onSizeChange?: (size: { width: number; height: number }) => void;
  /** Callback when resize starts */
  onResizeStart?: () => void;
  /** Callback when resize ends */
  onResizeEnd?: () => void;
  /** Show lock toggle button */
  showLockToggle?: boolean;
  /** Custom class name for the wrapper */
  className?: string;
  /** Z-index for the component */
  zIndex?: number;
  /** Maintain aspect ratio */
  maintainAspectRatio?: boolean;
  /** Aspect ratio (width/height) */
  aspectRatio?: number;
  /** Enable touch support (default: true) */
  enableTouch?: boolean;
  /** Minimum resize distance in pixels */
  resizeThreshold?: number;
  /** Enable mobile-specific optimizations */
  enableMobileOptimizations?: boolean;
  /** Touch action override */
  touchAction?: "none" | "pan-x" | "pan-y" | "manipulation";
}

export interface ResizableState {
  size: { width: number; height: number };
  isResizing: boolean;
  isLocked: boolean;
  activeHandle: ResizeHandlePosition | null;
}

// ============================================================================
// Resize Handle Component
// ============================================================================

interface ResizeHandleProps {
  position: ResizeHandlePosition;
  isLocked: boolean;
  onMouseDown: (e: React.MouseEvent, position: ResizeHandlePosition) => void;
  onTouchStart: (e: React.TouchEvent, position: ResizeHandlePosition) => void;
  isActive: boolean;
  isTouchDevice: boolean;
  enableMobileOptimizations: boolean;
}

const ResizeHandle = ({
  position,
  isLocked,
  onMouseDown,
  onTouchStart,
  isActive,
  isTouchDevice,
  enableMobileOptimizations,
}: ResizeHandleProps) => {
  const getHandleStyles = (): React.CSSProperties => {
    const handleSize = isTouchDevice && enableMobileOptimizations ? 24 : 12;
    const handleOffset = handleSize / 2;
    
    const baseStyles: React.CSSProperties = {
      position: "absolute",
      width: `${handleSize}px`,
      height: `${handleSize}px`,
      backgroundColor: "hsl(var(--background))",
      border: "2px solid hsl(var(--primary))",
      borderRadius: isTouchDevice ? "4px" : "2px",
      zIndex: 20,
      transition: isActive ? "none" : "background-color 0.2s, border-color 0.2s",
      touchAction: "none",
    };

    const positionStyles: Record<ResizeHandlePosition, React.CSSProperties> = {
      nw: { top: `-${handleOffset}px`, left: `-${handleOffset}px`, cursor: "nw-resize" },
      n: { top: `-${handleOffset}px`, left: "50%", transform: "translateX(-50%)", cursor: "n-resize" },
      ne: { top: `-${handleOffset}px`, right: `-${handleOffset}px`, cursor: "ne-resize" },
      e: { top: "50%", right: `-${handleOffset}px`, transform: "translateY(-50%)", cursor: "e-resize" },
      se: { bottom: `-${handleOffset}px`, right: `-${handleOffset}px`, cursor: "se-resize" },
      s: { bottom: `-${handleOffset}px`, left: "50%", transform: "translateX(-50%)", cursor: "s-resize" },
      sw: { bottom: `-${handleOffset}px`, left: `-${handleOffset}px`, cursor: "sw-resize" },
      w: { top: "50%", left: `-${handleOffset}px`, transform: "translateY(-50%)", cursor: "w-resize" },
    };

    return {
      ...baseStyles,
      ...positionStyles[position],
      opacity: isActive || isTouchDevice ? 1 : 0,
      pointerEvents: isLocked ? "none" : "auto",
      ...(isTouchDevice && {
        minWidth: "44px",
        minHeight: "44px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }),
    };
  };

  return (
    <div
      className="resize-handle group"
      style={getHandleStyles()}
      onMouseDown={(e) => !isLocked && onMouseDown(e, position)}
      onTouchStart={(e) => !isLocked && onTouchStart(e, position)}
      aria-label={`Resize ${position}`}
    />
  );
};

// ============================================================================
// ResizableWrapper Component
// ============================================================================

/**
 * ResizableWrapper - A wrapper component that makes its children resizable
 * 
 * Features:
 * - Smooth resize behavior with drag handles (corners and edges)
 * - Lock/unlock functionality
 * - Minimum and maximum size constraints
 * - Visual feedback during resize
 * - Aspect ratio maintenance
 * - Size persistence via callbacks
 */
export const ResizableWrapper = forwardRef<HTMLDivElement, ResizableWrapperProps>(
  (
    {
      id,
      children,
      initialSize = { width: 400, height: 300 },
      minSize = { width: 200, height: 150 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      resizeHandles = ["nw", "ne", "sw", "se", "n", "s", "e", "w"],
      onSizeChange,
      onResizeStart,
      onResizeEnd,
      showLockToggle = true,
      className,
      zIndex = 10,
      maintainAspectRatio = false,
      aspectRatio,
      enableTouch = true,
      resizeThreshold = 5,
      enableMobileOptimizations = true,
      touchAction = "none",
      style,
      ...props
    },
    ref
  ) => {
    // State
    const [size, setSize] = useState(initialSize);
    const [isResizing, setIsResizing] = useState(false);
    const [isLocked, setIsLocked] = useState(initiallyLocked);
    const [activeHandle, setActiveHandle] = useState<ResizeHandlePosition | null>(null);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Refs
    const wrapperRef = useRef<HTMLDivElement>(null);
    const resizeStartRef = useRef<{
      x: number;
      y: number;
      width: number;
      height: number;
      handle: ResizeHandlePosition;
      startX: number;
      startY: number;
    } | null>(null);
    const sizeRef = useRef(size);
    const hasMovedRef = useRef(false);

    // Detect touch device
    useEffect(() => {
      setIsTouchDevice(
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - deprecated but still useful for detection
        navigator.msMaxTouchPoints > 0
      );
    }, []);

    // Calculate aspect ratio if not provided
    const calculatedAspectRatio = aspectRatio ?? initialSize.width / initialSize.height;

    // Sync size ref with state
    useEffect(() => {
      sizeRef.current = size;
    }, [size]);

    // Handle size updates from parent
    useEffect(() => {
      if (initialSize.width !== size.width || initialSize.height !== size.height) {
        setSize(initialSize);
      }
    }, [initialSize]);

    // Handle resize start
    const handleResizeStart = useCallback(
      (clientX: number, clientY: number, handle: ResizeHandlePosition) => {
        if (isLocked) return;

        setIsResizing(true);
        setActiveHandle(handle);
        hasMovedRef.current = false;
        resizeStartRef.current = {
          x: clientX,
          y: clientY,
          width: sizeRef.current.width,
          height: sizeRef.current.height,
          handle,
          startX: clientX,
          startY: clientY,
        };

        onResizeStart?.();
      },
      [isLocked, onResizeStart]
    );

    // Handle resize move
    const handleResizeMove = useCallback(
      (clientX: number, clientY: number) => {
        if (!isResizing || !resizeStartRef.current || isLocked) return;

        // Check if resize threshold has been met
        const thresholdDeltaX = Math.abs(clientX - resizeStartRef.current.startX);
        const thresholdDeltaY = Math.abs(clientY - resizeStartRef.current.startY);
        
        if (!hasMovedRef.current && (thresholdDeltaX < resizeThreshold && thresholdDeltaY < resizeThreshold)) {
          return;
        }
        
        hasMovedRef.current = true;

        const { x: startX, y: startY, width: startWidth, height: startHeight, handle } = resizeStartRef.current;
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        // Calculate new size based on handle position
        switch (handle) {
          case "se":
            newWidth = startWidth + deltaX;
            newHeight = startHeight + deltaY;
            break;
          case "sw":
            newWidth = startWidth - deltaX;
            newHeight = startHeight + deltaY;
            break;
          case "ne":
            newWidth = startWidth + deltaX;
            newHeight = startHeight - deltaY;
            break;
          case "nw":
            newWidth = startWidth - deltaX;
            newHeight = startHeight - deltaY;
            break;
          case "n":
            newHeight = startHeight - deltaY;
            break;
          case "s":
            newHeight = startHeight + deltaY;
            break;
          case "e":
            newWidth = startWidth + deltaX;
            break;
          case "w":
            newWidth = startWidth - deltaX;
            break;
        }

        // Apply aspect ratio if enabled
        if (maintainAspectRatio) {
          if (["nw", "ne", "sw", "se"].includes(handle)) {
            // For corner handles, use the larger dimension to maintain aspect ratio
            const widthRatio = newWidth / calculatedAspectRatio;
            const heightRatio = newHeight * calculatedAspectRatio;

            if (Math.abs(newWidth - widthRatio) > Math.abs(newHeight - heightRatio)) {
              newHeight = newWidth / calculatedAspectRatio;
            } else {
              newWidth = newHeight * calculatedAspectRatio;
            }
          } else if (["e", "w"].includes(handle)) {
            // For horizontal handles, adjust height based on width
            newHeight = newWidth / calculatedAspectRatio;
          } else {
            // For vertical handles, adjust width based on height
            newWidth = newHeight * calculatedAspectRatio;
          }
        }

        // Apply size constraints
        const constrainedWidth = Math.max(minSize.width, Math.min(maxSize.width, newWidth));
        const constrainedHeight = Math.max(minSize.height, Math.min(maxSize.height, newHeight));

        setSize({ width: constrainedWidth, height: constrainedHeight });
        onSizeChange?.({ width: constrainedWidth, height: constrainedHeight });
      },
      [
        isResizing,
        isLocked,
        minSize,
        maxSize,
        maintainAspectRatio,
        calculatedAspectRatio,
        onSizeChange,
        resizeThreshold,
      ]
    );

    // Handle resize end
    const handleResizeEnd = useCallback(() => {
      if (!isResizing) return;

      setIsResizing(false);
      setActiveHandle(null);
      resizeStartRef.current = null;
      hasMovedRef.current = false;
      onResizeEnd?.();
    }, [isResizing, onResizeEnd]);

    // Mouse event handlers for handles
    const handleHandleMouseDown = useCallback(
      (e: React.MouseEvent, handle: ResizeHandlePosition) => {
        e.stopPropagation();
        e.preventDefault();
        handleResizeStart(e.clientX, e.clientY, handle);
      },
      [handleResizeStart]
    );

    // Touch event handlers for handles
    const handleHandleTouchStart = useCallback(
      (e: React.TouchEvent, handle: ResizeHandlePosition) => {
        if (!enableTouch) return;
        
        e.stopPropagation();
        const touch = e.touches[0];
        handleResizeStart(touch.clientX, touch.clientY, handle);
      },
      [handleResizeStart, enableTouch]
    );

    // Global mouse move handler
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        handleResizeMove(e.clientX, e.clientY);
      };

      const handleMouseUp = () => {
        handleResizeEnd();
      };

      if (isResizing) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isResizing, handleResizeMove, handleResizeEnd]);

    // Global touch move handler
    useEffect(() => {
      const handleTouchMove = (e: TouchEvent) => {
        if (!enableTouch) return;
        
        const touch = e.touches[0];
        handleResizeMove(touch.clientX, touch.clientY);
      };

      const handleTouchEnd = () => {
        handleResizeEnd();
      };

      if (isResizing && enableTouch) {
        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("touchend", handleTouchEnd);
        document.addEventListener("touchcancel", handleTouchEnd);
      }

      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        document.removeEventListener("touchcancel", handleTouchEnd);
      };
    }, [isResizing, handleResizeMove, handleResizeEnd, enableTouch]);

    // Toggle lock
    const toggleLock = useCallback(() => {
      setIsLocked((prev) => !prev);
    }, []);

    // Merge refs
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        wrapperRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // Get mobile-specific styles
    const getMobileStyles = useCallback(() => {
      if (!enableMobileOptimizations || !isTouchDevice) return {};
      
      return {
        touchAction,
        WebkitTouchCallout: "none" as const,
        WebkitUserSelect: "none" as const,
        userSelect: "none" as const,
      };
    }, [enableMobileOptimizations, isTouchDevice, touchAction]);

    // Get touch-friendly button size
    const getButtonSize = useCallback(() => {
      if (!enableMobileOptimizations || !isTouchDevice) return "p-1";
      return "p-3";
    }, [enableMobileOptimizations, isTouchDevice]);

    // Get touch-friendly icon size
    const getIconSize = useCallback(() => {
      if (!enableMobileOptimizations || !isTouchDevice) return 16;
      return 24;
    }, [enableMobileOptimizations, isTouchDevice]);

    return (
      <div
        ref={setRefs}
        className={cn(
          "relative transition-shadow duration-200",
          isResizing && "shadow-2xl",
          !isLocked && "group-hover:shadow-lg",
          isTouchDevice && "touch-none",
          className
        )}
        style={{
          width: size.width,
          height: size.height,
          zIndex,
          ...getMobileStyles(),
          ...style,
        }}
        data-resizable-id={id}
        data-resizable-locked={isLocked}
        {...props}
      >
        {/* Resize handles */}
        {!isLocked &&
          resizeHandles.map((handle) => (
            <ResizeHandle
              key={handle}
              position={handle}
              isLocked={isLocked}
              onMouseDown={handleHandleMouseDown}
              onTouchStart={handleHandleTouchStart}
              isActive={activeHandle === handle}
              isTouchDevice={isTouchDevice}
              enableMobileOptimizations={enableMobileOptimizations}
            />
          ))}

        {/* Lock toggle */}
        {showLockToggle && (
          <button
            type="button"
            onClick={toggleLock}
            className={cn(
              "absolute top-2 right-2 bg-background/80 hover:bg-background rounded shadow transition-colors z-10",
              getButtonSize(),
              isTouchDevice && "min-w-[44px] min-h-[44px] flex items-center justify-center"
            )}
            aria-label={isLocked ? "Unlock" : "Lock"}
          >
            {isLocked ? <Lock size={getIconSize()} /> : <Unlock size={getIconSize()} />}
          </button>
        )}

        {/* Children */}
        <div className="h-full w-full overflow-hidden">{children}</div>
      </div>
    );
  }
);

ResizableWrapper.displayName = "ResizableWrapper";

// ============================================================================
// Exports
// ============================================================================

export default ResizableWrapper;
