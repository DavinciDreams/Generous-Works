/**
 * Context Compactor
 *
 * Main orchestrator for context optimization. Combines token counting,
 * message summarization, and component compression to efficiently manage
 * LLM context window.
 */

import type { Message, UIComponent } from '../store';
import type { ContextConfig, TokenLimitConfig } from './config';
import { TokenCounter, type TokenCount } from './token-counter';
import { MessageSummarizer, type ConversationSummary } from './message-summarizer';
import type { CompactComponent } from '../components/types';

/**
 * Compaction result
 */
export interface CompactionResult {
  /** Compacted messages ready for LLM */
  compactedMessages: Message[];
  /** Compacted system prompt */
  compactedSystemPrompt: string;
  /** Token usage before compaction */
  originalTokenCount: TokenCount;
  /** Token usage after compaction */
  compactedTokenCount: TokenCount;
  /** Conversation summary if created */
  summary?: ConversationSummary;
  /** Compression ratio (0-1) */
  compressionRatio: number;
  /** Number of messages removed/summarized */
  messagesCompacted: number;
  /** Whether compaction was performed */
  wasCompacted: boolean;
}

/**
 * Component reference (compressed representation)
 */
export interface ComponentReference {
  id: string;
  type: string;
  summary: string;
}

/**
 * Context compactor class
 */
export class ContextCompactor {
  private config: ContextConfig;
  private tokenCounter: TokenCounter;
  private messageSummarizer: MessageSummarizer;

  /**
   * Create a new context compactor
   * @param config - Context configuration
   */
  constructor(config?: Partial<ContextConfig>) {
    this.config = this.mergeConfig(config);
    this.tokenCounter = new TokenCounter(this.config.tokenLimits);
    this.messageSummarizer = new MessageSummarizer(this.config.compression);
  }

  /**
   * Compact context for LLM consumption
   *
   * @param messages - Conversation messages
   * @param components - UI components (full specs)
   * @param compactedComponents - Optional compacted components from registry
   * @param systemPrompt - System prompt
   * @returns Compaction result
   */
  async compact(
    messages: Message[],
    components: Record<string, UIComponent>,
    compactedComponents?: Record<string, CompactComponent>,
    systemPrompt?: string
  ): Promise<CompactionResult> {
    // Use compacted components if provided, otherwise use full components
    const componentsToUse = compactedComponents && Object.keys(compactedComponents).length > 0
      ? this.expandCompactedComponents(compactedComponents, components)
      : components;

    // Calculate original token usage
    const originalTokenCount = this.tokenCounter.calculateUsage(messages, components, systemPrompt || '');

    // Check if compaction is needed
    const needsCompaction = this.needsCompaction(originalTokenCount);

    if (!needsCompaction) {
      // No compaction needed, return as-is
      return {
        compactedMessages: messages,
        compactedSystemPrompt: systemPrompt || '',
        originalTokenCount,
        compactedTokenCount: originalTokenCount,
        compressionRatio: 1,
        messagesCompacted: 0,
        wasCompacted: false,
      };
    }

    // Perform compaction
    const result = await this.performCompaction(messages, componentsToUse, systemPrompt || '');

    // Calculate compacted token usage
    const compactedTokenCount = this.tokenCounter.calculateUsage(
      result.compactedMessages,
      result.compactedComponents,
      result.compactedSystemPrompt
    );

    // Calculate compression ratio
    const compressionRatio = compactedTokenCount.total / originalTokenCount.total;

    return {
      compactedMessages: result.compactedMessages,
      compactedSystemPrompt: result.compactedSystemPrompt,
      originalTokenCount,
      compactedTokenCount,
      summary: result.summary,
      compressionRatio,
      messagesCompacted: result.messagesCompacted,
      wasCompacted: true,
    };
  }

  /**
   * Expand compacted components back to full components for use in context
   *
   * @param compactedComponents - Compacted components
   * @param fullComponents - Full components for reference
   * @returns Expanded components
   */
  private expandCompactedComponents(
    compactedComponents: Record<string, CompactComponent>,
    fullComponents: Record<string, UIComponent>
  ): Record<string, UIComponent> {
    // For now, return full components
    // In a more sophisticated implementation, we could use only compacted summaries
    return fullComponents;
  }

