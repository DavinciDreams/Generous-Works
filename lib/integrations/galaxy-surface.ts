import type { A2UIComponent, A2UIMessage } from '@/lib/a2ui/types';

export const GALAXY_SURFACE_SCHEMA = 'gb.surface.v1' as const;
export const GALAXY_SURFACE_CATALOG = {
  id: 'generous.a2ui',
  version: '1',
} as const;

const MAX_COMPONENTS = 64;
const MAX_JSON_BYTES = 262_144;
const MAX_DEPTH = 10;
const MAX_VALUE_NODES = 4_096;
const MAX_STRING_LENGTH = 20_000;
const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const ACTION_KEY_PATTERN = /^on[A-Z_]/;
const FORBIDDEN_PROPERTY_NAMES = new Set(['action', 'actions', 'handler', 'script']);
const PROTOTYPE_POLLUTION_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

/**
 * The components Galaxy draws, and the props each one takes. Mirrors the
 * catalog in Galaxy's gb.surface.v1 contract, where every component's props
 * are a closed set: Galaxy refuses the whole surface over one prop it does
 * not know. Props outside these lists are left behind here instead, so a
 * canvas still saves with everything Galaxy can show.
 */
const GALAXY_COMPONENT_PROPS: Readonly<Record<string, readonly string[]>> = {
  Badge: ['text', 'variant'],
  Card: [],
  Charts: ['data', 'options'],
  Column: ['align', 'distribution'],
  DataTable: ['data', 'options'],
  Grid: ['columns', 'gap'],
  Heading: ['text', 'usageHint'],
  KnowledgeGraph: ['data', 'options', 'title'],
  Markdown: ['data', 'options'],
  Row: ['align', 'distribution'],
  Separator: ['decorative', 'orientation'],
  Stack: ['align', 'distribution'],
  StatsDisplay: ['description', 'id', 'role', 'stats', 'title'],
  SVGPreview: ['svg', 'title', 'filename', 'width', 'height'],
  Text: ['text', 'usageHint'],
  Timeline: ['data', 'options'],
  Title: ['text', 'usageHint'],
};

/** Galaxy bounds strings in code points, as Python's len() counts them. */
function codePointLength(value: string): number {
  // A character outside the Basic Multilingual Plane is two UTF-16 units.
  return value.length - (value.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g)?.length ?? 0);
}

/** Keys that mark a component as carrying behaviour, wherever they appear. */
function isForbiddenKey(key: string): boolean {
  return (
    ACTION_KEY_PATTERN.test(key) ||
    FORBIDDEN_PROPERTY_NAMES.has(key.toLowerCase()) ||
    PROTOTYPE_POLLUTION_KEYS.has(key.toLowerCase()) ||
    key === 'dangerouslySetInnerHTML' ||
    key === 'srcDoc'
  );
}

export interface GalaxySurfaceSpec extends Record<string, unknown> {
  schema: typeof GALAXY_SURFACE_SCHEMA;
  catalog: typeof GALAXY_SURFACE_CATALOG;
  surfaceUpdate: {
    surfaceId?: string;
    components: A2UIComponent[];
  };
  bindings: [];
}

export class GalaxySurfaceContractError extends Error {}

function requireIdentifier(value: unknown, path: string): asserts value is string {
  if (typeof value !== 'string' || !IDENTIFIER_PATTERN.test(value)) {
    throw new GalaxySurfaceContractError(`${path} must be a stable identifier`);
  }
}

function validateBoundedValue(
  value: unknown,
  path: string,
  depth: number,
  counter: { value: number },
): void {
  if (depth > MAX_DEPTH) {
    throw new GalaxySurfaceContractError(`${path} exceeds the maximum nesting depth`);
  }
  counter.value += 1;
  if (counter.value > MAX_VALUE_NODES) {
    throw new GalaxySurfaceContractError('surface contains too many values');
  }

  if (value === null || typeof value === 'boolean' || typeof value === 'undefined') return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new GalaxySurfaceContractError(`${path} contains a non-finite number`);
    }
    return;
  }
  if (typeof value === 'string') {
    if (codePointLength(value) > MAX_STRING_LENGTH) {
      throw new GalaxySurfaceContractError(`${path} exceeds the maximum string length`);
    }
    const normalized = value.toLowerCase();
    if (normalized.includes('javascript:') || normalized.includes('<script')) {
      throw new GalaxySurfaceContractError(`${path} contains executable content`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      validateBoundedValue(item, `${path}[${index}]`, depth + 1, counter),
    );
    return;
  }
  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      if (isForbiddenKey(key)) {
        throw new GalaxySurfaceContractError(
          `${path}.${key} is not allowed in a promotable surface`,
        );
      }
      validateBoundedValue(item, `${path}.${key}`, depth + 1, counter);
    });
    return;
  }
  throw new GalaxySurfaceContractError(`${path} contains an unsupported value`);
}

