"use client";

import { useCallback, useMemo, useRef, useState } from 'react';
import { Database, History, RefreshCw, Rocket } from 'lucide-react';

import { GenerativeMessage } from '@/components/ai-elements/generative-message';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type {
  GalaxySurfaceRecord,
  GalaxySurfaceRevisionRecord,
} from '@/lib/integrations/galaxy-brain';
import { galaxySurfaceToMessageContent } from '@/lib/integrations/galaxy-surface';
import { cn } from '@/lib/utils';

interface GalaxySurfaceLibraryProps {
  connected: boolean;
  writesConfigured: boolean;
}

type SurfaceFilter = 'all' | GalaxySurfaceRecord['status'];

async function responseJson(response: Response): Promise<unknown> {
  return response.json().catch(() => ({}));
}

function responseError(value: unknown, fallback: string): string {
  if (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'string'
  ) {
    return value.error;
  }
  return fallback;
}

function formatTimestamp(value: string | undefined): string {
  if (!value) return 'Time unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return 'Time unavailable';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function provenanceItems(provenance: Record<string, unknown>): Array<[string, string]> {
  const fields: Array<[string, string]> = [
    ['Source', 'source'],
    ['Actor', 'actor_ref'],
    ['Model', 'model'],
    ['Profile', 'profile'],
    ['Run', 'run_id'],
    ['Message', 'message_id'],
  ];
  return fields.flatMap(([label, key]) =>
    typeof provenance[key] === 'string' && provenance[key]
      ? [[label, provenance[key] as string] as [string, string]]
      : [],
  );
}