  /**
   * Check if context needs compaction
   * 
   * @param tokenCount - Current token count
   * @returns True if compaction is needed
   */
  private needsCompaction(tokenCount: TokenCount): boolean {
    // Compaction needed if usage exceeds target percentage
    const targetUsage = this.config.compression.targetCompressionRatio;
    return tokenCount.usagePercentage > (targetUsage * 100);
  }

  /**
   * Perform the actual compaction
   * 
   * @param messages - Messages to compact
   * @param components - Components to compact
   * @param systemPrompt - System prompt to compact
   * @returns Compaction result
   */
  private async performCompaction(
    messages: Message[],
    components: Record<string, UIComponent>,
    systemPrompt: string
  ): Promise<{
    compactedMessages: Message[];
    compactedComponents: Record<string, UIComponent>;
    compactedSystemPrompt: string;
    summary?: ConversationSummary;
    messagesCompacted: number;
  }> {
    // Step 1: Compact messages (summarize older ones)
    const { compactedMessages, summary } = await this.compactMessages(messages);
    const messagesCompacted = summary ? summary.messageCount : 0;

    // Step 2: Compact system prompt
    const compactedSystemPrompt = this.compactSystemPrompt(systemPrompt, compactedMessages, components);

    // Step 3: Compact components (select most relevant)
    const compactedComponents = this.compactComponents(components, compactedMessages);

    return {
      compactedMessages,
      compactedComponents,
      compactedSystemPrompt,
      summary,
      messagesCompacted,
    };
  }

  /**
   * Compact messages by summarizing older ones
   * 
   * @param messages - Messages to compact
   * @returns Compacted messages with optional summary
   */
  private async compactMessages(
    messages: Message[]
  ): Promise<{ compactedMessages: Message[]; summary?: ConversationSummary }> {
    return await this.messageSummarizer.summarizeMessages(messages);
  }

  /**
   * Compact system prompt by removing redundant information
   * 
   * @param systemPrompt - Original system prompt
   * @param messages - Current messages
   * @param components - Current components
   * @returns Compacted system prompt
   */
  private compactSystemPrompt(
    systemPrompt: string,
    messages: Message[],
    components: Record<string, UIComponent>
  ): string {
    // For now, return the system prompt as-is
    // In a more sophisticated implementation, we could:
    // - Remove examples that are not relevant to current context
    // - Shorten descriptions
    // - Use references instead of full component specs

    // Add context metadata to system prompt
    const contextInfo = this.generateContextInfo(messages, components);
    
    if (contextInfo) {
      return `${systemPrompt}\n\n${contextInfo}`;
    }

    return systemPrompt;
  }

  /**
   * Generate context information for system prompt
   *
   * @param messages - Current messages
   * @param components - Current components
   * @returns Context information string
   */
  private generateContextInfo(
    messages: Message[],
    components: Record<string, UIComponent>
  ): string {
    const parts: string[] = [];

    parts.push(`[CONTEXT INFO]`);
    parts.push(`- Messages: ${messages.length}`);
    parts.push(`- Components: ${Object.keys(components).length}`);

    // Extract component types and summaries
    const componentTypes = new Set<string>();
    const componentSummaries: string[] = [];
    
    Object.values(components).forEach(comp => {
      componentTypes.add(comp.type);
      // Generate a brief summary for each component
      const summary = this.generateComponentSummary(comp);
      componentSummaries.push(`  - ${comp.id}: ${summary}`);
    });

    if (componentTypes.size > 0) {
      parts.push(`- Component types: ${Array.from(componentTypes).join(', ')}`);
    }

    if (componentSummaries.length > 0) {
      parts.push(`- Component details:`);
      parts.push(...componentSummaries);
    }

    parts.push(`[END CONTEXT INFO]`);

    return parts.join('\n');
  }

