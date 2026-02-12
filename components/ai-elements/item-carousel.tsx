"use client";

import type { ComponentProps } from "react";
import { ItemCarousel as ToolUIItemCarousel } from "@/components/tool-ui/item-carousel";
import type { ItemCarouselProps as ToolUIItemCarouselProps } from "@/components/tool-ui/item-carousel";

/**
 * ItemCarousel AI Element
 * Wrapper around tool-ui ItemCarousel component for A2UI integration
 */

export interface CarouselItem {
  /** Item ID */
  id: string;
  /** Item name */
  name: string;
  /** Subtitle/description */
  subtitle?: string;
  /** Image URL */
  image?: string;
  /** Background color */
  color?: string;
  /** Item actions */
  actions?: Array<{
    id: string;
    label: string;
    variant?: "default" | "outline" | "destructive" | "secondary" | "ghost";
    disabled?: boolean;
  }>;
}

export interface ItemCarouselData {
  /** Carousel ID */
  id: string;
  /** Carousel title */
  title?: string;
  /** Carousel description */
  description?: string;
  /** Array of items */
  items: CarouselItem[];
}

export interface ItemCarouselOptions {
  /** Custom class name */
  className?: string;
}

export type ItemCarouselProps = ComponentProps<"div"> & {
  data: ItemCarouselData;
  options?: ItemCarouselOptions;
  onItemClick?: (itemId: string) => void;
  onItemAction?: (itemId: string, actionId: string) => void;
};

export function ItemCarousel({ data, options = {}, onItemClick, onItemAction, ...props }: ItemCarouselProps) {
  // Map A2UI data to tool-ui props
  const toolUIProps: ToolUIItemCarouselProps = {
    id: data.id,
    title: data.title,
    description: data.description,
    items: data.items,
    className: options.className,
    onItemClick,
    onItemAction,
  };

  return <ToolUIItemCarousel {...toolUIProps} />;
}
