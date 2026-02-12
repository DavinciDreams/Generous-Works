"use client";

import type { ComponentProps } from "react";
import { OptionList as ToolUIOptionList } from "@/components/tool-ui/option-list";
import type { OptionListProps as ToolUIOptionListProps } from "@/components/tool-ui/option-list/schema";

/**
 * OptionList AI Element
 * Wrapper around tool-ui OptionList component for A2UI integration
 */

export interface Option {
  /** Option ID */
  id: string;
  /** Option label */
  label: string;
  /** Option description */
  description?: string;
  /** Option value */
  value: string | number;
  /** Icon name */
  icon?: string;
  /** Is option disabled */
  disabled?: boolean;
  /** Is option selected */
  selected?: boolean;
  /** Metadata */
  metadata?: Record<string, unknown>;
}

export interface OptionListData {
  /** Array of options */
  options: Option[];
  /** Selected option IDs */
  selected?: string[];
  /** Title */
  title?: string;
  /** Description */
  description?: string;
}

export interface OptionListOptions {
  /** Allow multiple selection */
  multiple?: boolean;
  /** Show search */
  searchable?: boolean;
  /** Layout style */
  layout?: "list" | "grid" | "cards";
  /** Compact mode */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

export type OptionListProps = ComponentProps<"div"> & {
  data: OptionListData;
  options?: OptionListOptions;
  onSelect?: (selectedIds: string[]) => void;
};

export function OptionList({ data, options = {}, onSelect, ...props }: OptionListProps) {
  // Map A2UI data to tool-ui props
  // Note: A2UI interface is richer (includes title, description, searchable, layout, compact)
  // but tool-ui only supports: id, options, selectionMode, defaultValue/value/choice
  const toolUIProps: ToolUIOptionListProps = {
    id: "option-list",
    options: data.options.map(opt => ({
      id: opt.id,
      label: opt.label,
      description: opt.description,
      disabled: opt.disabled,
    })),
    selectionMode: options.multiple ? "multi" : "single",
    defaultValue: data.selected,
    onChange: onSelect ? (value) => {
      const ids = Array.isArray(value) ? value : value ? [value] : [];
      onSelect(ids);
    } : undefined,
    className: options.className,
  };

  return <ToolUIOptionList {...toolUIProps} />;
}
