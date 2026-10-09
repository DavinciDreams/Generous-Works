/**
 * Tests for Template System
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createTemplate,
  listTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  incrementTemplateUsage,
  getTemplateCategories,
  getPopularTags,
  saveGenerationAsTemplate,
} from '../templates';

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

describe('Template System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTemplate', () => {
    it('should create a new template', async () => {
      const input = {
        user_id: 'test-user-id',
        name: 'Test Template',
        description: 'Test Description',
        category: 'test',
        tags: ['tag1', 'tag2'],
        ui_components: {},
        component_layouts: {},
        is_public: false,
      };

      const result = await createTemplate(input);

      expect(result).toBeDefined();
      expect(result.user_id).toBe(input.user_id);
      expect(result.name).toBe(input.name);
      expect(result.category).toBe(input.category);
    });
  });

  describe('listTemplates', () => {
    it('should list templates for a user', async () => {
      const options = {
        user_id: 'test-user-id',
        limit: 10,
        offset: 0,
        include_public: true,
        include_system: true,
      };

      const result = await listTemplates(options);

      expect(result).toBeDefined();
      expect(Array.isArray(result.templates)).toBe(true);
      expect(typeof result.total).toBe('number');
    });
  });

  describe('getTemplate', () => {
    it('should get a specific template by ID', async () => {
      const templateId = 'test-template-id';
      const userId = 'test-user-id';

      const result = await getTemplate(templateId, userId);

      expect(result).toBeDefined();
      expect(result?.id).toBe(templateId);
    });
  });

  describe('updateTemplate', () => {
    it('should update an existing template', async () => {
      const templateId = 'test-template-id';
      const userId = 'test-user-id';
      const updates = {
        name: 'Updated Template Name',
        description: 'Updated Description',
      };

      const result = await updateTemplate(templateId, userId, updates);

      expect(result).toBeDefined();
      expect(result?.name).toBe(updates.name);
      expect(result?.description).toBe(updates.description);
    });
  });

  describe('deleteTemplate', () => {
    it('should delete a template', async () => {
      const templateId = 'test-template-id';
      const userId = 'test-user-id';

      const result = await deleteTemplate(templateId, userId);

      expect(typeof result).toBe('boolean');
    });
  });

  describe('incrementTemplateUsage', () => {
    it('should increment usage count for a template', async () => {
      const templateId = 'test-template-id';

      const result = await incrementTemplateUsage(templateId);

      expect(typeof result).toBe('boolean');
    });
  });

  describe('getTemplateCategories', () => {
    it('should get template categories', async () => {
      const userId = 'test-user-id';

      const result = await getTemplateCategories(userId, true, true);

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getPopularTags', () => {
    it('should get popular tags', async () => {
      const userId = 'test-user-id';
      const limit = 10;

      const result = await getPopularTags(userId, limit);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('tag');
      expect(result[0]).toHaveProperty('count');
    });
  });

  describe('saveGenerationAsTemplate', () => {
    it('should save a generation as a template', async () => {
      const userId = 'test-user-id';
      const name = 'Test Template';
      const ui_components = {};

      const result = await saveGenerationAsTemplate(
        userId,
        name,
        ui_components,
        'Test Description',
        'test',
        ['tag1']
      );

      expect(result).toBeDefined();
      expect(result.user_id).toBe(userId);
      expect(result.name).toBe(name);
    });
  });
});
