"use client";

import type { ComponentProps } from "react";
import { OrderSummary as ToolUIOrderSummary } from "@/components/tool-ui/order-summary";
import type { OrderSummaryProps as ToolUIOrderSummaryProps } from "@/components/tool-ui/order-summary";

/**
 * OrderSummary AI Element
 * Wrapper around tool-ui OrderSummary component for A2UI integration
 */

export interface OrderItem {
  /** Item ID */
  id: string;
  /** Item name */
  name: string;
  /** Item description */
  description?: string;
  /** Image URL */
  imageUrl?: string;
  /** Quantity */
  quantity?: number;
  /** Unit price */
  unitPrice: number;
}

export interface OrderPricing {
  /** Subtotal amount */
  subtotal: number;
  /** Tax amount */
  tax?: number;
  /** Tax label */
  taxLabel?: string;
  /** Shipping amount */
  shipping?: number;
  /** Discount amount */
  discount?: number;
  /** Discount label */
  discountLabel?: string;
  /** Total amount */
  total: number;
  /** Currency code */
  currency?: string;
}

export interface OrderDecision {
  /** Action taken */
  action: "confirm";
  /** Order ID after confirmation */
  orderId?: string;
  /** Confirmation timestamp */
  confirmedAt?: string;
}

export interface OrderSummaryData {
  /** Order ID */
  id: string;
  /** Order title */
  title?: string;
  /** Array of order items */
  items: OrderItem[];
  /** Pricing information */
  pricing: OrderPricing;
  /** Order decision/choice */
  choice?: OrderDecision;
}

export interface OrderSummaryOptions {
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

export type OrderSummaryProps = ComponentProps<"div"> & {
  data: OrderSummaryData;
  options?: OrderSummaryOptions;
  onResponseAction?: (actionId: string) => void;
};

export function OrderSummary({ data, options = {}, onResponseAction, ...props }: OrderSummaryProps) {
  // Map A2UI data to tool-ui props
  const toolUIProps: ToolUIOrderSummaryProps = {
    id: data.id,
    title: data.title,
    items: data.items,
    pricing: data.pricing,
    choice: data.choice,
    className: options.className,
    responseActions: options.responseActions,
    onResponseAction,
  };

  return <ToolUIOrderSummary {...toolUIProps} />;
}
