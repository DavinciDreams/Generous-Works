/**
 * Galaxy checks each component's props with JSON Schema, using Python's
 * jsonschema. This applies the same schemas here, so a save Galaxy would
 * refuse fails, or loses only the offending prop, before it is sent.
 *
 * It implements exactly the keywords Galaxy's catalog uses, with Galaxy's
 * meaning: string lengths are code points, as Python counts them, and a
 * keyword only constrains values of the type it applies to. A schema that
 * uses any other keyword is refused when loaded, so a keyword Galaxy adds
 * later cannot be silently ignored here.
 */

export type JsonSchema = { readonly [keyword: string]: unknown };

const SUPPORTED_KEYWORDS = new Set([
  'additionalProperties', 'anyOf', 'const', 'enum', 'exclusiveMinimum', 'items',
  'maxItems', 'maxLength', 'maxProperties', 'maximum', 'minItems', 'minLength',
  'minProperties', 'minimum', 'not', 'oneOf', 'pattern', 'properties', 'required', 'type',
  // Annotations, which constrain nothing.
  'description', 'title',
]);

/** A character outside the Basic Multilingual Plane is two UTF-16 units. */
const SURROGATE_PAIR = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

/** Code points, as Python's len() counts them. */
export function codePointLength(value: string): number {
  return value.length - (value.match(SURROGATE_PAIR)?.length ?? 0);
}

/** Whether a string has more than `max` code points, counting only when it could. */
export function exceedsCodePoints(value: string, max: number): boolean {
  return value.length > max && codePointLength(value) > max;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Throw unless every keyword in the schema, at any depth, is one implemented here. */
export function assertSupportedSchema(schema: unknown, path: string): void {
  if (typeof schema === 'boolean') return;
  if (!isObject(schema)) throw new Error(`${path} is not a schema`);
  for (const [keyword, value] of Object.entries(schema)) {
    if (!SUPPORTED_KEYWORDS.has(keyword)) throw new Error(`${path} uses unsupported keyword ${keyword}`);
    if (keyword === 'properties' && isObject(value)) {
      for (const [name, child] of Object.entries(value)) assertSupportedSchema(child, `${path}.properties.${name}`);
    }
    if ((keyword === 'items' || keyword === 'not' || keyword === 'additionalProperties') && typeof value !== 'boolean') {
      assertSupportedSchema(value, `${path}.${keyword}`);
    }
    if ((keyword === 'anyOf' || keyword === 'oneOf') && Array.isArray(value)) {
      value.forEach((child, index) => assertSupportedSchema(child, `${path}.${keyword}[${index}]`));
    }
  }
}

/** JSON equality as jsonschema means it: booleans are never numbers. */
function jsonEqual(left: unknown, right: unknown): boolean {
  if (typeof left !== typeof right) return false;
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left) && Array.isArray(right) && left.length === right.length
      && left.every((item, index) => jsonEqual(item, right[index]));
  }
  if (isObject(left) && isObject(right)) {
    const keys = Object.keys(left);
    return keys.length === Object.keys(right).length
      && keys.every((key) => Object.hasOwn(right, key) && jsonEqual(left[key], right[key]));
  }
  return left === right;
}

function hasType(value: unknown, type: unknown): boolean {
  switch (type) {
    case 'object': return isObject(value);
    case 'array': return Array.isArray(value);
    case 'string': return typeof value === 'string';
    case 'number': return typeof value === 'number' && Number.isFinite(value);
    case 'integer': return typeof value === 'number' && Number.isInteger(value);
    case 'boolean': return typeof value === 'boolean';
    case 'null': return value === null;
    default: return false;
  }
}

const patterns = new Map<string, RegExp>();
function patternFor(source: string): RegExp {
  let pattern = patterns.get(source);
  if (!pattern) {
    pattern = new RegExp(source);
    patterns.set(source, pattern);
  }
  return pattern;
}

const describe = (value: unknown) => JSON.stringify(value)?.slice(0, 60) ?? String(value);

