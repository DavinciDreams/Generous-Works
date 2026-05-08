"use client";

import type { ComponentType } from "react";
import { useState } from "react";
import { useGenerativeUIStore } from "@/lib/store";
import { ArtifactIcon } from "@/components/ai-elements/artifact-icon";
import { ArtifactWindow } from "@/components/ai-elements/artifact-window";
import { LayoutGrid } from "lucide-react";

interface ArtifactShelfProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsxComponents?: Record<string, ComponentType<any>>;
}

export function ArtifactShelf({ jsxComponents }: ArtifactShelfProps) {
  const artifacts = useGenerativeUIStore((s) => s.artifacts);
  const openArtifact = useGenerativeUIStore((s) => s.openArtifact);
  const closeArtifact = useGenerativeUIStore((s) => s.closeArtifact);
  const deleteArtifact = useGenerativeUIStore((s) => s.deleteArtifact);
  const [panelOpen, setPanelOpen] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const openArtifacts = artifacts.filter((a) => a.isOpen);

  if (artifacts.length === 0) return null;

  return (
    <>
      {/* Nav button — rendered inline in the nav bar by the parent */}
      <button
        type="button"
        onClick={() => setPanelOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        Canvas
        <span className="ml-0.5 rounded-full bg-primary/20 px-1.5 py-px text-[10px] font-medium text-primary leading-none">
          {artifacts.length}
        </span>
      </button>

      {/* Artifact icon grid panel */}
      {panelOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPanelOpen(false)} />
          <div
            className="fixed right-4 top-14 z-50 w-64 rounded-xl overflow-hidden bg-popover/95 backdrop-blur-xl border border-border shadow-2xl"
          >
            <div className="px-3 py-2.5 border-b border-border text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
              Saved artifacts — click to open
            </div>
            <div className="p-4 grid grid-cols-3 gap-4">
              {artifacts.map((artifact) => (
                <ArtifactIcon
                  key={artifact.id}
                  artifact={artifact}
                  isOpen={artifact.isOpen}
                  onOpen={() => {
                    openArtifact(artifact.id);
                    setFocusedId(artifact.id);
                    setPanelOpen(false);
                  }}
                  onDelete={() => deleteArtifact(artifact.id)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Floating windows for open artifacts */}
      {openArtifacts.map((artifact, idx) => (
        <ArtifactWindow
          key={artifact.id}
          artifact={artifact}
          zIndex={focusedId === artifact.id ? 200 : 100 + idx}
          onClose={() => closeArtifact(artifact.id)}
          onFocus={() => setFocusedId(artifact.id)}
          jsxComponents={jsxComponents}
        />
      ))}
    </>
  );
}
