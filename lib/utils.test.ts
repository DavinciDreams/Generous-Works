import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn (className utility)', () => {
  it('should merge multiple class names', () => {
    const result = cn('class-1', 'class-2');
    expect(result).toBe('class-1 class-2');
  });

  it('should handle conditional class names with undefined', () => {
    const result = cn('class-1', undefined, 'class-2');
    expect(result).toBe('class-1 class-2');
  });

  it('should handle conditional class names with null', () => {
    const result = cn('class-1', null, 'class-2');
    expect(result).toBe('class-1 class-2');
  });

  it('should handle conditional class names with false', () => {
    const result = cn('class-1', false && 'class-2', 'class-3');
    expect(result).toBe('class-1 class-3');
  });

  it('should handle conditional class names with true', () => {
    const result = cn('class-1', true && 'class-2', 'class-3');
    expect(result).toBe('class-1 class-2 class-3');
  });

  it('should merge Tailwind conflicting classes correctly', () => {
    // tailwind-merge should keep the last conflicting class
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4');
  });

  it('should merge Tailwind classes with variants', () => {
    const result = cn('hover:px-2', 'hover:px-4');
    expect(result).toBe('hover:px-4');
  });

  it('should handle arrays of class names', () => {
    const result = cn(['class-1', 'class-2']);
    expect(result).toBe('class-1 class-2');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'class-1': true,
      'class-2': false,
      'class-3': true
    });
    expect(result).toBe('class-1 class-3');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle complex mixed inputs', () => {
    const result = cn(
      'base-class',
      ['array-class-1', 'array-class-2'],
      { 'object-class-1': true, 'object-class-2': false },
      undefined,
      null,
      false && 'conditional-class',
      'final-class'
    );
    expect(result).toContain('base-class');
    expect(result).toContain('array-class-1');
    expect(result).toContain('array-class-2');
    expect(result).toContain('object-class-1');
    expect(result).toContain('final-class');
    expect(result).not.toContain('object-class-2');
    expect(result).not.toContain('conditional-class');
  });
});
