"use client";

/**
 * A2UI Renderer
 * Renders AI-generated UI components from A2UI specifications
 * Supports both specialized components (with Zod validation) and adapter components
 */

import React from 'react';
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
import {
  SVGPreview,
  SVGPreviewHeader,
  SVGPreviewTitle,
  SVGPreviewActions,
  SVGPreviewCopyButton,
  SVGPreviewDownloadButton,
  SVGPreviewModeToggle,
  SVGPreviewContent
} from '@/components/ai-elements/svg-preview';
import {
  NodeEditor,
  NodeEditorHeader,
  NodeEditorTitle,
  NodeEditorActions,
  NodeEditorCopyButton,
  NodeEditorFullscreenButton,
  NodeEditorContent
} from '@/components/ai-elements/node-editor';
import {
  KnowledgeGraph,
  KnowledgeGraphHeader,
  KnowledgeGraphTitle,
  KnowledgeGraphActions,
  KnowledgeGraphSearch,
  KnowledgeGraphCopyButton,
  KnowledgeGraphFullscreenButton,
  KnowledgeGraphContent,
  KnowledgeGraphLegend
} from '@/components/ai-elements/knowledge-graph';
import {
  Latex,
  LatexHeader,
  LatexTitle,
  LatexActions,
  LatexCopyButton,
  LatexFullscreenButton,
  LatexContent
} from '@/components/ai-elements/latex';
import {
  ModelViewer,
  ModelViewerHeader,
  ModelViewerTitle,
  ModelViewerActions,
  ModelViewerResetButton,
  ModelViewerCopyButton,
  ModelViewerFullscreenButton,
  ModelViewerContent
} from '@/components/ai-elements/model-viewer';
import {
  Phaser,
  PhaserHeader,
  PhaserTitle,
  PhaserActions,
  PhaserPlayButton,
  PhaserResetButton,
  PhaserCopyButton,
  PhaserFullscreenButton,
  PhaserContent
} from '@/components/ai-elements/phaser';
import {
  Mermaid,
  MermaidHeader,
  MermaidTitle,
  MermaidActions,
  MermaidModeToggle,
  MermaidCopyButton,
  MermaidDownloadButton,
  MermaidFullscreenButton,
  MermaidContent
} from '@/components/ai-elements/mermaid';
import {
  Remotion,
  RemotionHeader,
  RemotionTitle,
  RemotionActions,
  RemotionPlayButton,
  RemotionResetButton,
  RemotionCopyButton,
  RemotionFullscreenButton,
  RemotionTimeline,
  RemotionContent
} from '@/components/ai-elements/remotion';
import {
  Geospatial,
  GeospatialHeader,
  GeospatialTitle,
  GeospatialActions,
  GeospatialLayerToggle,
  GeospatialCopyButton,
  GeospatialFullscreenButton,
  GeospatialContent,
  GeospatialLegend
} from '@/components/ai-elements/geospatial';
import { ToolUI } from '@/components/ai-elements/toolui';
import {
  Charts,
  ChartsHeader,
  ChartsTitle,
  ChartsActions,
  ChartsCopyButton,
  ChartsFullscreenButton,
  ChartsContent
} from '@/components/ai-elements/charts';
import {
  WYSIWYG,
  WYSIWYGHeader,
  WYSIWYGTitle,
  WYSIWYGActions,
  WYSIWYGExportButton,
  WYSIWYGCopyButton,
  WYSIWYGContent
} from '@/components/ai-elements/wysiwyg';
import {
  VRM,
  VRMHeader,
  VRMTitle,
  VRMActions,
  VRMAnimationToggle,
  VRMResetButton,
  VRMCopyButton,
  VRMFullscreenButton,
  VRMContent,
  VRMControls
} from '@/components/ai-elements/vrm';
import {
  CodeEditor,
  CodeEditorHeader,
  CodeEditorTitle,
  CodeEditorActions,
  CodeEditorCopyButton,
  CodeEditorDownloadButton,
  CodeEditorFullscreenButton,
  CodeEditorContent
} from '@/components/ai-elements/codeeditor';
import {
  Calendar,
  CalendarHeader,
  CalendarTitle,
  CalendarActions,
  CalendarNavigation,
  CalendarCopyButton,
  CalendarFullscreenButton,
  CalendarContent
} from '@/components/ai-elements/calendar';
import {
  Markdown,
  MarkdownHeader,
  MarkdownTitle,
  MarkdownActions,
  MarkdownCopyButton,
  MarkdownDownloadButton,
  MarkdownFullscreenButton,
  MarkdownContent
} from '@/components/ai-elements/markdown';
import {
  DataTable,
  DataTableHeader,
  DataTableTitle,
  DataTableActions,
  DataTableCopyButton,
  DataTableDownloadButton,
  DataTableFullscreenButton,
  DataTableContent
} from '@/components/ai-elements/datatable';
import {
  JSONViewer,
  JSONViewerHeader,
  JSONViewerTitle,
  JSONViewerActions,
  JSONViewerCopyButton,
  JSONViewerDownloadButton,
  JSONViewerFullscreenButton,
  JSONViewerContent
} from '@/components/ai-elements/jsonviewer';
import {
  ImageGallery,
  ImageGalleryHeader,
  ImageGalleryTitle,
  ImageGalleryActions,
  ImageGalleryDownloadButton,
  ImageGalleryFullscreenButton,
  ImageGalleryGrid
} from '@/components/ai-elements/imagegallery';
import { validateProps } from '@/lib/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { a2uiComponents } from './components';
import type { A2UIMessage, A2UIComponent } from './types';
import type { TimelineProps } from '@/lib/schemas/timeline.schema';
import type { MapsProps } from '@/lib/schemas/maps.schema';
import type { ThreeSceneProps } from '@/lib/schemas/threescene.schema';
import type { SVGPreviewProps } from '@/lib/schemas/svgpreview.schema';
import type { NodeEditorProps } from '@/lib/schemas/nodeeditor.schema';
import type { KnowledgeGraphProps } from '@/lib/schemas/knowledgegraph.schema';
import type { LatexProps } from '@/lib/schemas/latex.schema';
import type { ModelViewerProps } from '@/lib/schemas/modelviewer.schema';
import type { PhaserProps } from '@/lib/schemas/phaser.schema';
import type { MermaidProps } from '@/lib/schemas/mermaid.schema';
import type { RemotionProps } from '@/lib/schemas/remotion.schema';
import type { GeospatialProps } from '@/lib/schemas/geospatial.schema';
import type { ToolUIProps } from '@/lib/schemas/toolui.schema';
import type { ChartsProps } from '@/lib/schemas/charts.schema';
import type { WYSIWYGProps } from '@/lib/schemas/wysiwyg.schema';
import type { VRMProps } from '@/lib/schemas/vrm.schema';
import type { CodeEditorProps } from '@/lib/schemas/codeeditor.schema';
import type { CalendarProps } from '@/lib/schemas/calendar.schema';
import type { MarkdownProps } from '@/lib/schemas/markdown.schema';
import type { DataTableProps } from '@/lib/schemas/datatable.schema';
import type { JSONViewerProps } from '@/lib/schemas/jsonviewer.schema';
import type { ImageGalleryProps } from '@/lib/schemas/imagegallery.schema';

