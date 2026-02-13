/**
 * Configuration for context window management
 * 
 * This module defines the token limits and compression settings for
 * managing LLM context window to prevent exhaustion while maintaining
 * conversation quality.
 */

/**
 * Token limit configuration
 */
export interface TokenLimitConfig {
  /** Maximum total tokens allowed in context */
  maxTotalTokens: number;
  /** Maximum tokens for system prompt */
  maxSystemPromptTokens: number;
  /** Maximum tokens for conversation messages */
  maxConversationTokens: number;
  /** Maximum tokens for UI components */
  maxComponentsTokens: number;
  /** Reserve tokens for LLM response */
  reserveResponseTokens: number;
}

/**
 * Compression configuration
 */
export interface CompressionConfig {
  /** Target compression ratio (0.3-0.5 means reduce to 30-50% of original) */
  targetCompressionRatio: number;
  /** Number of recent messages to keep verbatim */
  recentMessageRetentionCount: number;
  /** Maximum number of messages before triggering summarization */
  maxMessagesBeforeSummarize: number;
  /** Whether to enable component reference compression */
  enableComponentCompression: boolean;
  /** Whether to enable conversation summarization */
  enableSummarization: boolean;
}

/**
 * Complete context management configuration
 */
export interface ContextConfig {
  tokenLimits: TokenLimitConfig;
  compression: CompressionConfig;
}

/**
 * Default token limit configuration
 * Based on common LLM context window sizes (e.g., GPT-4: 128k, Claude: 200k)
 */
export const defaultTokenLimits: TokenLimitConfig = {
  maxTotalTokens: 128000,
  maxSystemPromptTokens: 8000,
  maxConversationTokens: 80000,
  maxComponentsTokens: 30000,
  reserveResponseTokens: 10000,
};

/**
 * Default compression configuration
 */
export const defaultCompressionConfig: CompressionConfig = {
  targetCompressionRatio: 0.4, // Target 40% of original size
  recentMessageRetentionCount: 10, // Keep last 10 messages verbatim
  maxMessagesBeforeSummarize: 20, // Summarize when more than 20 messages
  enableComponentCompression: true,
  enableSummarization: true,
};

/**
 * Default complete configuration
 */
export const defaultContextConfig: ContextConfig = {
  tokenLimits: defaultTokenLimits,
  compression: defaultCompressionConfig,
};

/**
 * Get configuration with optional overrides
 */
export function getContextConfig(overrides?: Partial<ContextConfig>): ContextConfig {
  return {
    tokenLimits: { ...defaultTokenLimits, ...overrides?.tokenLimits },
    compression: { ...defaultCompressionConfig, ...overrides?.compression },
  };
}

/**
 * Validate configuration
 */
export function validateConfig(config: ContextConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate token limits
  if (config.tokenLimits.maxTotalTokens <= 0) {
    errors.push('maxTotalTokens must be positive');
  }
  if (config.tokenLimits.maxSystemPromptTokens <= 0) {
    errors.push('maxSystemPromptTokens must be positive');
  }
  if (config.tokenLimits.maxConversationTokens <= 0) {
    errors.push('maxConversationTokens must be positive');
  }
  if (config.tokenLimits.maxComponentsTokens <= 0) {
    errors.push('maxComponentsTokens must be positive');
  }
  if (config.tokenLimits.reserveResponseTokens <= 0) {
    errors.push('reserveResponseTokens must be positive');
  }

  // Check that individual limits don't exceed total
  const sumOfLimits =
    config.tokenLimits.maxSystemPromptTokens +
    config.tokenLimits.maxConversationTokens +
    config.tokenLimits.maxComponentsTokens +
    config.tokenLimits.reserveResponseTokens;

  if (sumOfLimits > config.tokenLimits.maxTotalTokens) {
    errors.push(
      `Sum of individual token limits (${sumOfLimits}) exceeds maxTotalTokens (${config.tokenLimits.maxTotalTokens})`
    );
  }

  // Validate compression settings
  if (config.compression.targetCompressionRatio <= 0 || config.compression.targetCompressionRatio > 1) {
    errors.push('targetCompressionRatio must be between 0 and 1');
  }
  if (config.compression.recentMessageRetentionCount < 0) {
    errors.push('recentMessageRetentionCount must be non-negative');
  }
  if (config.compression.maxMessagesBeforeSummarize < 2) {
    errors.push('maxMessagesBeforeSummarize must be at least 2');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
