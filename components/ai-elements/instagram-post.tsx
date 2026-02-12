"use client";

import type { ComponentProps } from "react";
import { InstagramPost as ToolUIInstagramPost } from "@/components/tool-ui/instagram-post";
import type { InstagramPostProps as ToolUIInstagramPostProps } from "@/components/tool-ui/instagram-post/schema";

/**
 * InstagramPost AI Element
 * Wrapper around tool-ui InstagramPost component for A2UI integration
 */

export interface InstagramPostData {
  /** Post author */
  author: {
    username: string;
    displayName?: string;
    avatar?: string;
    verified?: boolean;
  };
  /** Post caption/text */
  caption: string;
  /** Post images */
  images?: string[];
  /** Post video URL */
  video?: string;
  /** Like count */
  likes?: number;
  /** Comment count */
  comments?: number;
  /** Post timestamp */
  timestamp?: string | number;
  /** Location tag */
  location?: string;
  /** Hashtags */
  hashtags?: string[];
}

export interface InstagramPostOptions {
  /** Show engagement stats */
  showEngagement?: boolean;
  /** Show timestamp */
  showTimestamp?: boolean;
  /** Compact layout */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

export type InstagramPostProps = ComponentProps<"div"> & {
  data: InstagramPostData;
  options?: InstagramPostOptions;
};

export function InstagramPost({ data, options = {}, ...props }: InstagramPostProps) {
  // Map A2UI data to tool-ui props
  const toolUIProps: ToolUIInstagramPostProps = {
    author: data.author,
    caption: data.caption,
    images: data.images,
    video: data.video,
    likes: data.likes,
    comments: data.comments,
    timestamp: data.timestamp ? new Date(data.timestamp) : undefined,
    location: data.location,
    hashtags: data.hashtags,
    showEngagement: options.showEngagement ?? true,
    showTimestamp: options.showTimestamp ?? true,
    compact: options.compact,
    className: options.className,
  };

  return <ToolUIInstagramPost {...toolUIProps} {...props} />;
}
