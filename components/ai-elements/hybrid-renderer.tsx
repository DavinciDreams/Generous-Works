"use client";

/**
 * Hybrid Renderer Component
 * Renders mixed content blocks (text, JSX, and A2UI) in a unified way
 */

import type { ComponentProps, ReactNode } from "react";
import type { TProps as JsxParserProps } from "react-jsx-parser";
import type { ContentBlock } from "@/components/ai-elements/generative-message";
import type { A2UIMessage } from "@/lib/a2ui/types";

import { JSXPreview, JSXPreviewContent, JSXPreviewError } from "@/components/ai-elements/jsx-preview";
import { A2UIRenderer } from "@/lib/a2ui/renderer";
import { MessageResponse } from "@/components/ai-elements/message";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Component, ErrorInfo, useState } from "react";
import { useGenerativeUIStore } from "@/lib/store";

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
// Artifact Save Helper
// ============================================================================

const ARTIFACT_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b',
  '#ef4444', '#06b6d4', '#f97316', '#ec4899',
];

function resolveArtifactMeta(block: ContentBlock): { name: string; emoji: string; color: string } {
  const color = ARTIFACT_COLORS[Math.floor(Math.random() * ARTIFACT_COLORS.length)];

  if (block.type === 'a2ui') {
    const components = block.spec?.surfaceUpdate?.components;
    const key = components?.length ? Object.keys(components[0].component)[0] : null;
    const map: Record<string, { name: string; emoji: string }> = {
      Charts: { name: 'Chart', emoji: '📊' },
      Maps: { name: 'Map', emoji: '🗺️' },
      Geospatial: { name: 'Map', emoji: '🌍' },
      Timeline: { name: 'Timeline', emoji: '📅' },
      Calendar: { name: 'Calendar', emoji: '📆' },
      ThreeScene: { name: '3D Scene', emoji: '🎲' },
      Phaser: { name: 'Game', emoji: '🎮' },
      CodeEditor: { name: 'Code', emoji: '💻' },
      Mermaid: { name: 'Diagram', emoji: '📐' },
      KnowledgeGraph: { name: 'Graph', emoji: '🕸️' },
      Presentation: { name: 'Slides', emoji: '📑' },
      Document: { name: 'Document', emoji: '📄' },
      DataTable: { name: 'Table', emoji: '📋' },
      NodeEditor: { name: 'Node Editor', emoji: '🔧' },
    };
    const m = key ? (map[key] ?? { name: key, emoji: '✨' }) : { name: 'Component', emoji: '✨' };
    return { ...m, color };
  }

  if (block.type === 'jsx') {
    const tagMatch = block.code.match(/<([A-Z][a-zA-Z0-9]*)/);
    return { name: tagMatch ? tagMatch[1] : 'Component', emoji: '🧩', color };
  }

  return { name: 'Artifact', emoji: '✨', color };
}

interface BlockSaveWrapperProps {
  block: ContentBlock;
  children: ReactNode;
}

function BlockSaveWrapper({ block, children }: BlockSaveWrapperProps) {
  const saveArtifact = useGenerativeUIStore((s) => s.saveArtifact);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const meta = resolveArtifactMeta(block);
    saveArtifact({
      name: meta.name,
      type: block.type === 'jsx' ? 'jsx' : 'a2ui',
      content: block.type === 'jsx' ? block.code : JSON.stringify((block as Extract<ContentBlock, { type: 'a2ui' }>).spec),
      spec: block.type === 'a2ui' ? (block as Extract<ContentBlock, { type: 'a2ui' }>).spec : undefined,
      color: meta.color,
      emoji: meta.emoji,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="relative group/save">
      {children}
      <button
        onClick={handleSave}
        className={cn(
          "absolute top-2 right-2 flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md transition-all duration-150",
          "opacity-0 group-hover/save:opacity-100",
          saved
            ? "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30"
            : "bg-popover/80 text-muted-foreground border border-border hover:text-foreground hover:bg-popover backdrop-blur"
        )}
        aria-label="Save as artifact"
      >
        {saved ? (
          <><BookmarkCheck className="w-3 h-3" /> Saved</>
        ) : (
          <><Bookmark className="w-3 h-3" /> Save</>
        )}
      </button>
    </div>
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
      {blocks.map((block) => {
        // Diagnostic logging for debugging
        console.log('[HybridRenderer] Rendering block:', { id: block.id, type: block.type });
        
        return (
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
            <BlockSaveWrapper block={block}>
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
            </BlockSaveWrapper>
          )}

          {block.type === 'a2ui' && (
            <BlockSaveWrapper block={block}>
              <div className="border rounded-lg bg-background p-4">
                <A2UIRenderer message={block.spec} />
              </div>
            </BlockSaveWrapper>
          )}
          </HybridRendererErrorBoundary>
        );
      })}
    </div>
  );
}
