/**
 * Token Counter Utility
 * 
 * Provides functions to count tokens in text, messages, and UI components.
 * Uses a character-based approximation for token counting.
 * 
 * For production use with accurate token counting, consider installing
 * a proper tokenizer library like 'gpt-tokenizer' or 'tiktoken'.
 */

import type { Message, UIComponent } from '../store';
import type { TokenLimitConfig } from './config';

/**
 * Token count result
 */
export interface TokenCount {
  /** Total tokens */
  total: number;
  /** Tokens from messages */
  messages: number;
  /** Tokens from UI components */
  components: number;
  /** Tokens from system prompt */
  systemPrompt: number;
  /** Remaining tokens available */
  remaining: number;
  /** Token limit */
  limit: number;
  /** Percentage of limit used */
  usagePercentage: number;
}

/**
 * Token counter class
 */
export class TokenCounter {
  private limit: number;
  private reserveResponseTokens: number;

  /**
   * Create a new token counter
   * @param config - Token limit configuration
   */
  constructor(config: TokenLimitConfig) {
    this.limit = config.maxTotalTokens;
    this.reserveResponseTokens = config.reserveResponseTokens;
  }

  /**
   * Count tokens in text
   * Uses a character-based approximation: ~4 characters = 1 token
   * This is a rough estimate; for accurate counting, use a proper tokenizer
   * 
   * @param text - Text to count tokens for
   * @returns Approximate token count
   */
  countTokens(text: string): number {
    if (!text || text.length === 0) {
      return 0;
    }
    // Approximate: ~4 characters per token for English text
    // This varies by language and content type
    return Math.ceil(text.length / 4);
  }

  /**
   * Count tokens in a single message
   * 
   * @param message - Message to count tokens for
   * @returns Token count for the message
   */
  countMessage(message: Message): number {
    let tokens = this.countTokens(message.content);
    
    // Add tokens for role and other metadata
    tokens += 10; // Approximate overhead for role, id, etc.
    
    // Add tokens for JSX content if present
    if (message.jsx) {
      tokens += this.countTokens(message.jsx);
    }
    
    return tokens;
  }

  /**
   * Count tokens in an array of messages
   * 
   * @param messages - Messages to count tokens for
   * @returns Total token count for all messages
   */
  countMessages(messages: Message[]): number {
    return messages.reduce((sum, msg) => sum + this.countMessage(msg), 0);
  }

  /**
   * Count tokens in a UI component
   * 
   * @param component - UI component to count tokens for
   * @returns Token count for the component
   */
  countComponent(component: UIComponent): number {
    // Count tokens for component type and ID
    let tokens = this.countTokens(component.type) + this.countTokens(component.id);
    
    // Count tokens for props
    if (component.props) {
      tokens += this.countTokens(JSON.stringify(component.props));
    }
    
    // Count tokens for state if present
    if (component.state) {
      tokens += this.countTokens(JSON.stringify(component.state));
    }
    
    // Count tokens for children if present
    if (component.children && component.children.length > 0) {
      tokens += component.children.reduce((sum, child) => sum + this.countComponent(child), 0);
    }
    
    // Add overhead for component structure
    tokens += 20; // Approximate overhead for component structure
    
    return tokens;
  }

  /**
   * Count tokens in UI components
   * 
   * @param components - Record of UI components to count tokens for
   * @returns Total token count for all components
   */
  countComponents(components: Record<string, UIComponent>): number {
    return Object.values(components).reduce((sum, comp) => sum + this.countComponent(comp), 0);
  }

  /**
   * Count tokens in system prompt
   * 
   * @param prompt - System prompt to count tokens for
   * @returns Token count for the system prompt
   */
  countSystemPrompt(prompt: string): number {
    return this.countTokens(prompt);
  }

  /**
   * Calculate token usage statistics
   * 
   * @param messages - Conversation messages
   * @param components - UI components
   * @param systemPrompt - System prompt
   * @returns Token usage statistics
   */
  calculateUsage(
    messages: Message[],
    components: Record<string, UIComponent>,
    systemPrompt: string
  ): TokenCount {
    const messagesCount = this.countMessages(messages);
    const componentsCount = this.countComponents(components);
    const systemPromptCount = this.countSystemPrompt(systemPrompt);
    const total = messagesCount + componentsCount + systemPromptCount;
    const effectiveLimit = this.limit - this.reserveResponseTokens;
    const remaining = Math.max(0, effectiveLimit - total);
    const usagePercentage = (total / effectiveLimit) * 100;

    return {
      total,
      messages: messagesCount,
      components: componentsCount,
      systemPrompt: systemPromptCount,
      remaining,
      limit: effectiveLimit,
      usagePercentage,
    };
  }

  /**
   * Check if adding content would exceed the token limit
   * 
   * @param currentUsage - Current token usage
   * @param additionalTokens - Additional tokens to add
   * @returns True if adding would exceed limit
   */
  wouldExceedLimit(currentUsage: TokenCount, additionalTokens: number): boolean {
    return currentUsage.total + additionalTokens > currentUsage.limit;
  }

  /**
   * Get available tokens for additional content
   * 
   * @param currentUsage - Current token usage
   * @returns Available tokens
   */
  getAvailableTokens(currentUsage: TokenCount): number {
    return Math.max(0, currentUsage.remaining);
  }
}

/**
 * Create a token counter with default configuration
 */
export function createTokenCounter(config?: Partial<TokenLimitConfig>): TokenCounter {
  const defaultConfig = {
    maxTotalTokens: 128000,
    reserveResponseTokens: 10000,
    maxSystemPromptTokens: 8000,
    maxConversationTokens: 80000,
    maxComponentsTokens: 30000,
  };
  
  return new TokenCounter({ ...defaultConfig, ...config });
}
