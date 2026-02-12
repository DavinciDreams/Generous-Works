"use client";

import type { ComponentProps } from "react";
import { ParameterSlider as ToolUIParameterSlider } from "@/components/tool-ui/parameter-slider";
import type { ParameterSliderProps as ToolUIParameterSliderProps, SliderValue } from "@/components/tool-ui/parameter-slider";

/**
 * ParameterSlider AI Element
 * Wrapper around tool-ui ParameterSlider component for A2UI integration
 */

export interface SliderConfig {
  /** Slider ID */
  id: string;
  /** Slider label */
  label: string;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step increment */
  step?: number;
  /** Current value */
  value: number;
  /** Unit label (e.g., "px", "%", "ms") */
  unit?: string;
  /** Decimal precision */
  precision?: number;
  /** Track custom class */
  trackClassName?: string;
  /** Fill custom class */
  fillClassName?: string;
  /** Handle custom class */
  handleClassName?: string;
}

export interface ParameterSliderData {
  /** Component ID */
  id: string;
  /** Array of slider configurations */
  sliders: SliderConfig[];
}

export interface ParameterSliderOptions {
  /** Custom class name */
  className?: string;
  /** Response actions */
  responseActions?: Array<{
    id: string;
    label: string;
    variant?: "default" | "outline" | "destructive" | "secondary" | "ghost";
    disabled?: boolean;
  }>;
  /** Track custom class */
  trackClassName?: string;
  /** Fill custom class */
  fillClassName?: string;
  /** Handle custom class */
  handleClassName?: string;
}

export type ParameterSliderProps = ComponentProps<"div"> & {
  data: ParameterSliderData;
  options?: ParameterSliderOptions;
  values?: SliderValue[];
  onChange?: (values: SliderValue[]) => void;
  onResponseAction?: (actionId: string, values: SliderValue[]) => void | Promise<void>;
  onBeforeResponseAction?: (actionId: string) => boolean | Promise<boolean>;
};

export function ParameterSlider({
  data,
  options = {},
  values,
  onChange,
  onResponseAction,
  onBeforeResponseAction,
  ...props
}: ParameterSliderProps) {
  // Map A2UI data to tool-ui props
  const toolUIProps: ToolUIParameterSliderProps = {
    id: data.id,
    sliders: data.sliders,
    className: options.className,
    values,
    onChange,
    responseActions: options.responseActions,
    onResponseAction,
    onBeforeResponseAction,
    trackClassName: options.trackClassName,
    fillClassName: options.fillClassName,
    handleClassName: options.handleClassName,
  };

  return <ToolUIParameterSlider {...toolUIProps} />;
}

export type { SliderValue };