/** Galaxy's bounds for SVGPreview, mirrored so a save fails here, clearly. */
const SVG_TITLE_MAX = 500;
const SVG_FILENAME_MAX = 200;
const SVG_SIZE_PATTERN = /^[0-9]+(\.[0-9]+)?(px|%|em|rem)?$/;
/**
 * Galaxy's own pattern for an SVG document. A comment body cannot contain
 * `-->`, which keeps matching linear: `<!--[\s\S]*?-->` let each comment
 * swallow the next and doubled its work per stacked comment.
 */
const SVG_DOCUMENT_START = /^\s*(<\?xml[^>]*\?>\s*)?(<!--(?:[^-]|-(?!->))*-->\s*)*<[sS][vV][gG][\s>/]/;

function galaxySvgSize(value: unknown): number | string | undefined {
  if (typeof value === 'number' && value > 0 && value <= 4096) return value;
  if (typeof value === 'string' && value.length <= 16 && SVG_SIZE_PATTERN.test(value)) return value;
  return undefined;
}

/**
 * Hold SVGPreview's props to Galaxy's bounds. The drawing itself is checked
 * and refused with a message that says what is wrong: nothing here can repair
 * it. The other props are cosmetic and written by the model, which the user
 * cannot edit, so values Galaxy would refuse are dropped rather than failing
 * an otherwise good save.
 */
function toGalaxySvgPreviewProps(props: Record<string, unknown>, path: string) {
  const { svg, title, filename, width, height } = props;
  if (typeof svg !== 'string' || svg.trim().length === 0) {
    throw new GalaxySurfaceContractError(`${path}.svg must be a non-empty SVG document`);
  }
  const length = codePointLength(svg);
  if (length > MAX_STRING_LENGTH) {
    throw new GalaxySurfaceContractError(
      `${path}.svg is ${length.toLocaleString('en-US')} characters; Galaxy accepts SVG up to ${MAX_STRING_LENGTH.toLocaleString('en-US')}`,
    );
  }
  if (/<!\s*(doctype|entity)/i.test(svg)) {
    throw new GalaxySurfaceContractError(`${path}.svg must not declare a DOCTYPE or entities`);
  }
  if (!SVG_DOCUMENT_START.test(svg)) {
    throw new GalaxySurfaceContractError(`${path}.svg must be a single SVG document`);
  }

  const normalized: Record<string, unknown> = { svg };
  if (typeof title === 'string' && codePointLength(title) <= SVG_TITLE_MAX) normalized.title = title;
  if (typeof filename === 'string' && codePointLength(filename) <= SVG_FILENAME_MAX) {
    normalized.filename = filename;
  }
  const galaxyWidth = galaxySvgSize(width);
  if (galaxyWidth !== undefined) normalized.width = galaxyWidth;
  const galaxyHeight = galaxySvgSize(height);
  if (galaxyHeight !== undefined) normalized.height = galaxyHeight;
  return normalized;
}

export function toReplayableA2UIMessage(spec: unknown): A2UIMessage {
  if (
    typeof spec !== 'object' ||
    spec === null ||
    Array.isArray(spec) ||
    !('schema' in spec) ||
    spec.schema !== GALAXY_SURFACE_SCHEMA ||
    !('catalog' in spec) ||
    typeof spec.catalog !== 'object' ||
    spec.catalog === null ||
    Array.isArray(spec.catalog) ||
    !('id' in spec.catalog) ||
    spec.catalog.id !== GALAXY_SURFACE_CATALOG.id ||
    !('version' in spec.catalog) ||
    spec.catalog.version !== GALAXY_SURFACE_CATALOG.version
  ) {
    throw new GalaxySurfaceContractError('Stored surface has an unsupported schema or catalog');
  }

  const validated = toGalaxySurfaceSpec(spec as A2UIMessage);
  return { surfaceUpdate: validated.surfaceUpdate };
}

export function galaxySurfaceToMessageContent(spec: unknown): string {
  const message = toReplayableA2UIMessage(spec);
  return `\`\`\`json\n${JSON.stringify(message, null, 2)}\n\`\`\``;
}

function assertAcyclic(childrenById: Map<string, string[]>): void {
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (componentId: string) => {
    if (visiting.has(componentId)) {
      throw new GalaxySurfaceContractError('component references contain a cycle');
    }
    if (visited.has(componentId)) return;
    visiting.add(componentId);
    childrenById.get(componentId)?.forEach(visit);
    visiting.delete(componentId);
    visited.add(componentId);
  };

  childrenById.forEach((_, componentId) => visit(componentId));
}

