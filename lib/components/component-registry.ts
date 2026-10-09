/**
 * Component Registry
 * 
 * A registry system for managing UI components with:
 * - Content hashing for deduplication
 * - Lazy loading of full component data
 * - Component summarization for prompts
 * - Usage statistics tracking
 * - Dependency management
 */

import type { UIComponent } from '../store';
import type {
  ComponentRegistryEntry,
  CompactComponent,
  EditableField,
  RegistryStats,
  ComplexityAssessment,
  HashOptions,
  SummaryOptions,
  TokenEstimationOptions,
} from './types';

/**
 * Component Registry class
 * 
 * Manages component registration, deduplication, and retrieval
 */
export class ComponentRegistry {
  /** Registry storage: component ID -> registry entry */
  private registry: Map<string, ComponentRegistryEntry>;
  
  /** Hash index: hash -> component ID */
  private hashIndex: Map<string, string>;
  
  /** Maximum cache size for components */
  private maxCacheSize: number;
  
  /** Default hash options */
  private defaultHashOptions: HashOptions;
  
  /** Default summary options */
  private defaultSummaryOptions: SummaryOptions;
  
  /** Default token estimation options */
  private defaultTokenOptions: TokenEstimationOptions;

  /**
   * Create a new component registry
   * @param maxCacheSize - Maximum number of components to cache (default: 1000)
   */
  constructor(maxCacheSize: number = 1000) {
    this.registry = new Map();
    this.hashIndex = new Map();
    this.maxCacheSize = maxCacheSize;
    this.defaultHashOptions = {
      includeId: false,
      includeTimestamp: false,
      algorithm: 'djb2',
    };
    this.defaultSummaryOptions = {
      maxLength: 200,
      includeType: true,
      includeKeyProps: true,
      keyPropsCount: 3,
    };
    this.defaultTokenOptions = {
      tokensPerChar: 0.25, // Approximate: 4 chars = 1 token
      includeOverhead: true,
    };
  }

  /**
   * Register a component in the registry
   * 
   * @param component - Component to register
   * @param options - Optional hash and summary options
   * @returns Registered component entry
   */
  registerComponent(
    component: UIComponent,
    options?: { hash?: HashOptions; summary?: SummaryOptions }
  ): ComponentRegistryEntry {
    const hashOptions = { ...this.defaultHashOptions, ...options?.hash };
    const summaryOptions = { ...this.defaultSummaryOptions, ...options?.summary };
    
    // Generate hash for deduplication
    const hash = this.generateHash(component, hashOptions);
    
    // Check for existing component with same hash (deduplication)
    const existingId = this.hashIndex.get(hash);
    if (existingId) {
      const existing = this.registry.get(existingId);
      if (existing) {
        // Update usage stats for existing component
        existing.usageStats.accessCount++;
        existing.usageStats.lastAccessed = Date.now();
        return existing;
      }
    }
    
    // Generate compact representation
    const compactSpec = this.compactComponent(component, hash, summaryOptions);
    
    // Extract dependencies
    const dependencies = this.extractDependencies(component);
    
    // Assess complexity
    const complexity = this.assessComplexity(component);
    
    // Create registry entry
    const now = Date.now();
    const entry: ComponentRegistryEntry = {
      id: component.id,
      type: component.type,
      fullSpec: component,
      compactSpec,
      hash,
      dependencies,
      editableFields: this.extractEditableFields(component),
      usageStats: {
        accessCount: 1,
        lastAccessed: now,
        createdAt: now,
      },
      metadata: {
        complexity: complexity.level,
        estimatedTokens: compactSpec.estimatedTokens,
      },
    };
    
    // Store in registry
    this.registry.set(entry.id, entry);
    this.hashIndex.set(hash, entry.id);
    
    // Evict components if cache is full
    this.evictIfNeeded();
    
    return entry;
  }

  /**
   * Get compact component representation
   * 
   * @param id - Component ID
   * @returns Compact component or undefined if not found
   */
  getCompactComponent(id: string): CompactComponent | undefined {
    const entry = this.registry.get(id);
    if (!entry) {
      return undefined;
    }
    
    // Update usage stats
    entry.usageStats.accessCount++;
    entry.usageStats.lastAccessed = Date.now();
    
    return entry.compactSpec;
  }

  /**
   * Get full component specification (lazy loaded)
   * 
   * @param id - Component ID
   * @returns Full component specification or undefined if not found
   */
  getFullComponent(id: string): UIComponent | undefined {
    const entry = this.registry.get(id);
    if (!entry) {
      return undefined;
    }
    
    // Update usage stats
    entry.usageStats.accessCount++;
    entry.usageStats.lastAccessed = Date.now();
    
    return entry.fullSpec;
  }

