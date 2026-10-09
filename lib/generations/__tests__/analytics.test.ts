/**
 * Tests for Analytics System
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createAnalyticsEvent,
  getAnalytics,
  getAnalyticsSummary,
  getComponentUsageStats,
  trackComponentView,
  trackComponentInteraction,
  trackComponentCreation,
  trackComponentUpdate,
  trackComponentDeletion,
} from '../analytics';

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

describe('Analytics System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createAnalyticsEvent', () => {
    it('should create a new analytics event', async () => {
      const input = {
        user_id: 'test-user-id',
        generation_id: 'test-generation-id',
        event_type: 'view',
        component_type: 'chat',
        action: 'view',
        metadata: {},
      };

      const result = await createAnalyticsEvent(input);

      expect(result).toBeDefined();
      expect(result.user_id).toBe(input.user_id);
      expect(result.event_type).toBe(input.event_type);
      expect(result.component_type).toBe(input.component_type);
    });
  });

  describe('getAnalytics', () => {
    it('should get analytics events with filters', async () => {
      const options = {
        user_id: 'test-user-id',
        generation_id: 'test-generation-id',
        event_type: 'view',
        component_type: 'chat',
        start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end_date: new Date(),
        limit: 10,
        offset: 0,
      };

      const result = await getAnalytics(options);

      expect(result).toBeDefined();
      expect(Array.isArray(result.events)).toBe(true);
      expect(typeof result.total).toBe('number');
    });
  });

  describe('getAnalyticsSummary', () => {
    it('should get analytics summary', async () => {
      const userId = 'test-user-id';
      const generationId = 'test-generation-id';

      const result = await getAnalyticsSummary(userId, generationId);

      expect(result).toBeDefined();
      expect(typeof result.total_events).toBe('number');
      expect(typeof result.event_types).toBe('object');
      expect(typeof result.component_types).toBe('object');
      expect(Array.isArray(result.daily_counts)).toBe(true);
    });
  });

  describe('getComponentUsageStats', () => {
    it('should get component usage statistics', async () => {
      const userId = 'test-user-id';
      const generationId = 'test-generation-id';

      const result = await getComponentUsageStats(userId, generationId);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('component_type');
      expect(result[0]).toHaveProperty('total_events');
      expect(result[0]).toHaveProperty('event_types');
      expect(result[0]).toHaveProperty('actions');
    });
  });

  describe('trackComponentView', () => {
    it('should track a component view', async () => {
      const userId = 'test-user-id';
      const generationId = 'test-generation-id';
      const componentType = 'chat';

      const result = await trackComponentView(userId, generationId, componentType);

      expect(result).toBeDefined();
      expect(result.event_type).toBe('view');
      expect(result.component_type).toBe(componentType);
    });
  });

  describe('trackComponentInteraction', () => {
    it('should track a component interaction', async () => {
      const userId = 'test-user-id';
      const generationId = 'test-generation-id';
      const componentType = 'chat';
      const action = 'click';

      const result = await trackComponentInteraction(userId, generationId, componentType, action);

      expect(result).toBeDefined();
      expect(result.event_type).toBe('interaction');
      expect(result.component_type).toBe(componentType);
      expect(result.action).toBe(action);
    });
  });

  describe('trackComponentCreation', () => {
    it('should track a component creation', async () => {
      const userId = 'test-user-id';
      const generationId = 'test-generation-id';
      const componentType = 'chat';

      const result = await trackComponentCreation(userId, generationId, componentType);

      expect(result).toBeDefined();
      expect(result.event_type).toBe('creation');
      expect(result.component_type).toBe(componentType);
    });
  });

  describe('trackComponentUpdate', () => {
    it('should track a component update', async () => {
      const userId = 'test-user-id';
      const generationId = 'test-generation-id';
      const componentType = 'chat';

      const result = await trackComponentUpdate(userId, generationId, componentType);

      expect(result).toBeDefined();
      expect(result.event_type).toBe('update');
      expect(result.component_type).toBe(componentType);
    });
  });

  describe('trackComponentDeletion', () => {
    it('should track a component deletion', async () => {
      const userId = 'test-user-id';
      const generationId = 'test-generation-id';
      const componentType = 'chat';

      const result = await trackComponentDeletion(userId, generationId, componentType);

      expect(result).toBeDefined();
      expect(result.event_type).toBe('deletion');
      expect(result.component_type).toBe(componentType);
    });
  });
});
