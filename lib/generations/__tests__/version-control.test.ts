/**
 * Tests for Version Control System
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createVersion,
  listVersions,
  getVersion,
  getVersionByNumber,
  getCurrentVersion,
  restoreVersion,
  compareVersions,
  deleteVersion,
  deleteGenerationHistory,
} from '../version-control';

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

describe('Version Control', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createVersion', () => {
    it('should create a new version', async () => {
      const input = {
        generation_id: 'test-generation-id',
        user_id: 'test-user-id',
        version: 1,
        name: 'Test Version',
        description: 'Test Description',
        messages: [],
        ui_components: {},
        change_reason: 'Initial version',
        is_current_version: false,
      };

      const result = await createVersion(input);

      expect(result).toBeDefined();
      expect(result.generation_id).toBe(input.generation_id);
      expect(result.user_id).toBe(input.user_id);
      expect(result.version).toBe(input.version);
      expect(result.name).toBe(input.name);
    });
  });

  describe('listVersions', () => {
    it('should list all versions for a generation', async () => {
      const options = {
        generation_id: 'test-generation-id',
        user_id: 'test-user-id',
        limit: 10,
        offset: 0,
      };

      const result = await listVersions(options);

      expect(result).toBeDefined();
      expect(Array.isArray(result.versions)).toBe(true);
      expect(typeof result.total).toBe('number');
    });
  });

  describe('getVersion', () => {
    it('should get a specific version by ID', async () => {
      const versionId = 'test-version-id';
      const userId = 'test-user-id';

      const result = await getVersion(versionId, userId);

      expect(result).toBeDefined();
      expect(result?.id).toBe(versionId);
    });
  });

  describe('getVersionByNumber', () => {
    it('should get a version by version number', async () => {
      const generationId = 'test-generation-id';
      const version = 1;
      const userId = 'test-user-id';

      const result = await getVersionByNumber(generationId, version, userId);

      expect(result).toBeDefined();
      expect(result?.version).toBe(version);
    });
  });

  describe('getCurrentVersion', () => {
    it('should get the current version of a generation', async () => {
      const generationId = 'test-generation-id';
      const userId = 'test-user-id';

      const result = await getCurrentVersion(generationId, userId);

      expect(result).toBeDefined();
      expect(result?.is_current_version).toBe(true);
    });
  });

  describe('restoreVersion', () => {
    it('should restore a specific version', async () => {
      const versionId = 'test-version-id';
      const userId = 'test-user-id';

      const result = await restoreVersion(versionId, userId);

      expect(result).toBeDefined();
      expect(result.is_current_version).toBe(true);
    });
  });

  describe('compareVersions', () => {
    it('should compare two versions and return differences', async () => {
      const version1Id = 'test-version-1-id';
      const version2Id = 'test-version-2-id';
      const userId = 'test-user-id';

      const result = await compareVersions(version1Id, version2Id, userId);

      expect(result).toBeDefined();
      expect(result.version1).toBeDefined();
      expect(result.version2).toBeDefined();
      expect(Array.isArray(result.differences)).toBe(true);
    });
  });

  describe('deleteVersion', () => {
    it('should delete a specific version', async () => {
      const versionId = 'test-version-id';
      const userId = 'test-user-id';

      const result = await deleteVersion(versionId, userId);

      expect(typeof result).toBe('boolean');
    });
  });

  describe('deleteGenerationHistory', () => {
    it('should delete all history for a generation', async () => {
      const generationId = 'test-generation-id';
      const userId = 'test-user-id';

      const result = await deleteGenerationHistory(generationId, userId);

      expect(typeof result).toBe('boolean');
    });
  });
});
