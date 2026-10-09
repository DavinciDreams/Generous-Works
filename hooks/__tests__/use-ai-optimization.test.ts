/**
 * Tests for AI Optimization Hook
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAIOptimization, useDebounce } from '../use-ai-optimization';

// Mock fetch
global.fetch = vi.fn();

describe('useAIOptimization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateSuggestions', () => {
    it('should generate AI suggestions', async () => {
      const mockSuggestions = [
        {
          id: 'suggestion-1',
          type: 'layout' as const,
          title: 'Improve Layout',
          description: 'Optimize the layout for better UX',
          priority: 'high' as const,
          suggestion: {},
          confidence: 0.9,
          applied: false,
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, suggestions: mockSuggestions }),
      });

      const { result } = renderHook(() => useAIOptimization({ enabled: true }));

      await act(async () => {
        await result.current.generateSuggestions({});
      });

      expect(result.current.suggestions).toEqual(mockSuggestions);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle errors when generating suggestions', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Failed to generate suggestions'));

      const { result } = renderHook(() => useAIOptimization({ enabled: true }));

      await act(async () => {
        await result.current.generateSuggestions({});
      });

      expect(result.current.error).toBe('Failed to generate suggestions');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('generateRecommendations', () => {
    it('should generate AI recommendations', async () => {
      const mockRecommendations = [
        {
          component_type: 'chat',
          recommended_components: ['chat', 'input'],
          reason: 'Add chat interface for better user interaction',
          confidence: 0.9,
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, recommendations: mockRecommendations }),
      });

      const { result } = renderHook(() => useAIOptimization({ enabled: true }));

      await act(async () => {
        await result.current.generateRecommendations({});
      });

      expect(result.current.recommendations).toEqual(mockRecommendations);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('applySuggestion', () => {
    it('should apply a suggestion', async () => {
      const mockSuggestion = {
        id: 'suggestion-1',
        type: 'layout' as const,
        title: 'Improve Layout',
        description: 'Optimize the layout for better UX',
        priority: 'high' as const,
        suggestion: {},
        confidence: 0.9,
        applied: false,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const { result } = renderHook(() => useAIOptimization({ enabled: true }));

      result.current.suggestions = [mockSuggestion];

      await act(async () => {
        await result.current.applySuggestion('suggestion-1');
      });

      expect(result.current.suggestions[0].applied).toBe(true);
    });
  });

  describe('dismissSuggestion', () => {
    it('should dismiss a suggestion', () => {
      const mockSuggestions = [
        {
          id: 'suggestion-1',
          type: 'layout' as const,
          title: 'Improve Layout',
          description: 'Optimize the layout for better UX',
          priority: 'high' as const,
          suggestion: {},
          confidence: 0.9,
          applied: false,
        },
      ];

      const { result } = renderHook(() => useAIOptimization({ enabled: true }));

      result.current.suggestions = mockSuggestions;

      act(() => {
        result.current.dismissSuggestion('suggestion-1');
      });

      expect(result.current.suggestions).toHaveLength(0);
    });
  });

  describe('clearSuggestions', () => {
    it('should clear all suggestions', () => {
      const mockSuggestions = [
        {
          id: 'suggestion-1',
          type: 'layout' as const,
          title: 'Improve Layout',
          description: 'Optimize the layout for better UX',
          priority: 'high' as const,
          suggestion: {},
          confidence: 0.9,
          applied: false,
        },
      ];

      const { result } = renderHook(() => useAIOptimization({ enabled: true }));

      result.current.suggestions = mockSuggestions;

      act(() => {
        result.current.clearSuggestions();
      });

      expect(result.current.suggestions).toHaveLength(0);
    });
  });

  describe('clearRecommendations', () => {
    it('should clear all recommendations', () => {
      const mockRecommendations = [
        {
          component_type: 'chat',
          recommended_components: ['chat', 'input'],
          reason: 'Add chat interface for better user interaction',
          confidence: 0.9,
        },
      ];

      const { result } = renderHook(() => useAIOptimization({ enabled: true }));

      result.current.recommendations = mockRecommendations;

      act(() => {
        result.current.clearRecommendations();
      });

      expect(result.current.recommendations).toHaveLength(0);
    });
  });
});

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce function calls', () => {
    const mockCallback = vi.fn();
    const delay = 500;

    const { result } = renderHook(() => useDebounce(mockCallback, delay));

    act(() => {
      result.current('arg1');
      result.current('arg2');
      result.current('arg3');
    });

    expect(mockCallback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(delay);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('arg3');
  });
});