  /**
   * Get component by hash
   * 
   * @param hash - Component hash
   * @returns Component registry entry or undefined if not found
   */
  getComponentByHash(hash: string): ComponentRegistryEntry | undefined {
    const id = this.hashIndex.get(hash);
    if (!id) {
      return undefined;
    }
    return this.registry.get(id);
  }

  /**
   * Generate compact component representation
   * 
   * @param component - Component to compact
   * @param hash - Component hash
   * @param options - Summary options
   * @returns Compact component
   */
  compactComponent(
    component: UIComponent,
    hash: string,
    options?: SummaryOptions
  ): CompactComponent {
    const summaryOptions = { ...this.defaultSummaryOptions, ...options };
    
    const complexity = this.assessComplexity(component);
    const dependencies = this.extractDependencies(component);
    const estimatedTokens = this.estimateTokenCount(component);
    
    return {
      id: component.id,
      type: component.type,
      hash,
      summary: this.generateComponentSummary(component, summaryOptions),
      estimatedTokens,
      complexity: complexity.level,
      dependencies,
      usageStats: {
        accessCount: 0,
        lastAccessed: Date.now(),
        createdAt: Date.now(),
      },
    };
  }

  /**
   * Generate natural language summary for a component
   * 
   * @param component - Component to summarize
   * @param options - Summary options
   * @returns Component summary
   */
  generateComponentSummary(
    component: UIComponent,
    options?: SummaryOptions
  ): string {
    const opts = { ...this.defaultSummaryOptions, ...options };
    const parts: string[] = [];
    
    // Add component type
    if (opts.includeType) {
      parts.push(component.type);
    }
    
    // Add key properties
    if (opts.includeKeyProps && component.props) {
      const keyProps = this.extractKeyProperties(component.props, opts.keyPropsCount || 3);
      if (keyProps.length > 0) {
        parts.push(`with ${keyProps.join(', ')}`);
      }
    }
    
    // Add children info
    if (component.children && component.children.length > 0) {
      parts.push(`containing ${component.children.length} child component(s)`);
    }
    
    // Add state info
    if (component.state && Object.keys(component.state).length > 0) {
      parts.push(`with ${Object.keys(component.state).length} state properties`);
    }
    
    let summary = parts.join(' ');
    
    // Truncate if needed
    if (opts.maxLength && summary.length > opts.maxLength) {
      summary = summary.substring(0, opts.maxLength - 3) + '...';
    }
    
    return summary || `${component.type} component`;
  }

