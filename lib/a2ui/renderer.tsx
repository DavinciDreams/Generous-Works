"use client";

/**
 * A2UI Renderer
 * Renders AI-generated UI components from A2UI specifications
 * with Zod validation
 */

import {
  Timeline,
  TimelineHeader,
  TimelineTitle,
  TimelineActions,
  TimelineCopyButton,
  TimelineFullscreenButton,
  TimelineContent
} from '@/components/ai-elements/timeline';
import {
  Maps,
  MapsHeader,
  MapsTitle,
  MapsActions,
  MapsCopyButton,
  MapsFullscreenButton,
  MapsContent
} from '@/components/ai-elements/maps';
import {
  ThreeScene,
  ThreeSceneHeader,
  ThreeSceneTitle,
  ThreeSceneActions,
  ThreeSceneCopyButton,
  ThreeSceneFullscreenButton,
  ThreeSceneResetButton,
  ThreeSceneContent
} from '@/components/ai-elements/threescene';
import { validateProps } from '@/lib/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { A2UIMessage, A2UIComponent } from './types';
import type { TimelineProps } from '@/lib/schemas/timeline.schema';
import type { MapsProps } from '@/lib/schemas/maps.schema';
import type { ThreeSceneProps } from '@/lib/schemas/threescene.schema';

/**
 * Error Fallback Component
 * Displayed when a component fails validation or rendering
 */
export function ComponentError({
  componentType,
  error,
  componentId
}: {
  componentType: string;
  error: string;
  componentId: string;
}) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Component Error: {componentType}</AlertTitle>
      <AlertDescription>
        <div className="mt-2">
          <p className="font-mono text-sm">{error}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Component ID: {componentId}
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Unknown Component Fallback
 * Displayed when component type is not recognized
 */
export function UnknownComponent({ type, id }: { type: string; id: string }) {
  return (
    <Alert className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Unknown Component</AlertTitle>
      <AlertDescription>
        <p>Component type "{type}" is not registered in the catalog.</p>
        <p className="text-xs text-muted-foreground mt-2">Component ID: {id}</p>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Render a single A2UI component with validation
 */
export function renderA2UIComponent(component: A2UIComponent): React.ReactNode {
  const componentId = component.id;

  // Extract component type and props
  const componentEntry = Object.entries(component.component)[0];
  if (!componentEntry) {
    return (
      <ComponentError
        componentType="Unknown"
        error="Component definition is empty"
        componentId={componentId}
      />
    );
  }

  const [componentType, props] = componentEntry;

  // Validate props with Zod
  const validation = validateProps(componentType, props);

  if (!validation.success) {
    const errorMessage = validation.error.message;
    console.error(`[A2UI] Validation failed for ${componentType}:`, errorMessage);

    return (
      <ComponentError
        componentType={componentType}
        error={errorMessage}
        componentId={componentId}
      />
    );
  }

  // Render the validated component
  try {
    switch (componentType) {
      case 'Timeline': {
        const timelineProps = validation.data as TimelineProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <Timeline {...timelineProps}>
              <TimelineHeader>
                <TimelineTitle>Timeline</TimelineTitle>
                <TimelineActions>
                  <TimelineCopyButton />
                  <TimelineFullscreenButton />
                </TimelineActions>
              </TimelineHeader>
              <TimelineContent />
            </Timeline>
          </div>
        );
      }

      case 'Maps': {
        const mapsProps = validation.data as MapsProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <Maps {...mapsProps}>
              <MapsHeader>
                <MapsTitle>Map</MapsTitle>
                <MapsActions>
                  <MapsCopyButton />
                  <MapsFullscreenButton />
                </MapsActions>
              </MapsHeader>
              <MapsContent />
            </Maps>
          </div>
        );
      }

      case 'ThreeScene': {
        const threeSceneProps = validation.data as ThreeSceneProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <ThreeScene {...threeSceneProps}>
              <ThreeSceneHeader>
                <ThreeSceneTitle>3D Scene</ThreeSceneTitle>
                <ThreeSceneActions>
                  <ThreeSceneResetButton />
                  <ThreeSceneCopyButton />
                  <ThreeSceneFullscreenButton />
                </ThreeSceneActions>
              </ThreeSceneHeader>
              <ThreeSceneContent />
            </ThreeScene>
          </div>
        );
      }

      default:
        return (
          <UnknownComponent type={componentType} id={componentId} />
        );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[A2UI] Render error for ${componentType}:`, error);

    return (
      <ComponentError
        componentType={componentType}
        error={`Render error: ${errorMessage}`}
        componentId={componentId}
      />
    );
  }
}

/**
 * A2UI Renderer Component
 *
 * Renders a complete A2UI message (surfaceUpdate)
 *
 * Usage:
 * ```tsx
 * <A2UIRenderer message={a2uiMessage} />
 * ```
 */
export interface A2UIRendererProps {
  /** A2UI message to render */
  message: A2UIMessage;
  /** Optional className for container */
  className?: string;
}

export function A2UIRenderer({ message, className }: A2UIRendererProps) {
  const { surfaceUpdate } = message;

  console.log('[A2UI Renderer] Rendering message:', message);

  if (!surfaceUpdate) {
    console.warn('[A2UI Renderer] No surfaceUpdate in message');
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>A2UI Rendering Error</AlertTitle>
        <AlertDescription>
          Message is missing 'surfaceUpdate' property
        </AlertDescription>
      </Alert>
    );
  }

  if (!surfaceUpdate.components) {
    console.warn('[A2UI Renderer] No components in surfaceUpdate');
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>A2UI Rendering Error</AlertTitle>
        <AlertDescription>
          surfaceUpdate is missing 'components' array
        </AlertDescription>
      </Alert>
    );
  }

  const components = surfaceUpdate.components;

  if (components.length === 0) {
    console.warn('[A2UI Renderer] Components array is empty');
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Components</AlertTitle>
        <AlertDescription>
          surfaceUpdate.components is empty
        </AlertDescription>
      </Alert>
    );
  }

  console.log('[A2UI Renderer] Rendering', components.length, 'component(s)');

  return (
    <div className={className} data-a2ui-surface>
      {components.map((component) => (
        <div key={component.id}>
          {renderA2UIComponent(component)}
        </div>
      ))}
    </div>
  );
}

/**
 * Simple Renderer (just render components without message wrapper)
 *
 * Usage:
 * ```tsx
 * <SimpleA2UIRenderer components={components} />
 * ```
 */
export interface SimpleA2UIRendererProps {
  /** Array of A2UI components */
  components: A2UIComponent[];
  /** Optional className for container */
  className?: string;
}

export function SimpleA2UIRenderer({ components, className }: SimpleA2UIRendererProps) {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <div className={className} data-a2ui-surface>
      {components.map((component) => (
        <div key={component.id}>
          {renderA2UIComponent(component)}
        </div>
      ))}
    </div>
  );
}
