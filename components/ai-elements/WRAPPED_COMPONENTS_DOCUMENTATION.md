# Wrapped Components Documentation

This document provides comprehensive documentation for all wrapped AI elements components with draggable and resizable functionality.

## Overview

All wrapped components provide:
- **Draggable**: Components can be dragged to any position within their boundary
- **Resizable**: Components can be resized to fit user needs
- **State Preservation**: Component position, size, and lock state are preserved across sessions
- **Lock Toggle**: Components can be locked to prevent accidental movement/resizing
- **Configurable Constraints**: Each component has default size constraints that can be customized

## Common Props

All wrapped components support the following common props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **Required** | Unique identifier for state preservation |
| `initialPosition` | `{ x: number; y: number }` | `{ x: 0, y: 0 }` | Initial position of the component |
| `initialSize` | `{ width: number; height: number }` | Component-specific | Initial size of the component |
| `minSize` | `{ width: number; height: number }` | Component-specific | Minimum allowed size |
| `maxSize` | `{ width: number; height: number }` | `{ width: Infinity, height: Infinity }` | Maximum allowed size |
| `initiallyLocked` | `boolean` | `false` | Whether the component starts locked |
| `showLockToggle` | `boolean` | `true` | Whether to show the lock toggle button |
| `zIndex` | `number` | `10` | Z-index for layering |
| `boundaryId` | `string` | `undefined` | ID of the boundary element for drag constraints |
| `maintainAspectRatio` | `boolean` | `false` | Whether to maintain aspect ratio when resizing |

## Wrapped Components

### Priority Components (Previously Wrapped)

#### WrappedCharts
- **Purpose**: Display charts and graphs
- **Default Size**: 600x400px
- **Min Size**: 300x200px
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: ChartsData`
- **Options Prop**: `options?: ChartsOptions`
- **Children**: Supports children for custom content

#### WrappedTimeline
- **Purpose**: Display timeline events
- **Default Size**: 800x500px
- **Min Size**: 400x300px
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any`
- **Options Prop**: `options?: any`

#### WrappedMaps
- **Purpose**: Display interactive maps
- **Default Size**: 600x400px
- **Min Size**: 300x200px
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any`
- **Options Prop**: `options?: any`

#### WrappedThreeScene
- **Purpose**: Display 3D scenes
- **Default Size**: 600x400px
- **Min Size**: 300x200px
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any`
- **Options Prop**: `options?: any`

#### WrappedKnowledgeGraph
- **Purpose**: Display knowledge graphs
- **Default Size**: 600x400px
- **Min Size**: 300x200px
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any`
- **Options Prop**: `options?: any`

#### WrappedDataTable
- **Purpose**: Display tabular data
- **Default Size**: 800x500px
- **Min Size**: 400x300px
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any`
- **Options Prop**: `options?: any`

#### WrappedCodeEditor
- **Purpose**: Edit code with syntax highlighting
- **Default Size**: 600x400px
- **Min Size**: 300x200px
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any`
- **Options Prop**: `options?: any`
- **Special Prop**: `onCodeChange?: (code: string) => void` - Callback when code changes

#### WrappedMarkdown
- **Purpose**: Display formatted markdown
- **Default Size**: 600x400px
- **Min Size**: 300x200px
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any`
- **Options Prop**: `options?: any`

### Extended Components (Phase 8)

#### WrappedCalendar
- **Purpose**: Display calendar with events
- **Default Size**: 800x600px
- **Min Size**: 400x300px
- **Max Size**: Unlimited
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any` - Calendar events and configuration
- **Options Prop**: `options?: any` - Calendar display options
- **Use Case**: Scheduling, event planning, date visualization
- **Notes**: Larger default size to accommodate calendar views (day, week, month)

#### WrappedGeospatial
- **Purpose**: Display geospatial data visualizations
- **Default Size**: 800x600px
- **Min Size**: 400x300px
- **Max Size**: Unlimited
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any` - Geospatial layers and data points
- **Options Prop**: `options?: any` - Map configuration options
- **Use Case**: Geographic data visualization, heat maps, layer analysis
- **Notes**: Supports multiple layer types and time-series data

