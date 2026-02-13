/**
 * LLM Response Cache
 * 
 * Extends the generic ComponentCache to provide specialized caching
 * for LLM API responses with request signature generation.
 */

import { ComponentCache, CacheStats } from './component-cache';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * LLM message interface
 */
export interface LLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Cache entry for LLM responses
 */
export interface CachedLLMResponse {
  /** The messages sent to the LLM */
  messages: LLMMessage[];
  /** The system prompt used */
  systemPrompt: string;
  /** The LLM response */
  response: string;
  /** Timestamp when cached */
  timestamp: number;
  /** Number of times this response has been retrieved */
  hitCount: number;
}

// ============================================================================
// LLM Response Cache Class
// ============================================================================

/**
 * Specialized cache for LLM responses
 * 
 * Generates cache keys from message arrays and system prompts,
 * allowing efficient reuse of LLM responses for identical requests.
 */
export class LLMResponseCache extends ComponentCache<string> {
  /**
   * Create a new LLMResponseCache instance
   * 
   * @param maxSize - Maximum cache size in bytes (default: 50MB for LLM responses)
   * @param maxEntries - Maximum number of entries (default: 500)
   * @param defaultTTL - Default TTL in milliseconds (default: 24 hours)
   */
  constructor(
    maxSize: number = 50 * 1024 * 1024,
    maxEntries: number = 500,
    defaultTTL: number = 24 * 60 * 60 * 1000
  ) {
    super(maxSize, maxEntries, defaultTTL);
  }

  /**
   * Get a cached LLM response
   * 
   * @param messages - The messages sent to the LLM
   * @param systemPrompt - The system prompt used
   * @returns The cached response or undefined if not found
   */
  getResponse(messages: LLMMessage[], systemPrompt: string): string | undefined {
    const key = this.generateKey(messages, systemPrompt);
    return this.get(key);
  }

  /**
   * Cache an LLM response
   * 
   * @param messages - The messages sent to the LLM
   * @param systemPrompt - The system prompt used
   * @param response - The LLM response to cache
   */
  setResponse(messages: LLMMessage[], systemPrompt: string, response: string): void {
    const key = this.generateKey(messages, systemPrompt);
    this.set(key, response);
  }

  /**
   * Invalidate cached responses for a specific system prompt
   * 
   * @param systemPrompt - The system prompt to invalidate
   */
  invalidateBySystemPrompt(systemPrompt: string): void {
    const pattern = new RegExp(`^system:${this.hashString(systemPrompt)}:`);
    this.invalidatePattern(pattern);
  }

  /**
   * Invalidate cached responses containing specific message content
   * 
   * @param content - The message content to search for
   */
  invalidateByMessageContent(content: string): void {
    const contentHash = this.hashString(content);
    const pattern = new RegExp(`msg:${contentHash}:`);
    this.invalidatePattern(pattern);
  }

  /**
   * Get cache statistics specific to LLM responses
   * 
   * @returns Cache statistics
   */
  getStats(): CacheStats {
    return super.getStats();
  }

  /**
   * Get the hit rate (percentage of cache hits)
   * 
   * @returns Hit rate as a percentage (0-100)
   */
  getHitRate(): number {
    const stats = this.getStats();
    const total = stats.hits + stats.misses;
    return total > 0 ? (stats.hits / total) * 100 : 0;
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Generate a unique cache key from messages and system prompt
   * 
   * @param messages - The messages sent to the LLM
   * @param systemPrompt - The system prompt used
   * @returns A unique cache key
   */
  private generateKey(messages: LLMMessage[], systemPrompt: string): string {
    const systemHash = this.hashString(systemPrompt);
    const messageHashes = messages.map(msg => 
      `${this.hashString(msg.role)}:${this.hashString(msg.content)}`
    ).join('|');
    
    return `system:${systemHash}:msg:${this.hashString(messageHashes)}`;
  }

  /**
   * Hash a string to create a short, unique identifier
   * 
   * Uses a simple hash algorithm for cache keys. For production use,
   * consider using a more robust hashing algorithm like SHA-256.
   * 
   * @param str - The string to hash
   * @returns A hexadecimal hash string
   */
  private hashString(str: string): string {
    let hash = 0;
    const strLower = str.toLowerCase();
    
    for (let i = 0; i < strLower.length; i++) {
      const char = strLower.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }
}
