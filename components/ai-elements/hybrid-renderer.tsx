"use client";

/**
 * Hybrid Renderer Component
 * Renders mixed content blocks (text, JSX, and A2UI) in a unified way
 */

import type { ComponentProps, ReactNode } from "react";
import type { TProps as JsxParserProps } from "react-jsx-parser";
import type { ContentBlock } from "@/components/ai-elements/generative-message";

import { JSXPreview, JSXPreviewContent, JSXPreviewError } from "@/components/ai-elements/jsx-preview";
import { A2UIRenderer } from "@/lib/a2ui/renderer";
import { MessageResponse } from "@/components/ai-elements/message";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Component, ErrorInfo } from "react";

// ============================================================================
// Error Boundary
// ============================================================================

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface HybridRendererErrorBoundaryProps {
  children: ReactNode;
  blockId: string;
  blockType: string;
}

/**
 * Error boundary for individual content blocks
 * Catches rendering errors and displays user-friendly message
 */
class HybridRendererErrorBoundary extends Component<
  HybridRendererErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: HybridRendererErrorBoundaryProps) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[HybridRenderer] Error in block ${this.props.blockId}:`, error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.error) {
      return (
        <HybridRendererError
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          blockId={this.props.blockId}
          blockType={this.props.blockType}
        />
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// Error Display Component
// ============================================================================

interface HybridRendererErrorProps {
  error: Error;
  errorInfo?: ErrorInfo | null;
  blockId?: string;
  blockType?: string;
  className?: string;
}

/**
 * User-friendly error display with collapsible technical details
 */
export function HybridRendererError({
  error,
  errorInfo,
  blockId,
  blockType,
  className,
}: HybridRendererErrorProps) {
  return (
    <Alert
      variant="destructive"
      className={cn("my-4 border-destructive/50 bg-destructive/10", className)}
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Component Rendering Error</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          <p className="text-sm">
            Failed to render {blockType || 'component'} block.
          </p>
          <p className="text-sm font-medium">{error.message}</p>

          {/* Collapsible technical details */}
          <details className="mt-3 cursor-pointer">
            <summary className="text-xs text-muted-foreground hover:text-foreground">
              Show technical details
            </summary>
            <div className="mt-2 space-y-2 rounded-md border border-destructive/20 bg-background/50 p-3">
              {blockId && (
                <div className="text-xs">
                  <span className="font-medium">Block ID:</span>{' '}
                  <code className="font-mono">{blockId}</code>
                </div>
              )}
              {blockType && (
                <div className="text-xs">
                  <span className="font-medium">Block Type:</span>{' '}
                  <code className="font-mono">{blockType}</code>
                </div>
              )}
              <div className="text-xs">
                <span className="font-medium">Error:</span>
                <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-xs">
                  {error.stack || error.message}
                </pre>
              </div>
              {errorInfo?.componentStack && (
                <div className="text-xs">
                  <span className="font-medium">Component Stack:</span>
                  <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-xs">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// ============================================================================
// Hybrid Renderer Component
// ============================================================================

export interface HybridRendererProps extends ComponentProps<"div"> {
  /** Content blocks to render (text, JSX, A2UI) */
  blocks: ContentBlock[];
  /** Component registry for JSX rendering */
  jsxComponents?: JsxParserProps["components"];
  /** Bindings for interactive JSX components */
  jsxBindings?: JsxParserProps["bindings"];
  /** Whether content is still streaming */
  isStreaming?: boolean;
}

/**
 * Hybrid Renderer
 * Renders mixed content blocks in order: text (markdown), JSX, and A2UI
 *
 * Usage:
 * ```tsx
 * <HybridRenderer
 *   blocks={contentBlocks}
 *   jsxComponents={componentRegistry}
 *   isStreaming={false}
 * />
 * ```
 */
export function HybridRenderer({
  blocks,
  jsxComponents,
  jsxBindings,
  isStreaming = false,
  className,
  ...props
}: HybridRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {blocks.map((block) => (
        <HybridRendererErrorBoundary
          key={block.id}
          blockId={block.id}
          blockType={block.type}
        >
          {block.type === 'text' && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <MessageResponse>{block.content}</MessageResponse>
            </div>
          )}

          {block.type === 'jsx' && (
            <JSXPreview
              jsx={block.code}
              isStreaming={isStreaming}
              components={jsxComponents}
              bindings={jsxBindings}
              className="border rounded-lg bg-background p-4"
            >
              <JSXPreviewError />
              <JSXPreviewContent />
            </JSXPreview>
          )}

          {block.type === 'a2ui' && (
            <div className="border rounded-lg bg-background p-4">
              <A2UIRenderer message={block.spec} />
            </div>
          )}
        </HybridRendererErrorBoundary>
      ))}
    </div>
  );
}
