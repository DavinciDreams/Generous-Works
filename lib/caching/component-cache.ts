/**
 * Generic Component Cache with LRU Eviction Strategy
 * 
 * Provides an in-memory caching mechanism with configurable TTL,
 * size limits, and LRU (Least Recently Used) eviction strategy.
 */

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Cache entry containing the cached value and metadata
 */
export interface CacheEntry<T> {
  /** Unique key for the cache entry */
  key: string;
  /** Cached value */
  value: T;
  /** Timestamp when the entry was created */
  timestamp: number;
  /** Timestamp when the entry expires (0 for no expiration) */
  expiresAt: number;
  /** Number of times this entry has been accessed */
  hits: number;
  /** Estimated size of the entry in bytes */
  size: number;
}

/**
 * Cache statistics for monitoring cache performance
 */
export interface CacheStats {
  /** Total number of cache hits */
  hits: number;
  /** Total number of cache misses */
  misses: number;
  /** Total number of evicted entries */
  evictions: number;
  /** Current total size of all cached entries */
  size: number;
  /** Maximum size limit for the cache */
  maxSize: number;
  /** Current number of entries in the cache */
  entryCount: number;
  /** Maximum number of entries allowed */
  maxEntries: number;
}

// ============================================================================
// Component Cache Class
// ============================================================================

/**
 * Generic cache class with LRU eviction strategy
 * 
 * @template T - The type of values to cache
 */
export class ComponentCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private accessOrder: string[]; // Track access order for LRU
  private maxSize: number; // Maximum size in bytes
  private maxEntries: number; // Maximum number of entries
  private defaultTTL: number; // Default time-to-live in milliseconds
  private stats: CacheStats;

  /**
   * Create a new ComponentCache instance
   * 
   * @param maxSize - Maximum cache size in bytes (default: 10MB)
   * @param maxEntries - Maximum number of entries (default: 1000)
   * @param defaultTTL - Default TTL in milliseconds (default: 1 hour)
   */
  constructor(maxSize: number = 10 * 1024 * 1024, maxEntries: number = 1000, defaultTTL: number = 60 * 60 * 1000) {
    this.cache = new Map();
    this.accessOrder = [];
    this.maxSize = maxSize;
    this.maxEntries = maxEntries;
    this.defaultTTL = defaultTTL;
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      maxSize,
      entryCount: 0,
      maxEntries,
    };
  }

  /**
   * Get a cached value by key
   * 
   * @param key - The cache key
   * @returns The cached value or undefined if not found/expired
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    // Check if entry has expired
    if (entry.expiresAt > 0 && Date.now() > entry.expiresAt) {
      this.invalidate(key);
      this.stats.misses++;
      return undefined;
    }

    // Update access order for LRU
    this.updateAccessOrder(key);
    
    // Update entry stats
    entry.hits++;
    this.stats.hits++;

    return entry.value;
  }

  /**
   * Set a value in the cache
   * 
   * @param key - The cache key
   * @param value - The value to cache
   * @param customTTL - Optional custom TTL in milliseconds (uses default if not provided)
   */
  set(key: string, value: T, customTTL?: number): void {
    // Calculate entry size
    const size = this.calculateSize(value);

    // Check if we need to evict entries
    this.evictIfNeeded(size);

    // Create cache entry
    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: Date.now(),
      expiresAt: customTTL !== undefined 
        ? (customTTL > 0 ? Date.now() + customTTL : 0)
        : (this.defaultTTL > 0 ? Date.now() + this.defaultTTL : 0),
      hits: 0,
      size,
    };

    // Remove existing entry if updating
    if (this.cache.has(key)) {
      const existing = this.cache.get(key)!;
      this.stats.size -= existing.size;
      this.stats.entryCount--;
      const idx = this.accessOrder.indexOf(key);
      if (idx !== -1) {
        this.accessOrder.splice(idx, 1);
      }
    }

    // Add new entry
    this.cache.set(key, entry);
    this.accessOrder.push(key);
    this.stats.size += size;
    this.stats.entryCount++;
  }

  /**
   * Invalidate a specific cache entry
   * 
   * @param key - The cache key to invalidate
   */
  invalidate(key: string): void {
    const entry = this.cache.get(key);
    if (entry) {
      this.stats.size -= entry.size;
      this.stats.entryCount--;
      this.cache.delete(key);
      const idx = this.accessOrder.indexOf(key);
      if (idx !== -1) {
        this.accessOrder.splice(idx, 1);
      }
    }
  }

  /**
   * Invalidate all cache entries matching a pattern
   * 
   * @param pattern - Regular expression pattern to match keys
   */
  invalidatePattern(pattern: RegExp): void {
    const keysToInvalidate: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        keysToInvalidate.push(key);
      }
    }

    for (const key of keysToInvalidate) {
      this.invalidate(key);
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.stats.size = 0;
    this.stats.entryCount = 0;
  }

  /**
   * Get current cache statistics
   * 
   * @returns Current cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Check if a key exists in the cache and is not expired
   * 
   * @param key - The cache key to check
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }
    
    // Check expiration
    if (entry.expiresAt > 0 && Date.now() > entry.expiresAt) {
      this.invalidate(key);
      return false;
    }

    return true;
  }

  /**
   * Get all keys in the cache
   * 
   * @returns Array of all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get the number of entries in the cache
   * 
   * @returns Number of cache entries
   */
  size(): number {
    return this.cache.size;
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Update the access order for LRU tracking
   * 
   * @param key - The key that was accessed
   */
  private updateAccessOrder(key: string): void {
    const idx = this.accessOrder.indexOf(key);
    if (idx !== -1) {
      this.accessOrder.splice(idx, 1);
    }
    this.accessOrder.push(key);
  }

  /**
   * Evict entries if needed to make room for new entry
   * 
   * @param newEntrySize - Size of the new entry to be added
   */
  private evictIfNeeded(newEntrySize: number): void {
    // Evict by entry count if needed
    while (this.cache.size >= this.maxEntries) {
      this.evictLRU();
    }

    // Evict by size if needed
    while (this.stats.size + newEntrySize > this.maxSize && this.accessOrder.length > 0) {
      this.evictLRU();
    }
  }

  /**
   * Evict the least recently used entry
   */
  private evictLRU(): void {
    if (this.accessOrder.length === 0) {
      return;
    }

    const lruKey = this.accessOrder.shift()!;
    const entry = this.cache.get(lruKey);
    
    if (entry) {
      this.stats.size -= entry.size;
      this.stats.entryCount--;
      this.stats.evictions++;
      this.cache.delete(lruKey);
    }
  }

  /**
   * Calculate the approximate size of a value in bytes
   * 
   * @param value - The value to calculate size for
   * @returns Approximate size in bytes
   */
  private calculateSize(value: T): number {
    try {
      const json = JSON.stringify(value);
      return new Blob([json]).size;
    } catch {
      // Fallback: estimate based on string representation
      return String(value).length * 2; // UTF-16 uses 2 bytes per character
    }
  }
}