  /**
   * Generate content-based hash for a component
   * 
   * @param component - Component to hash
   * @param options - Hash options
   * @returns Component hash
   */
  generateHash(component: UIComponent, options?: HashOptions): string {
    const opts = { ...this.defaultHashOptions, ...options };
    
    // Create deterministic string representation
    const hashParts: string[] = [component.type];
    
    // Add props (sorted for determinism)
    if (component.props) {
      const sortedProps = Object.entries(component.props)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}:${JSON.stringify(value)}`);
      hashParts.push(...sortedProps);
    }
    
    // Add children
    if (component.children && component.children.length > 0) {
      const childHashes = component.children
        .map(child => this.generateHash(child, opts))
        .sort();
      hashParts.push(...childHashes);
    }
    
    // Add state
    if (component.state) {
      const sortedState = Object.entries(component.state)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}:${JSON.stringify(value)}`);
      hashParts.push(...sortedState);
    }
    
    // Optionally include ID and timestamp
    if (opts.includeId) {
      hashParts.push(component.id);
    }
    if (opts.includeTimestamp && component.props) {
      const timestamp = (component.props as any).timestamp;
      if (timestamp) {
        hashParts.push(String(timestamp));
      }
    }
    
    const hashString = hashParts.join('|');
    
    // Apply hash algorithm
    switch (opts.algorithm) {
      case 'sdbm':
        return this.sdbmHash(hashString);
      case 'fnv1a':
        return this.fnv1aHash(hashString);
      case 'djb2':
      default:
        return this.djb2Hash(hashString);
    }
  }

  /**
   * Estimate token count for a component
   * 
   * @param component - Component to estimate
   * @param options - Token estimation options
   * @returns Estimated token count
   */
  estimateTokenCount(component: UIComponent, options?: TokenEstimationOptions): number {
    const opts = { ...this.defaultTokenOptions, ...options };
    
    // Count characters in JSON representation
    const jsonString = JSON.stringify(component);
    const charCount = jsonString.length;
    
    // Estimate tokens
    let tokens = charCount * (opts.tokensPerChar || 0.25);
    
    // Add overhead for JSON structure
    if (opts.includeOverhead) {
      tokens += 50; // Base overhead for JSON structure
    }
    
    return Math.ceil(tokens);
  }

  /**
   * Assess component complexity
   * 
   * @param component - Component to assess
   * @returns Complexity assessment
   */
  assessComplexity(component: UIComponent): ComplexityAssessment {
    const propertyCount = component.props ? Object.keys(component.props).length : 0;
    const nestingDepth = this.calculateNestingDepth(component);
    const childCount = component.children ? component.children.length : 0;
    const dependencyCount = this.extractDependencies(component).length;
    
    // Calculate complexity score (0-100)
    const factors = {
      propertyCount,
      nestingDepth,
      childCount,
      dependencyCount,
    };
    
    const score = Math.min(
      100,
      (factors.propertyCount * 2) +
      (factors.nestingDepth * 10) +
      (factors.childCount * 5) +
      (factors.dependencyCount * 8)
    );
    
    // Determine complexity level
    let level: 'low' | 'medium' | 'high';
    if (score < 30) {
      level = 'low';
    } else if (score < 60) {
      level = 'medium';
    } else {
      level = 'high';
    }
    
    return {
      level,
      score,
      factors,
    };
  }

  /**
   * Extract component dependencies
   * 
   * @param component - Component to analyze
   * @returns Array of component IDs this component depends on
   */
  extractDependencies(component: UIComponent): string[] {
    const dependencies: string[] = [];
    
    // Check for parentId reference
    if (component.parentId) {
      dependencies.push(component.parentId);
    }
    
    // Check children for dependencies
    if (component.children) {
      for (const child of component.children) {
        dependencies.push(...this.extractDependencies(child));
      }
    }
    
    // Check props for component references
    if (component.props) {
      const propsWithRefs = this.findComponentReferencesInProps(component.props);
      dependencies.push(...propsWithRefs);
    }
    
    // Remove duplicates and return
    return [...new Set(dependencies)];
  }

  /**
   * Extract editable fields from a component
   * 
   * @param component - Component to extract fields from
   * @returns Array of editable fields
   */
  extractEditableFields(component: UIComponent): EditableField[] {
    const fields: EditableField[] = [];
    
    if (!component.props) {
      return fields;
    }
    
    for (const [key, value] of Object.entries(component.props)) {
      const field: EditableField = {
        name: key,
        type: this.inferFieldType(value),
        value,
        editable: !key.startsWith('_'), // Don't edit private fields
        label: this.formatLabel(key),
      };
      
      // Add validation for common types
      if (field.type === 'number') {
        field.validation = {
          min: -Infinity,
          max: Infinity,
        };
      }
      
      fields.push(field);
    }
    
    return fields;
  }

  /**
   * Get registry statistics
   * 
   * @returns Registry statistics
   */
  getStats(): RegistryStats {
    const components = Array.from(this.registry.values());
    const totalComponents = components.length;
    const uniqueComponents = this.hashIndex.size;
    const duplicatesAvoided = totalComponents - uniqueComponents;
    
    const totalAccessCount = components.reduce((sum, comp) => sum + comp.usageStats.accessCount, 0);
    const avgAccessCount = totalComponents > 0 ? totalAccessCount / totalComponents : 0;
    
    const totalEstimatedTokens = components.reduce(
      (sum, comp) => sum + comp.compactSpec.estimatedTokens,
      0
    );
    
    const complexityDistribution = {
      low: components.filter(c => c.compactSpec.complexity === 'low').length,
      medium: components.filter(c => c.compactSpec.complexity === 'medium').length,
      high: components.filter(c => c.compactSpec.complexity === 'high').length,
    };
    
    return {
      totalComponents,
      uniqueComponents,
      duplicatesAvoided,
      avgAccessCount,
      totalEstimatedTokens,
      complexityDistribution,
    };
  }

  /**
   * Clear all components from the registry
   */
  clear(): void {
    this.registry.clear();
    this.hashIndex.clear();
  }

  /**
   * Remove a component from the registry
   * 
   * @param id - Component ID to remove
   * @returns True if component was removed, false if not found
   */
  removeComponent(id: string): boolean {
    const entry = this.registry.get(id);
    if (!entry) {
      return false;
    }
    
    this.registry.delete(id);
    this.hashIndex.delete(entry.hash);
    return true;
  }

  /**
   * Check if a component exists in the registry
   * 
   * @param id - Component ID
   * @returns True if component exists
   */
  hasComponent(id: string): boolean {
    return this.registry.has(id);
  }

  /**
   * Get all component IDs in the registry
   * 
   * @returns Array of component IDs
   */
  getAllComponentIds(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Get all compact components
   * 
   * @returns Array of compact components
   */
  getAllCompactComponents(): CompactComponent[] {
    return Array.from(this.registry.values()).map(entry => entry.compactSpec);
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Evict least recently used components if cache is full
   */
  private evictIfNeeded(): void {
    if (this.registry.size <= this.maxCacheSize) {
      return;
    }
    
    // Sort by last accessed (LRU)
    const sorted = Array.from(this.registry.entries())
      .sort(([, a], [, b]) => a.usageStats.lastAccessed - b.usageStats.lastAccessed);
    
    // Evict 10% of cache
    const toEvict = sorted.slice(0, Math.floor(this.maxCacheSize * 0.1));
    
    for (const [id, entry] of toEvict) {
      this.registry.delete(id);
      this.hashIndex.delete(entry.hash);
    }
  }

  /**
   * Extract key properties from component props
   * 
   * @param props - Component props
   * @param count - Number of properties to extract
   * @returns Array of key property descriptions
   */
  private extractKeyProperties(props: Record<string, unknown>, count: number): string[] {
    const entries = Object.entries(props);
    const keyProps: string[] = [];
    
    // Prioritize certain property types
    const priorityKeys = ['title', 'name', 'label', 'text', 'value', 'data'];
    
    for (const key of priorityKeys) {
      if (keyProps.length >= count) break;
      const entry = entries.find(([k]) => k === key);
      if (entry) {
        keyProps.push(`${key}="${this.formatValue(entry[1])}"`);
      }
    }
    
    // Add remaining properties
    for (const [key, value] of entries) {
      if (keyProps.length >= count) break;
      if (!priorityKeys.includes(key)) {
        keyProps.push(`${key}="${this.formatValue(value)}"`);
      }
    }
    
    return keyProps;
  }

  /**
   * Format a value for display in summary
   * 
   * @param value - Value to format
   * @returns Formatted string
   */
  private formatValue(value: unknown): string {
    if (typeof value === 'string') {
      return value.length > 20 ? value.substring(0, 17) + '...' : value;
    }
    if (typeof value === 'number') {
      return String(value);
    }
    if (typeof value === 'boolean') {
      return String(value);
    }
    if (Array.isArray(value)) {
      return `[${value.length} items]`;
    }
    if (typeof value === 'object' && value !== null) {
      return '[object]';
    }
    return String(value);
  }

  /**
   * Calculate nesting depth of a component
   * 
   * @param component - Component to analyze
   * @returns Nesting depth
   */
  private calculateNestingDepth(component: UIComponent): number {
    if (!component.children || component.children.length === 0) {
      return 1;
    }
    
    const childDepths = component.children.map(child => this.calculateNestingDepth(child));
    return 1 + Math.max(...childDepths);
  }

  /**
   * Find component references in props
   * 
   * @param props - Props to search
   * @returns Array of component IDs
   */
  private findComponentReferencesInProps(props: Record<string, unknown>): string[] {
    const refs: string[] = [];
    
    for (const value of Object.values(props)) {
      if (typeof value === 'string' && value.startsWith('comp-')) {
        refs.push(value);
      } else if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'string' && item.startsWith('comp-')) {
            refs.push(item);
          }
        }
      }
    }
    
    return refs;
  }

  /**
   * Infer field type from value
   * 
   * @param value - Value to analyze
   * @returns Field type
   */
  private inferFieldType(value: unknown): EditableField['type'] {
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    return 'string';
  }

  /**
   * Format a key into a label
   * 
   * @param key - Key to format
   * @returns Formatted label
   */
  private formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  // ============================================================================
  // Hash Algorithms
  // ============================================================================

  /**
   * DJB2 hash algorithm
   * 
   * @param str - String to hash
   * @returns Hash string
   */
  private djb2Hash(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * SDBM hash algorithm
   * 
   * @param str - String to hash
   * @returns Hash string
   */
  private sdbmHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * FNV-1a hash algorithm
   * 
   * @param str - String to hash
   * @returns Hash string
   */
  private fnv1aHash(str: string): string {
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    return Math.abs(hash).toString(16);
  }
}

/**
 * Create a new component registry with default settings
 * 
 * @param maxCacheSize - Maximum cache size (default: 1000)
 * @returns New component registry instance
 */
export function createComponentRegistry(maxCacheSize?: number): ComponentRegistry {
  return new ComponentRegistry(maxCacheSize);
}
