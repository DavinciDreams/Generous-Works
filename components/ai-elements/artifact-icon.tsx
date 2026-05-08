"use client";

import { useState } from "react";
import type { Artifact } from "@/lib/store";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtifactIconProps {
  artifact: Artifact;
  isOpen: boolean;
  onOpen: () => void;
  onDelete: () => void;
  className?: string;
}

export function ArtifactIcon({ artifact, isOpen, onOpen, onDelete, className }: ArtifactIconProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn("flex flex-col items-center gap-1.5 cursor-pointer select-none", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      <div className="relative">
        <div
          className={cn(
            "w-14 h-14 rounded-[18px] flex items-center justify-center text-2xl shadow-lg transition-all duration-150",
            hovered ? "scale-110 shadow-xl" : "scale-100",
            isOpen && "ring-2 ring-white/30"
          )}
          style={{ background: `linear-gradient(135deg, ${artifact.color}cc, ${artifact.color}66)`, border: `1px solid ${artifact.color}44` }}
        >
          <span style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}>
            {artifact.emoji}
          </span>
        </div>

        {/* Delete badge */}
        {hovered && (
          <button
            className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-10"
            style={{ width: 18, height: 18 }}
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            aria-label="Delete artifact"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        )}

        {/* Open indicator dot */}
        {isOpen && (
          <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/80" />
        )}
      </div>

      <span
        className="text-[10px] text-center text-white/70 max-w-[64px] leading-tight"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
      >
        {artifact.name.length > 10 ? artifact.name.slice(0, 10) + "…" : artifact.name}
      </span>
    </div>
  );
}
