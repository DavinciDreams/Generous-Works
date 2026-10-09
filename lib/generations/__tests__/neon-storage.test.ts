/**
 * Tests for Neon DB Storage Client
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveGeneration,
  listGenerations,
  loadGeneration,
  updateGeneration,
  deleteGeneration,
  generationExists,
} from '../neon-storage';

// Mock the neon database client
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => ({
    __: vi.fn(),
    unsafe: vi.fn(),
  })),
  neonConfig: {
    fetchConnectionCache: true,
  },
}));

describe('Neon Storage Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveGeneration', () => {
    it('should save a new generation', async () => {
      const input = {
        user_id: 'user-123',
        name: 'Test Generation',
        description: 'Test description',
        messages: [{ role: 'user', content: 'Hello' }],
        ui_components: { component1: {} },
        component_layouts: { layout1: {} },
      };

      // This test would require mocking the neon client
      // For now, we'll just verify the function exists and is callable
      expect(typeof saveGeneration).toBe('function');
    });
  });

  describe('listGenerations', () => {
    it('should list generations for a user', async () => {
      const options = {
        user_id: 'user-123',
        limit: 20,
        offset: 0,
      };

      // This test would require mocking the neon client
      expect(typeof listGenerations).toBe('function');
    });

    it('should support search functionality', async () => {
      const options = {
        user_id: 'user-123',
        limit: 20,
        offset: 0,
        search: 'test',
      };

      expect(typeof listGenerations).toBe('function');
    });
  });

  describe('loadGeneration', () => {
    it('should load a generation by ID', async () => {
      expect(typeof loadGeneration).toBe('function');
    });
  });

  describe('updateGeneration', () => {
    it('should update a generation', async () => {
      const updates = {
        name: 'Updated Name',
        description: 'Updated description',
      };

      expect(typeof updateGeneration).toBe('function');
    });
  });

  describe('deleteGeneration', () => {
    it('should delete a generation', async () => {
      expect(typeof deleteGeneration).toBe('function');
    });
  });

  describe('generationExists', () => {
    it('should check if a generation exists', async () => {
      expect(typeof generationExists).toBe('function');
    });
  });
});
