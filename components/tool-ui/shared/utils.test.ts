import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { formatRelativeTime, formatCount, getDomain, prefersReducedMotion } from './utils';

describe('formatRelativeTime', () => {
  let now: number;

  beforeEach(() => {
    now = Date.now();
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should format seconds correctly', () => {
    const tenSecondsAgo = new Date(now - 10 * 1000).toISOString();
    expect(formatRelativeTime(tenSecondsAgo)).toBe('10s');
  });

  it('should format less than 1 second correctly', () => {
    const halfSecondAgo = new Date(now - 500).toISOString();
    expect(formatRelativeTime(halfSecondAgo)).toBe('1s');
  });

  it('should format minutes correctly', () => {
    const fiveMinutesAgo = new Date(now - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m');
  });

  it('should format hours correctly', () => {
    const threeHoursAgo = new Date(now - 3 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(threeHoursAgo)).toBe('3h');
  });

  it('should format days correctly', () => {
    const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoDaysAgo)).toBe('2d');
  });

  it('should format weeks correctly', () => {
    const twoWeeksAgo = new Date(now - 2 * 7 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(twoWeeksAgo)).toBe('2w');
  });

  it('should round to nearest minute when between 1-60 minutes', () => {
    const oneMinute30SecondsAgo = new Date(now - 90 * 1000).toISOString();
    expect(formatRelativeTime(oneMinute30SecondsAgo)).toBe('2m');
  });

  it('should round to nearest hour when between 1-24 hours', () => {
    const oneHour30MinutesAgo = new Date(now - (1.5 * 60 * 60 * 1000)).toISOString();
    expect(formatRelativeTime(oneHour30MinutesAgo)).toBe('2h');
  });
});

describe('formatCount', () => {
  it('should format numbers under 1000 as-is', () => {
    expect(formatCount(0)).toBe('0');
    expect(formatCount(1)).toBe('1');
    expect(formatCount(42)).toBe('42');
    expect(formatCount(999)).toBe('999');
  });

  it('should format thousands with K suffix', () => {
    expect(formatCount(1000)).toBe('1.0K');
    expect(formatCount(1500)).toBe('1.5K');
    expect(formatCount(10000)).toBe('10.0K');
    expect(formatCount(99999)).toBe('100.0K');
  });

  it('should format millions with M suffix', () => {
    expect(formatCount(1000000)).toBe('1.0M');
    expect(formatCount(1500000)).toBe('1.5M');
    expect(formatCount(10000000)).toBe('10.0M');
    expect(formatCount(99999999)).toBe('100.0M');
  });

  it('should round to 1 decimal place', () => {
    expect(formatCount(1234)).toBe('1.2K');
    expect(formatCount(1567)).toBe('1.6K');
    expect(formatCount(1234567)).toBe('1.2M');
  });

  it('should handle negative numbers', () => {
    // formatCount uses Math.abs behavior for negative numbers
    expect(formatCount(-1000)).toBe('-1000');
    expect(formatCount(-1000000)).toBe('-1000000');
  });
});

describe('getDomain', () => {
  it('should extract domain from valid URL', () => {
    expect(getDomain('https://example.com/path')).toBe('example.com');
    expect(getDomain('http://example.com')).toBe('example.com');
    expect(getDomain('https://subdomain.example.com')).toBe('subdomain.example.com');
  });

  it('should remove www prefix', () => {
    expect(getDomain('https://www.example.com')).toBe('example.com');
    expect(getDomain('http://www.subdomain.example.com')).toBe('subdomain.example.com');
  });

  it('should handle URLs with ports', () => {
    expect(getDomain('https://example.com:8080/path')).toBe('example.com');
  });

  it('should handle URLs with query parameters', () => {
    expect(getDomain('https://example.com/path?query=value')).toBe('example.com');
  });

  it('should handle URLs with fragments', () => {
    expect(getDomain('https://example.com/path#section')).toBe('example.com');
  });

  it('should return empty string for invalid URLs', () => {
    expect(getDomain('not a url')).toBe('');
    expect(getDomain('')).toBe('');
    expect(getDomain('//example.com')).toBe('');
  });

  it('should handle localhost', () => {
    expect(getDomain('http://localhost:3000')).toBe('localhost');
  });
});

describe('prefersReducedMotion', () => {
  it('should return false when matchMedia is not available', () => {
    const originalWindow = global.window;
    // @ts-ignore - intentionally setting to undefined
    global.window = undefined;
    expect(prefersReducedMotion()).toBe(false);
    global.window = originalWindow;
  });

  it('should return falsy when matchMedia is not a function', () => {
    const originalMatchMedia = window.matchMedia;
    // @ts-ignore - intentionally setting to undefined
    window.matchMedia = undefined;
    // Optional chaining returns undefined, which is falsy
    expect(prefersReducedMotion()).toBeFalsy();
    window.matchMedia = originalMatchMedia;
  });

  it('should return true when prefers-reduced-motion is set', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    expect(prefersReducedMotion()).toBe(true);
    window.matchMedia = originalMatchMedia;
  });

  it('should return false when prefers-reduced-motion is not set', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    expect(prefersReducedMotion()).toBe(false);
    window.matchMedia = originalMatchMedia;
  });
});
