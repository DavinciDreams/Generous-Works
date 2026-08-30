import type {
  A2UIComponent,
  A2UIMessage,
  A2UITypedValue,
} from './types';

const DEFAULT_SURFACE_ID = '@default';
const MAX_EVENT_CHARS = 256 * 1024;
const MAX_SURFACES = 32;
const MAX_COMPONENTS_PER_UPDATE = 256;
const MAX_COMPONENTS_PER_SURFACE = 512;
const MAX_DATA_ENTRIES = 512;
const MAX_VALUE_DEPTH = 24;
const MAX_VALUE_NODES = 16_384;
const MAX_STRING_CHARS = 64 * 1024;
const MAX_IDENTIFIER_CHARS = 160;
const UNSAFE_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

export type A2UIJsonValue =
  | null
  | boolean
  | number
  | string
  | A2UIJsonValue[]
  | { [key: string]: A2UIJsonValue };

export interface A2UISurfaceStreamState {
  surfaceId: string;
  components: readonly A2UIComponent[];
  dataModel: { readonly [key: string]: A2UIJsonValue };
  ready: boolean;
  rootId?: string;
  catalogId?: string;
  styles?: { readonly [key: string]: A2UIJsonValue };
  revision: number;
}

export interface A2UIStreamState {
  surfaces: readonly A2UISurfaceStreamState[];
}

export type A2UIStreamErrorCode =
  | 'event-too-large'
  | 'invalid-json'
  | 'invalid-event'
  | 'limit-exceeded';

export interface A2UIStreamError {
  code: A2UIStreamErrorCode;
  message: string;
}

export type A2UIStreamApplyResult =
  | {
      ok: true;
      state: A2UIStreamState;
      duplicate: boolean;
      surfaceIds: readonly string[];
    }
  | {
      ok: false;
      state: A2UIStreamState;
      error: A2UIStreamError;
    };

export interface A2UIStreamApplyOptions {
  defaultSurfaceId?: string;
  /** Complete mode makes a legacy surface-only envelope immediately renderable. */
  mode?: 'stream' | 'complete';
}

interface NormalizedSurfaceUpdate {
  kind: 'surfaceUpdate';
  surfaceId: string;
  components: A2UIComponent[];
}

interface NormalizedDataModelUpdate {
  kind: 'dataModelUpdate';
  surfaceId: string;
  path: string[];
  operation: 'set' | 'delete' | 'merge-entries';
  value?: A2UIJsonValue;
}

interface NormalizedBeginRendering {
  kind: 'beginRendering';
  surfaceId: string;
  rootId?: string;
  catalogId?: string;
  styles?: { [key: string]: A2UIJsonValue };
  inferRoot: boolean;
}

type NormalizedEvent =
  | NormalizedSurfaceUpdate
  | NormalizedDataModelUpdate
  | NormalizedBeginRendering;

class NormalizerError extends Error {
  constructor(
    readonly code: A2UIStreamErrorCode,
    message: string,
  ) {
    super(message);
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function fail(code: A2UIStreamErrorCode, message: string): never {
  throw new NormalizerError(code, message);
}

function assertAllowedKeys(
  value: Record<string, unknown>,
  allowed: readonly string[],
  label: string,
): void {
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(value)) {
    if (!allowedSet.has(key)) fail('invalid-event', `${label} contains unsupported field "${key}"`);
  }
}

function validateIdentifier(value: unknown, label: string): string {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > MAX_IDENTIFIER_CHARS ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    fail('invalid-event', `${label} must be a non-empty bounded printable string`);
  }
  return value;
}

