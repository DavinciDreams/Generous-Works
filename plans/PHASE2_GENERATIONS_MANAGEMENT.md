# Phase 2: Generations Management - Remaining Tasks

## Overview
This document outlines the remaining phases (5-11) of the generations management system that need to be implemented. These phases build upon the completed Phase 1 features (Context Window Management, Component Compaction, Editing and Caching, Clear Generations UI, and Generations Dashboard) to provide a comprehensive generations management experience.

## Completed Phases (Phase 1)
- Phase 1: Context Window Management ✓
- Phase 2: Component Compaction ✓
- Phase 3: Editing and Caching ✓
- Phase 4: Clear Generations UI ✓
- Phase 5: Generations Dashboard ✓

## Remaining Phases (Phase 2)

### Phase 5: Storage Infrastructure Setup

**Duration**: 2-3 days
**Dependencies**: None
**Priority**: High

#### Overview
Set up the database infrastructure for persistent storage of generations using Neon DB (Postgres).

#### Tasks
1. Set up Neon DB project
2. Create database schema
3. Set up environment variables
4. Create storage client module
5. Implement API routes (save, list, load, delete)
6. Add authentication middleware
7. Write API tests

#### Deliverables
- `lib/generations/neon-storage.ts`
- `app/api/generations/route.ts`
- `app/api/generations/[id]/route.ts`
- Database migration scripts
- API documentation
- Integration tests

#### Success Criteria
- API endpoints return correct responses
- Authentication works correctly
- Data persists correctly in database
- Error handling is robust

#### Database Schema
```sql
-- Generations table
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  ui_components JSONB NOT NULL DEFAULT '{}'::jsonb,
  component_layouts JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX idx_generations_updated_at ON generations(updated_at DESC);

-- Full-text search index
CREATE INDEX idx_generations_name_trgm ON generations USING gin(name gin_trgm_ops);
CREATE INDEX idx_generations_description_trgm ON generations USING gin(description gin_trgm_ops);
```

---

### Phase 6: Save/Download/Delete UI

**Duration**: 2-3 days
**Dependencies**: Phase 5
**Priority**: High

#### Overview
Build the user interface components for saving, downloading, and deleting generations with proper error handling and loading states.

#### Tasks
1. Create API routes for generations CRUD operations
2. Build save dialog component
3. Build download functionality (JSON, HTML)
4. Build delete functionality with confirmation
5. Add to canvas page
6. Add loading states
7. Add error handling
8. Write tests

#### Deliverables
- `components/generations/save-dialog.tsx`
- `components/generations/saved-list.tsx`
- `components/generations/delete-dialog.tsx`
- `components/generations/export-button.tsx`
- `lib/generations/export.ts`
- Updated `app/canvas/page.tsx`
- Unit and integration tests

#### Success Criteria
- Can save generations with name and description
- Can list and load saved generations
- Can delete generations with confirmation
- Can export as JSON and HTML
- Loading and error states display correctly

#### Dashboard Integration
- The [`GenerationsDashboard`](components/ai-elements/generations-dashboard.tsx:1) component already provides download and delete functionality
- Dashboard's download feature supports both single and batch operations (JSON and zip)
- Dashboard's save as images feature uses html2canvas for PNG export
- Dashboard's delete functionality includes confirmation dialogs
- The dashboard can be extended to integrate with cloud storage API routes

#### Save Dialog Component
```typescript
// components/generations/save-dialog.tsx
interface SaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, description?: string) => Promise<void>;
  isSaving: boolean;
}

export const SaveDialog = ({ open, onOpenChange, onSave, isSaving }: SaveDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    try {
      await onSave(name.trim(), description.trim());
      setName('');
      setDescription('');
      setError(null);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Generation</DialogTitle>
          <DialogDescription>
            Save your current generation to access it later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Generation"
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description..."
              rows={3}
              disabled={isSaving}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !name.trim()}>
            {isSaving ? <Spinner className="mr-2 size-4" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

---

### Phase 7: Draggable/Resizable Wrapper (Phase 1 Components)

**Duration**: 3-4 days
**Dependencies**: None
**Priority**: Medium

#### Overview
Implement drag and resize functionality for priority components using a wrapper pattern that preserves component state during interactions.

#### Tasks
1. Create DraggableWrapper component
2. Create ResizableWrapper component
3. Implement drag functionality
4. Implement resize functionality
5. Add lock/unlock toggle
6. Add responsive behavior
7. Implement state preservation
8. Wrap priority components (Charts, Timeline, Maps, ThreeScene, KnowledgeGraph, DataTable, CodeEditor, Markdown)
9. Add to store for layout persistence
10. Write tests

#### Deliverables
- `components/ai-elements/draggable-wrapper.tsx`
- `components/ai-elements/resizable-wrapper.tsx`
- `hooks/use-component-state-preservation.ts`
- Wrapped versions of priority components
- Updated store with layout state
- Unit tests for drag/resize
- Integration tests

#### Success Criteria
- Components can be dragged smoothly
- Components can be resized smoothly
- State is preserved during interactions
- Lock toggle prevents movement
- Layout persists across reloads
- Responsive behavior works on different screen sizes

#### Dashboard Integration
- The dashboard can display component layout information (position, size)
- Dashboard can show lock/unlock status for each component
- Dashboard can be used to quickly access and manage draggable components
- Layout changes made through drag/resize can be reflected in the dashboard

#### Draggable Wrapper Component
```typescript
// components/ai-elements/draggable-wrapper.tsx
"use client";

