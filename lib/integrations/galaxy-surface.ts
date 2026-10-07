import type { A2UIComponent, A2UIMessage } from '@/lib/a2ui/types';

import contract from './galaxy-surface-contract.json';
import {
  assertSupportedSchema,
  codePointLength,
  exceedsCodePoints,
  schemaError,
  type JsonSchema,
} from './galaxy-props-schema';

export const GALAXY_SURFACE_SCHEMA = 'gb.surface.v1' as const;
export const GALAXY_SURFACE_CATALOG = {
  id: 'generous.a2ui',
  version: '1',
} as const;

/**
 * Galaxy's gb.surface.v1 contract: its bounds, its rules for keys and
 * strings, and every component's prop schema. A copy of the `schema` and
 * `catalog` sections of Galaxy's services/galaxy-brain-api/contracts/
 * gb.surface.v1.json; the tests check it still hashes to these digests, so
 * any change to it is deliberate and matches a Galaxy release.
 */
interface GalaxySurfaceContract {
  schema: {
    bounds: Record<
      'maxComponents' | 'maxJsonBytes' | 'maxStringLength' | 'maxDepth' | 'maxValueNodes',
      number
    >;
    identifierPattern: string;
    forbiddenPropertyNames: string[];
    forbiddenPropertyPattern: string;
    forbiddenStringFragments: string[];
  };
  catalog: { components: Record<string, { propsSchema: JsonSchema }> };
  digests: { algorithm: string; schema: string; catalog: string };
}
const GALAXY_CONTRACT = contract as unknown as GalaxySurfaceContract;
export const GALAXY_CONTRACT_DIGESTS = GALAXY_CONTRACT.digests;

const {
  maxComponents: MAX_COMPONENTS,
  maxJsonBytes: MAX_JSON_BYTES,
  maxDepth: MAX_DEPTH,
  maxValueNodes: MAX_VALUE_NODES,
  maxStringLength: MAX_STRING_LENGTH,
} = GALAXY_CONTRACT.schema.bounds;
const IDENTIFIER_PATTERN = new RegExp(GALAXY_CONTRACT.schema.identifierPattern);
const ACTION_KEY_PATTERN = new RegExp(GALAXY_CONTRACT.schema.forbiddenPropertyPattern);
const FORBIDDEN_PROPERTY_NAMES = new Set(
  GALAXY_CONTRACT.schema.forbiddenPropertyNames.map((name) => name.toLowerCase()),
);
const FORBIDDEN_STRING_FRAGMENTS = GALAXY_CONTRACT.schema.forbiddenStringFragments;
const COMPONENT_KEYS = new Set(['id', 'component', 'parentId', 'children']);

const COMPONENT_SCHEMAS = GALAXY_CONTRACT.catalog.components;
Object.entries(COMPONENT_SCHEMAS).forEach(([type, { propsSchema }]) =>
  assertSupportedSchema(propsSchema, `${type}.propsSchema`),
);