/**
 * Why `value` fails `schema`, or null when it passes. Like jsonschema, an
 * unsatisfiable alternative reports only that no alternative matched.
 */
export function schemaError(value: unknown, schema: unknown, path: string): string | null {
  if (schema === true) return null;
  if (schema === false) return `${path} is not allowed`;
  if (!isObject(schema)) return `${path} has no schema`;
  const s = schema;

  if (s.type !== undefined) {
    const types = Array.isArray(s.type) ? s.type : [s.type];
    if (!types.some((type) => hasType(value, type))) return `${path} must be ${types.join(' or ')}`;
  }
  if (Array.isArray(s.enum) && !s.enum.some((option) => jsonEqual(option, value))) {
    return `${path} must be one of ${s.enum.map(describe).join(', ')}, not ${describe(value)}`;
  }
  if ('const' in s && !jsonEqual(s.const, value)) return `${path} must be ${describe(s.const)}`;

  if (typeof value === 'string') {
    if (typeof s.maxLength === 'number' && exceedsCodePoints(value, s.maxLength)) {
      return `${path} must be at most ${s.maxLength} characters`;
    }
    if (typeof s.minLength === 'number' && codePointLength(value) < s.minLength) {
      return `${path} must be at least ${s.minLength} characters`;
    }
    if (typeof s.pattern === 'string' && !patternFor(s.pattern).test(value)) {
      return `${path} is not in the accepted format`;
    }
  }
  if (typeof value === 'number') {
    if (typeof s.minimum === 'number' && value < s.minimum) return `${path} must be at least ${s.minimum}`;
    if (typeof s.maximum === 'number' && value > s.maximum) return `${path} must be at most ${s.maximum}`;
    if (typeof s.exclusiveMinimum === 'number' && value <= s.exclusiveMinimum) {
      return `${path} must be more than ${s.exclusiveMinimum}`;
    }
  }
  if (Array.isArray(value)) {
    if (typeof s.minItems === 'number' && value.length < s.minItems) return `${path} needs at least ${s.minItems} items`;
    if (typeof s.maxItems === 'number' && value.length > s.maxItems) return `${path} allows at most ${s.maxItems} items`;
    if (s.items !== undefined) {
      for (let index = 0; index < value.length; index += 1) {
        const error = schemaError(value[index], s.items, `${path}[${index}]`);
        if (error) return error;
      }
    }
  }
  if (isObject(value)) {
    const keys = Object.keys(value);
    if (typeof s.minProperties === 'number' && keys.length < s.minProperties) {
      return `${path} needs at least ${s.minProperties} entries`;
    }
    if (typeof s.maxProperties === 'number' && keys.length > s.maxProperties) {
      return `${path} allows at most ${s.maxProperties} entries`;
    }
    for (const name of Array.isArray(s.required) ? s.required : []) {
      if (typeof name === 'string' && !Object.hasOwn(value, name)) return `${path}.${name} is required`;
    }
    const properties = isObject(s.properties) ? s.properties : {};
    for (const key of keys) {
      const childPath = `${path}.${key}`;
      const error = Object.hasOwn(properties, key)
        ? schemaError(value[key], properties[key], childPath)
        : s.additionalProperties === undefined
          ? null
          : s.additionalProperties === false
            ? `${childPath} is not something Galaxy accepts here`
            : schemaError(value[key], s.additionalProperties, childPath);
      if (error) return error;
    }
  }

  if (s.not !== undefined && schemaError(value, s.not, path) === null) return `${path} is not in the accepted format`;
  if (Array.isArray(s.anyOf) && !s.anyOf.some((option) => schemaError(value, option, path) === null)) {
    return `${path} does not match any accepted form`;
  }
  if (Array.isArray(s.oneOf) && s.oneOf.filter((option) => schemaError(value, option, path) === null).length !== 1) {
    return `${path} must match exactly one accepted form`;
  }
  return null;
}
