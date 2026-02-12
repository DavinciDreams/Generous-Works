"use client";

import type { ComponentProps } from "react";
import { InstagramPost as ToolUIInstagramPost } from "@/components/tool-ui/instagram-post";
import type { InstagramPostProps as ToolUIInstagramPostProps } from "@/components/tool-ui/instagram-post";

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
  // Convert A2UI format to tool-ui InstagramPostData format
  const post = {
    id: "instagram-post",
    author: {
      name: data.author.displayName || data.author.username,
      handle: data.author.username,
      avatarUrl: data.author.avatar || "https://i.pravatar.cc/150?u=default",
      verified: data.author.verified,
    },
    text: data.caption,
    media: data.images?.map((url, index) => ({
      type: "image" as const,
      url,
      alt: `Image ${index + 1}`,
    })),
    stats: {
      likes: data.likes,
      isLiked: false,
    },
    createdAt: data.timestamp ? new Date(data.timestamp).toISOString() : undefined,
  };

  const toolUIProps: ToolUIInstagramPostProps = {
    post,
    className: options.className,
  };

  return <ToolUIInstagramPost {...toolUIProps} />;
}