#### WrappedImageGallery
- **Purpose**: Display image galleries with lightbox
- **Default Size**: 800x600px
- **Min Size**: 300x200px
- **Max Size**: Unlimited
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any` - Image array and metadata
- **Options Prop**: `options?: any` - Gallery layout options
- **Use Case**: Photo galleries, image portfolios, visual collections
- **Notes**: Flexible sizing for different grid layouts

#### WrappedJSONViewer
- **Purpose**: Display and explore JSON data
- **Default Size**: 600x400px
- **Min Size**: 300x200px
- **Max Size**: Unlimited
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any` - JSON data to display
- **Options Prop**: `options?: any` - Viewer configuration
- **Use Case**: API response visualization, data inspection, debugging
- **Notes**: Syntax highlighting and collapsible nodes

#### WrappedLatex
- **Purpose**: Render LaTeX equations
- **Default Size**: 600x400px
- **Min Size**: 300x200px
- **Max Size**: Unlimited
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any` - LaTeX equations or single equation
- **Options Prop**: `options?: any` - KaTeX rendering options
- **Use Case**: Mathematical notation, scientific documentation, academic content
- **Notes**: Supports multiple equations and custom macros

#### WrappedMermaid
- **Purpose**: Render Mermaid diagrams
- **Default Size**: 800x600px
- **Min Size**: 400x300px
- **Max Size**: Unlimited
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any` - Mermaid diagram code
- **Options Prop**: `options?: any` - Diagram theme and security options
- **Use Case**: Flowcharts, sequence diagrams, Gantt charts
- **Notes**: Larger default size for complex diagrams

#### WrappedModelViewer
- **Purpose**: Display 3D models
- **Default Size**: 600x500px
- **Min Size**: 300x250px
- **Max Size**: Unlimited
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any` - Model URL and format
- **Options Prop**: `options?: any` - Viewer controls and camera settings
- **Use Case**: 3D model preview, product visualization, architectural models
- **Notes**: Supports multiple 3D formats (GLTF, GLB, OBJ, FBX, STL, DAE)

#### WrappedNodeEditor
- **Purpose**: Visual node-based editing
- **Default Size**: 800x600px
- **Min Size**: 400x300px
- **Max Size**: Unlimited
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any` - Nodes and edges
- **Options Prop**: `options?: any` - Editor configuration
- **Use Case**: Workflow design, visual programming, node graphs
- **Notes**: Based on ReactFlow with mini-map and controls

#### WrappedPhaser
- **Purpose**: Display Phaser games
- **Default Size**: 800x600px
- **Min Size**: 400x300px
- **Max Size**: Unlimited
- **Aspect Ratio**: **Maintained** (4:3)
- **Data Prop**: `data: any` - Game config and scenes
- **Options Prop**: `options?: any` - Game options
- **Use Case**: Game previews, interactive demos, educational games
- **Notes**: Aspect ratio maintained to preserve game proportions

#### WrappedRemotion
- **Purpose**: Display Remotion video compositions
- **Default Size**: 800x450px
- **Min Size**: 400x225px
- **Max Size**: Unlimited
- **Aspect Ratio**: **Maintained** (16:9)
- **Data Prop**: `data: any` - Composition configuration
- **Options Prop**: `options?: any` - Player options
- **Use Case**: Video previews, motion graphics, animations
- **Notes**: Aspect ratio maintained for video proportions (16:9 standard)

#### WrappedSVGPreview
- **Purpose**: Display and edit SVG files
- **Default Size**: 600x400px
- **Min Size**: 300x200px
- **Max Size**: Unlimited
- **Aspect Ratio**: Not maintained
- **Special Props**:
  - `svg: string` - SVG content (required)
  - `title?: string` - Optional title
  - `filename?: string` - Optional filename
- **Use Case**: SVG preview, icon inspection, vector graphics
- **Notes**: Supports preview and code modes, different from other components (uses `svg` prop instead of `data`)