function cloneBoundedJson(
  value: unknown,
  depth = 0,
  counter = { nodes: 0, chars: 0 },
): A2UIJsonValue {
  counter.nodes += 1;
  if (depth > MAX_VALUE_DEPTH || counter.nodes > MAX_VALUE_NODES) {
    fail('limit-exceeded', 'event value exceeds nesting or node limits');
  }
  if (value === null) return null;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) fail('invalid-event', 'numbers must be finite');
    return value;
  }
  if (typeof value === 'string') {
    if (value.length > MAX_STRING_CHARS) fail('limit-exceeded', 'string value is too large');
    counter.chars += value.length;
    if (counter.chars > MAX_EVENT_CHARS) fail('limit-exceeded', 'event values exceed the total size limit');
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => cloneBoundedJson(item, depth + 1, counter));
  }
  if (!isRecord(value)) fail('invalid-event', 'values must be JSON-compatible');

  const cloned: { [key: string]: A2UIJsonValue } = {};
  for (const [key, child] of Object.entries(value)) {
    if (UNSAFE_KEYS.has(key)) fail('invalid-event', `unsafe object key "${key}" is not allowed`);
    if (key.length > MAX_IDENTIFIER_CHARS) fail('limit-exceeded', 'object key is too large');
    counter.chars += key.length;
    if (counter.chars > MAX_EVENT_CHARS) fail('limit-exceeded', 'event values exceed the total size limit');
    cloned[key] = cloneBoundedJson(child, depth + 1, counter);
  }
  return cloned;
}

