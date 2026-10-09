/**
 * Context Window Management Module
 *
 * Provides utilities for managing LLM context window to prevent exhaustion
 * while maintaining conversation quality.
 *
 * Main exports:
 * - ContextCompactor: Main orchestrator for context optimization
 * - TokenCounter: Utility for counting tokens
 * - MessageSummarizer: Utility for summarizing messages
 * - ContextConfig: Configuration types and defaults
 */

// Re-export Message type from store for convenience
export type { Message, UIComponent } from '../store';

// Configuration
export type {
  TokenLimitConfig,
  CompressionConfig,
  ContextConfig,
} from './config';

export {
  defaultTokenLimits,
  defaultCompressionConfig,
  defaultContextConfig,
  getContextConfig,
  validateConfig,
} from './config';

// Token Counter
export type { TokenCount } from './token-counter';

export { TokenCounter, createTokenCounter } from './token-counter';

// Message Summarizer
export type { ConversationSummary, SummarizeOptions } from './message-summarizer';

export { MessageSummarizer, createMessageSummarizer } from './message-summarizer';

// Context Compactor
export type { CompactionResult, ComponentReference } from './context-compactor';

export { ContextCompactor, createContextCompactor } from './context-compactor';