#### WrappedVRM
- **Purpose**: Display VRM 3D avatars
- **Default Size**: 600x700px
- **Min Size**: 300x350px
- **Max Size**: Unlimited
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any` - VRM model URL
- **Options Prop**: `options?: any` - Avatar configuration
- **Use Case**: Virtual character display, avatar preview, VTuber content
- **Notes**: Taller default size to accommodate full-body avatars

#### WrappedWYSIWYG
- **Purpose**: Rich text editing
- **Default Size**: 800x600px
- **Min Size**: 400x300px
- **Max Size**: Unlimited
- **Aspect Ratio**: Not maintained
- **Data Prop**: `data: any` - Initial content
- **Options Prop**: `options?: any` - Editor features and configuration
- **Use Case**: Content creation, document editing, rich text formatting
- **Notes**: Larger default size for comfortable editing experience

## Component-Specific Behaviors

### Aspect Ratio Constraints

Some components maintain aspect ratio by default:

- **WrappedPhaser**: 4:3 aspect ratio (800x600 default)
- **WrappedRemotion**: 16:9 aspect ratio (800x450 default)

These components are designed to preserve their proportions for optimal display:
- Games need to maintain aspect ratio to prevent distortion
- Videos need to maintain aspect ratio for proper playback

### Size Constraints

Each component has carefully chosen default sizes based on:

1. **Content Requirements**: Components with complex visualizations need more space
2. **User Experience**: Larger sizes for components that benefit from more screen real estate
3. **Aspect Ratio**: Components with fixed aspect ratios have dimensions that match their ratio
4. **Minimum Usability**: Minimum sizes ensure components remain usable even when small

### State Preservation

All wrapped components use the `useComponentStatePreservation` hook to persist:
- **Position**: Where the component is located
- **Size**: The component's dimensions
- **Lock State**: Whether the component is locked

State is stored in localStorage with the key pattern: `component-layout:{id}`

## Usage Examples

### Basic Usage

```tsx
import { WrappedCalendar } from "@/components/ai-elements/wrapped-components";

function MyComponent() {
  return (
    <WrappedCalendar
      id="my-calendar"
      data={{
        events: [
          { start: "2024-01-01", end: "2024-01-02", title: "Event 1" }
        ]
      }}
    />
  );
}
```

### Custom Position and Size

```tsx
import { WrappedMermaid } from "@/components/ai-elements/wrapped-components";

function MyComponent() {
  return (
    <WrappedMermaid
      id="my-diagram"
      initialPosition={{ x: 100, y: 50 }}
      initialSize={{ width: 1000, height: 700 }}
      data={{
        diagram: "graph TD; A-->B; B-->C;"
      }}
    />
  );
}
```

### With Size Constraints

```tsx
import { WrappedImageGallery } from "@/components/ai-elements/wrapped-components";

function MyComponent() {
  return (
    <WrappedImageGallery
      id="my-gallery"
      minSize={{ width: 400, height: 300 }}
      maxSize={{ width: 1200, height: 900 }}
      data={{
        images: [
          { src: "/image1.jpg", width: 800, height: 600 },
          { src: "/image2.jpg", width: 800, height: 600 }
        ]
      }}
    />
  );
}
```

### With Boundary Constraint

```tsx
import { WrappedDataTable } from "@/components/ai-elements/wrapped-components";

function MyComponent() {
  return (
    <div id="dashboard-container" style={{ width: "100%", height: "100vh" }}>
      <WrappedDataTable
        id="my-table"
        boundaryId="dashboard-container"
        data={{
          columns: [{ id: "name", header: "Name" }],
          rows: [{ name: "Item 1" }]
        }}
      />
    </div>
  );
}
```

### Initially Locked

```tsx
import { WrappedCodeEditor } from "@/components/ai-elements/wrapped-components";

function MyComponent() {
  return (
    <WrappedCodeEditor
      id="my-editor"
      initiallyLocked={true}
      showLockToggle={true}
      data={{
        code: "const x = 1;",
        language: "javascript"
      }}
    />
  );
}
```

### With Code Change Callback

```tsx
import { WrappedCodeEditor } from "@/components/ai-elements/wrapped-components";

