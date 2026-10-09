/**
 * AI-Assisted Component Optimization Hook
 * Provides AI-powered layout suggestions and component recommendations
 */

import { useState, useCallback, useEffect } from 'react';

// Types
export interface AISuggestion {
  id: string;
  type: 'layout' | 'component' | 'optimization';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  suggestion: Record<string, unknown>;
  confidence: number;
  applied: boolean;
}

export interface AIRecommendation {
  component_type: string;
  recommended_components: string[];
  reason: string;
  confidence: number;
}

export interface UseAIOptimizationOptions {
  enabled?: boolean;
  autoApply?: boolean;
  debounceMs?: number;
}

export interface UseAIOptimizationReturn {
  suggestions: AISuggestion[];
  recommendations: AIRecommendation[];
  isLoading: boolean;
  error: string | null;
  generateSuggestions: (components: Record<string, unknown>) => Promise<void>;
  generateRecommendations: (context: Record<string, unknown>) => Promise<void>;
  applySuggestion: (suggestionId: string) => Promise<void>;
  dismissSuggestion: (suggestionId: string) => void;
  clearSuggestions: () => void;
  clearRecommendations: () => void;
}

export function useAIOptimization(
  options: UseAIOptimizationOptions = {}
): UseAIOptimizationReturn {
  const {
    enabled = true,
    autoApply = false,
    debounceMs = 500,
  } = options;

  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate AI suggestions for component layout optimization
   */
  const generateSuggestions = useCallback(async (
    components: Record<string, unknown>
  ) => {
    if (!enabled) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ components }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI suggestions');
      }

      const data = await response.json();

      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);

        // Auto-apply high confidence suggestions if enabled
        if (autoApply) {
          const highConfidenceSuggestions = data.suggestions.filter(
            (s: AISuggestion) => s.confidence > 0.9 && s.priority === 'high'
          );

          for (const suggestion of highConfidenceSuggestions) {
            await applySuggestion(suggestion.id);
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Failed to generate AI suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, autoApply]);

  /**
   * Generate AI recommendations for component selection
   */
  const generateRecommendations = useCallback(async (
    context: Record<string, unknown>
  ) => {
    if (!enabled) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI recommendations');
      }

      const data = await response.json();

      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Failed to generate AI recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  /**
   * Apply a specific AI suggestion
   */
  const applySuggestion = useCallback(async (suggestionId: string) => {
    try {
      const response = await fetch('/api/ai/suggestions/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ suggestion_id: suggestionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to apply suggestion');
      }

      const data = await response.json();

      if (data.success) {
        setSuggestions(prev =>
          prev.map(s =>
            s.id === suggestionId ? { ...s, applied: true } : s
          )
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Failed to apply suggestion:', err);
    }
  }, []);

  /**
   * Dismiss a specific AI suggestion
   */
  const dismissSuggestion = useCallback((suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, []);

  /**
   * Clear all suggestions
   */
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  /**
   * Clear all recommendations
   */
  const clearRecommendations = useCallback(() => {
    setRecommendations([]);
    setError(null);
  }, []);

  return {
    suggestions,
    recommendations,
    isLoading,
    error,
    generateSuggestions,
    generateRecommendations,
    applySuggestion,
    dismissSuggestion,
    clearSuggestions,
    clearRecommendations,
  };
}

/**
 * Debounce function for AI optimization
 */
export function useDebounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T {
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  }, [callback, delay, timeoutId]) as T;
}