function canonicalJson(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  return `{${Object.keys(value as Record<string, unknown>)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson((value as Record<string, unknown>)[key])}`)
    .join(',')}}`;
}

function parseInput(input: string | unknown): Record<string, unknown> {
  let parsed: unknown = input;
  if (typeof input === 'string') {
    if (input.length > MAX_EVENT_CHARS) fail('event-too-large', 'A2UI event exceeds 256 KiB');
    try {
      parsed = JSON.parse(input);
    } catch {
      fail('invalid-json', 'A2UI event is not valid JSON');
    }
  }
  // Bounds object input too, and clone it so later caller mutation cannot alter state.
  const cloned = cloneBoundedJson(parsed);
  if (!isRecord(cloned)) fail('invalid-event', 'A2UI event must be a JSON object');
  return cloned;
}

function normalizeSurfaceUpdate(
  raw: unknown,
  fallbackSurfaceId: string,
): NormalizedSurfaceUpdate {
  if (!isRecord(raw)) fail('invalid-event', 'surfaceUpdate must be an object');
  assertAllowedKeys(raw, ['surfaceId', 'components'], 'surfaceUpdate');
  const surfaceId = validateIdentifier(raw.surfaceId ?? fallbackSurfaceId, 'surfaceId');
  if (!Array.isArray(raw.components)) fail('invalid-event', 'surfaceUpdate.components must be an array');
  if (raw.components.length > MAX_COMPONENTS_PER_UPDATE) {
    fail('limit-exceeded', `surfaceUpdate may contain at most ${MAX_COMPONENTS_PER_UPDATE} components`);
  }

  const componentIds = new Set<string>();
  const components = raw.components.map((candidate, index) => {
    if (!isRecord(candidate)) fail('invalid-event', `component ${index} must be an object`);
    assertAllowedKeys(candidate, ['id', 'component', 'parentId', 'children'], `component ${index}`);
    const id = validateIdentifier(candidate.id, `component ${index} id`);
    if (componentIds.has(id)) fail('invalid-event', `duplicate component id "${id}" in update`);
    componentIds.add(id);
    if (!isRecord(candidate.component)) {
      fail('invalid-event', `component "${id}" definition must be an object`);
    }
    const definitions = Object.entries(candidate.component);
    if (definitions.length !== 1 || !isRecord(definitions[0][1])) {
      fail('invalid-event', `component "${id}" must contain exactly one component type`);
    }
    validateIdentifier(definitions[0][0], `component "${id}" type`);
    if (candidate.parentId !== undefined) validateIdentifier(candidate.parentId, `component "${id}" parentId`);
    if (candidate.children !== undefined) {
      if (!Array.isArray(candidate.children)) fail('invalid-event', `component "${id}" children must be an array`);
      candidate.children.forEach((child, childIndex) =>
        validateIdentifier(child, `component "${id}" child ${childIndex}`),
      );
    }
    return candidate as unknown as A2UIComponent;
  });

  return { kind: 'surfaceUpdate', surfaceId, components };
}

const TYPED_VALUE_KEYS = [
  'valueString',
  'valueNumber',
  'valueBoolean',
  'valueMap',
  'valueList',
] as const;

function decodeTypedValue(raw: unknown, depth = 0): A2UIJsonValue {
  if (depth > MAX_VALUE_DEPTH) fail('limit-exceeded', 'typed data value is nested too deeply');
  if (!isRecord(raw)) fail('invalid-event', 'typed data value must be an object');
  assertAllowedKeys(raw, TYPED_VALUE_KEYS, 'typed data value');
  const present = TYPED_VALUE_KEYS.filter((key) => raw[key] !== undefined);
  if (present.length !== 1) fail('invalid-event', 'typed data value must contain exactly one value field');
  const key = present[0];
  const value = raw[key];
  if (key === 'valueString') {
    if (typeof value !== 'string') fail('invalid-event', 'valueString must be a string');
    return value;
  }
  if (key === 'valueNumber') {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      fail('invalid-event', 'valueNumber must be finite');
    }
    return value;
  }
  if (key === 'valueBoolean') {
    if (typeof value !== 'boolean') fail('invalid-event', 'valueBoolean must be a boolean');
    return value;
  }
  if (!Array.isArray(value)) fail('invalid-event', `${key} must be an array`);
  if (value.length > MAX_DATA_ENTRIES) fail('limit-exceeded', `${key} contains too many entries`);
  if (key === 'valueMap') return decodeDataEntries(value, depth + 1);
  return value.map((item) => decodeTypedValue(item, depth + 1));
}

function decodeDataEntries(entries: unknown[], depth = 0): { [key: string]: A2UIJsonValue } {
  if (entries.length > MAX_DATA_ENTRIES) fail('limit-exceeded', 'dataModelUpdate contains too many entries');
  const decoded: { [key: string]: A2UIJsonValue } = {};
  for (const [index, candidate] of entries.entries()) {
    if (!isRecord(candidate)) fail('invalid-event', `data entry ${index} must be an object`);
    const key = validateIdentifier(candidate.key, `data entry ${index} key`);
    if (UNSAFE_KEYS.has(key)) fail('invalid-event', `unsafe data key "${key}" is not allowed`);
    if (Object.hasOwn(decoded, key)) fail('invalid-event', `duplicate data key "${key}"`);
    const valueSource = isRecord(candidate.value)
      ? candidate.value
      : Object.fromEntries(Object.entries(candidate).filter(([entryKey]) => entryKey !== 'key'));
    assertAllowedKeys(candidate, ['key', 'value', ...TYPED_VALUE_KEYS], `data entry ${index}`);
    decoded[key] = decodeTypedValue(valueSource as A2UITypedValue, depth + 1);
  }
  return decoded;
}

function parsePath(value: unknown): string[] {
  if (value === undefined || value === '' || value === '/') return [];
  if (typeof value !== 'string' || value.length > MAX_STRING_CHARS) {
    fail('invalid-event', 'data model path must be a bounded string');
  }
  const rawParts = value.startsWith('/') ? value.slice(1).split('/') : value.split('/');
  if (rawParts.length > MAX_VALUE_DEPTH) fail('limit-exceeded', 'data model path is too deep');
  return rawParts.map((part) => {
    const decoded = part.replace(/~1/g, '/').replace(/~0/g, '~');
    if (!decoded || UNSAFE_KEYS.has(decoded)) fail('invalid-event', 'data model path contains an unsafe segment');
    return decoded;
  });
}

function normalizeDataModelUpdate(
  raw: unknown,
  fallbackSurfaceId: string,
): NormalizedDataModelUpdate {
  if (!isRecord(raw)) fail('invalid-event', 'dataModelUpdate must be an object');
  const surfaceId = validateIdentifier(raw.surfaceId ?? fallbackSurfaceId, 'surfaceId');
  const path = parsePath(raw.path);

  if (raw.contents !== undefined) {
    assertAllowedKeys(raw, ['surfaceId', 'path', 'contents'], 'dataModelUpdate');
    if (!Array.isArray(raw.contents)) fail('invalid-event', 'dataModelUpdate.contents must be an array');
    return {
      kind: 'dataModelUpdate',
      surfaceId,
      path,
      operation: 'merge-entries',
      value: decodeDataEntries(raw.contents),
    };
  }

  assertAllowedKeys(raw, ['surfaceId', 'path', 'value', 'operation'], 'dataModelUpdate');
  const operation = raw.operation ?? 'set';
  if (operation !== 'set' && operation !== 'delete' && operation !== 'merge') {
    fail('invalid-event', 'legacy dataModelUpdate.operation must be set, delete, or merge');
  }
  if (operation !== 'delete' && !Object.hasOwn(raw, 'value')) {
    fail('invalid-event', 'legacy dataModelUpdate.value is required');
  }
  const value = Object.hasOwn(raw, 'value') ? cloneBoundedJson(raw.value) : undefined;
  if (operation === 'merge' && !isRecord(value)) {
    fail('invalid-event', 'legacy merge value must be an object');
  }
  return {
    kind: 'dataModelUpdate',
    surfaceId,
    path,
    operation: operation === 'merge' ? 'merge-entries' : operation,
    value,
  };
}

function normalizeBeginRendering(
  raw: unknown,
  fallbackSurfaceId: string,
): NormalizedBeginRendering {
  if (raw === true) {
    return {
      kind: 'beginRendering',
      surfaceId: fallbackSurfaceId,
      inferRoot: true,
    };
  }
  if (!isRecord(raw)) fail('invalid-event', 'beginRendering must be true or an object');
  assertAllowedKeys(raw, ['surfaceId', 'root', 'catalogId', 'styles'], 'beginRendering');
  const surfaceId = validateIdentifier(raw.surfaceId ?? fallbackSurfaceId, 'surfaceId');
  const rootId = validateIdentifier(raw.root, 'beginRendering.root');
  const catalogId = raw.catalogId === undefined
    ? undefined
    : validateIdentifier(raw.catalogId, 'beginRendering.catalogId');
  let styles: { [key: string]: A2UIJsonValue } | undefined;
  if (raw.styles !== undefined) {
    const cloned = cloneBoundedJson(raw.styles);
    if (!isRecord(cloned)) fail('invalid-event', 'beginRendering.styles must be an object');
    styles = cloned as { [key: string]: A2UIJsonValue };
  }
  return { kind: 'beginRendering', surfaceId, rootId, catalogId, styles, inferRoot: false };
}

function normalizeEnvelope(
  envelope: Record<string, unknown>,
  options: A2UIStreamApplyOptions,
): NormalizedEvent[] {
  assertAllowedKeys(envelope, ['surfaceUpdate', 'dataModelUpdate', 'beginRendering'], 'A2UI event');
  const present = ['surfaceUpdate', 'dataModelUpdate', 'beginRendering'].filter((key) =>
    Object.hasOwn(envelope, key),
  );
  if (present.length === 0) fail('invalid-event', 'A2UI event has no supported message');

  const explicitSurfaceIds = [envelope.surfaceUpdate, envelope.dataModelUpdate, envelope.beginRendering]
    .filter(isRecord)
    .map((value) => value.surfaceId)
    .filter((value): value is string => typeof value === 'string');
  const fallbackSurfaceId = validateIdentifier(
    explicitSurfaceIds[0] ?? options.defaultSurfaceId ?? DEFAULT_SURFACE_ID,
    'default surfaceId',
  );
  const events: NormalizedEvent[] = [];
  if (Object.hasOwn(envelope, 'surfaceUpdate')) {
    events.push(normalizeSurfaceUpdate(envelope.surfaceUpdate, fallbackSurfaceId));
  }
  if (Object.hasOwn(envelope, 'dataModelUpdate')) {
    events.push(normalizeDataModelUpdate(envelope.dataModelUpdate, fallbackSurfaceId));
  }
  if (Object.hasOwn(envelope, 'beginRendering')) {
    events.push(normalizeBeginRendering(envelope.beginRendering, fallbackSurfaceId));
  } else if (options.mode === 'complete' && Object.hasOwn(envelope, 'surfaceUpdate')) {
    events.push({ kind: 'beginRendering', surfaceId: fallbackSurfaceId, inferRoot: true });
  }
  return events;
}

function replaceSurface(
  surfaces: readonly A2UISurfaceStreamState[],
  nextSurface: A2UISurfaceStreamState,
): A2UISurfaceStreamState[] {
  const index = surfaces.findIndex((surface) => surface.surfaceId === nextSurface.surfaceId);
  if (index < 0) {
    if (surfaces.length >= MAX_SURFACES) fail('limit-exceeded', `stream may contain at most ${MAX_SURFACES} surfaces`);
    return [...surfaces, nextSurface];
  }
  const next = surfaces.slice();
  next[index] = nextSurface;
  return next;
}

function emptySurface(surfaceId: string): A2UISurfaceStreamState {
  return { surfaceId, components: [], dataModel: {}, ready: false, revision: 0 };
}

function sameJson(left: unknown, right: unknown): boolean {
  return canonicalJson(left) === canonicalJson(right);
}

function applySurfaceUpdate(
  surface: A2UISurfaceStreamState,
  event: NormalizedSurfaceUpdate,
): A2UISurfaceStreamState {
  const components = surface.components.slice();
  let changed = false;
  for (const component of event.components) {
    const index = components.findIndex((candidate) => candidate.id === component.id);
    if (index < 0) {
      components.push(component);
      changed = true;
    } else if (!sameJson(components[index], component)) {
      components[index] = component;
      changed = true;
    }
  }
  if (components.length > MAX_COMPONENTS_PER_SURFACE) {
    fail('limit-exceeded', `surface may contain at most ${MAX_COMPONENTS_PER_SURFACE} components`);
  }
  return changed ? { ...surface, components, revision: surface.revision + 1 } : surface;
}

function updateObjectPath(
  model: { readonly [key: string]: A2UIJsonValue },
  path: readonly string[],
  operation: NormalizedDataModelUpdate['operation'],
  value?: A2UIJsonValue,
): { [key: string]: A2UIJsonValue } {
  if (path.length === 0) {
    if (operation === 'delete') return {};
    if (!isRecord(value)) fail('invalid-event', 'root data model update must produce an object');
    if (operation === 'merge-entries') return { ...model, ...(value as object) };
    return value as { [key: string]: A2UIJsonValue };
  }

  const [head, ...tail] = path;
  const existing = model[head];
  const child = isRecord(existing) ? existing as { [key: string]: A2UIJsonValue } : {};
  const next: { [key: string]: A2UIJsonValue } = { ...model };
  if (tail.length === 0) {
    if (operation === 'delete') delete next[head];
    else if (operation === 'merge-entries') {
      if (!isRecord(value)) fail('invalid-event', 'merged data model value must be an object');
      next[head] = { ...child, ...(value as object) } as { [key: string]: A2UIJsonValue };
    } else {
      next[head] = value as A2UIJsonValue;
    }
    return next;
  }
  next[head] = updateObjectPath(child, tail, operation, value);
  return next;
}

function applyDataModelUpdate(
  surface: A2UISurfaceStreamState,
  event: NormalizedDataModelUpdate,
): A2UISurfaceStreamState {
  const dataModel = updateObjectPath(surface.dataModel, event.path, event.operation, event.value);
  return sameJson(surface.dataModel, dataModel)
    ? surface
    : { ...surface, dataModel, revision: surface.revision + 1 };
}

function applyBeginRendering(
  surface: A2UISurfaceStreamState,
  event: NormalizedBeginRendering,
): A2UISurfaceStreamState {
  const rootId = event.inferRoot
    ? surface.components.find((component) => component.id === 'root')?.id ?? surface.components[0]?.id
    : event.rootId;
  if (!rootId || !surface.components.some((component) => component.id === rootId)) {
    fail('invalid-event', 'beginRendering.root must reference a buffered component');
  }
  const next = {
    ...surface,
    ready: true,
    rootId,
    catalogId: event.catalogId ?? surface.catalogId,
    styles: event.styles ?? surface.styles,
  };
  const changed =
    !surface.ready ||
    surface.rootId !== next.rootId ||
    surface.catalogId !== next.catalogId ||
    !sameJson(surface.styles, next.styles);
  return changed ? { ...next, revision: surface.revision + 1 } : surface;
}

export function createA2UIStreamState(): A2UIStreamState {
  return { surfaces: [] };
}

export function findA2UISurface(
  state: A2UIStreamState,
  surfaceId = DEFAULT_SURFACE_ID,
): A2UISurfaceStreamState | undefined {
  return state.surfaces.find((surface) => surface.surfaceId === surfaceId);
}

/**
 * Parse and atomically apply one A2UI v0.8 JSONL event (or one legacy complete
 * envelope). This function is deliberately pure: it does not render, execute
 * actions, access storage, or perform network requests.
 */
export function applyA2UIStreamEvent(
  state: A2UIStreamState,
  input: string | unknown,
  options: A2UIStreamApplyOptions = {},
): A2UIStreamApplyResult {
  try {
    const envelope = parseInput(input);
    const events = normalizeEnvelope(envelope, { ...options, mode: options.mode ?? 'stream' });
    let surfaces = state.surfaces.slice();
    let changed = false;
    const touchedSurfaceIds = new Set<string>();
    for (const event of events) {
      const existingSurface = surfaces.find((surface) => surface.surfaceId === event.surfaceId);
      const surface = existingSurface ?? emptySurface(event.surfaceId);
      const updated = event.kind === 'surfaceUpdate'
        ? applySurfaceUpdate(surface, event)
        : event.kind === 'dataModelUpdate'
          ? applyDataModelUpdate(surface, event)
          : applyBeginRendering(surface, event);
      if (!existingSurface || updated !== existingSurface) {
        surfaces = replaceSurface(surfaces, updated);
        changed = true;
      }
      touchedSurfaceIds.add(event.surfaceId);
    }
    return {
      ok: true,
      state: changed ? { surfaces } : state,
      duplicate: !changed,
      surfaceIds: [...touchedSurfaceIds],
    };
  } catch (error) {
    const normalized = error instanceof NormalizerError
      ? error
      : new NormalizerError('invalid-event', 'A2UI event could not be normalized');
    return {
      ok: false,
      state,
      error: { code: normalized.code, message: normalized.message },
    };
  }
}

/** Apply Generous' original complete-message shape and infer render readiness. */
export function applyA2UICompleteMessage(
  state: A2UIStreamState,
  input: string | A2UIMessage,
  options: Omit<A2UIStreamApplyOptions, 'mode'> = {},
): A2UIStreamApplyResult {
  return applyA2UIStreamEvent(state, input, { ...options, mode: 'complete' });
}

/** Produce the complete surface envelope consumed by today's A2UIRenderer. */
export function toA2UIMessage(surface: A2UISurfaceStreamState): A2UIMessage {
  return {
    surfaceUpdate: {
      surfaceId: surface.surfaceId,
      components: surface.components.slice(),
    },
    beginRendering: surface.ready,
  };
}