  /**
   * Generate a brief summary for a component
   *
   * @param component - Component to summarize
   * @returns Component summary
   */
  private generateComponentSummary(component: UIComponent): string {
    const parts: string[] = [];
    parts.push(component.type);
    
    // Add key props
    if (component.props) {
      const keyProps = Object.entries(component.props)
        .slice(0, 3)
        .map(([key, value]) => `${key}=${this.formatValue(value)}`)
        .join(', ');
      if (keyProps) {
        parts.push(`(${keyProps})`);
      }
    }
    
    // Add children count
    if (component.children && component.children.length > 0) {
      parts.push(`with ${component.children.length} children`);
    }
    
    return parts.join(' ');
  }

  /**
   * Format a value for display in summary
   *
   * @param value - Value to format
   * @returns Formatted string
   */
  private formatValue(value: unknown): string {
    if (typeof value === 'string') {
      return value.length > 20 ? `"${value.substring(0, 17)}..."` : `"${value}"`;
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
   * Compact components by selecting most relevant ones
   * 
   * @param components - All components
   * @param messages - Current messages (for relevance scoring)
   * @returns Selected components
   */
  private compactComponents(
    components: Record<string, UIComponent>,
    messages: Message[]
  ): Record<string, UIComponent> {
    if (!this.config.compression.enableComponentCompression) {
      return components;
    }

    // Calculate available tokens for components
    const systemPromptTokens = this.tokenCounter.countSystemPrompt('');
    const messagesTokens = this.tokenCounter.countMessages(messages);
    const availableTokens = this.config.tokenLimits.maxComponentsTokens;

    // Select components based on recency and relevance
    return this.selectComponents(components, availableTokens, messages);
  }

  /**
   * Select most relevant components within token limit
   * 
   * @param components - All components
   * @param maxTokens - Maximum tokens for components
   * @param messages - Messages for relevance scoring
   * @returns Selected components
   */
  private selectComponents(
    components: Record<string, UIComponent>,
    maxTokens: number,
    messages: Message[]
  ): Record<string, UIComponent> {
    const selected: Record<string, UIComponent> = {};
    let usedTokens = 0;

    // Sort components by recency (assuming timestamp in props or metadata)
    const sortedComponents = Object.entries(components).sort(([, a], [, b]) => {
      const timeA = (a.props as any)?.timestamp || 0;
      const timeB = (b.props as any)?.timestamp || 0;
      return timeB - timeA;
    });

    // Select components until token limit is reached
    for (const [id, component] of sortedComponents) {
      const compTokens = this.tokenCounter.countComponent(component);

      if (usedTokens + compTokens <= maxTokens) {
        selected[id] = component;
        usedTokens += compTokens;
      } else {
        break;
      }
    }

    return selected;
  }

  /**
   * Merge configuration with defaults
   * 
   * @param config - Partial configuration
   * @returns Complete configuration
   */
  private mergeConfig(config?: Partial<ContextConfig>): ContextConfig {
    const defaultConfig = {
      tokenLimits: {
        maxTotalTokens: 128000,
        maxSystemPromptTokens: 8000,
        maxConversationTokens: 80000,
        maxComponentsTokens: 30000,
        reserveResponseTokens: 10000,
      },
      compression: {
        targetCompressionRatio: 0.4,
        recentMessageRetentionCount: 10,
        maxMessagesBeforeSummarize: 20,
        enableComponentCompression: true,
        enableSummarization: true,
      },
    };

    if (!config) {
      return defaultConfig;
    }

    return {
      tokenLimits: { ...defaultConfig.tokenLimits, ...config.tokenLimits },
      compression: { ...defaultConfig.compression, ...config.compression },
    };
  }

  /**
   * Get current configuration
   */
  getConfig(): ContextConfig {
    return this.config;
  }

  /**
   * Update configuration
   * 
   * @param config - Partial configuration to update
   */
  updateConfig(config: Partial<ContextConfig>): void {
    this.config = this.mergeConfig(config);
    this.tokenCounter = new TokenCounter(this.config.tokenLimits);
    this.messageSummarizer = new MessageSummarizer(this.config.compression);
  }
}

/**
 * Create a context compactor with default configuration
 */
export function createContextCompactor(config?: Partial<ContextConfig>): ContextCompactor {
  return new ContextCompactor(config);
}
