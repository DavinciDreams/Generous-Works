"use client";

import type { ComponentType } from "react";
import type { Artifact } from "@/lib/store";
import type { A2UIMessage } from "@/lib/a2ui/types";
import type { ContentBlock } from "@/components/ai-elements/generative-message";

import { motion, useDragControls, useMotionValue } from "motion/react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { HybridRenderer } from "@/components/ai-elements/hybrid-renderer";
import { useGenerativeUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface ArtifactWindowProps {
  artifact: Artifact;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsxComponents?: Record<string, ComponentType<any>>;
}

export function ArtifactWindow({ artifact, zIndex, onClose, onFocus, jsxComponents }: ArtifactWindowProps) {
  const updateArtifact = useGenerativeUIStore((s) => s.updateArtifact);
  const dragControls = useDragControls();
  const x = useMotionValue(artifact.windowX);
  const y = useMotionValue(artifact.windowY);
  const [maximized, setMaximized] = useState(false);

  const block: ContentBlock = artifact.type === 'jsx'
    ? { type: 'jsx', code: artifact.content, id: `aw-${artifact.id}` }
    : { type: 'a2ui', spec: artifact.spec as A2UIMessage, id: `aw-${artifact.id}` };

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      className={cn(
        "flex flex-col overflow-hidden shadow-2xl",
        maximized ? "rounded-none" : "rounded-xl"
      )}
      style={{
        x: maximized ? 0 : x,
        y: maximized ? 0 : y,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex,
        width: maximized ? '100vw' : 660,
        height: maximized ? '100vh' : 'auto',
        background: 'rgba(12, 16, 22, 0.96)',
        border: `1px solid ${artifact.color}44`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: `0 0 0 1px ${artifact.color}22, 0 24px 64px rgba(0,0,0,0.6)`,
      }}
      onPointerDown={onFocus}
      onDragEnd={() => {
        if (!maximized) {
          updateArtifact(artifact.id, { windowX: x.get(), windowY: y.get() });
        }
      }}
    >
      {/* Title bar — drag handle */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 border-b shrink-0 select-none",
          !maximized && "cursor-grab active:cursor-grabbing"
        )}
        style={{
          borderColor: `${artifact.color}33`,
          background: `linear-gradient(90deg, ${artifact.color}18, transparent)`,
        }}
        onPointerDown={(e) => {
          if (!maximized) dragControls.start(e);
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{artifact.emoji}</span>
          <span className="text-sm font-medium text-white/90">{artifact.name}</span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
            style={{ background: `${artifact.color}33`, color: artifact.color }}
          >
            {artifact.type}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMaximized((v) => !v)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
            aria-label={maximized ? "Restore" : "Maximize"}
          >
            {maximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-md flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-red-500/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="overflow-auto flex-1"
        style={{ maxHeight: maximized ? 'calc(100vh - 40px)' : 520 }}
      >
        <div className="p-4">
          <HybridRenderer blocks={[block]} jsxComponents={jsxComponents as unknown as Parameters<typeof HybridRenderer>[0]['jsxComponents']} />
        </div>
      </div>
    </motion.div>
  );
}
