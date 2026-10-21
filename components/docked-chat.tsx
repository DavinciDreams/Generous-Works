"use client";

import type { ReactNode } from "react";
import type { TProps as JsxParserProps } from "react-jsx-parser";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { memo } from "react";

import type { ContentBlock } from "@/components/ai-elements/generative-message";
import type { Message as StoreMessage } from "@/lib/store";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  getMessageBlocks,
  trimPendingCodeFence,
} from "@/components/ai-elements/generative-message";
import { getBlockLabel, HybridRenderer } from "@/components/ai-elements/hybrid-renderer";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { getCanvasArtifactId } from "@/components/artifact-canvas";
import { GalaxySurfaceControls } from "@/components/galaxy-surface-controls";

export interface SplitMessageBlocks {
  text: ContentBlock[];
  visuals: ContentBlock[];
  /** A visual is still streaming inside an unclosed code fence. */
  pending: boolean;
}

/**
 * Split an assistant message into prose (shown in the chat) and visuals
 * (placed on the canvas). Both views use this so their ids always agree.
 */
export function splitMessageBlocks(
  message: Pick<StoreMessage, "content" | "a2ui">,
  isStreaming: boolean,
): SplitMessageBlocks {
  const { content, pending } = isStreaming
    ? trimPendingCodeFence(message.content)
    : { content: message.content, pending: false };
  const blocks = getMessageBlocks(content, message.a2ui);

  return {
    text: blocks.filter((block) => block.type === "text"),
    visuals: blocks.filter((block) => block.type !== "text"),
    pending,
  };
}

interface DockedChatMessageProps {
  message: StoreMessage;
  isStreaming: boolean;
  jsxComponents?: JsxParserProps["components"];
  galaxySurfaceWritesConfigured: boolean;
  galaxyAccessAllowed: boolean;
  onFocusArtifact: (id: string) => void;
}

const DockedChatMessage = memo(({
  message,
  isStreaming,
  jsxComponents,
  galaxySurfaceWritesConfigured,
  galaxyAccessAllowed,
  onFocusArtifact,
}: DockedChatMessageProps) => {
  if (message.role === "user") {
    return (
      <Message from="user">
        <MessageContent>
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </MessageContent>
      </Message>
    );
  }

  const { text, visuals, pending } = splitMessageBlocks(message, isStreaming);
  const isThinking = isStreaming && text.length === 0 && visuals.length === 0 && !pending;

  return (
    <Message from="assistant">
      <MessageContent className="w-full">
        {text.length > 0 ? (
          <HybridRenderer
            blocks={text}
            jsxComponents={jsxComponents}
            isStreaming={isStreaming}
          />
        ) : null}

        {visuals.length > 0 || pending ? (
          <div className="flex flex-wrap gap-2">
            {visuals.map((block) => {
              const { name, emoji } = getBlockLabel(block);
              return (
                <button
                  key={block.id}
                  type="button"
                  onClick={() => onFocusArtifact(getCanvasArtifactId(message.id, block.id))}
                  className="group/chip flex min-h-9 items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-3 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span aria-hidden="true">{emoji}</span>
                  {name}
                  <span className="text-muted-foreground group-hover/chip:text-foreground">
                    View on canvas
                  </span>
                  <ArrowUpRight aria-hidden="true" className="size-3.5 text-muted-foreground" />
                </button>
              );
            })}
            {pending ? (
              <span className="flex min-h-9 items-center gap-2 rounded-lg border border-dashed border-primary/40 px-3 text-xs text-muted-foreground">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                Building a visual…
              </span>
            ) : null}
          </div>
        ) : null}

        {isThinking ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            Thinking…
          </div>
        ) : null}

        <GalaxySurfaceControls
          messageId={message.id}
          content={message.content}
          a2ui={message.a2ui}
          isStreaming={isStreaming}
          writesConfigured={galaxySurfaceWritesConfigured}
          accessAllowed={galaxyAccessAllowed}
        />
      </MessageContent>
    </Message>
  );
});

DockedChatMessage.displayName = "DockedChatMessage";

export interface DockedChatProps {
  messages: StoreMessage[];
  isLoading: boolean;
  jsxComponents?: JsxParserProps["components"];
  galaxySurfaceWritesConfigured: boolean;
  galaxyAccessAllowed: boolean;
  onFocusArtifact: (id: string) => void;
  error?: string | null;
  /** The prompt input, pinned to the bottom of the panel. */
  footer: ReactNode;
}

export function DockedChat({
  messages,
  isLoading,
  jsxComponents,
  galaxySurfaceWritesConfigured,
  galaxyAccessAllowed,
  onFocusArtifact,
  error,
  footer,
}: DockedChatProps) {
  const visibleMessages = messages.filter((message) => message.role !== "system");
  const lastMessageId = messages[messages.length - 1]?.id;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {visibleMessages.length === 0 ? (
        <div className="flex min-h-0 flex-1 items-center justify-center p-6">
          <div className="max-w-xs space-y-3 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0097b2] to-[#7ed952] text-white shadow-lg">
              <Sparkles aria-hidden="true" className="size-5" />
            </div>
            <h2 className="font-[family-name:var(--font-poppins)] text-2xl font-bold text-foreground">
              Ask for anything.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Charts, maps, 3D scenes, slides, docs — each one lands on the canvas, where you can move it around.
            </p>
          </div>
        </div>
      ) : (
        <Conversation className="min-h-0 flex-1">
          <ConversationContent className="gap-6 px-4 py-6">
            {visibleMessages.map((message) => (
              <DockedChatMessage
                key={message.id}
                message={message}
                isStreaming={isLoading && message.role === "assistant" && message.id === lastMessageId}
                jsxComponents={jsxComponents}
                galaxySurfaceWritesConfigured={galaxySurfaceWritesConfigured}
                galaxyAccessAllowed={galaxyAccessAllowed}
                onFocusArtifact={onFocusArtifact}
              />
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      {error ? (
        <div
          role="alert"
          className="mx-3 mb-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
        >
          {error}
        </div>
      ) : null}

      <div className="shrink-0 border-t border-border p-3">{footer}</div>
    </div>
  );
}
