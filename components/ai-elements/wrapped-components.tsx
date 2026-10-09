"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { Charts } from "./charts";
import { Timeline } from "./timeline";
import { Maps } from "./maps";
import { ThreeScene } from "./threescene";
import { KnowledgeGraph } from "./knowledge-graph";
import { DataTable } from "./datatable";
import { CodeEditor } from "./codeeditor";
import { Markdown } from "./markdown";
import { Calendar } from "./calendar";
import { Geospatial } from "./geospatial";
import { ImageGallery } from "./imagegallery";
import { JSONViewer } from "./jsonviewer";
import { Latex } from "./latex";
import { Mermaid } from "./mermaid";
import { ModelViewer } from "./model-viewer";
import { NodeEditor } from "./node-editor";
import { Phaser } from "./phaser";
import { Remotion } from "./remotion";
import { SVGPreview } from "./svg-preview";
import { VRM } from "./vrm";
import { WYSIWYG } from "./wysiwyg";
import { DraggableWrapper } from "./draggable-wrapper";
import { ResizableWrapper } from "./resizable-wrapper";
import { useComponentStatePreservation } from "@/hooks/use-component-state-preservation";
import { forwardRef, useEffect, useState } from "react";
import type { ChartsData, ChartsOptions } from "@/lib/schemas/charts.schema";

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

// ============================================================================
// Wrapped Charts Component
// ============================================================================

export interface WrappedChartsProps extends WrappedComponentProps {
  data: ChartsData;
  options?: ChartsOptions;
  children?: ReactNode;
}

