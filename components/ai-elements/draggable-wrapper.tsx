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

export interface DraggableWrapperProps extends HTMLAttributes<HTMLDivElement> {
  /** Component ID for state preservation */
  id: string;
  /** Child component to wrap */
  children: ReactNode;
  /** Initial position */
  initialPosition?: { x: number; y: number };
  /** Whether drag is initially locked */
  initiallyLocked?: boolean;
  /** Minimum position constraints */
  minPosition?: { x: number; y: number };
  /** Maximum position constraints */
  maxPosition?: { x: number; y: number };
  /** Boundary element ID or ref */
  boundaryId?: string;
  /** Callback when position changes */
  onPositionChange?: (position: { x: number; y: number }) => void;
  /** Callback when drag starts */
  onDragStart?: () => void;
  /** Callback when drag ends */
  onDragEnd?: () => void;
  /** Custom drag handle */
  dragHandle?: ReactNode;
  /** Show lock toggle button */
  showLockToggle?: boolean;
  /** Custom class name for the wrapper */
  className?: string;
  /** Z-index for the component */
  zIndex?: number;
  /** Enable touch support (default: true) */
  enableTouch?: boolean;
  /** Touch action override */
  touchAction?: "none" | "pan-x" | "pan-y" | "manipulation";
  /** Minimum drag distance in pixels */
  dragThreshold?: number;
  /** Enable mobile-specific optimizations */
  enableMobileOptimizations?: boolean;
}

export interface DraggableState {
  position: { x: number; y: number };
  isDragging: boolean;
  isLocked: boolean;
}

// ============================================================================
// DraggableWrapper Component
// ============================================================================

/**
 * DraggableWrapper - A wrapper component that makes its children draggable
 * 
 * Features:
 * - Smooth drag behavior with mouse/touch events
 * - Lock/unlock functionality
 * - Boundary constraints
 * - Visual feedback during drag
 * - Position persistence via callbacks
 */
