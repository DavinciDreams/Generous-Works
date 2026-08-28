"use client";

import type { HTMLAttributes } from "react";
import type { TProps as JsxParserProps } from "react-jsx-parser";
import type { A2UIMessage } from "@/lib/a2ui/types";

import { JSXPreview, JSXPreviewContent, JSXPreviewError } from "@/components/ai-elements/jsx-preview";
import { HybridRenderer } from "@/components/ai-elements/hybrid-renderer";
import { MessageResponse } from "@/components/ai-elements/message";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Content block types for unified parsing
 */
export type ContentBlock =
  | { type: 'text'; content: string; id: string }
  | { type: 'jsx'; code: string; id: string }
  | { type: 'a2ui'; spec: A2UIMessage; id: string };

/**
 * Message interface for generative messages
 */
export interface GenerativeMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** The message object containing id, role, content, and optional jsx */
  message: {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    jsx?: string;
    timestamp?: number;
    uiComponents?: Array<{
      id: string;
      jsx: string;
      componentName: string;
      state?: Record<string, unknown>;
    }>;
  };
  /** Whether the message is currently streaming */
  isStreaming?: boolean;
  /** Component registry for JSX rendering */
  components?: JsxParserProps["components"];
  /** Bindings for interactive components */
  bindings?: JsxParserProps["bindings"];
}

// ============================================================================
// Code Block Extraction Utilities
// ============================================================================

/**
 * Regex to match markdown code blocks with jsx or tsx language
 */
const JSX_CODE_BLOCK_REGEX = /```(?:jsx|tsx)(?:[ \t]*\r?\n|[ \t]+)([\s\S]*?)```/gi;

/**
 * Regex to match JSON code blocks (for A2UI)
 */
const JSON_CODE_BLOCK_REGEX = /```json(?:[ \t]*\r?\n|[ \t]+)([\s\S]*?)```/gi;

/** Unlabelled fenced JSON is common in streamed model responses. */
const UNLABELLED_JSON_CODE_BLOCK_REGEX = /```[ \t]*(?:\r?\n)?(\s*\{[\s\S]*?\})\s*```/gi;

/**
 * Normalize JSX code for react-jsx-parser without changing text or literals.
 */
const normalizeJSX = (jsx: string): string => {
  return jsx.trim();
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Guard the transport envelope before handing it to the renderer. */
const isA2UIMessage = (value: unknown): value is A2UIMessage => {
  if (!isRecord(value) || !isRecord(value.surfaceUpdate)) return false;

  const { components } = value.surfaceUpdate;
  if (!Array.isArray(components)) return false;

  return components.every((component) => {
    if (!isRecord(component) || typeof component.id !== 'string') return false;
    if (!isRecord(component.component)) return false;

    const entries = Object.entries(component.component);
    return entries.length === 1 && isRecord(entries[0][1]);
  });
};

/**
 * Parse message content into unified ContentBlock array
 * Extracts JSX (```tsx), A2UI (```json with surfaceUpdate), and text
 * Preserves original message order
 */
export const parseMessageContent = (content: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  let blockIndex = 0;

  // Find all code blocks with their positions
  interface CodeBlockMatch {
    type: 'jsx' | 'a2ui' | 'text';
    start: number;
    end: number;
    content: string;
    data?: A2UIMessage;
  }

  const matches: CodeBlockMatch[] = [];

  // Find JSX blocks
  const jsxRegex = new RegExp(JSX_CODE_BLOCK_REGEX.source, JSX_CODE_BLOCK_REGEX.flags);
  let jsxMatch: RegExpExecArray | null;
  while ((jsxMatch = jsxRegex.exec(content)) !== null) {
    const normalized = normalizeJSX(jsxMatch[1]);
    matches.push({
      type: 'jsx',
      start: jsxMatch.index,
      end: jsxMatch.index + jsxMatch[0].length,
      content: normalized,
    });
  }

  // Find labelled and unlabelled A2UI JSON blocks.
  for (const pattern of [JSON_CODE_BLOCK_REGEX, UNLABELLED_JSON_CODE_BLOCK_REGEX]) {
    const jsonRegex = new RegExp(pattern.source, pattern.flags);
    let jsonMatch: RegExpExecArray | null;

    while ((jsonMatch = jsonRegex.exec(content)) !== null) {
      try {
        const parsed: unknown = JSON.parse(jsonMatch[1].trim());

        if (isA2UIMessage(parsed)) {
          matches.push({
            type: 'a2ui',
            start: jsonMatch.index,
            end: jsonMatch.index + jsonMatch[0].length,
            content: jsonMatch[1].trim(),
            data: parsed,
          });
        }
      } catch {
        // Invalid JSON stays visible as text instead of disappearing or crashing.
        console.debug('[parseMessageContent] Invalid JSON block, treating as text');
      }
    }
  }

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);

  // Extract text blocks between code blocks
  let lastEnd = 0;
  for (const match of matches) {
    // Add text before this match
    if (match.start > lastEnd) {
      const textContent = content.substring(lastEnd, match.start).trim();
      if (textContent) {
        blocks.push({
          type: 'text',
          content: textContent,
          id: `text-block-${blockIndex++}`,
        });
      }
    }

    // Add the code block
    if (match.type === 'jsx') {
      blocks.push({
        type: 'jsx',
        code: match.content,
        id: `jsx-block-${blockIndex++}`,
      });
    } else if (match.type === 'a2ui' && match.data) {
      blocks.push({
        type: 'a2ui',
        spec: match.data,
        id: `a2ui-block-${blockIndex++}`,
      });
    }

    lastEnd = match.end;
  }

  // Add remaining text after last match
  if (lastEnd < content.length) {
    const textContent = content.substring(lastEnd).trim();
    if (textContent) {
      blocks.push({
        type: 'text',
        content: textContent,
        id: `text-block-${blockIndex++}`,
      });
    }
  }

  // If no blocks were found, treat entire content as text
  if (blocks.length === 0 && content.trim()) {
    blocks.push({
      type: 'text',
      content: content.trim(),
      id: 'text-block-0',
    });
  }

  return blocks;
};

