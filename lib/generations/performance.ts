/**
 * Performance optimization utilities for Generations Management
 * Provides caching, debouncing, and other performance enhancements
 */

/**
 * Simple in-memory cache implementation
 */
class SimpleCache<T> {
  private cache: Map<string, { value: T; timestamp: number }>;
  private ttl: number;

  constructor(ttl: number = 5 * 60 * 1000) {
    // Default TTL: 5 minutes
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key: string, value: T): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Cache instances for different data types
 */
export const generationCache = new SimpleCache<any>(5 * 60 * 1000); // 5 minutes
export const templateCache = new SimpleCache<any>(10 * 60 * 1000); // 10 minutes
export const analyticsCache = new SimpleCache<any>(2 * 60 * 1000); // 2 minutes

/**
 * Debounce function
 * Delays the execution of a function until after a specified wait time
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * Limits the execution rate of a function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request animation frame throttle
 * Optimizes animations to run at 60fps
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    lastArgs = args;

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        if (lastArgs) {
          func(...lastArgs);
        }
        rafId = null;
        lastArgs = null;
      });
    }
  };
}

/**
 * Memoize function
 * Caches the result of a function based on its arguments
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = keyGenerator
      ? keyGenerator(...args)
      : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Batch operations
 * Groups multiple operations into a single batch for efficiency
 */
export class BatchOperation<T> {
  private operations: Array<() => Promise<T>> = [];
  private batchSize: number;

  constructor(batchSize: number = 10) {
    this.batchSize = batchSize;
  }

  add(operation: () => Promise<T>): void {
    this.operations.push(operation);
  }

  async execute(): Promise<T[]> {
    const results: T[] = [];
    const batches: Array<() => Promise<T>>[] = [];

    // Split operations into batches
    for (let i = 0; i < this.operations.length; i += this.batchSize) {
      batches.push(this.operations.slice(i, i + this.batchSize));
    }

    // Execute batches sequentially
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map((op) => op())
      );
      results.push(...batchResults);
    }

    this.operations = [];
    return results;
  }

  clear(): void {
    this.operations = [];
  }

  size(): number {
    return this.operations.length;
  }
}

/**
 * Lazy load utility
 * Delays loading of resources until they're needed
 */
export function lazyLoad<T>(
  loader: () => Promise<T>,
  cacheKey: string
): () => Promise<T> {
  let cachedPromise: Promise<T> | null = null;

  return async (): Promise<T> => {
    if (cachedPromise) {
      return cachedPromise;
    }

    cachedPromise = loader().then((result) => {
      // Cache the result
      generationCache.set(cacheKey, result);
      return result;
    });

    return cachedPromise;
  };
}

/**
 * Performance monitor
 * Tracks and reports performance metrics
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startMeasure(label: string): void {
    performance.mark(`${label}-start`);
  }

  endMeasure(label: string): number {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    const duration = measure ? measure.duration : 0;

    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);

    // Clean up marks and measures
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);

    return duration;
  }

  getAverage(label: string): number {
    const durations = this.metrics.get(label);
    if (!durations || durations.length === 0) {
      return 0;
    }

    const sum = durations.reduce((acc, val) => acc + val, 0);
    return sum / durations.length;
  }

  getMax(label: string): number {
    const durations = this.metrics.get(label);
    if (!durations || durations.length === 0) {
      return 0;
    }

    return Math.max(...durations);
  }

  getMin(label: string): number {
    const durations = this.metrics.get(label);
    if (!durations || durations.length === 0) {
      return 0;
    }

    return Math.min(...durations);
  }

  getCount(label: string): number {
    return this.metrics.get(label)?.length || 0;
  }

  getAllMetrics(): Record<string, { avg: number; max: number; min: number; count: number }> {
    const result: Record<string, { avg: number; max: number; min: number; count: number }> = {};

    for (const [label] of this.metrics) {
      result[label] = {
        avg: this.getAverage(label),
        max: this.getMax(label),
        min: this.getMin(label),
        count: this.getCount(label),
      };
    }

    return result;
  }

  clear(): void {
    this.metrics.clear();
  }
}

/**
 * Global performance monitor instance
 */