/**
 * List of specialized components that use Zod validation and composable pattern
 * These require complex internal structure with sub-components
 */
const SPECIALIZED_COMPONENTS = new Set([
  'Timeline',
  'Maps',
  'ThreeScene',
  'SVGPreview',
  'NodeEditor',
  'KnowledgeGraph',
  'Latex',
  'ModelViewer',
  'Phaser',
  'Mermaid',
  'Remotion',
  'Geospatial',
  'ToolUI',
  'Charts',
  'WYSIWYG',
  'VRM',
  'CodeEditor',
  'Calendar',
  'Markdown',
  'DataTable',
  'JSONViewer',
  'ImageGallery',
]);

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
        <p>Component type &quot;{type}&quot; is not registered in the catalog.</p>
        <p className="text-xs text-muted-foreground mt-2">Component ID: {id}</p>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Render a single A2UI component with validation
 * Supports both specialized components (Zod validation) and adapter components
 */
export function renderA2UIComponent(
  component: A2UIComponent,
  componentsMap?: Map<string, A2UIComponent>,
  onAction?: (action: unknown) => void
): React.ReactNode {
  const componentId = component.id;

  // Diagnostic logging
  console.log('[renderA2UIComponent] Rendering component:', { id: componentId, component });

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

  // Check if component exists in registry
  const ComponentAdapter = a2uiComponents[componentType];
  if (!ComponentAdapter) {
    return <UnknownComponent type={componentType} id={componentId} />;
  }

  // SPECIALIZED COMPONENTS: Use Zod validation and composable pattern
  if (SPECIALIZED_COMPONENTS.has(componentType)) {
    // Validate props with Zod
    const validation = validateProps(componentType, props);

    if (!validation.success) {
      const errorMessage = (validation as { success: false; error: Error }).error.message;
      console.error(`[A2UI] Validation failed for ${componentType}:`, errorMessage);

      return (
        <ComponentError
          componentType={componentType}
          error={errorMessage}
          componentId={componentId}
        />
      );
    }

    // Render the validated specialized component
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

      case 'SVGPreview': {
        const svgPreviewProps = validation.data as SVGPreviewProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <SVGPreview {...svgPreviewProps}>
              <SVGPreviewHeader>
                <SVGPreviewTitle />
                <SVGPreviewActions>
                  <SVGPreviewModeToggle />
                  <SVGPreviewCopyButton />
                  <SVGPreviewDownloadButton />
                </SVGPreviewActions>
              </SVGPreviewHeader>
              <SVGPreviewContent />
            </SVGPreview>
          </div>
        );
      }

      case 'NodeEditor': {
        const nodeEditorProps = validation.data as NodeEditorProps;
        // Fix nodes/edges type for NodeEditor
        const fixedNodeEditorProps = {
          ...nodeEditorProps,
          data: {
            ...nodeEditorProps.data,
            nodes: nodeEditorProps.data?.nodes as any[] || [],
            edges: nodeEditorProps.data?.edges as any[] || [],
          }
        };
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <NodeEditor {...fixedNodeEditorProps}>
              <NodeEditorHeader>
                <NodeEditorTitle />
                <NodeEditorActions>
                  <NodeEditorCopyButton />
                  <NodeEditorFullscreenButton />
                </NodeEditorActions>
              </NodeEditorHeader>
              <NodeEditorContent />
            </NodeEditor>
          </div>
        );
      }

      case 'KnowledgeGraph': {
        const knowledgeGraphProps = validation.data as KnowledgeGraphProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <KnowledgeGraph {...knowledgeGraphProps}>
              <KnowledgeGraphHeader>
                <KnowledgeGraphTitle />
                <KnowledgeGraphActions>
                  <KnowledgeGraphSearch />
                  <KnowledgeGraphCopyButton />
                  <KnowledgeGraphFullscreenButton />
                </KnowledgeGraphActions>
              </KnowledgeGraphHeader>
              <KnowledgeGraphContent />
              <KnowledgeGraphLegend />
            </KnowledgeGraph>
          </div>
        );
      }

      case 'Latex': {
        const latexProps = validation.data as LatexProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <Latex {...latexProps}>
              <LatexHeader>
                <LatexTitle />
                <LatexActions>
                  <LatexCopyButton />
                  <LatexFullscreenButton />
                </LatexActions>
              </LatexHeader>
              <LatexContent />
            </Latex>
          </div>
        );
      }

      case 'ModelViewer': {
        const modelViewerProps = validation.data as ModelViewerProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <ModelViewer {...modelViewerProps}>
              <ModelViewerHeader>
                <ModelViewerTitle />
                <ModelViewerActions>
                  <ModelViewerResetButton />
                  <ModelViewerCopyButton />
                  <ModelViewerFullscreenButton />
                </ModelViewerActions>
              </ModelViewerHeader>
              <ModelViewerContent />
            </ModelViewer>
          </div>
        );
      }

      case 'Phaser': {
        const phaserProps = validation.data as PhaserProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <Phaser {...phaserProps}>
              <PhaserHeader>
                <PhaserTitle />
                <PhaserActions>
                  <PhaserPlayButton />
                  <PhaserResetButton />
                  <PhaserCopyButton />
                  <PhaserFullscreenButton />
                </PhaserActions>
              </PhaserHeader>
              <PhaserContent />
            </Phaser>
          </div>
        );
      }

      case 'Mermaid': {
        const mermaidProps = validation.data as MermaidProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <Mermaid {...mermaidProps}>
              <MermaidHeader>
                <MermaidTitle />
                <MermaidActions>
                  <MermaidModeToggle />
                  <MermaidCopyButton />
                  <MermaidDownloadButton />
                  <MermaidFullscreenButton />
                </MermaidActions>
              </MermaidHeader>
              <MermaidContent />
            </Mermaid>
          </div>
        );
      }

      case 'Remotion': {
        const remotionProps = validation.data as RemotionProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <Remotion {...remotionProps}>
              <RemotionHeader>
                <RemotionTitle />
                <RemotionActions>
                  <RemotionPlayButton />
                  <RemotionResetButton />
                  <RemotionCopyButton />
                  <RemotionFullscreenButton />
                </RemotionActions>
              </RemotionHeader>
              <RemotionContent />
              <RemotionTimeline />
            </Remotion>
          </div>
        );
      }

      case 'Geospatial': {
        const geospatialProps = validation.data as GeospatialProps;
        // Fix layers to have required color property
        const fixedGeospatialProps = {
          ...geospatialProps,
          data: {
            ...geospatialProps.data,
            layers: geospatialProps.data?.layers?.map((layer: any) => ({
              ...layer,
              style: {
                color: layer.style?.color || '#3b82f6',
                ...layer.style,
              }
            })) || [],
            timeline: geospatialProps.data?.timeline ? {
              enabled: geospatialProps.data.timeline.enabled,
              startTime: geospatialProps.data.timeline.startTime || 0,
              endTime: geospatialProps.data.timeline.endTime || 100,
              step: geospatialProps.data.timeline.step,
              autoPlay: geospatialProps.data.timeline.autoPlay,
              speed: geospatialProps.data.timeline.speed,
            } : undefined
          }
        };
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <Geospatial {...fixedGeospatialProps}>
              <GeospatialHeader>
                <GeospatialTitle />
                <GeospatialActions>
                  <GeospatialLayerToggle />
                  <GeospatialCopyButton />
                  <GeospatialFullscreenButton />
                </GeospatialActions>
              </GeospatialHeader>
              <GeospatialContent />
              <GeospatialLegend />
            </Geospatial>
          </div>
        );
      }

      case 'ToolUI': {
        const toolUIProps = validation.data as ToolUIProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <ToolUI data={toolUIProps.data} options={toolUIProps.options} />
          </div>
        );
      }

      case 'Charts': {
        const chartsProps = validation.data as ChartsProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <Charts {...chartsProps}>
              <ChartsHeader>
                <ChartsTitle />
                <ChartsActions>
                  <ChartsCopyButton />
                  <ChartsFullscreenButton />
                </ChartsActions>
              </ChartsHeader>
              <ChartsContent />
            </Charts>
          </div>
        );
      }

      case 'WYSIWYG': {
        const wysiwygProps = validation.data as WYSIWYGProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <WYSIWYG {...wysiwygProps}>
              <WYSIWYGHeader>
                <WYSIWYGTitle />
                <WYSIWYGActions>
                  <WYSIWYGExportButton />
                  <WYSIWYGCopyButton />
                </WYSIWYGActions>
              </WYSIWYGHeader>
              <WYSIWYGContent />
            </WYSIWYG>
          </div>
        );
      }

      case 'VRM': {
        const vrmProps = validation.data as VRMProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <VRM {...vrmProps}>
              <VRMHeader>
                <VRMTitle />
                <VRMActions>
                  <VRMAnimationToggle />
                  <VRMResetButton />
                  <VRMCopyButton />
                  <VRMFullscreenButton />
                </VRMActions>
              </VRMHeader>
              <VRMContent />
              <VRMControls />
            </VRM>
          </div>
        );
      }

      case 'CodeEditor': {
        const codeEditorProps = validation.data as CodeEditorProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <CodeEditor {...codeEditorProps}>
              <CodeEditorHeader>
                <CodeEditorTitle />
                <CodeEditorActions>
                  <CodeEditorCopyButton />
                  <CodeEditorDownloadButton />
                  <CodeEditorFullscreenButton />
                </CodeEditorActions>
              </CodeEditorHeader>
              <CodeEditorContent />
            </CodeEditor>
          </div>
        );
      }

      case 'Calendar': {
        const calendarProps = validation.data as CalendarProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <Calendar {...calendarProps}>
              <CalendarHeader>
                <CalendarTitle />
                <CalendarActions>
                  <CalendarNavigation />
                  <CalendarCopyButton />
                  <CalendarFullscreenButton />
                </CalendarActions>
              </CalendarHeader>
              <CalendarContent />
            </Calendar>
          </div>
        );
      }

      case 'Markdown': {
        const markdownProps = validation.data as MarkdownProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <Markdown {...markdownProps}>
              <MarkdownHeader>
                <MarkdownTitle />
                <MarkdownActions>
                  <MarkdownCopyButton />
                  <MarkdownDownloadButton />
                  <MarkdownFullscreenButton />
                </MarkdownActions>
              </MarkdownHeader>
              <MarkdownContent />
            </Markdown>
          </div>
        );
      }

      case 'DataTable': {
        const dataTableProps = validation.data as DataTableProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <DataTable {...dataTableProps}>
              <DataTableHeader>
                <DataTableTitle />
                <DataTableActions>
                  <DataTableCopyButton />
                  <DataTableDownloadButton />
                  <DataTableFullscreenButton />
                </DataTableActions>
              </DataTableHeader>
              <DataTableContent />
            </DataTable>
          </div>
        );
      }

      case 'JSONViewer': {
        const jsonViewerProps = validation.data as JSONViewerProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <JSONViewer {...jsonViewerProps}>
              <JSONViewerHeader>
                <JSONViewerTitle />
                <JSONViewerActions>
                  <JSONViewerCopyButton />
                  <JSONViewerDownloadButton />
                  <JSONViewerFullscreenButton />
                </JSONViewerActions>
              </JSONViewerHeader>
              <JSONViewerContent />
            </JSONViewer>
          </div>
        );
      }

      case 'ImageGallery': {
        const imageGalleryProps = validation.data as ImageGalleryProps;
        return (
          <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
            <ImageGallery {...imageGalleryProps}>
              <ImageGalleryHeader>
                <ImageGalleryTitle />
                <ImageGalleryActions>
                  <ImageGalleryDownloadButton />
                  <ImageGalleryFullscreenButton />
                </ImageGalleryActions>
              </ImageGalleryHeader>
              <ImageGalleryGrid />
            </ImageGallery>
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

  // ADAPTER COMPONENTS: Use adapter pattern for standard UI components
  try {
    // Build children from component references
    let children: React.ReactNode = null;

    // Handle single child reference
    if (props.child && typeof props.child === 'string' && componentsMap) {
      const childComponent = componentsMap.get(props.child);
      if (childComponent) {
        children = renderA2UIComponent(childComponent, componentsMap, onAction);
      }
    }

    // Handle multiple children references
    if (props.children && Array.isArray(props.children) && componentsMap) {
      children = props.children
        .map((childId: string) => {
          if (typeof childId !== 'string') return null;
          const childComponent = componentsMap.get(childId);
          if (!childComponent) return null;
          return (
            <React.Fragment key={childId}>
              {renderA2UIComponent(childComponent, componentsMap, onAction)}
            </React.Fragment>
          );
        })
        .filter(Boolean);
    }

    // Create A2UI node structure for adapter
    const a2uiNode = {
      id: componentId,
      type: componentType,
      properties: props,
    };

    // Render using adapter
    return (
      <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
        <ComponentAdapter
          node={a2uiNode}
          onAction={onAction ?? (() => {})}
          components={a2uiComponents}
          surfaceId="default"
        >
          {children}
        </ComponentAdapter>
      </div>
    );
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
          Message is missing &apos;surfaceUpdate&apos; property
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
          surfaceUpdate is missing &apos;components&apos; array
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

  // Build components map for child resolution
  const componentsMap = new Map<string, A2UIComponent>();
  components.forEach((component) => {
    componentsMap.set(component.id, component);
  });

  // Action handler
  const handleAction = (action: unknown) => {
    console.log('[A2UI] Action:', action);
    // TODO: Implement action handling (e.g., send to AI, update state, etc.)
  };

  return (
    <div className={className} data-a2ui-surface>
      {components.map((component) => (
        <div key={component.id}>
          {renderA2UIComponent(component, componentsMap, handleAction)}
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

  // Build components map for child resolution
  const componentsMap = new Map<string, A2UIComponent>();
  components.forEach((component) => {
    componentsMap.set(component.id, component);
  });

  // Action handler
  const handleAction = (action: unknown) => {
    console.log('[A2UI] Action:', action);
    // TODO: Implement action handling (e.g., send to AI, update state, etc.)
  };

  return (
    <div className={className} data-a2ui-surface>
      {components.map((component) => (
        <div key={component.id}>
          {renderA2UIComponent(component, componentsMap, handleAction)}
        </div>
      ))}
    </div>
  );
}
