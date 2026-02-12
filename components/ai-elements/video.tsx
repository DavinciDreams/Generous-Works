"use client";

import type { ComponentProps } from "react";
import { Video as ToolUIVideo } from "@/components/tool-ui/video";
import type { VideoProps as ToolUIVideoProps } from "@/components/tool-ui/video";

/**
 * Video AI Element
 * Wrapper around tool-ui Video component for A2UI integration
 */

export interface VideoSource {
  label: string;
  iconUrl?: string;
  url?: string;
}

export interface VideoData {
  /** ID of the video */
  id: string;
  /** Asset ID */
  assetId: string;
  /** Video source URL */
  src: string;
  /** Poster/thumbnail URL */
  poster?: string;
  /** Video title */
  title?: string;
  /** Video description */
  description?: string;
  /** External link */
  href?: string;
  /** Domain name */
  domain?: string;
  /** Duration in milliseconds */
  durationMs?: number;
  /** Creation timestamp */
  createdAt?: string;
  /** Locale */
  locale?: string;
  /** Source information */
  source?: VideoSource;
}

export interface VideoOptions {
  /** Aspect ratio */
  ratio?: "16:9" | "4:3" | "1:1" | "21:9" | "9:16";
  /** Video fit mode */
  fit?: "cover" | "contain" | "fill";
  /** Auto play */
  autoPlay?: boolean;
  /** Default muted state */
  defaultMuted?: boolean;
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

export type VideoProps = ComponentProps<"div"> & {
  data: VideoData;
  options?: VideoOptions;
  onNavigate?: (href: string) => void;
  onMediaEvent?: (type: "play" | "pause" | "mute" | "unmute") => void;
  onResponseAction?: (actionId: string) => void;
};

export function Video({ data, options = {}, onNavigate, onMediaEvent, onResponseAction, ...props }: VideoProps) {
  // Map A2UI data to tool-ui props
  const toolUIProps: ToolUIVideoProps = {
    id: data.id,
    assetId: data.assetId,
    src: data.src,
    poster: data.poster,
    title: data.title,
    description: data.description,
    href: data.href,
    domain: data.domain,
    durationMs: data.durationMs,
    createdAt: data.createdAt,
    locale: data.locale,
    source: data.source,
    ratio: options.ratio,
    fit: options.fit,
    autoPlay: options.autoPlay,
    defaultMuted: options.defaultMuted ?? true,
    className: options.className,
    responseActions: options.responseActions,
    onNavigate: onNavigate ? (href) => onNavigate(href) : undefined,
    onMediaEvent,
    onResponseAction,
  };

  return <ToolUIVideo {...toolUIProps} {...props} />;
}
