"use client";

import { useMemo, useState } from 'react';
import { Check, CloudUpload, Rocket } from 'lucide-react';

import { parseMessageContent } from '@/components/ai-elements/generative-message';
import { Button } from '@/components/ui/button';
import type { GalaxySurfaceRecord } from '@/lib/integrations/galaxy-brain';

interface GalaxySurfaceControlsProps {
  messageId: string;
  content: string;
  isStreaming: boolean;
  writesConfigured: boolean;
}

interface SurfaceState {
  phase: 'idle' | 'saving' | 'saved' | 'promoting' | 'promoted' | 'error';
  surface?: GalaxySurfaceRecord;
  error?: string;
}

async function responseJson(response: Response): Promise<Record<string, unknown>> {
  const value: unknown = await response.json().catch(() => ({}));
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function GalaxySurfaceControls({
  messageId,
  content,
  isStreaming,
  writesConfigured,
}: GalaxySurfaceControlsProps) {
  const surfaces = useMemo(
    () => parseMessageContent(content).filter((block) => block.type === 'a2ui'),
    [content],
  );
  const [states, setStates] = useState<Record<string, SurfaceState>>({});

  if (isStreaming || surfaces.length === 0) return null;

  const setSurfaceState = (blockId: string, state: SurfaceState) => {
    setStates((current) => ({ ...current, [blockId]: state }));
  };

  const save = async (blockId: string, spec: (typeof surfaces)[number]['spec']) => {
    setSurfaceState(blockId, { phase: 'saving' });
    try {
      const response = await fetch('/api/galaxy-brain/surfaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spec,
          messageId,
          idempotencyKey: `generous:${messageId}:${blockId}`,
        }),
      });
      const body = await responseJson(response);
      if (!response.ok) {
        throw new Error(typeof body.error === 'string' ? body.error : 'Surface save failed');
      }
      setSurfaceState(blockId, { phase: 'saved', surface: body as unknown as GalaxySurfaceRecord });
    } catch (error) {
      setSurfaceState(blockId, {
        phase: 'error',
        error: error instanceof Error ? error.message : 'Surface save failed',
      });
    }
  };

  const promote = async (blockId: string, surface: GalaxySurfaceRecord) => {
    if (!window.confirm(`Promote “${surface.title}” to the Galaxy Brain workspace?`)) return;
    setSurfaceState(blockId, { phase: 'promoting', surface });
    try {
      const response = await fetch(
        `/api/galaxy-brain/surfaces/${encodeURIComponent(surface.id)}/promote`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            baseVersion: surface.current_version,
            idempotencyKey: `generous-promote:${surface.id}:${surface.current_version}`,
          }),
        },
      );
      const body = await responseJson(response);
      if (!response.ok) {
        throw new Error(typeof body.error === 'string' ? body.error : 'Surface promotion failed');
      }
      setSurfaceState(blockId, {
        phase: 'promoted',
        surface: body as unknown as GalaxySurfaceRecord,
      });
    } catch (error) {
      setSurfaceState(blockId, {
        phase: 'error',
        surface,
        error: error instanceof Error ? error.message : 'Surface promotion failed',
      });
    }
  };

  return (
    <div className="mt-2 space-y-2">
      {surfaces.map((block, index) => {
        const state = states[block.id] ?? { phase: 'idle' as const };
        const promoted = state.phase === 'promoted' || state.surface?.status === 'promoted';

        return (
          <div key={block.id} className="flex flex-wrap items-center gap-2 text-xs">
            {!state.surface ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!writesConfigured || state.phase === 'saving'}
                onClick={() => save(block.id, block.spec)}
                title={
                  writesConfigured
                    ? 'Save this validated A2UI preview as a Galaxy Brain draft'
                    : 'Configure GALAXY_BRAIN_WRITE_TOKEN with eln:write scope'
                }
              >
                <CloudUpload className="size-3.5" />
                {state.phase === 'saving'
                  ? 'Saving…'
                  : `Save${surfaces.length > 1 ? ` surface ${index + 1}` : ''} to Galaxy`}
              </Button>
            ) : (
              <>
                <span className="text-muted-foreground">
                  {promoted ? 'Promoted' : 'Draft saved'} · v{state.surface.current_version}
                </span>
                {!promoted && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={state.phase === 'promoting'}
                    onClick={() => promote(block.id, state.surface!)}
                  >
                    <Rocket className="size-3.5" />
                    {state.phase === 'promoting' ? 'Promoting…' : 'Promote'}
                  </Button>
                )}
                {promoted && <Check className="size-4 text-emerald-500" aria-label="Promoted" />}
              </>
            )}
            {state.error && <span className="text-destructive">{state.error}</span>}
          </div>
        );
      })}
    </div>
  );
}