// ============================================================================
// Main Component
// ============================================================================

export const GenerativeMessage = memo(
  ({
    message,
    isStreaming = false,
    components,
    bindings,
    className,
    ...props
  }: GenerativeMessageProps) => {
    const { id, role, content, jsx } = message;

    // Parse content to extract ALL blocks (text, JSX, A2UI)
    const contentBlocks = useMemo(() => {
      // If explicit jsx prop is provided, use legacy format
      if (jsx) {
        return [
          {
            type: 'text' as const,
            content,
            id: `text-${id}`,
          },
          {
            type: 'jsx' as const,
            code: jsx,
            id: `jsx-${id}`,
          },
        ];
      }

      // Otherwise, parse content for mixed blocks
      const blocks = parseMessageContent(content);
      console.log('[GenerativeMessage] Parsed blocks:', blocks.length, blocks.map(b => b.type));
      return blocks;
    }, [content, jsx, id]);

    // Don't render for system messages
    if (role === "system") {
      return null;
    }

    // Render using HybridRenderer
    return (
      <div className={cn("my-4", className)} {...props}>
        <HybridRenderer
          blocks={contentBlocks}
          jsxComponents={components}
          jsxBindings={bindings}
          isStreaming={isStreaming}
        />

        {/* Show streaming indicator */}
        {isStreaming && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>Generating...</span>
            <span className="sr-only" aria-live="polite">AI is generating a response</span>
          </div>
        )}
      </div>
    );
  }
);

GenerativeMessage.displayName = "GenerativeMessage";

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Wrapper component for text content
 */
export type GenerativeMessageTextProps = HTMLAttributes<HTMLDivElement>;

export const GenerativeMessageText = ({
  children,
  className,
  ...props
}: GenerativeMessageTextProps) => (
  <div
    className={cn(
      "prose prose-sm dark:prose-invert max-w-none",
      className
    )}
    {...props}
  >
    <MessageResponse>{String(children ?? "")}</MessageResponse>
  </div>
);

/**
 * Wrapper component for JSX content
 */
export type GenerativeMessageJSXProps = HTMLAttributes<HTMLDivElement> & {
  jsx: string;
  isStreaming?: boolean;
  components?: JsxParserProps["components"];
  bindings?: JsxParserProps["bindings"];
};

export const GenerativeMessageJSX = memo(
  ({
    jsx,
    isStreaming = false,
    components,
    bindings,
    className,
  }: GenerativeMessageJSXProps) => (
    <JSXPreview
      jsx={jsx}
      isStreaming={isStreaming}
      components={components}
      bindings={bindings}
      className={cn("border rounded-lg bg-background p-4", className)}
    >
      <JSXPreviewError />
      <JSXPreviewContent />
    </JSXPreview>
  )
);

GenerativeMessageJSX.displayName = "GenerativeMessageJSX";
