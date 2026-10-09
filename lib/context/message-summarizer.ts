/**
 * Message Summarizer
 * 
 * Provides functionality to summarize older conversation messages
 * to reduce token usage while preserving essential context.
 */

import type { Message } from '../store';
import type { CompressionConfig } from './config';

/**
 * Conversation summary result
 */
export interface ConversationSummary {
  /** Original messages that were summarized */
  originalMessages: Message[];
  /** Generated summary text */
  summary: string;
  /** Key points extracted from messages */
  keyPoints: string[];
  /** Component references found in messages */
  componentReferences: string[];
  /** When the summary was created */
  timestamp: number;
  /** Number of messages summarized */
  messageCount: number;
}

/**
 * Summarization options
 */
export interface SummarizeOptions {
  /** Maximum length of summary in characters */
  maxSummaryLength?: number;
  /** Maximum number of key points to extract */
  maxKeyPoints?: number;
  /** Whether to include component references */
  includeComponentRefs?: boolean;
}

/**
 * Message summarizer class
 */
export class MessageSummarizer {
  private config: CompressionConfig;

  /**
   * Create a new message summarizer
   * @param config - Compression configuration
   */
  constructor(config: CompressionConfig) {
    this.config = config;
  }

  /**
   * Check if summarization should be triggered
   * 
   * @param messages - Messages to check
   * @returns True if summarization should be triggered
   */
  shouldSummarize(messages: Message[]): boolean {
    if (!this.config.enableSummarization) {
      return false;
    }
    return messages.length > this.config.maxMessagesBeforeSummarize;
  }

  /**
   * Summarize older messages while keeping recent messages verbatim
   * 
   * @param messages - All messages
   * @param options - Summarization options
   * @returns Object with compacted messages and summary
   */
  async summarizeMessages(
    messages: Message[],
    options?: SummarizeOptions
  ): Promise<{ compactedMessages: Message[]; summary?: ConversationSummary }> {
    const {
      maxSummaryLength = 2000,
      maxKeyPoints = 10,
      includeComponentRefs = true,
    } = options || {};

    // If message count is below threshold, return as-is
    if (messages.length <= this.config.recentMessageRetentionCount) {
      return { compactedMessages: messages };
    }

    // Split messages into older and recent
    const splitIndex = Math.max(0, messages.length - this.config.recentMessageRetentionCount);
    const olderMessages = messages.slice(0, splitIndex);
    const recentMessages = messages.slice(splitIndex);

    // Generate summary of older messages
    const summary = await this.summarize(olderMessages, {
      maxSummaryLength,
      maxKeyPoints,
      includeComponentRefs,
    });

    // Create compacted messages array
    const compactedMessages: Message[] = [];

    // Add summary as a system message if available
    if (summary) {
      compactedMessages.push({
        id: `summary-${Date.now()}`,
        role: 'system',
        content: this.formatSummary(summary),
        timestamp: summary.timestamp,
      });
    }

    // Add recent messages verbatim
    compactedMessages.push(...recentMessages);

    return { compactedMessages, summary };
  }

  /**
   * Generate a summary of messages
   * 
   * @param messages - Messages to summarize
   * @param options - Summarization options
   * @returns Generated summary
   */
  async summarize(
    messages: Message[],
    options?: SummarizeOptions
  ): Promise<ConversationSummary> {
    const {
      maxSummaryLength = 2000,
      maxKeyPoints = 10,
      includeComponentRefs = true,
    } = options || {};

    // Extract key information from messages
    const keyPoints = this.extractKeyPoints(messages, maxKeyPoints);
    const componentReferences = includeComponentRefs
      ? this.extractComponentReferences(messages)
      : [];

    // Generate summary text
    const summary = this.generateSummaryText(messages, keyPoints, componentReferences, maxSummaryLength);

    return {
      originalMessages: messages,
      summary,
      keyPoints,
      componentReferences,
      timestamp: Date.now(),
      messageCount: messages.length,
    };
  }