/** Keys that mark a component as carrying behaviour, wherever they appear. */
function isForbiddenKey(key: string): boolean {
  return ACTION_KEY_PATTERN.test(key) || FORBIDDEN_PROPERTY_NAMES.has(key.toLowerCase());
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

/** Galaxy's surface-wide bounds for one value, as its server applies them. */
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
    if (exceedsCodePoints(value, MAX_STRING_LENGTH)) {
      throw new GalaxySurfaceContractError(`${path} exceeds the maximum string length`);
    }
    const normalized = value.toLowerCase();
    if (FORBIDDEN_STRING_FRAGMENTS.some((fragment) => normalized.includes(fragment))) {
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

/**
 * Refuse a component built to do something, even through a prop that would
 * be left behind: an `onClick` anywhere says what the component was for.
 * Walks every key at any depth, without recursion, within a fixed budget.
 */
function assertNoBehaviour(props: Record<string, unknown>, path: string): void {
  const pending: [unknown, string][] = [[props, path]];
  let budget = MAX_VALUE_NODES * 4;
  while (pending.length > 0) {
    const [value, at] = pending.pop()!;
    if ((budget -= 1) < 0) throw new GalaxySurfaceContractError('surface contains too many values');
    if (Array.isArray(value)) {
      value.forEach((item, index) => pending.push([item, `${at}[${index}]`]));
    } else if (typeof value === 'object' && value !== null) {
      for (const [key, item] of Object.entries(value)) {
        if (isForbiddenKey(key)) {
          throw new GalaxySurfaceContractError(`${at}.${key} is not allowed in a promotable surface`);
        }
        pending.push([item, `${at}.${key}`]);
      }
    }
  }
}

/**
 * Galaxy's own pattern for an SVG document, from its contract. Checked here
 * first only to give a clearer reason than "not in the accepted format".
 */
const SVG_DOCUMENT_START = /^\s*(<\?xml[^>]*\?>\s*)?(<!--(?:[^-]|-(?!->))*-->\s*)*<[sS][vV][gG][\s>/]/;

/** Say exactly why a drawing Galaxy would refuse is refused. Nothing here can repair it. */
function assertGalaxySvgDocument(svg: unknown, path: string): void {
  if (typeof svg !== 'string' || svg.trim().length === 0) {
    throw new GalaxySurfaceContractError(`${path} must be a non-empty SVG document`);
  }
  if (exceedsCodePoints(svg, MAX_STRING_LENGTH)) {
    throw new GalaxySurfaceContractError(
      `${path} is ${codePointLength(svg).toLocaleString('en-US')} characters; Galaxy accepts SVG up to ${MAX_STRING_LENGTH.toLocaleString('en-US')}`,
    );
  }
  if (/<!\s*(doctype|entity)/i.test(svg)) {
    throw new GalaxySurfaceContractError(`${path} must not declare a DOCTYPE or entities`);
  }
  if (!SVG_DOCUMENT_START.test(svg)) {
    throw new GalaxySurfaceContractError(`${path} must be a single SVG document`);
  }
}

/**
 * The props Galaxy will take for one component. Each declared prop is held to
 * Galaxy's schema for it and to the surface-wide bounds. Props Galaxy does not
 * declare, and optional props it would refuse, are left behind: the model
 * writes them and the user cannot edit them, so one should not fail an
 * otherwise good save. A required prop Galaxy would refuse fails the save,
 * saying why, since the component means nothing without it.
 */
function toGalaxyProps(
  componentType: string,
  props: Record<string, unknown>,
  path: string,
  counter: { value: number },
): Record<string, unknown> {
  assertNoBehaviour(props, path);
  const schema = COMPONENT_SCHEMAS[componentType].propsSchema;
  const declared = (schema.properties ?? {}) as Record<string, JsonSchema>;
  const required = new Set(Array.isArray(schema.required) ? (schema.required as string[]) : []);
  if (componentType === 'SVGPreview') assertGalaxySvgDocument(props.svg, `${path}.svg`);

  counter.value += 1;
  const kept: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!Object.hasOwn(declared, key)) continue;
    const propPath = `${path}.${key}`;
    const trial = { value: counter.value };
    let reason: string | null = null;
    try {
      validateBoundedValue(value, propPath, 1, trial);
    } catch (error) {
      if (!(error instanceof GalaxySurfaceContractError)) throw error;
      reason = error.message;
    }
    reason ??= schemaError(value, declared[key], propPath);
    if (reason === null) {
      kept[key] = value;
      counter.value = trial.value;
    } else if (required.has(key)) {
      throw new GalaxySurfaceContractError(reason);
    }
  }
  const reason = schemaError(kept, schema, path);
  if (reason !== null) throw new GalaxySurfaceContractError(reason);
  return kept;
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
  const galaxyComponents: A2UIComponent[] = [];

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
    if (!Object.hasOwn(COMPONENT_SCHEMAS, componentType)) {
      throw new GalaxySurfaceContractError(
        `component type is not approved for Galaxy Brain: ${componentType}`,
      );
    }
    if (typeof props !== 'object' || props === null || Array.isArray(props)) {
      throw new GalaxySurfaceContractError(`${path}.component.${componentType} must be an object`);
    }
    // Galaxy takes only id, component, parentId and children on a component.
    // Layout hints such as `weight` are left behind, but behaviour is refused.
    Object.keys(component).forEach((key) => {
      if (!COMPONENT_KEYS.has(key) && isForbiddenKey(key)) {
        throw new GalaxySurfaceContractError(`${path}.${key} is not allowed in a promotable surface`);
      }
    });
    const galaxyProps = toGalaxyProps(
      componentType,
      props as Record<string, unknown>,
      `${path}.component.${componentType}`,
      counter,
    );

    if (component.parentId !== undefined) {
      requireIdentifier(component.parentId, `${path}.parentId`);
    }
    if (component.children !== undefined && !Array.isArray(component.children)) {
      throw new GalaxySurfaceContractError(`${path}.children must be an array`);
    }
    const children = component.children ?? [];
    children.forEach((childId) => requireIdentifier(childId, `${path}.children`));
    childrenById.set(component.id, children);

    galaxyComponents.push({
      id: component.id,
      component: { [componentType]: galaxyProps },
      ...(component.parentId === undefined ? {} : { parentId: component.parentId }),
      ...(component.children === undefined ? {} : { children: component.children }),
    } as A2UIComponent);
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
      components: galaxyComponents,
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
