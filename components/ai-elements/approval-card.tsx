"use client";

import type { ComponentProps } from "react";
import { ApprovalCard as ToolUIApprovalCard } from "@/components/tool-ui/approval-card";
import type { ApprovalCardProps as ToolUIApprovalCardProps } from "@/components/tool-ui/approval-card/schema";

/**
 * ApprovalCard AI Element
 * Wrapper around tool-ui ApprovalCard component for A2UI integration
 */

export interface ApprovalCardData {
  /** Title of the approval request */
  title: string;
  /** Description or details */
  description?: string;
  /** Status of the approval */
  status?: "pending" | "approved" | "rejected";
  /** Requester information */
  requester?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  /** Approval timestamp */
  timestamp?: string | number;
  /** Optional metadata to display */
  metadata?: Array<{
    label: string;
    value: string;
  }>;
}

export interface ApprovalCardOptions {
  /** Show approve/reject buttons */
  showActions?: boolean;
  /** Compact layout */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

export type ApprovalCardProps = ComponentProps<"div"> & {
  data: ApprovalCardData;
  options?: ApprovalCardOptions;
};

export function ApprovalCard({ data, options = {}, ...props }: ApprovalCardProps) {
  // Map A2UI data to tool-ui props
  const toolUIProps: ToolUIApprovalCardProps = {
    title: data.title,
    description: data.description,
    status: data.status,
    requester: data.requester,
    timestamp: data.timestamp ? new Date(data.timestamp) : undefined,
    metadata: data.metadata,
    showActions: options.showActions ?? true,
    compact: options.compact,
    className: options.className,
  };

  return <ToolUIApprovalCard {...toolUIProps} {...props} />;
}
