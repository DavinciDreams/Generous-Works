"use client";

import type { ComponentProps } from "react";
import { MessageDraft as ToolUIMessageDraft } from "@/components/tool-ui/message-draft";
import type { MessageDraftProps as ToolUIMessageDraftProps } from "@/components/tool-ui/message-draft";

/**
 * MessageDraft AI Element
 * Wrapper around tool-ui MessageDraft component for A2UI integration
 */

export interface SlackTarget {
  type: "channel" | "dm";
  name: string;
  memberCount?: number;
}

export interface EmailDraftData {
  /** Draft ID */
  id: string;
  /** Channel type */
  channel: "email";
  /** Email subject */
  subject: string;
  /** Email body */
  body: string;
  /** From address */
  from?: string;
  /** To addresses */
  to: string[];
  /** CC addresses */
  cc?: string[];
  /** BCC addresses */
  bcc?: string[];
  /** Outcome status */
  outcome?: "sent" | "cancelled";
}

export interface SlackDraftData {
  /** Draft ID */
  id: string;
  /** Channel type */
  channel: "slack";
  /** Message body */
  body: string;
  /** Slack target */
  target: SlackTarget;
  /** Outcome status */
  outcome?: "sent" | "cancelled";
}

export type MessageDraftData = EmailDraftData | SlackDraftData;

export interface MessageDraftOptions {
  /** Custom class name */
  className?: string;
  /** Undo grace period in ms */
  undoGracePeriod?: number;
}

export type MessageDraftProps = ComponentProps<"div"> & {
  data: MessageDraftData;
  options?: MessageDraftOptions;
  onSend?: () => void | Promise<void>;
  onUndo?: () => void;
  onCancel?: () => void;
};

export function MessageDraft({ data, options = {}, onSend, onUndo, onCancel, ...props }: MessageDraftProps) {
  // Map A2UI data to tool-ui props
  const toolUIProps: ToolUIMessageDraftProps = {
    ...data,
    className: options.className,
    undoGracePeriod: options.undoGracePeriod,
    onSend,
    onUndo,
    onCancel,
  };

  return <ToolUIMessageDraft {...toolUIProps} />;
}
