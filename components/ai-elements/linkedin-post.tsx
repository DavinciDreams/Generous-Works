"use client";

import type { ComponentProps } from "react";
import { LinkedInPost as ToolUILinkedInPost } from "@/components/tool-ui/linkedin-post";
import type { LinkedInPostProps as ToolUILinkedInPostProps } from "@/components/tool-ui/linkedin-post";
import type {
  LinkedInPostData as ToolUILinkedInPostData,
  LinkedInPostAuthor as ToolUILinkedInPostAuthor,
  LinkedInPostMedia as ToolUILinkedInPostMedia,
  LinkedInPostLinkPreview as ToolUILinkedInPostLinkPreview,
  LinkedInPostStats as ToolUILinkedInPostStats,
} from "@/components/tool-ui/linkedin-post";

/**
 * LinkedInPost AI Element
 * Wrapper around tool-ui LinkedInPost component for A2UI integration
 */

export interface LinkedInPostData {
  /** Unique post ID */
  id: string;
  /** Post author information */
  author: {
    name: string;
    avatarUrl: string;
    headline?: string;
  };
  /** Post text content */
  text?: string;
  /** Post media (image or video) */
  media?: {
    type: "image" | "video";
    url: string;
    alt: string;
  };
  /** Link preview card */
  linkPreview?: {
    url: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    domain?: string;
  };
  /** Post engagement statistics */
  stats?: {
    likes?: number;
    isLiked?: boolean;
  };
  /** Post creation timestamp */
  createdAt?: string | number;
}

export interface LinkedInPostOptions {
  /** Custom class name */
  className?: string;
  /** Callback when user interacts with the post (like, share) */
  onAction?: (action: string, post: ToolUILinkedInPostData) => void;
}

export type LinkedInPostProps = ComponentProps<"div"> & {
  data: LinkedInPostData;
  options?: LinkedInPostOptions;
};

export function LinkedInPost({
  data,
  options = {},
  ...props
}: LinkedInPostProps) {
  // Map A2UI data to tool-ui props
  const toolUIProps: ToolUILinkedInPostProps = {
    post: {
      id: data.id,
      author: data.author,
      text: data.text,
      media: data.media,
      linkPreview: data.linkPreview,
      stats: data.stats,
      createdAt:
        typeof data.createdAt === "number"
          ? new Date(data.createdAt).toISOString()
          : data.createdAt,
    },
    className: options.className,
    onAction: options.onAction,
  };

  return <ToolUILinkedInPost {...toolUIProps} />;
}
