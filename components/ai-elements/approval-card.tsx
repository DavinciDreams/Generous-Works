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
  // Note: A2UI interface is richer (includes requester, timestamp, status: "pending"|"approved"|"rejected")
  // but tool-ui only supports: choice ("approved"|"denied"), variant, basic metadata
  const toolUIProps: ToolUIApprovalCardProps = {
    id: "approval-card",
    title: data.title,
    description: data.description,
    metadata: data.metadata?.map(item => ({ key: item.label, value: item.value })),
    choice: data.status === "approved" ? "approved" : data.status === "rejected" ? "denied" : undefined,
    variant: data.status === "rejected" ? "destructive" : "default",
    className: options.className,
  };

  return <ToolUIApprovalCard {...toolUIProps} />;
}