  /**
   * Extract key points from messages
   * 
   * @param messages - Messages to extract from
   * @param maxPoints - Maximum number of points to extract
   * @returns Array of key points
   */
  private extractKeyPoints(messages: Message[], maxPoints: number): string[] {
    const points: string[] = [];

    for (const msg of messages) {
      // Extract user requests
      if (msg.role === 'user') {
        const truncatedContent = this.truncateText(msg.content, 100);
        points.push(`User: ${truncatedContent}`);
      }

      // Extract assistant responses (brief)
      if (msg.role === 'assistant' && msg.content.length < 200) {
        points.push(`Assistant: ${this.truncateText(msg.content, 80)}`);
      }

      // Stop if we have enough points
      if (points.length >= maxPoints) {
        break;
      }
    }

    return points.slice(0, maxPoints);
  }

  /**
   * Extract component references from messages
   * 
   * @param messages - Messages to extract from
   * @returns Array of component references
   */
  private extractComponentReferences(messages: Message[]): string[] {
    const refs = new Set<string>();

    for (const msg of messages) {
      // Look for component patterns in content
      const componentPattern = /component:?\s*(\w+)/gi;
      const matches = msg.content.match(componentPattern);
      
      if (matches) {
        matches.forEach(match => {
          const componentName = match.replace(/component:?\s*/gi, '');
          refs.add(componentName);
        });
      }

      // Check for UI components in message
      if (msg.uiComponents && msg.uiComponents.length > 0) {
        msg.uiComponents.forEach(comp => {
          refs.add(comp.type);
        });
      }
    }

    return Array.from(refs);
  }

  /**
   * Generate summary text
   * 
   * @param messages - Messages being summarized
   * @param keyPoints - Key points extracted
   * @param componentReferences - Component references
   * @param maxLength - Maximum length of summary
   * @returns Generated summary text
   */
  private generateSummaryText(
    messages: Message[],
    keyPoints: string[],
    componentReferences: string[],
    maxLength: number
  ): string {
    const parts: string[] = [];

    // Add overview
    parts.push(`Previous conversation with ${messages.length} messages.`);

    // Add key points
    if (keyPoints.length > 0) {
      parts.push('\nKey points:');
      keyPoints.forEach((point, index) => {
        parts.push(`${index + 1}. ${point}`);
      });
    }

    // Add component references
    if (componentReferences.length > 0) {
      parts.push(`\nComponents mentioned: ${componentReferences.join(', ')}.`);
    }

    // Combine and truncate if necessary
    let summary = parts.join('\n');
    if (summary.length > maxLength) {
      summary = summary.substring(0, maxLength - 3) + '...';
    }

    return summary;
  }

  /**
   * Format summary as a system message
   * 
   * @param summary - Summary to format
   * @returns Formatted summary text
   */
  private formatSummary(summary: ConversationSummary): string {
    let text = `[CONVERSATION SUMMARY]\n`;
    text += `${summary.summary}\n`;
    
    if (summary.componentReferences.length > 0) {
      text += `\nComponents referenced: ${summary.componentReferences.join(', ')}`;
    }
    
    text += `\n[END SUMMARY - ${summary.messageCount} messages summarized]`;
    
    return text;
  }

  /**
   * Truncate text to specified length
   * 
   * @param text - Text to truncate
   * @param maxLength - Maximum length
   * @returns Truncated text
   */
  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  }
}

/**
 * Create a message summarizer with default configuration
 */
export function createMessageSummarizer(config?: Partial<CompressionConfig>): MessageSummarizer {
  const defaultConfig = {
    targetCompressionRatio: 0.4,
    recentMessageRetentionCount: 10,
    maxMessagesBeforeSummarize: 20,
    enableComponentCompression: true,
    enableSummarization: true,
  };
  
  return new MessageSummarizer({ ...defaultConfig, ...config });
}
