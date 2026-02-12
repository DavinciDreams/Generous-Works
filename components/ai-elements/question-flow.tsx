"use client";

import type { ComponentProps, ReactNode } from "react";
import { QuestionFlow as ToolUIQuestionFlow } from "@/components/tool-ui/question-flow";
import type { QuestionFlowProps as ToolUIQuestionFlowProps } from "@/components/tool-ui/question-flow";

/**
 * QuestionFlow AI Element
 * Wrapper around tool-ui QuestionFlow component for A2UI integration
 */

export interface QuestionFlowOption {
  /** Option ID */
  id: string;
  /** Option label */
  label: string;
  /** Option description */
  description?: string;
  /** Option icon */
  icon?: ReactNode;
  /** Is option disabled */
  disabled?: boolean;
}

export interface QuestionFlowStepDefinition {
  /** Step ID */
  id: string;
  /** Step title */
  title: string;
  /** Step description */
  description?: string;
  /** Available options */
  options: QuestionFlowOption[];
  /** Selection mode */
  selectionMode?: "single" | "multi";
}

export interface QuestionFlowSummaryItem {
  /** Summary label */
  label: string;
  /** Summary value */
  value: string;
}

export interface QuestionFlowChoice {
  /** Choice title */
  title: string;
  /** Summary items */
  summary: QuestionFlowSummaryItem[];
}

export interface QuestionFlowProgressiveData {
  /** Flow ID */
  id: string;
  /** Current step number */
  step: number;
  /** Current step title */
  title: string;
  /** Current step description */
  description?: string;
  /** Current step options */
  options: QuestionFlowOption[];
  /** Selection mode */
  selectionMode?: "single" | "multi";
}

export interface QuestionFlowUpfrontData {
  /** Flow ID */
  id: string;
  /** All steps definition */
  steps: QuestionFlowStepDefinition[];
}

export interface QuestionFlowReceiptData {
  /** Flow ID */
  id: string;
  /** Final choice/summary */
  choice: QuestionFlowChoice;
}

export type QuestionFlowData =
  | QuestionFlowProgressiveData
  | QuestionFlowUpfrontData
  | QuestionFlowReceiptData;

export interface QuestionFlowOptions {
  /** Custom class name */
  className?: string;
}

export type QuestionFlowProps = ComponentProps<"div"> & {
  data: QuestionFlowData;
  options?: QuestionFlowOptions;
  defaultValue?: string[];
  onSelect?: (optionIds: string[]) => void | Promise<void>;
  onBack?: () => void;
  onStepChange?: (stepId: string) => void;
  onComplete?: (answers: Record<string, string[]>) => void | Promise<void>;
};

export function QuestionFlow({
  data,
  options = {},
  defaultValue,
  onSelect,
  onBack,
  onStepChange,
  onComplete,
  ...props
}: QuestionFlowProps) {
  // Map A2UI data to tool-ui props
  const toolUIProps: ToolUIQuestionFlowProps = {
    ...data,
    className: options.className,
    defaultValue,
    onSelect,
    onBack,
    onStepChange,
    onComplete,
  } as ToolUIQuestionFlowProps;

  return <ToolUIQuestionFlow {...toolUIProps} {...props} />;
}