export function GalaxySurfaceLibrary({
  connected,
  writesConfigured,
}: GalaxySurfaceLibraryProps) {
  const [open, setOpen] = useState(false);
  const [surfaces, setSurfaces] = useState<GalaxySurfaceRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [revisions, setRevisions] = useState<GalaxySurfaceRevisionRecord[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<number>();
  const [filter, setFilter] = useState<SurfaceFilter>('all');
  const [loading, setLoading] = useState(false);
  const [revisionsLoading, setRevisionsLoading] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [error, setError] = useState<string>();
  const selectedIdRef = useRef<string | undefined>(undefined);

  const selected = surfaces.find((surface) => surface.id === selectedId);
  const selectedRevision = revisions.find((revision) => revision.version === selectedVersion);
  const visibleSurfaces = useMemo(
    () => surfaces.filter((surface) => filter === 'all' || surface.status === filter),
    [filter, surfaces],
  );

  const loadRevisions = useCallback(async (surface: GalaxySurfaceRecord) => {
    setRevisionsLoading(true);
    setError(undefined);
    try {
      const response = await fetch(
        `/api/galaxy-brain/surfaces/${encodeURIComponent(surface.id)}/revisions`,
        { cache: 'no-store' },
      );
      const body = await responseJson(response);
      if (!response.ok || !Array.isArray(body)) {
        throw new Error(responseError(body, 'Surface history failed to load'));
      }
      const nextRevisions = body as GalaxySurfaceRevisionRecord[];
      setRevisions(nextRevisions);
      setSelectedVersion(
        nextRevisions.some((revision) => revision.version === surface.current_version)
          ? surface.current_version
          : nextRevisions[0]?.version,
      );
    } catch (cause) {
      setRevisions([]);
      setSelectedVersion(undefined);
      setError(cause instanceof Error ? cause.message : 'Surface history failed to load');
    } finally {
      setRevisionsLoading(false);
    }
  }, []);

  const selectSurface = useCallback(
    (surface: GalaxySurfaceRecord) => {
      selectedIdRef.current = surface.id;
      setSelectedId(surface.id);
      void loadRevisions(surface);
    },
    [loadRevisions],
  );

  const loadSurfaces = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const response = await fetch('/api/galaxy-brain/surfaces', { cache: 'no-store' });
      const body = await responseJson(response);
      if (!response.ok || !Array.isArray(body)) {
        throw new Error(responseError(body, 'Galaxy surfaces failed to load'));
      }
      const nextSurfaces = body as GalaxySurfaceRecord[];
      setSurfaces(nextSurfaces);
      const nextSelected =
        nextSurfaces.find((surface) => surface.id === selectedIdRef.current) ?? nextSurfaces[0];
      if (nextSelected) selectSurface(nextSelected);
      else {
        setSelectedId(undefined);
        selectedIdRef.current = undefined;
        setRevisions([]);
        setSelectedVersion(undefined);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Galaxy surfaces failed to load');
    } finally {
      setLoading(false);
    }
  }, [selectSurface]);

  const preview = useMemo(() => {
    const spec = selectedRevision?.spec ?? selected?.current_spec;
    if (!spec) return null;
    try {
      return { content: galaxySurfaceToMessageContent(spec), error: undefined };
    } catch (cause) {
      return {
        content: undefined,
        error: cause instanceof Error ? cause.message : 'Stored surface failed validation',
      };
    }
  }, [selected, selectedRevision]);

  const promote = async () => {
    if (!selected || selected.status !== 'draft') return;
    if (!window.confirm(`Promote “${selected.title}” to the Galaxy Brain workspace?`)) return;
    setPromoting(true);
    setError(undefined);
    try {
      const response = await fetch(
        `/api/galaxy-brain/surfaces/${encodeURIComponent(selected.id)}/promote`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            baseVersion: selected.current_version,
            idempotencyKey: `generous-library-promote:${selected.id}:${selected.current_version}`,
          }),
        },
      );
      const body = await responseJson(response);
      if (!response.ok || typeof body !== 'object' || body === null || Array.isArray(body)) {
        throw new Error(responseError(body, 'Surface promotion failed'));
      }
      const promoted = body as GalaxySurfaceRecord;
      setSurfaces((current) =>
        current.map((surface) => (surface.id === promoted.id ? promoted : surface)),
      );
      setSelectedId(promoted.id);
      await loadRevisions(promoted);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Surface promotion failed');
    } finally {
      setPromoting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen && connected) void loadSurfaces();
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={!connected}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          title={connected ? 'Browse saved Galaxy Brain surfaces' : 'Galaxy Brain is unavailable'}
        >
          <Database className="size-3.5" />
          Galaxy surfaces
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Galaxy surfaces</DialogTitle>
          <DialogDescription>
            Reopen the current surface or inspect an immutable historical revision before promoting.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'draft', 'promoted', 'archived'] as const).map((value) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={filter === value ? 'secondary' : 'ghost'}
              onClick={() => setFilter(value)}
            >
              {value[0].toUpperCase() + value.slice(1)}
            </Button>
          ))}
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="ml-auto"
            disabled={loading}
            onClick={() => void loadSurfaces()}
          >
            <RefreshCw className={cn('size-3.5', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-[17rem_minmax(0,1fr)]">
          <div className="max-h-[62vh] space-y-2 overflow-y-auto rounded-lg border p-2">
            {loading && surfaces.length === 0 && (
              <p className="p-3 text-sm text-muted-foreground">Loading surfaces…</p>
            )}
            {!loading && visibleSurfaces.length === 0 && (
              <p className="p-3 text-sm text-muted-foreground">No {filter === 'all' ? '' : `${filter} `}surfaces yet.</p>
            )}
            {visibleSurfaces.map((surface) => (
              <button
                key={surface.id}
                type="button"
                onClick={() => selectSurface(surface)}
                className={cn(
                  'w-full rounded-md border p-3 text-left transition-colors hover:bg-accent',
                  selected?.id === surface.id && 'border-primary bg-accent',
                )}
              >
                <span className="block truncate text-sm font-medium">{surface.title}</span>
                <span className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{surface.status}</span>
                  <span>v{surface.current_version}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="max-h-[62vh] min-w-0 overflow-y-auto rounded-lg border p-4">
            {!selected && (
              <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
                Select a surface to preview it.
              </div>
            )}
            {selected && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{selected.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatTimestamp(selected.updated_at)} · {selected.current_content_hash.slice(0, 12)}
                    </p>
                  </div>
                  <Badge variant={selected.status === 'promoted' ? 'default' : 'secondary'}>
                    {selected.status}
                  </Badge>
                  {selected.status === 'draft' && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={!writesConfigured || promoting}
                      onClick={() => void promote()}
                      title={
                        writesConfigured
                          ? 'Promote this reviewed draft'
                          : 'Configure GALAXY_BRAIN_WRITE_TOKEN with eln:write scope'
                      }
                    >
                      <Rocket className="size-3.5" />
                      {promoting ? 'Promoting…' : 'Promote'}
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2" aria-label="Surface revisions">
                  <History className="size-4 text-muted-foreground" />
                  {revisionsLoading ? (
                    <span className="text-xs text-muted-foreground">Loading history…</span>
                  ) : (
                    revisions.map((revision) => (
                      <Button
                        key={revision.id}
                        type="button"
                        size="sm"
                        variant={selectedVersion === revision.version ? 'secondary' : 'ghost'}
                        onClick={() => setSelectedVersion(revision.version)}
                        aria-label={`Preview revision ${revision.version}`}
                      >
                        v{revision.version} · {revision.status}
                      </Button>
                    ))
                  )}
                </div>

                {provenanceItems(selectedRevision?.provenance ?? selected.provenance).length > 0 && (
                  <dl className="grid gap-x-4 gap-y-1 rounded-md bg-muted/40 p-3 text-xs sm:grid-cols-2">
                    {provenanceItems(selectedRevision?.provenance ?? selected.provenance).map(
                      ([label, value]) => (
                        <div key={label} className="flex min-w-0 gap-2">
                          <dt className="font-medium text-muted-foreground">{label}</dt>
                          <dd className="truncate" title={value}>{value}</dd>
                        </div>
                      ),
                    )}
                  </dl>
                )}

                {preview?.content && (
                  <div className="rounded-lg bg-background p-1">
                    <GenerativeMessage
                      message={{
                        id: `galaxy-surface-${selected.id}-${selectedVersion ?? selected.current_version}`,
                        role: 'assistant',
                        content: preview.content,
                      }}
                    />
                  </div>
                )}
                {preview?.error && (
                  <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                    This stored revision cannot be replayed safely: {preview.error}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}
