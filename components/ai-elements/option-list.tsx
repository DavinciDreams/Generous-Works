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
  const toolUIProps: ToolUIOptionListProps = {
    options: data.options,
    selected: data.selected,
    title: data.title,
    description: data.description,
    multiple: options.multiple,
    searchable: options.searchable,
    layout: options.layout || "list",
    compact: options.compact,
    className: options.className,
    onSelect,
  };

  return <ToolUIOptionList {...toolUIProps} {...props} />;
}
