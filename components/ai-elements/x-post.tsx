"use client";

import type { ComponentProps } from "react";
import { XPost as ToolUIXPost } from "@/components/tool-ui/x-post";
import type { XPostProps as ToolUIXPostProps } from "@/components/tool-ui/x-post";
import type {
  XPostData as ToolUIXPostData,
} from "@/components/tool-ui/x-post";

/**
 * XPost AI Element
 * Wrapper around tool-ui XPost component for A2UI integration
 */

export interface XPostData {
  /** Unique post ID */
  id: string;
  /** Post author information */
  author: {
    name: string;
    handle: string;
    avatarUrl: string;
    verified?: boolean;
  };
  /** Post text content */
  text?: string;
  /** Post media (image or video) */
  media?: {
    type: "image" | "video";
    url: string;
    alt: string;
    aspectRatio?: "1:1" | "4:3" | "16:9" | "9:16";
  };
  /** Link preview card */
  linkPreview?: {
    url: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    domain?: string;
  };
  /** Quoted/retweeted post */
  quotedPost?: XPostData;
  /** Post engagement statistics */
  stats?: {
    likes?: number;
    isLiked?: boolean;
    isReposted?: boolean;
    isBookmarked?: boolean;
  };
  /** Post creation timestamp */
  createdAt?: string | number;
}

export interface XPostOptions {
  /** Custom class name */
  className?: string;
  /** Callback when user interacts with the post (like, share) */
  onAction?: (action: string, post: ToolUIXPostData) => void;
}

export type XPostProps = ComponentProps<"div"> & {
  data: XPostData;
  options?: XPostOptions;
};

export function XPost({ data, options = {} }: XPostProps) {
  // Helper to convert timestamp to ISO string
  const convertTimestamp = (
    timestamp?: string | number
  ): string | undefined => {
    if (timestamp === undefined) return undefined;
    return typeof timestamp === "number"
      ? new Date(timestamp).toISOString()
      : timestamp;
  };

  // Helper to recursively convert quoted posts
  const convertQuotedPost = (
    quotedPost?: XPostData
  ): ToolUIXPostData | undefined => {
    if (!quotedPost) return undefined;

    return {
      id: quotedPost.id,
      author: quotedPost.author,
      text: quotedPost.text,
      media: quotedPost.media,
      linkPreview: quotedPost.linkPreview,
      quotedPost: convertQuotedPost(quotedPost.quotedPost),
      stats: quotedPost.stats,
      createdAt: convertTimestamp(quotedPost.createdAt),
    };
  };

  // Map A2UI data to tool-ui props
  const toolUIProps: ToolUIXPostProps = {
    post: {
      id: data.id,
      author: data.author,
      text: data.text,
      media: data.media,
      linkPreview: data.linkPreview,
      quotedPost: convertQuotedPost(data.quotedPost),
      stats: data.stats,
      createdAt: convertTimestamp(data.createdAt),
    },
    className: options.className,
    onAction: options.onAction,
  };

  return <ToolUIXPost {...toolUIProps} />;
}
