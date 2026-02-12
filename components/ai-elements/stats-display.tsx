"use client";

import type { ComponentProps } from "react";
import { StatsDisplay as ToolUIStatsDisplay } from "@/components/tool-ui/stats-display";
import type { StatsDisplayProps as ToolUIStatsDisplayProps } from "@/components/tool-ui/stats-display/schema";

/**
 * StatsDisplay AI Element
 * Wrapper around tool-ui StatsDisplay component for A2UI integration
 */

export interface Stat {
  /** Stat label */
  label: string;
  /** Stat value */
  value: string | number;
  /** Optional change/delta */
  change?: number;
  /** Change period (e.g., "vs last month") */
  changePeriod?: string;
  /** Trend direction */
  trend?: "up" | "down" | "neutral";
  /** Mini sparkline data */
  sparkline?: number[];
  /** Icon name */
  icon?: string;
}

export interface StatsDisplayData {
  /** Array of stats to display */
  stats: Stat[];
  /** Optional title */
  title?: string;
}

export interface StatsDisplayOptions {
  /** Layout: grid or list */
  layout?: "grid" | "list";
  /** Number of columns (grid layout) */
  columns?: 2 | 3 | 4;
  /** Show sparklines */
  showSparklines?: boolean;
  /** Compact mode */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

export type StatsDisplayProps = ComponentProps<"div"> & {
  data: StatsDisplayData;
  options?: StatsDisplayOptions;
};

export function StatsDisplay({ data, options = {}, ...props }: StatsDisplayProps) {
  // Map A2UI data to tool-ui props
  const toolUIProps: ToolUIStatsDisplayProps = {
    stats: data.stats,
    title: data.title,
    layout: options.layout || "grid",
    columns: options.columns || 3,
    showSparklines: options.showSparklines ?? true,
    compact: options.compact,
    className: options.className,
  };

  return <ToolUIStatsDisplay {...toolUIProps} {...props} />;
}