export const perfMonitor = new PerformanceMonitor();

/**
 * Optimized fetch with caching
 */
export async function cachedFetch<T>(
  url: string,
  options: RequestInit = {},
  cache: SimpleCache<T> = generationCache,
  cacheKey?: string
): Promise<T> {
  const key = cacheKey || url;

  // Check cache first
  const cached = cache.get(key);
  if (cached) {
    return cached;
  }

  // Fetch data
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Cache the result
  cache.set(key, data);

  return data;
}

/**
 * Optimized scroll handler
 * Uses requestAnimationFrame for smooth scrolling performance
 */
export function createOptimizedScrollHandler(
  callback: (scrollTop: number) => void
): (event: Event) => void {
  let ticking = false;

  return (event: Event) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = (event.target as HTMLElement).scrollTop;
        callback(scrollTop);
        ticking = false;
      });
      ticking = true;
    }
  };
}

/**
 * Optimized resize handler
 * Uses requestAnimationFrame for smooth resize performance
 */
export function createOptimizedResizeHandler(
  callback: (width: number, height: number) => void
): () => void {
  let ticking = false;

  return () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback(window.innerWidth, window.innerHeight);
        ticking = false;
      });
      ticking = true;
    }
  };
}

/**
 * Performance targets
 */
export const PerformanceTargets = {
  SAVE_GENERATION: 2000, // 2 seconds
  LOAD_GENERATION: 1000, // 1 second
  LIST_GENERATIONS: 500, // 500ms
  DRAG_FPS: 60, // 60 frames per second
  ANIMATION_FPS: 60, // 60 frames per second
  API_RESPONSE: 1000, // 1 second
  CACHE_HIT_RATE: 0.8, // 80% cache hit rate
};

/**
 * Check if performance target is met
 */
export function checkPerformanceTarget(
  actual: number,
  target: number,
  type: "less" | "greater" | "equal" = "less"
): boolean {
  switch (type) {
    case "less":
      return actual <= target;
    case "greater":
      return actual >= target;
    case "equal":
      return actual === target;
    default:
      return false;
  }
}

/**
 * Generate performance report
 */
export function generatePerformanceReport(): {
  metrics: Record<string, { avg: number; max: number; min: number; count: number }>;
  targets: Record<string, boolean>;
  summary: string;
} {
  const metrics = perfMonitor.getAllMetrics();
  const targets: Record<string, boolean> = {};

  // Check each metric against its target
  for (const [label, data] of Object.entries(metrics)) {
    let target = 0;
    let type: "less" | "greater" = "less";

    if (label.includes("save")) {
      target = PerformanceTargets.SAVE_GENERATION;
      type = "less";
    } else if (label.includes("load")) {
      target = PerformanceTargets.LOAD_GENERATION;
      type = "less";
    } else if (label.includes("list")) {
      target = PerformanceTargets.LIST_GENERATIONS;
      type = "less";
    } else if (label.includes("drag")) {
      target = PerformanceTargets.DRAG_FPS;
      type = "greater";
    } else if (label.includes("animation")) {
      target = PerformanceTargets.ANIMATION_FPS;
      type = "greater";
    }

    targets[label] = checkPerformanceTarget(data.avg, target, type);
  }

  // Generate summary
  const passedCount = Object.values(targets).filter((v) => v).length;
  const totalCount = Object.keys(targets).length;
  const passRate = totalCount > 0 ? (passedCount / totalCount) * 100 : 0;

  const summary = `Performance Report: ${passedCount}/${totalCount} targets met (${passRate.toFixed(1)}%)`;

  return {
    metrics,
    targets,
    summary,
  };
}