function MyComponent() {
  const handleCodeChange = (code: string) => {
    console.log("Code changed:", code);
  };

  return (
    <WrappedCodeEditor
      id="my-editor"
      data={{
        code: "const x = 1;",
        language: "javascript"
      }}
      onCodeChange={handleCodeChange}
    />
  );
}
```

## Best Practices

1. **Unique IDs**: Always use unique IDs for each component instance to avoid state conflicts
2. **Boundary Containers**: Use `boundaryId` to keep components within a specific area
3. **Lock Important Components**: Lock components that shouldn't be moved accidentally
4. **Appropriate Sizing**: Use default sizes as starting points, adjust based on content
5. **Aspect Ratio**: Respect aspect ratio constraints for games and videos
6. **State Management**: State is automatically preserved, no manual management needed

## Troubleshooting

### Component Not Saving Position
- Ensure the `id` prop is unique and consistent
- Check that localStorage is enabled in the browser

### Component Not Resizing
- Verify `minSize` and `maxSize` constraints allow the desired size
- Check if the component is locked

### Component Not Dragging
- Verify the component is not locked
- Check if `boundaryId` is restricting movement
- Ensure there's enough space within the boundary

### Aspect Ratio Issues
- For games and videos, keep `maintainAspectRatio` enabled
- Adjust initial size to match desired aspect ratio

## Migration Guide

### From Unwrapped Components

To migrate from unwrapped components to wrapped components:

**Before:**
```tsx
import { Calendar } from "@/components/ai-elements/calendar";

<Calendar data={calendarData} />
```

**After:**
```tsx
import { WrappedCalendar } from "@/components/ai-elements/wrapped-components";

<WrappedCalendar id="my-calendar" data={calendarData} />
```

### Adding Drag/Resize to Existing Wrapped Components

If you have existing wrapped components and want to add drag/resize:

1. Import the wrapped version instead of the base component
2. Add a unique `id` prop
3. Optionally customize position, size, and constraints

## Future Enhancements

Potential improvements for wrapped components:

1. **Responsive Breakpoints**: Automatic size adjustment based on screen size
2. **Snap to Grid**: Optional grid snapping for alignment
3. **Component Grouping**: Group multiple components together
4. **Save/Load Layouts**: Save and restore entire dashboard layouts
5. **Component Templates**: Predefined layouts for common use cases

## API Reference

### WrappedComponentProps

Base interface for all wrapped components.

```typescript
interface WrappedComponentProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onDragStart" | "onDragEnd"> {
  id: string;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  initiallyLocked?: boolean;
  showLockToggle?: boolean;
  zIndex?: number;
  boundaryId?: string;
  maintainAspectRatio?: boolean;
}
```

## Component Summary

| Component | Default Size | Min Size | Aspect Ratio | Use Case |
|-----------|-------------|----------|--------------|-----------|
| WrappedCharts | 600x400 | 300x200 | No | Data visualization |
| WrappedTimeline | 800x500 | 400x300 | No | Event timeline |
| WrappedMaps | 600x400 | 300x200 | No | Interactive maps |
| WrappedThreeScene | 600x400 | 300x200 | No | 3D scenes |
| WrappedKnowledgeGraph | 600x400 | 300x200 | No | Knowledge graphs |
| WrappedDataTable | 800x500 | 400x300 | No | Tabular data |
| WrappedCodeEditor | 600x400 | 300x200 | No | Code editing |
| WrappedMarkdown | 600x400 | 300x200 | No | Markdown rendering |
| WrappedCalendar | 800x600 | 400x300 | No | Calendar/events |
| WrappedGeospatial | 800x600 | 400x300 | No | Geospatial data |
| WrappedImageGallery | 800x600 | 300x200 | No | Image galleries |
| WrappedJSONViewer | 600x400 | 300x200 | No | JSON display |
| WrappedLatex | 600x400 | 300x200 | No | LaTeX equations |
| WrappedMermaid | 800x600 | 400x300 | No | Diagrams |
| WrappedModelViewer | 600x500 | 300x250 | No | 3D models |
| WrappedNodeEditor | 800x600 | 400x300 | No | Node graphs |
| WrappedPhaser | 800x600 | 400x300 | **Yes (4:3)** | Games |
| WrappedRemotion | 800x450 | 400x225 | **Yes (16:9)** | Videos |
| WrappedSVGPreview | 600x400 | 300x200 | No | SVG preview |
| WrappedVRM | 600x700 | 300x350 | No | VRM avatars |
| WrappedWYSIWYG | 800x600 | 400x300 | No | Rich text editing |

## Total Components Wrapped: 21

Phase 8 added 13 new wrapped components to the existing 8 from Phase 7, bringing the total to 21 wrapped components.
