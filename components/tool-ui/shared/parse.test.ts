import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { formatZodError, parseWithSchema } from './parse';

describe('formatZodError', () => {
  it('should format a single validation error', () => {
    const schema = z.object({ name: z.string() });
    const result = schema.safeParse({ name: 123 });

    if (!result.success) {
      const formatted = formatZodError(result.error);
      expect(formatted).toContain('name');
      expect(formatted).toContain('string');
    }
  });

  it('should format multiple validation errors', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number()
    });
    const result = schema.safeParse({ name: 123, age: 'not a number' });

    if (!result.success) {
      const formatted = formatZodError(result.error);
      expect(formatted).toContain('name');
      expect(formatted).toContain('age');
    }
  });

  it('should format nested object errors', () => {
    const schema = z.object({
      user: z.object({
        name: z.string()
      })
    });
    const result = schema.safeParse({ user: { name: 123 } });

    if (!result.success) {
      const formatted = formatZodError(result.error);
      expect(formatted).toContain('user.name');
    }
  });

  it('should format array index errors', () => {
    const schema = z.object({
      items: z.array(z.string())
    });
    const result = schema.safeParse({ items: ['valid', 123, 'also valid'] });

    if (!result.success) {
      const formatted = formatZodError(result.error);
      expect(formatted).toContain('items.[1]');
    }
  });

  it('should format root-level errors', () => {
    const schema = z.string();
    const result = schema.safeParse(123);

    if (!result.success) {
      const formatted = formatZodError(result.error);
      expect(formatted).toContain('root');
    }
  });

  it('should deduplicate identical errors', () => {
    const schema = z.object({
      field1: z.string(),
      field2: z.string()
    });

    // Use actual parsing to generate duplicate-like errors
    const result1 = schema.safeParse({ field1: 123, field2: 'valid' });
    const result2 = schema.safeParse({ field1: 123, field2: 'valid' });

    if (!result1.success && !result2.success) {
      // Combine issues to simulate duplicates
      const error = new z.ZodError([...result1.error.issues, ...result2.error.issues]);
      const formatted = formatZodError(error);
      const occurrences = (formatted.match(/field1/g) || []).length;
      expect(occurrences).toBe(1);
    }
  });

  it('should join multiple errors with semicolons', () => {
    const schema = z.object({
      field1: z.string(),
      field2: z.number()
    });
    const result = schema.safeParse({ field1: 123, field2: 'string' });

    if (!result.success) {
      const formatted = formatZodError(result.error);
      expect(formatted).toContain(';');
    }
  });

  it('should handle empty path array', () => {
    const error = new z.ZodError([
      {
        code: 'custom',
        path: [],
        message: 'Custom error'
      }
    ]);

    const formatted = formatZodError(error);
    expect(formatted).toContain('root: Custom error');
  });

  it('should handle complex nested paths', () => {
    const schema = z.object({
      users: z.array(z.object({
        profile: z.object({
          name: z.string()
        })
      }))
    });

    const result = schema.safeParse({
      users: [
        { profile: { name: 'valid' } },
        { profile: { name: 123 } }
      ]
    });

    if (!result.success) {
      const formatted = formatZodError(result.error);
      expect(formatted).toContain('users.[1].profile.name');
    }
  });
});

describe('parseWithSchema', () => {
  it('should successfully parse valid input', () => {
    const schema = z.object({ name: z.string() });
    const input = { name: 'John' };

    const result = parseWithSchema(schema, input, 'User');
    expect(result).toEqual({ name: 'John' });
  });

  it('should throw error with component name for invalid input', () => {
    const schema = z.object({ name: z.string() });
    const input = { name: 123 };

    expect(() => {
      parseWithSchema(schema, input, 'User');
    }).toThrow('Invalid User payload');
  });

  it('should include formatted error details', () => {
    const schema = z.object({ name: z.string() });
    const input = { name: 123 };

    expect(() => {
      parseWithSchema(schema, input, 'User');
    }).toThrow('name');
  });

  it('should handle complex schemas', () => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
      email: z.string().email()
    });

    const validInput = {
      name: 'John',
      age: 30,
      email: 'john@example.com'
    };

    const result = parseWithSchema(schema, validInput, 'User');
    expect(result).toEqual(validInput);
  });

  it('should apply schema transformations', () => {
    const schema = z.object({
      name: z.string().trim().toLowerCase()
    });

    const input = { name: '  JOHN  ' };
    const result = parseWithSchema(schema, input, 'User');
    expect(result.name).toBe('john');
  });

  it('should handle union types', () => {
    const schema = z.union([
      z.object({ type: z.literal('user'), name: z.string() }),
      z.object({ type: z.literal('admin'), role: z.string() })
    ]);

    const input = { type: 'user', name: 'John' };
    const result = parseWithSchema(schema, input, 'Profile');
    expect(result).toEqual(input);
  });

  it('should handle optional fields', () => {
    const schema = z.object({
      name: z.string(),
      nickname: z.string().optional()
    });

    const input = { name: 'John' };
    const result = parseWithSchema(schema, input, 'User');
    expect(result).toEqual({ name: 'John' });
  });

  it('should handle default values', () => {
    const schema = z.object({
      name: z.string(),
      active: z.boolean().default(true)
    });

    const input = { name: 'John' };
    const result = parseWithSchema(schema, input, 'User');
    expect(result).toEqual({ name: 'John', active: true });
  });
});
