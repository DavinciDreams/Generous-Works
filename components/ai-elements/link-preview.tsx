"use client";

import type { ComponentProps } from "react";
import { LinkPreview as ToolUILinkPreview } from "@/components/tool-ui/link-preview";
import type { LinkPreviewProps as ToolUILinkPreviewProps } from "@/components/tool-ui/link-preview";

/**
 * LinkPreview AI Element
 * Wrapper around tool-ui LinkPreview component for A2UI integration
 */

export interface LinkPreviewData {
  /** ID of the link preview */
  id: string;
  /** URL to preview */
  href: string;
  /** Title of the page */
  title?: string;
  /** Description/snippet */
  description?: string;
  /** Preview image URL */
  image?: string;
  /** Domain name */
  domain?: string;
  /** Favicon URL */
  favicon?: string;
  /** Creation timestamp */
  createdAt?: string;
  /** Locale */
  locale?: string;
}

export interface LinkPreviewOptions {
  /** Aspect ratio for image */
  ratio?: "16:9" | "4:3" | "1:1" | "9:16" | "auto";
  /** Image fit mode */
  fit?: "cover" | "contain";
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

export type LinkPreviewProps = ComponentProps<"div"> & {
  data: LinkPreviewData;
  options?: LinkPreviewOptions;
  onNavigate?: (href: string) => void;
  onResponseAction?: (actionId: string) => void;
};

export function LinkPreview({ data, options = {}, onNavigate, onResponseAction, ...props }: LinkPreviewProps) {
  // Map A2UI data to tool-ui props
  const toolUIProps: ToolUILinkPreviewProps = {
    id: data.id,
    href: data.href,
    title: data.title,
    description: data.description,
    image: data.image,
    domain: data.domain,
    favicon: data.favicon,
    createdAt: data.createdAt,
    locale: data.locale,
    ratio: options.ratio,
    fit: options.fit,
    className: options.className,
    responseActions: options.responseActions,
    onNavigate: onNavigate ? (href) => onNavigate(href) : undefined,
    onResponseAction,
  };

  return <ToolUILinkPreview {...toolUIProps} />;
}
