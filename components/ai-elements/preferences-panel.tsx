"use client";

import type { ComponentProps } from "react";
import { PreferencesPanel as ToolUIPreferencesPanel } from "@/components/tool-ui/preferences-panel";
import type { PreferencesPanelProps as ToolUIPreferencesPanelProps, PreferencesValue } from "@/components/tool-ui/preferences-panel";

/**
 * PreferencesPanel AI Element
 * Wrapper around tool-ui PreferencesPanel component for A2UI integration
 */

export interface PreferenceOption {
  value: string;
  label: string;
}

export interface PreferenceSwitch {
  type: "switch";
  id: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}

export interface PreferenceToggle {
  type: "toggle";
  id: string;
  label: string;
  description?: string;
  options: PreferenceOption[];
  defaultValue?: string;
}

export interface PreferenceSelect {
  type: "select";
  id: string;
  label: string;
  description?: string;
  selectOptions: PreferenceOption[];
  defaultSelected?: string;
}

export type PreferenceItem = PreferenceSwitch | PreferenceToggle | PreferenceSelect;

export interface PreferenceSection {
  /** Section heading */
  heading?: string;
  /** Array of preference items */
  items: PreferenceItem[];
}

export interface PreferencesPanelData {
  /** Panel ID */
  id: string;
  /** Panel title */
  title?: string;
  /** Array of preference sections */
  sections: PreferenceSection[];
}

export interface PreferencesPanelOptions {
  /** Custom class name */
  className?: string;
  /** Response actions */
  responseActions?: Array<{
    id: string;
    label: string;
    variant?: "default" | "outline" | "destructive" | "secondary" | "ghost";
    disabled?: boolean;
  }>;
}

export type PreferencesPanelProps = ComponentProps<"div"> & {
  data: PreferencesPanelData;
  options?: PreferencesPanelOptions;
  value?: PreferencesValue;
  onChange?: (value: PreferencesValue) => void;
  onSave?: (value: PreferencesValue) => void | Promise<void>;
  onCancel?: () => void;
  onResponseAction?: (actionId: string, value: PreferencesValue) => void | Promise<void>;
  onBeforeResponseAction?: (actionId: string) => boolean | Promise<boolean>;
};

export function PreferencesPanel({
  data,
  options = {},
  value,
  onChange,
  onSave,
  onCancel,
  onResponseAction,
  onBeforeResponseAction,
  ...props
}: PreferencesPanelProps) {
  // Map A2UI data to tool-ui props
  const toolUIProps: ToolUIPreferencesPanelProps = {
    id: data.id,
    title: data.title,
    sections: data.sections,
    className: options.className,
    value,
    onChange,
    onSave,
    onCancel,
    responseActions: options.responseActions,
    onResponseAction,
    onBeforeResponseAction,
  };

  return <ToolUIPreferencesPanel {...toolUIProps} />;
}

export type { PreferencesValue };