const WrappedChartsComponent = forwardRef<HTMLDivElement, WrappedChartsProps>(
  (
    {
      id,
      data,
      options,
      children,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 600, height: 400 },
      minSize = { width: 300, height: 200 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <Charts data={data} options={options}>
            {children}
          </Charts>
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedChartsComponent.displayName = "WrappedChartsComponent";

// ============================================================================
// Wrapped Timeline Component
// ============================================================================

export interface WrappedTimelineProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedTimelineComponent = forwardRef<HTMLDivElement, WrappedTimelineProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 800, height: 500 },
      minSize = { width: 400, height: 300 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <Timeline data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedTimelineComponent.displayName = "WrappedTimelineComponent";

// ============================================================================
// Wrapped Maps Component
// ============================================================================

export interface WrappedMapsProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedMapsComponent = forwardRef<HTMLDivElement, WrappedMapsProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 600, height: 400 },
      minSize = { width: 300, height: 200 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <Maps data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedMapsComponent.displayName = "WrappedMapsComponent";

// ============================================================================
// Wrapped ThreeScene Component
// ============================================================================

export interface WrappedThreeSceneProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedThreeSceneComponent = forwardRef<HTMLDivElement, WrappedThreeSceneProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 600, height: 400 },
      minSize = { width: 300, height: 200 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <ThreeScene data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedThreeSceneComponent.displayName = "WrappedThreeSceneComponent";

// ============================================================================
// Wrapped KnowledgeGraph Component
// ============================================================================

export interface WrappedKnowledgeGraphProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedKnowledgeGraphComponent = forwardRef<HTMLDivElement, WrappedKnowledgeGraphProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 600, height: 400 },
      minSize = { width: 300, height: 200 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <KnowledgeGraph data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedKnowledgeGraphComponent.displayName = "WrappedKnowledgeGraphComponent";

// ============================================================================
// Wrapped DataTable Component
// ============================================================================

export interface WrappedDataTableProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedDataTableComponent = forwardRef<HTMLDivElement, WrappedDataTableProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 800, height: 500 },
      minSize = { width: 400, height: 300 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <DataTable data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedDataTableComponent.displayName = "WrappedDataTableComponent";

// ============================================================================
// Wrapped CodeEditor Component
// ============================================================================

export interface WrappedCodeEditorProps extends Omit<WrappedComponentProps, "onChange"> {
  data: any;
  options?: any;
  onCodeChange?: (code: string) => void;
}

const WrappedCodeEditorComponent = forwardRef<HTMLDivElement, WrappedCodeEditorProps>(
  (
    {
      id,
      data,
      options,
      onCodeChange,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 600, height: 400 },
      minSize = { width: 300, height: 200 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <CodeEditor data={data} options={options} onChange={onCodeChange} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedCodeEditorComponent.displayName = "WrappedCodeEditorComponent";

// ============================================================================
// Wrapped Markdown Component
// ============================================================================

export interface WrappedMarkdownProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedMarkdownComponent = forwardRef<HTMLDivElement, WrappedMarkdownProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 600, height: 400 },
      minSize = { width: 300, height: 200 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <Markdown data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedMarkdownComponent.displayName = "WrappedMarkdownComponent";

// ============================================================================
// Wrapped Calendar Component
// ============================================================================

export interface WrappedCalendarProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedCalendarComponent = forwardRef<HTMLDivElement, WrappedCalendarProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 800, height: 600 },
      minSize = { width: 400, height: 300 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <Calendar data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedCalendarComponent.displayName = "WrappedCalendarComponent";

// ============================================================================
// Wrapped Geospatial Component
// ============================================================================

export interface WrappedGeospatialProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedGeospatialComponent = forwardRef<HTMLDivElement, WrappedGeospatialProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 800, height: 600 },
      minSize = { width: 400, height: 300 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <Geospatial data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedGeospatialComponent.displayName = "WrappedGeospatialComponent";

// ============================================================================
// Wrapped ImageGallery Component
// ============================================================================

export interface WrappedImageGalleryProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedImageGalleryComponent = forwardRef<HTMLDivElement, WrappedImageGalleryProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 800, height: 600 },
      minSize = { width: 300, height: 200 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <ImageGallery data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedImageGalleryComponent.displayName = "WrappedImageGalleryComponent";

// ============================================================================
// Wrapped JSONViewer Component
// ============================================================================

export interface WrappedJSONViewerProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedJSONViewerComponent = forwardRef<HTMLDivElement, WrappedJSONViewerProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 600, height: 400 },
      minSize = { width: 300, height: 200 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <JSONViewer data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedJSONViewerComponent.displayName = "WrappedJSONViewerComponent";

// ============================================================================
// Wrapped Latex Component
// ============================================================================

export interface WrappedLatexProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedLatexComponent = forwardRef<HTMLDivElement, WrappedLatexProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 600, height: 400 },
      minSize = { width: 300, height: 200 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <Latex data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedLatexComponent.displayName = "WrappedLatexComponent";

// ============================================================================
// Wrapped Mermaid Component
// ============================================================================

export interface WrappedMermaidProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedMermaidComponent = forwardRef<HTMLDivElement, WrappedMermaidProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 800, height: 600 },
      minSize = { width: 400, height: 300 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <Mermaid data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedMermaidComponent.displayName = "WrappedMermaidComponent";

// ============================================================================
// Wrapped ModelViewer Component
// ============================================================================

export interface WrappedModelViewerProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedModelViewerComponent = forwardRef<HTMLDivElement, WrappedModelViewerProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 600, height: 500 },
      minSize = { width: 300, height: 250 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <ModelViewer data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedModelViewerComponent.displayName = "WrappedModelViewerComponent";

// ============================================================================
// Wrapped NodeEditor Component
// ============================================================================

export interface WrappedNodeEditorProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedNodeEditorComponent = forwardRef<HTMLDivElement, WrappedNodeEditorProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 800, height: 600 },
      minSize = { width: 400, height: 300 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <NodeEditor data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedNodeEditorComponent.displayName = "WrappedNodeEditorComponent";

// ============================================================================
// Wrapped Phaser Component
// ============================================================================

export interface WrappedPhaserProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedPhaserComponent = forwardRef<HTMLDivElement, WrappedPhaserProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 800, height: 600 },
      minSize = { width: 400, height: 300 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = true,
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
          <Phaser data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedPhaserComponent.displayName = "WrappedPhaserComponent";

// ============================================================================
// Wrapped Remotion Component
// ============================================================================

export interface WrappedRemotionProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedRemotionComponent = forwardRef<HTMLDivElement, WrappedRemotionProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 800, height: 450 },
      minSize = { width: 400, height: 225 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = true,
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
          <Remotion data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedRemotionComponent.displayName = "WrappedRemotionComponent";

// ============================================================================
// Wrapped SVGPreview Component
// ============================================================================

export interface WrappedSVGPreviewProps extends WrappedComponentProps {
  svg: string;
  title?: string;
  filename?: string;
}

const WrappedSVGPreviewComponent = forwardRef<HTMLDivElement, WrappedSVGPreviewProps>(
  (
    {
      id,
      svg,
      title,
      filename,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 600, height: 400 },
      minSize = { width: 300, height: 200 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <SVGPreview svg={svg} title={title} filename={filename} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedSVGPreviewComponent.displayName = "WrappedSVGPreviewComponent";

// ============================================================================
// Wrapped VRM Component
// ============================================================================

export interface WrappedVRMProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedVRMComponent = forwardRef<HTMLDivElement, WrappedVRMProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 600, height: 700 },
      minSize = { width: 300, height: 350 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <VRM data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedVRMComponent.displayName = "WrappedVRMComponent";

// ============================================================================
// Wrapped WYSIWYG Component
// ============================================================================

export interface WrappedWYSIWYGProps extends WrappedComponentProps {
  data: any;
  options?: any;
}

const WrappedWYSIWYGComponent = forwardRef<HTMLDivElement, WrappedWYSIWYGProps>(
  (
    {
      id,
      data,
      options,
      initialPosition = { x: 0, y: 0 },
      initialSize = { width: 800, height: 600 },
      minSize = { width: 400, height: 300 },
      maxSize = { width: Infinity, height: Infinity },
      initiallyLocked = false,
      showLockToggle = true,
      zIndex = 10,
      boundaryId,
      maintainAspectRatio = false,
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
          <WYSIWYG data={data} options={options} />
        </ResizableWrapper>
      </DraggableWrapper>
    );
  }
);

WrappedWYSIWYGComponent.displayName = "WrappedWYSIWYGComponent";

// ============================================================================
// Exports
// ============================================================================

export const WrappedCharts = WrappedChartsComponent;
export const WrappedTimeline = WrappedTimelineComponent;
export const WrappedMaps = WrappedMapsComponent;
export const WrappedThreeScene = WrappedThreeSceneComponent;
export const WrappedKnowledgeGraph = WrappedKnowledgeGraphComponent;
export const WrappedDataTable = WrappedDataTableComponent;
export const WrappedCodeEditor = WrappedCodeEditorComponent;
export const WrappedMarkdown = WrappedMarkdownComponent;
export const WrappedCalendar = WrappedCalendarComponent;
export const WrappedGeospatial = WrappedGeospatialComponent;
export const WrappedImageGallery = WrappedImageGalleryComponent;
export const WrappedJSONViewer = WrappedJSONViewerComponent;
export const WrappedLatex = WrappedLatexComponent;
export const WrappedMermaid = WrappedMermaidComponent;
export const WrappedModelViewer = WrappedModelViewerComponent;
export const WrappedNodeEditor = WrappedNodeEditorComponent;
export const WrappedPhaser = WrappedPhaserComponent;
export const WrappedRemotion = WrappedRemotionComponent;
export const WrappedSVGPreview = WrappedSVGPreviewComponent;
export const WrappedVRM = WrappedVRMComponent;
export const WrappedWYSIWYG = WrappedWYSIWYGComponent;