export function toGalaxySurfaceSpec(message: A2UIMessage): GalaxySurfaceSpec {
  const update = message.surfaceUpdate;
  if (!update || !Array.isArray(update.components)) {
    throw new GalaxySurfaceContractError('A2UI message does not contain a surface update');
  }
  if (update.components.length < 1 || update.components.length > MAX_COMPONENTS) {
    throw new GalaxySurfaceContractError(`surface must contain 1-${MAX_COMPONENTS} components`);
  }
  if (update.surfaceId !== undefined) {
    requireIdentifier(update.surfaceId, 'surfaceUpdate.surfaceId');
  }

  const componentIds = new Set<string>();
  const childrenById = new Map<string, string[]>();
  const counter = { value: 0 };
  const galaxyProps = new Map<string, Record<string, unknown>>();

  update.components.forEach((component, index) => {
    const path = `surfaceUpdate.components[${index}]`;
    requireIdentifier(component.id, `${path}.id`);
    if (componentIds.has(component.id)) {
      throw new GalaxySurfaceContractError(`duplicate component id: ${component.id}`);
    }
    componentIds.add(component.id);

    const entries = Object.entries(component.component ?? {});
    if (entries.length !== 1) {
      throw new GalaxySurfaceContractError(`${path}.component must contain exactly one type`);
    }
    const [componentType, props] = entries[0];
    const propNames = Object.hasOwn(GALAXY_COMPONENT_PROPS, componentType)
      ? GALAXY_COMPONENT_PROPS[componentType]
      : undefined;
    if (!propNames) {
      throw new GalaxySurfaceContractError(
        `component type is not approved for Galaxy Brain: ${componentType}`,
      );
    }
    if (typeof props !== 'object' || props === null || Array.isArray(props)) {
      throw new GalaxySurfaceContractError(`${path}.component.${componentType} must be an object`);
    }
    const propsPath = `${path}.component.${componentType}`;
    // Behaviour is refused even on a prop that would be left behind: it says
    // the component was built to do something Galaxy will not.
    Object.keys(props).forEach((key) => {
      if (isForbiddenKey(key)) {
        throw new GalaxySurfaceContractError(`${propsPath}.${key} is not allowed in a promotable surface`);
      }
    });
    let kept: Record<string, unknown> = Object.fromEntries(
      Object.entries(props).filter(([key]) => propNames.includes(key)),
    );
    if (componentType === 'SVGPreview') kept = toGalaxySvgPreviewProps(kept, propsPath);
    // Only what is sent is checked, so a prop being left behind cannot block the save.
    validateBoundedValue(kept, propsPath, 0, counter);
    galaxyProps.set(component.id, kept);

    if (component.parentId !== undefined) {
      requireIdentifier(component.parentId, `${path}.parentId`);
    }
    if (component.children !== undefined && !Array.isArray(component.children)) {
      throw new GalaxySurfaceContractError(`${path}.children must be an array`);
    }
    const children = component.children ?? [];
    children.forEach((childId) => requireIdentifier(childId, `${path}.children`));
    childrenById.set(component.id, children);
  });

  update.components.forEach((component) => {
    if (component.parentId !== undefined && !componentIds.has(component.parentId)) {
      throw new GalaxySurfaceContractError(`unknown parent component: ${component.parentId}`);
    }
    childrenById.get(component.id)?.forEach((childId) => {
      if (!componentIds.has(childId)) {
        throw new GalaxySurfaceContractError(`unknown child component: ${childId}`);
      }
      if (childId === component.id) {
        throw new GalaxySurfaceContractError('component cannot be its own child');
      }
    });
  });
  assertAcyclic(childrenById);

  const spec: GalaxySurfaceSpec = {
    schema: GALAXY_SURFACE_SCHEMA,
    catalog: GALAXY_SURFACE_CATALOG,
    surfaceUpdate: {
      ...(update.surfaceId === undefined ? {} : { surfaceId: update.surfaceId }),
      components: update.components.map((component) => ({
        ...component,
        component: { [Object.keys(component.component)[0]]: galaxyProps.get(component.id) },
      })),
    },
    bindings: [],
  };
  const encoded = JSON.stringify(spec);
  if (new TextEncoder().encode(encoded).length > MAX_JSON_BYTES) {
    throw new GalaxySurfaceContractError('surface exceeds the maximum encoded size');
  }

  return JSON.parse(encoded) as GalaxySurfaceSpec;
}

export function deriveGalaxySurfaceTitle(message: A2UIMessage): string {
  for (const component of message.surfaceUpdate?.components ?? []) {
    const props = Object.values(component.component)[0];
    if (typeof props !== 'object' || props === null) continue;
    for (const field of ['title', 'text']) {
      const value = props[field];
      if (typeof value === 'string' && value.trim()) return value.trim().slice(0, 200);
    }
  }
  return 'Generous canvas surface';
}
