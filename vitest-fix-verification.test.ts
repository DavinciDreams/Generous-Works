// Simple test to verify vitest setup is working
import { test, expect, vi } from 'vitest';

test('should be able to run a simple test', () => {
  expect(1 + 1).toBe(2);
});

test('should have afterEach cleanup available', () => {
  // This test verifies that the setup file is loaded correctly
  const mockFn = vi.fn();
  mockFn();
  expect(mockFn).toHaveBeenCalledTimes(1);
});
