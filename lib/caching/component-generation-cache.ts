/**
 * Component Generation Cache
 * 
 * Extends the generic ComponentCache to provide specialized caching
 * for generated UI components with component type and props-based keys.
 */

import { ComponentCache, CacheStats } from './component-cache';
import type { UIComponent } from '../store';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Cache entry for generated components
 */
export interface CachedComponent {
  /** The component type */
  type: string;
  /** The component props */
  props: Record<string, unknown>;
  /** The full component specification */
  component: UIComponent;
  /** Timestamp when cached */
  timestamp: number;
  /** Number of times this component has been retrieved */
  hitCount: number;
}

// ============================================================================
// Component Generation Cache Class
// ============================================================================

/**
 * Specialized cache for generated UI components
 * 
 * Generates cache keys from component types and props,
 * allowing efficient reuse of component specifications.
 */
export class ComponentGenerationCache extends ComponentCache<UIComponent> {
  /**
   * Create a new ComponentGenerationCache instance
   * 
   * @param maxSize - Maximum cache size in bytes (default: 20MB)
   * @param maxEntries - Maximum number of entries (default: 1000)
   * @param defaultTTL - Default TTL in milliseconds (default: 1 hour)
   */
  constructor(
    maxSize: number = 20 * 1024 * 1024,
    maxEntries: number = 1000,
    defaultTTL: number = 60 * 60 * 1000
  ) {
    super(maxSize, maxEntries, defaultTTL);
  }

  /**
   * Get a cached generated component
   * 
   * @param type - The component type
   * @param props - The component props
   * @returns The cached component or undefined if not found
   */
  getGeneratedComponent(type: string, props: Record<string, unknown>): UIComponent | undefined {
    const key = this.generateKey(type, props);
    return this.get(key);
  }

  /**
   * Cache a generated component
   * 
   * @param type - The component type
   * @param props - The component props
   * @param component - The component to cache
   */
  setGeneratedComponent(type: string, props: Record<string, unknown>, component: UIComponent): void {
    const key = this.generateKey(type, props);
    this.set(key, component);
  }

  /**
   * Invalidate all cached components of a specific type
   * 
   * @param type - The component type to invalidate
   */
  invalidateByType(type: string): void {
    const pattern = new RegExp(`^type:${this.hashString(type)}:`);
    this.invalidatePattern(pattern);
  }

  /**
   * Invalidate cached components with specific prop values
   * 
   * @param propName - The property name to check
   * @param propValue - The property value to match
   */
  invalidateByProp(propName: string, propValue: unknown): void {
    const propHash = this.hashString(`${propName}:${JSON.stringify(propValue)}`);
    const pattern = new RegExp(`prop:${propHash}:`);
    this.invalidatePattern(pattern);
  }

  /**
   * Get all cached components of a specific type
   * 
   * @param type - The component type
   * @returns Array of cached components of the specified type
   */
  getComponentsByType(type: string): UIComponent[] {
    const components: UIComponent[] = [];
    const pattern = new RegExp(`^type:${this.hashString(type)}:`);
    
    for (const key of this.keys()) {
      if (pattern.test(key)) {
        const component = this.get(key);
        if (component) {
          components.push(component);
        }
      }
    }
    
    return components;
  }

  /**
   * Get cache statistics specific to component generation
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

  /**
   * Get component type distribution in cache
   * 
   * @returns Object mapping component types to counts
   */
  getComponentTypeDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    for (const key of this.keys()) {
      const match = key.match(/^type:([a-f0-9]+):/);
      if (match) {
        const typeHash = match[1];
        distribution[typeHash] = (distribution[typeHash] || 0) + 1;
      }
    }
    
    return distribution;
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Generate a unique cache key from component type and props
   * 
   * @param type - The component type
   * @param props - The component props
   * @returns A unique cache key
   */
  private generateKey(type: string, props: Record<string, unknown>): string {
    const typeHash = this.hashString(type);
    const propsHash = this.hashProps(props);
    
    return `type:${typeHash}:props:${propsHash}`;
  }

  /**
   * Hash component props to create a stable identifier
   * 
   * @param props - The props to hash
   * @returns A hexadecimal hash string
   */
  private hashProps(props: Record<string, unknown>): string {
    // Sort keys for consistent hashing
    const sortedKeys = Object.keys(props).sort();
    const propPairs = sortedKeys.map(key => {
      const value = props[key];
      return `${key}:${this.hashValue(value)}`;
    });
    
    return this.hashString(propPairs.join('|'));
  }

  /**
   * Hash a single value (handles nested objects and arrays)
   * 
   * @param value - The value to hash
   * @returns A string representation for hashing
   */
  private hashValue(value: unknown): string {
    if (value === null || value === undefined) {
      return 'null';
    }
    
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return `array:${value.map(v => this.hashValue(v)).join(',')}`;
      }
      return `object:${this.hashProps(value as Record<string, unknown>)}`;
    }
    
    if (typeof value === 'function') {
      return 'function';
    }
    
    return String(value);
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