import { useCallback, useRef, useState } from 'react';
import { motion } from 'motion';
import { GripVertical, Maximize2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DraggableWrapperProps {
  children: React.ReactNode;
  componentId: string;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  onSizeChange?: (id: string, size: { width: number; height: number }) => void;
  locked?: boolean;
  resizable?: boolean;
  draggable?: boolean;
  className?: string;
}

export const DraggableWrapper = ({
  children,
  componentId,
  initialPosition = { x: 0, y: 0 },
  initialSize = { width: 400, height: 300 },
  onPositionChange,
  onSizeChange,
  locked: lockedProp = false,
  resizable = true,
  draggable = true,
  className,
}: DraggableWrapperProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [locked, setLocked] = useState(lockedProp);

  const dragRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!draggable || locked) return;
    e.preventDefault();
    setIsDragging(true);
    startPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [draggable, locked, position]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (!resizable || locked) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { width: size.width, height: size.height };
  }, [resizable, locked, size]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - startPos.current.x,
          y: e.clientY - startPos.current.y,
        };
        setPosition(newPosition);
        onPositionChange?.(componentId, newPosition);
      }

      if (isResizing) {
        const newSize = {
          width: Math.max(200, startSize.current.width + (e.clientX - startPos.current.x)),
          height: Math.max(150, startSize.current.height + (e.clientY - startPos.current.y)),
        };
        setSize(newSize);
        onSizeChange?.(componentId, newSize);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, componentId, onPositionChange, onSizeChange]);

  return (
    <motion.div
      ref={dragRef}
      className={cn(
        'absolute bg-background border border-border rounded-lg shadow-lg overflow-hidden',
        isDragging && 'cursor-grabbing',
        !isDragging && draggable && !locked && 'cursor-grab',
        locked && 'cursor-default',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: isDragging || isResizing ? 1000 : 1,
      }}
      onMouseDown={handleMouseDown}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header with drag handle and controls */}
      <div
        className={cn(
          'flex items-center justify-between px-3 py-2 bg-muted/50 border-b',
          draggable && !locked && 'cursor-grab hover:bg-muted/70'
        )}
      >
        <div className="flex items-center gap-2">
          {draggable && !locked && <GripVertical className="size-4 text-muted-foreground" />}
          <span className="text-sm font-medium text-muted-foreground">
            {componentId}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setLocked(!locked)}
            className={locked ? 'text-muted-foreground' : ''}
          >
            <Lock className="size-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-auto" style={{ height: 'calc(100% - 40px)' }}>
        {children}
      </div>

      {/* Resize handle */}
      {resizable && !locked && (
        <div
          ref={resizeRef}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <Maximize2 className="size-3 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
};
```

---

### Phase 8: Extended Component Support

**Duration**: 2-3 days
**Dependencies**: Phase 7
**Priority**: Low

#### Overview
Apply draggable/resizable functionality to all remaining AI elements components, ensuring each component behaves correctly with the wrapper.

#### Tasks
1. Apply draggable/resizable to Charts, Timeline, Maps, ThreeScene, KnowledgeGraph, DataTable, CodeEditor, Markdown
2. Wrap remaining AI elements components
3. Test each wrapped component
4. Add component-specific resize constraints
5. Add responsive breakpoints
6. Document component-specific behaviors

#### Deliverables
- Wrapped versions of all 114+ components
- Component documentation
- Test coverage
- Responsive breakpoint configurations

#### Success Criteria
- All components support drag/resize
- Each component behaves correctly
- Documentation is complete
- Responsive breakpoints work correctly

#### Dashboard Integration
- The dashboard can filter and display all 114+ components by type
- Dashboard can show which components support drag/resize
- Component-specific behaviors can be documented in the dashboard tooltips
- Dashboard can display component-specific resize constraints

#### Priority Components List
1. Charts
2. Timeline
3. Maps
4. ThreeScene
5. KnowledgeGraph
6. DataTable
7. CodeEditor
8. Markdown

---

### Phase 9: Responsive Behavior

**Duration**: 2-3 days
**Dependencies**: Phase 7
**Priority**: Medium

#### Overview
Implement responsive layouts and touch support for draggable/resizable components to ensure optimal experience across all device sizes.

#### Tasks
1. Implement responsive layouts for components
2. Add mobile-specific optimizations
3. Add mobile touch support
4. Implement adaptive layouts
5. Add breakpoint handling
6. Add touch-friendly controls
7. Test on different screen sizes

#### Deliverables
- Responsive drag/resize logic
- Touch event handlers
- Breakpoint configurations
- Mobile testing results
- Touch-friendly controls

#### Success Criteria
- Components adapt to screen size
- Touch gestures work on mobile
- Layout is usable on tablets and phones
- Touch-friendly controls are intuitive

#### Dashboard Integration
- The dashboard should be fully responsive and work on mobile devices
- Dashboard's component list should adapt to different screen sizes
- Touch-friendly controls for selection and actions on mobile
- Dashboard should use responsive breakpoints for optimal display

#### Responsive Breakpoints
```typescript
// breakpoints.ts
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const getBreakpoint = (width: number): keyof typeof breakpoints => {
  if (width < breakpoints.sm) return 'xs';
  if (width < breakpoints.md) return 'sm';
  if (width < breakpoints.lg) return 'md';
  if (width < breakpoints.xl) return 'lg';
  if (width < breakpoints['2xl']) return 'xl';
  return '2xl';
};
```

---

### Phase 10: Advanced Features

**Duration**: 3-4 days
**Dependencies**: Phases 6, 7
**Priority**: Low

#### Overview
Implement advanced features including component versioning, templates, sharing, collaboration, analytics, and AI-assisted optimization.

#### Tasks
1. Implement component versioning & history
2. Create component templates system
3. Implement component sharing & collaboration
4. Add component analytics & insights
5. Implement AI-assisted component optimization
6. Write tests

#### Deliverables
- Version control system
- Template system
- Sharing functionality
- Analytics dashboard
- AI optimization hooks
- Tests

#### Success Criteria
- Multiple versions can be saved
- Templates can be created and used
- Generations can be shared via link
- Analytics show usage patterns
- AI suggestions improve components

#### Dashboard Integration
- Dashboard can display component version history
- Dashboard can apply templates to selected components
- Dashboard can show sharing status and collaboration features
- Analytics can be integrated into the dashboard header
- AI optimization suggestions can be displayed in the dashboard

#### Component Versioning System
```typescript
// lib/versioning/component-versioning.ts
export interface ComponentVersion {
  id: string;
  componentId: string;
  version: number;
  data: UIComponent;
  createdAt: number;
  createdBy: string;
  description?: string;
}

export class ComponentVersionManager {
  private versions: Map<string, ComponentVersion[]>;

  constructor() {
    this.versions = new Map();
  }

  createVersion(
    component: UIComponent,
    userId: string,
    description?: string
  ): ComponentVersion {
    const componentId = component.id;
    const existingVersions = this.versions.get(componentId) || [];
    const nextVersion = existingVersions.length + 1;

    const version: ComponentVersion = {
      id: this.generateVersionId(componentId, nextVersion),
      componentId,
      version: nextVersion,
      data: { ...component },
      createdAt: Date.now(),
      createdBy: userId,
      description,
    };

    existingVersions.push(version);
    this.versions.set(componentId, existingVersions);

    return version;
  }

  getVersion(componentId: string, version: number): ComponentVersion | undefined {
    const versions = this.versions.get(componentId);
    return versions?.find(v => v.version === version);
  }

  getLatestVersion(componentId: string): ComponentVersion | undefined {
    const versions = this.versions.get(componentId);
    return versions?.[versions.length - 1];
  }

  getAllVersions(componentId: string): ComponentVersion[] {
    return this.versions.get(componentId) || [];
  }

  restoreVersion(componentId: string, version: number): UIComponent | undefined {
    const version = this.getVersion(componentId, version);
    return version ? { ...version.data } : undefined;
  }

  compareVersions(
    componentId: string,
    versionA: number,
    versionB: number
  ): { field: string; old: any; new: any }[] {
    const vA = this.getVersion(componentId, versionA);
    const vB = this.getVersion(componentId, versionB);

    if (!vA || !vB) return [];

    const diff: { field: string; old: any; new: any }[] = [];

    const propsA = vA.data.props || {};
    const propsB = vB.data.props || {};
    const allKeys = new Set([...Object.keys(propsA), ...Object.keys(propsB)]);

    for (const key of allKeys) {
      if (JSON.stringify(propsA[key]) !== JSON.stringify(propsB[key])) {
        diff.push({
          field: key,
          old: propsA[key],
          new: propsB[key],
        });
      }
    }

    return diff;
  }

  private generateVersionId(componentId: string, version: number): string {
    return `${componentId}-v${version}`;
  }
}
```

#### Component Templates System
```typescript
// lib/templates/component-templates.ts
export interface ComponentTemplate {
  id: string;
  name: string;
  description: string;
  componentType: string;
  defaultProps: Record<string, any>;
  schema: FieldSchema;
  tags: string[];
  createdBy: string;
  createdAt: number;
  isPublic: boolean;
}

export class ComponentTemplateManager {
  private templates: Map<string, ComponentTemplate>;

  constructor() {
    this.templates = new Map();
  }

  createTemplate(template: Omit<ComponentTemplate, 'id' | 'createdAt'>): ComponentTemplate {
    const id = this.generateTemplateId();
    const newTemplate: ComponentTemplate = {
      ...template,
      id,
      createdAt: Date.now(),
    };

    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  getTemplate(id: string): ComponentTemplate | undefined {
    return this.templates.get(id);
  }

  getTemplatesByType(type: string): ComponentTemplate[] {
    return Array.from(this.templates.values())
      .filter(t => t.componentType === type);
  }

  getPublicTemplates(): ComponentTemplate[] {
    return Array.from(this.templates.values())
      .filter(t => t.isPublic);
  }

  searchTemplates(query: string): ComponentTemplate[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.templates.values())
      .filter(t =>
        t.name.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
  }

  applyTemplate(templateId: string, overrides: Record<string, any> = {}): UIComponent {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    return {
      id: this.generateComponentId(),
      type: template.componentType,
      props: { ...template.defaultProps, ...overrides },
    };
  }

  private generateTemplateId(): string {
    return `tpl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateComponentId(): string {
    return `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

---

### Phase 11: Polish and Documentation

**Duration**: 2-3 days
**Dependencies**: All previous phases
**Priority**: Medium

#### Overview
Polish the user experience with smooth animations, clear error messages, comprehensive documentation, and ensure accessibility compliance.

#### Tasks
1. Update all documentation
2. Add inline code comments
3. Add animations and transitions
4. Improve error messages
5. Add user onboarding
6. Create user guides
7. Create developer documentation
8. Performance optimization
9. Accessibility audit

#### Deliverables
- Smooth animations
- Clear error messages
- Onboarding flow
- User guide
- API documentation
- Performance improvements
- Accessibility compliance
- Inline code comments

#### Success Criteria
- Animations are smooth and enhance UX
- Error messages are helpful
- New users understand the features
- Documentation is comprehensive
- Performance meets targets
- Accessibility audit passes
- Code is well-commented

#### Dashboard Integration
- Dashboard should have smooth animations for opening/closing
- Dashboard error messages should be clear and actionable
- User onboarding should include dashboard introduction
- User guide should cover all dashboard features
- Dashboard should be accessible (ARIA compliant)
- Dashboard performance should be optimized for large component lists

#### Accessibility Checklist
- Keyboard navigation works
- Screen reader announces actions
- Focus management is correct
- ARIA labels are present
- Color contrast meets WCAG AA
- Touch targets are 44x44px minimum

#### Performance Metrics
- Drag/resize frame rate: 60fps
- Save operation duration: <2s
- Load operation duration: <1s
- List operation duration: <500ms
- Search operation duration: <300ms
- Cache hit rate: >70%
- Context compaction time: <100ms

---

## Notes
- All phases 1-5 have been successfully implemented and pushed to the `feature/generations-management` branch
- The dev server is running and ready for testing of completed features
- These remaining phases should be implemented in priority order
- Each phase builds upon the previous ones, so proper sequencing is important
- Testing should be thorough for each phase before moving to the next
- The [`GenerationsDashboard`](components/ai-elements/generations-dashboard.tsx:1) component serves as a central hub for many of these features
- Consider user feedback during implementation to adjust priorities as needed
