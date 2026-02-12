/**
 * Unified A2UI Component Registry
 *
 * Combines all available components:
 * - Standard UI adapters (76 from shadcn)
 * - Specialized composable components (16 data viz/interactive)
 * - AI element adapters (to be expanded)
 */

import type { ComponentMapping } from './adapter';
import { shadcnAdapters } from './adapters';

// Import specialized composable components (keep existing)
import { Timeline } from '@/components/ai-elements/timeline';
import { Maps } from '@/components/ai-elements/maps';
import { ThreeScene } from '@/components/ai-elements/threescene';
import { SVGPreview } from '@/components/ai-elements/svg-preview';
import { NodeEditor } from '@/components/ai-elements/node-editor';
import { KnowledgeGraph } from '@/components/ai-elements/knowledge-graph';
import { Latex } from '@/components/ai-elements/latex';
import { ModelViewer } from '@/components/ai-elements/model-viewer';
import { Phaser } from '@/components/ai-elements/phaser';
import { Mermaid } from '@/components/ai-elements/mermaid';
import { Remotion } from '@/components/ai-elements/remotion';
import { Charts } from '@/components/ai-elements/charts';
import { Geospatial } from '@/components/ai-elements/geospatial';
import { WYSIWYG } from '@/components/ai-elements/wysiwyg';
import { VRM } from '@/components/ai-elements/vrm';
import { ToolUI } from '@/components/ai-elements/toolui';
import { Calendar } from '@/components/ai-elements/calendar';
import { JSONViewer } from '@/components/ai-elements/jsonviewer';
import { CodeEditor } from '@/components/ai-elements/codeeditor';
import { Markdown } from '@/components/ai-elements/markdown';
import { DataTable } from '@/components/ai-elements/datatable';
import { ImageGallery } from '@/components/ai-elements/imagegallery';
import { ApprovalCard } from '@/components/ai-elements/approval-card';
import { WeatherWidget } from '@/components/ai-elements/weather-widget';
import { StatsDisplay } from '@/components/ai-elements/stats-display';
import { ProgressTracker } from '@/components/ai-elements/progress-tracker';
import { OptionList } from '@/components/ai-elements/option-list';
import { InstagramPost } from '@/components/ai-elements/instagram-post';
import { LinkedInPost } from '@/components/ai-elements/linkedin-post';
import { XPost } from '@/components/ai-elements/x-post';
import { LinkPreview } from '@/components/ai-elements/link-preview';
import { Video } from '@/components/ai-elements/video';
import { MessageDraft } from '@/components/ai-elements/message-draft';
import { ItemCarousel } from '@/components/ai-elements/item-carousel';
import { OrderSummary } from '@/components/ai-elements/order-summary';
import { ParameterSlider } from '@/components/ai-elements/parameter-slider';
import { PreferencesPanel } from '@/components/ai-elements/preferences-panel';
import { QuestionFlow } from '@/components/ai-elements/question-flow';

/**
 * Specialized components that use the composable pattern
 * These have complex internal state and shouldn't be adapted
 */
export const specializedComponents = {
  Timeline,
  Maps,
  ThreeScene,
  SVGPreview,
  NodeEditor,
  KnowledgeGraph,
  Latex,
  ModelViewer,
  Phaser,
  Mermaid,
  Remotion,
  Charts,
  Geospatial,
  WYSIWYG,
  VRM,
  ToolUI,
  Calendar,
  JSONViewer,
  CodeEditor,
  Markdown,
  DataTable,
  ImageGallery,
  ApprovalCard,
  WeatherWidget,
  StatsDisplay,
  ProgressTracker,
  OptionList,
  InstagramPost,
  LinkedInPost,
  XPost,
  LinkPreview,
  Video,
  MessageDraft,
  ItemCarousel,
  OrderSummary,
  ParameterSlider,
  PreferencesPanel,
  QuestionFlow,
} as const;

/**
 * Complete A2UI Component Registry
 *
 * Priority order:
 * 1. Specialized components (data viz, interactive)
 * 2. Standard UI adapters (shadcn)
 * 3. AI element adapters (to be added)
 */
export const a2uiComponents: ComponentMapping = {
  // Specialized components (highest priority)
  // Cast needed because these use their own prop types, not A2UIComponentProps
  ...(specializedComponents as any),

  // Standard UI adapters
  ...shadcnAdapters,

  // TODO: Add AI element adapters here
  // ...aiElementAdapters,
};

/**
 * Get all available component types
 */
export function getAvailableComponents(): string[] {
  return Object.keys(a2uiComponents).filter(key => key !== '__fallback__');
}

/**
 * Check if a component type is available
 */
export function hasComponent(type: string): boolean {
  return type in a2uiComponents && a2uiComponents[type] !== undefined;
}

/**
 * Get component by type
 */
export function getComponent(type: string) {
  return a2uiComponents[type] || a2uiComponents.__fallback__;
}

/**
 * Component categories for documentation
 */
export const componentCategories = {
  specialized: [
    'Timeline', 'Maps', 'ThreeScene', 'SVGPreview', 'NodeEditor',
    'KnowledgeGraph', 'Latex', 'ModelViewer', 'Phaser', 'Mermaid', 'Remotion',
    'Charts', 'Geospatial', 'WYSIWYG', 'VRM', 'ToolUI', 'Calendar', 'JSONViewer', 'CodeEditor', 'Markdown'
  ],
  toolui: [
    'DataTable', 'ImageGallery', 'ApprovalCard', 'WeatherWidget', 'StatsDisplay',
    'ProgressTracker', 'OptionList', 'InstagramPost', 'LinkedInPost', 'XPost',
    'LinkPreview', 'Video', 'MessageDraft', 'ItemCarousel', 'OrderSummary',
    'ParameterSlider', 'PreferencesPanel', 'QuestionFlow'
  ],
  layout: [
    'Row', 'Column', 'HStack', 'VStack', 'Stack',
    'Flex', 'Grid', 'Box', 'Container', 'Center', 'Card'
  ],
  typography: [
    'Text', 'Title', 'Heading', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'Badge', 'Label', 'Code', 'Blockquote', 'Link'
  ],
  forms: [
    'Button', 'Input', 'TextField', 'Textarea', 'Checkbox',
    'Switch', 'Slider', 'NumberInput'
  ],
} as const;
