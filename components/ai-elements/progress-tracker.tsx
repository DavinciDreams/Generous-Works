"use client";

import type { ComponentProps } from "react";
import { ProgressTracker as ToolUIProgressTracker } from "@/components/tool-ui/progress-tracker";
import type { ProgressTrackerProps as ToolUIProgressTrackerProps } from "@/components/tool-ui/progress-tracker/schema";

/**
 * ProgressTracker AI Element
 * Wrapper around tool-ui ProgressTracker component for A2UI integration
 */

export interface Step {
  /** Step ID */
  id: string;
  /** Step title */
  title: string;
  /** Step description */
  description?: string;
  /** Step status */
  status: "pending" | "in-progress" | "completed" | "error";
  /** Optional timestamp */
  timestamp?: string | number;
}

export interface ProgressTrackerData {
  /** Array of steps */
  steps: Step[];
  /** Current step index */
  currentStep?: number;
  /** Overall status */
  status?: "in-progress" | "completed" | "error";
  /** Title */
  title?: string;
}

export interface ProgressTrackerOptions {
  /** Layout orientation */
  orientation?: "vertical" | "horizontal";
  /** Show step numbers */
  showNumbers?: boolean;
  /** Show timestamps */
  showTimestamps?: boolean;
  /** Compact mode */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

export type ProgressTrackerProps = ComponentProps<"div"> & {
  data: ProgressTrackerData;
  options?: ProgressTrackerOptions;
};

export function ProgressTracker({ data, options = {}, ...props }: ProgressTrackerProps) {
  // Map A2UI data to tool-ui props
  // Note: A2UI interface is richer (includes currentStep, status, title, orientation, etc.)
  // but tool-ui only supports: id, steps, elapsedTime, choice, responseActions
  const toolUIProps: ToolUIProgressTrackerProps = {
    id: "progress-tracker",
    steps: data.steps.map(step => ({
      id: step.id,
      label: step.title,
      description: step.description,
      status: step.status === "error" ? "failed" : step.status,
    })),
    className: options.className,
  };

  return <ToolUIProgressTracker {...toolUIProps} />;
}
