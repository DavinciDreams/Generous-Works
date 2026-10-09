/**
 * Tests for Sharing System
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createShare,
  listShares,
  getShareByToken,
  getShare,
  updateShare,
  deleteShare,
  deleteGenerationShares,
  getSharedGeneration,
  isShareValid,
} from '../sharing';

// Mock the neon client
vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn(() => ({
    __esModule: true,
    default: vi.fn(),
  })),
}));

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid'),
}));

vi.mock('../neon-storage', () => ({
  loadGeneration: vi.fn(),
}));

describe('Sharing System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createShare', () => {
    it('should create a new share link', async () => {
      const input = {
        generation_id: 'test-generation-id',
        user_id: 'test-user-id',
        is_readonly: true,
        expires_at: null,
      };

      const result = await createShare(input);

      expect(result).toBeDefined();
      expect(result.generation_id).toBe(input.generation_id);
      expect(result.user_id).toBe(input.user_id);
      expect(result.is_readonly).toBe(input.is_readonly);
      expect(result.share_token).toBeDefined();
      expect(result.share_url).toBeDefined();
    });
  });

  describe('listShares', () => {
    it('should list shares for a user', async () => {
      const options = {
        user_id: 'test-user-id',
        limit: 10,
        offset: 0,
        generation_id: 'test-generation-id',
      };

      const result = await listShares(options);

      expect(result).toBeDefined();
      expect(Array.isArray(result.shares)).toBe(true);
      expect(typeof result.total).toBe('number');
    });
  });

  describe('getShareByToken', () => {
    it('should get a share by token', async () => {
      const shareToken = 'test-share-token';

      const result = await getShareByToken(shareToken);

      expect(result).toBeDefined();
      expect(result?.share_token).toBe(shareToken);
    });
  });

  describe('getShare', () => {
    it('should get a specific share by ID', async () => {
      const shareId = 'test-share-id';
      const userId = 'test-user-id';

      const result = await getShare(shareId, userId);

      expect(result).toBeDefined();
      expect(result?.id).toBe(shareId);
    });
  });

  describe('updateShare', () => {
    it('should update a share', async () => {
      const shareId = 'test-share-id';
      const userId = 'test-user-id';
      const updates = {
        is_readonly: false,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      const result = await updateShare(shareId, userId, updates);

      expect(result).toBeDefined();
      expect(result?.is_readonly).toBe(updates.is_readonly);
    });
  });

  describe('deleteShare', () => {
    it('should delete a share', async () => {
      const shareId = 'test-share-id';
      const userId = 'test-user-id';

      const result = await deleteShare(shareId, userId);

      expect(typeof result).toBe('boolean');
    });
  });

  describe('deleteGenerationShares', () => {
    it('should delete all shares for a generation', async () => {
      const generationId = 'test-generation-id';
      const userId = 'test-user-id';

      const result = await deleteGenerationShares(generationId, userId);

      expect(typeof result).toBe('boolean');
    });
  });

  describe('getSharedGeneration', () => {
    it('should get a shared generation by share token', async () => {
      const shareToken = 'test-share-token';

      const result = await getSharedGeneration(shareToken);

      expect(result).toBeDefined();
      expect(result.share).toBeDefined();
      expect(result.generation).toBeDefined();
    });
  });

  describe('isShareValid', () => {
    it('should check if a share is valid', async () => {
      const shareToken = 'test-share-token';

      const result = await isShareValid(shareToken);

      expect(typeof result).toBe('boolean');
    });
  });
});
