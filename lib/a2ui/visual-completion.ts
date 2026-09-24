import type { A2UIMessage } from './types';
import { validateProps } from '../schemas';

const VISUAL_REQUEST_PATTERN = /\b(?:chart|dashboard|diagram|flowchart|graph|heatmap|infographic|map|network|plot|sankey|scene|spinor|timeline|visual(?:i[sz](?:e|ation))?|3d)\b/i;

const VISUAL_COMPONENT_TYPES = new Set([
  'Calendar',
  'Charts',
  'CodeEditor',
  'DataTable',
  'Geospatial',
  'ImageGallery',
  'JSONViewer',
  'KnowledgeGraph',
  'Latex',
  'Maps',
  'Markdown',
  'Mermaid',
  'ModelViewer',
  'NodeEditor',
  'Phaser',
  'Remotion',
  'SVGPreview',
  'StatsDisplay',
  'ThreeScene',
  'Timeline',
  'ToolUI',
  'VRM',
  'Video',
  'WYSIWYG',
]);

export interface A2UIVisualCompletion {
  complete: boolean;
  componentTypes: string[];
}

interface A2UIComponentEntry {
  props: Record<string, unknown>;
  type: string;
}

export function isVisualRequest(prompt: string): boolean {
  return VISUAL_REQUEST_PATTERN.test(prompt);
}

export function getA2UIComponentTypes(messages: readonly A2UIMessage[]): string[] {
  return getA2UIComponentEntries(messages).map((entry) => entry.type);
}

function getA2UIComponentEntries(messages: readonly A2UIMessage[]): A2UIComponentEntry[] {
  return messages.flatMap((message) =>
    (message.surfaceUpdate?.components ?? []).flatMap((component) =>
      Object.entries(component.component).map(([type, props]) => ({ type, props })),
    ),
  );
}

export function assessA2UIVisualCompletion(
  prompt: string,
  messages: readonly A2UIMessage[],
): A2UIVisualCompletion {
  const entries = getA2UIComponentEntries(messages);
  const componentTypes = entries.map((entry) => entry.type);

  if (!isVisualRequest(prompt)) {
    return { complete: messages.length > 0, componentTypes };
  }

  return {
    complete: entries.some((entry) =>
      VISUAL_COMPONENT_TYPES.has(entry.type)
      && validateProps(entry.type, entry.props).success,
    ),
    componentTypes,
  };
}

export function getA2UIVisualRetryPrompt(prompt: string): string {
  return `${prompt}\n\nThe previous A2UI stream was incomplete. Return JSONL only and build the requested visual, not just a title or prose. The final surface must contain at least one suitable visual component such as ThreeScene, SVGPreview, Latex, Mermaid, Charts, KnowledgeGraph, or NodeEditor, with all required props valid for the Generous catalog.`;
}