export const DraggableWrapper = forwardRef<HTMLDivElement, DraggableWrapperProps>(
  (
    {
      id,
      children,
      initialPosition = { x: 0, y: 0 },
      initiallyLocked = false,
      minPosition = { x: -Infinity, y: -Infinity },
      maxPosition = { x: Infinity, y: Infinity },
      boundaryId,
      onPositionChange,
      onDragStart,
      onDragEnd,
      dragHandle,
      showLockToggle = true,
      className,
      zIndex = 10,
      enableTouch = true,
      touchAction = "none",
      dragThreshold = 5,
      enableMobileOptimizations = true,
      style,
      ...props
    },
    ref
  ) => {
    // State
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isLocked, setIsLocked] = useState(initiallyLocked);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Refs
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
    const positionRef = useRef(position);
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

    // Sync position ref with state
    useEffect(() => {
      positionRef.current = position;
    }, [position]);

    // Handle position updates from parent
    useEffect(() => {
      if (initialPosition.x !== position.x || initialPosition.y !== position.y) {
        setPosition(initialPosition);
      }
    }, [initialPosition]);

    // Get boundary constraints
    const getBoundaryConstraints = useCallback(() => {
      if (!boundaryId) return { minX: minPosition.x, minY: minPosition.y, maxX: maxPosition.x, maxY: maxPosition.y };

      const boundary = document.getElementById(boundaryId);
      if (!boundary || !wrapperRef.current) {
        return { minX: minPosition.x, minY: minPosition.y, maxX: maxPosition.x, maxY: maxPosition.y };
      }

      const boundaryRect = boundary.getBoundingClientRect();
      const wrapperRect = wrapperRef.current.getBoundingClientRect();

      return {
        minX: minPosition.x,
        minY: minPosition.y,
        maxX: maxPosition.x === Infinity ? boundaryRect.width - wrapperRect.width : maxPosition.x,
        maxY: maxPosition.y === Infinity ? boundaryRect.height - wrapperRect.height : maxPosition.y,
      };
    }, [boundaryId, minPosition, maxPosition]);

    // Handle drag start
    const handleDragStart = useCallback(
      (clientX: number, clientY: number) => {
        if (isLocked) return;

        setIsDragging(true);
        hasMovedRef.current = false;
        dragStartRef.current = {
          x: clientX - positionRef.current.x,
          y: clientY - positionRef.current.y,
          startX: clientX,
          startY: clientY,
        };

        onDragStart?.();
      },
      [isLocked, onDragStart]
    );

    // Handle drag move
    const handleDragMove = useCallback(
      (clientX: number, clientY: number) => {
        if (!isDragging || !dragStartRef.current || isLocked) return;

        // Check if drag threshold has been met
        const deltaX = Math.abs(clientX - dragStartRef.current.startX);
        const deltaY = Math.abs(clientY - dragStartRef.current.startY);
        
        if (!hasMovedRef.current && (deltaX < dragThreshold && deltaY < dragThreshold)) {
          return;
        }
        
        hasMovedRef.current = true;

        const newX = clientX - dragStartRef.current.x;
        const newY = clientY - dragStartRef.current.y;

        const constraints = getBoundaryConstraints();
        const constrainedX = Math.max(constraints.minX, Math.min(constraints.maxX, newX));
        const constrainedY = Math.max(constraints.minY, Math.min(constraints.maxY, newY));

        setPosition({ x: constrainedX, y: constrainedY });
        onPositionChange?.({ x: constrainedX, y: constrainedY });
      },
      [isDragging, isLocked, getBoundaryConstraints, onPositionChange, dragThreshold]
    );

    // Handle drag end
    const handleDragEnd = useCallback(() => {
      if (!isDragging) return;

      setIsDragging(false);
      dragStartRef.current = null;
      hasMovedRef.current = false;
      onDragEnd?.();
    }, [isDragging, onDragEnd]);

    // Mouse event handlers
    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        // Only left mouse button
        if (e.button !== 0) return;

        handleDragStart(e.clientX, e.clientY);
      },
      [handleDragStart]
    );

    // Touch event handlers
    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (!enableTouch) return;
        
        const touch = e.touches[0];
        handleDragStart(touch.clientX, touch.clientY);
      },
      [handleDragStart, enableTouch]
    );

    // Global mouse move handler
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        handleDragMove(e.clientX, e.clientY);
      };

      const handleMouseUp = () => {
        handleDragEnd();
      };

      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, handleDragMove, handleDragEnd]);

    // Global touch move handler
    useEffect(() => {
      const handleTouchMove = (e: TouchEvent) => {
        if (!enableTouch) return;
        
        const touch = e.touches[0];
        handleDragMove(touch.clientX, touch.clientY);
      };

      const handleTouchEnd = () => {
        handleDragEnd();
      };

      if (isDragging && enableTouch) {
        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("touchend", handleTouchEnd);
        document.addEventListener("touchcancel", handleTouchEnd);
      }

      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        document.removeEventListener("touchcancel", handleTouchEnd);
      };
    }, [isDragging, handleDragMove, handleDragEnd, enableTouch]);

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
          "absolute transition-shadow duration-200",
          isDragging && "shadow-2xl",
          isLocked ? "cursor-not-allowed" : "cursor-move",
          isTouchDevice && "touch-none",
          className
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          zIndex,
          ...getMobileStyles(),
          ...style,
        }}
        data-draggable-id={id}
        data-draggable-locked={isLocked}
        {...props}
      >
        {/* Drag handle */}
        {dragHandle ? (
          <div
            className={cn(
              "flex items-center justify-between p-2 bg-muted/50 border-b",
              isLocked ? "cursor-not-allowed" : "cursor-move",
              isTouchDevice && "min-h-[44px]"
            )}
            onMouseDown={!isLocked ? handleMouseDown : undefined}
            onTouchStart={!isLocked ? handleTouchStart : undefined}
          >
            {dragHandle}
            {showLockToggle && (
              <button
                type="button"
                onClick={toggleLock}
                className={cn(
                  getButtonSize(),
                  "hover:bg-muted rounded transition-colors",
                  isTouchDevice && "min-w-[44px] min-h-[44px] flex items-center justify-center"
                )}
                aria-label={isLocked ? "Unlock" : "Lock"}
              >
                {isLocked ? <Lock size={getIconSize()} /> : <Unlock size={getIconSize()} />}
              </button>
            )}
          </div>
        ) : (
          showLockToggle && (
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
          )
        )}

        {/* Children */}
        {!dragHandle && (
          <div
            className={cn("h-full w-full", isLocked ? "pointer-events-none" : "")}
            onMouseDown={!isLocked ? handleMouseDown : undefined}
            onTouchStart={!isLocked ? handleTouchStart : undefined}
          >
            {children}
          </div>
        )}

        {dragHandle && (
          <div className={cn("h-full w-full", isLocked ? "pointer-events-none" : "")}>
            {children}
          </div>
        )}
      </div>
    );
  }
);

DraggableWrapper.displayName = "DraggableWrapper";

// ============================================================================
// Exports
// ============================================================================

export default DraggableWrapper;
