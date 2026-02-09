"use client";

import type { HTMLAttributes } from "react";
import type { TProps as JsxParserProps } from "react-jsx-parser";

import { JSXPreview, JSXPreviewContent, JSXPreviewError } from "@/components/ai-elements/jsx-preview";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";

// ============================================================================
// Type Definitions
// ============================================================================

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

/**
 * Parsed content with text and JSX parts
 */
interface ParsedContent {
  textContent: string;
  jsxBlocks: Array<{
    id: string;
    code: string;
    language: "jsx" | "tsx";
  }>;
}

// ============================================================================
// JSX Extraction Utilities
// ============================================================================

/**
 * Regex to match markdown code blocks with jsx or tsx language
 */
const JSX_CODE_BLOCK_REGEX = /```(?:jsx|tsx)\s*\n([\s\S]*?)```/gi;

/**
 * Extract JSX code blocks from markdown content
 */
const extractJSXFromMarkdown = (content: string): ParsedContent => {
  const jsxBlocks: Array<{ id: string; code: string; language: "jsx" | "tsx" }> = [];
  let textContent = content;
  let matchIndex = 0;

  // Find all JSX/TSX code blocks
  let match: RegExpExecArray | null;
  while ((match = JSX_CODE_BLOCK_REGEX.exec(content)) !== null) {
    const [fullMatch, code] = match;
    const language: "jsx" | "tsx" = fullMatch.includes("```jsx") ? "jsx" : "tsx";

    jsxBlocks.push({
      id: `jsx-block-${matchIndex++}`,
      code: code.trim(),
      language,
    });

    // Remove the code block from text content
    textContent = textContent.replace(fullMatch, "");
  }

  return {
    textContent: textContent.trim(),
    jsxBlocks,
  };
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

    // Parse content to extract JSX blocks
    const parsedContent = useMemo(() => {
      // If explicit jsx prop is provided, use it
      if (jsx) {
        return {
          textContent: content,
          jsxBlocks: [
            {
              id: `jsx-block-${id}`,
              code: jsx,
              language: "tsx" as const,
            },
          ],
        };
      }

      // Otherwise, extract JSX from markdown code blocks
      return extractJSXFromMarkdown(content);
    }, [content, jsx, id]);

    const { textContent, jsxBlocks } = parsedContent;

    // Debug logging
    console.log('[DEBUG GenerativeMessage]', {
      messageId: id,
      hasJsx: !!jsx,
      jsxBlocksCount: jsxBlocks.length,
      jsx: jsx?.substring(0, 100),
      components: !!components
    });

    // Don't render for system messages
    if (role === "system") {
      return null;
    }

    // BYPASS Message/MessageContent - render directly
    return (
      <div className={cn("my-4 p-4 border-2", role === "user" ? "border-blue-500 bg-blue-50" : "border-green-500 bg-green-50", className)} {...props}>
        {/* DEBUG MARKER */}
        <div className="bg-pink-500 text-white font-bold text-xl p-4 my-2 border-4 border-black">
          GenerativeMessage RENDERING - Role: {role} - jsxBlocksCount: {jsxBlocks.length}
        </div>

          {/* Render text content with markdown */}
          {textContent && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MessageResponse>{textContent}</MessageResponse>
            </div>
          )}

          {/* Render JSX blocks */}
          {jsxBlocks.length > 0 && (
            <div className="mt-4 space-y-4">
              {jsxBlocks.map((jsxBlock) => (
                <JSXPreview
                  key={jsxBlock.id}
                  jsx={jsxBlock.code}
                  isStreaming={isStreaming}
                  components={components}
                  bindings={bindings}
                  className="border rounded-lg bg-background p-4"
                >
                  <JSXPreviewError />
                  <JSXPreviewContent />
                </JSXPreview>
              ))}
            </div>
          )}

          {/* Show streaming indicator */}
          {isStreaming && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>Generating...</span>
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
