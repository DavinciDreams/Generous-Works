import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  createGalaxySurface,
  getGalaxyBrainConnectionStatus,
  getGalaxyBrainContext,
  listGalaxySurfaceRevisions,
  listGalaxySurfaces,
  promoteGalaxySurface,
} from './galaxy-brain';

const originalUrl = process.env.GALAXY_BRAIN_API_URL;
const originalToken = process.env.GALAXY_BRAIN_API_TOKEN;
const originalWriteToken = process.env.GALAXY_BRAIN_WRITE_TOKEN;

beforeEach(() => {
  process.env.GALAXY_BRAIN_API_URL = 'https://galaxybrain.example/api/eln';
  process.env.GALAXY_BRAIN_API_TOKEN = `gbk_${'a'.repeat(43)}`;
  process.env.GALAXY_BRAIN_WRITE_TOKEN = `gbk_${'b'.repeat(43)}`;
});

afterEach(() => {
  vi.unstubAllGlobals();

  if (originalUrl === undefined) delete process.env.GALAXY_BRAIN_API_URL;
  else process.env.GALAXY_BRAIN_API_URL = originalUrl;

  if (originalToken === undefined) delete process.env.GALAXY_BRAIN_API_TOKEN;
  else process.env.GALAXY_BRAIN_API_TOKEN = originalToken;

  if (originalWriteToken === undefined) delete process.env.GALAXY_BRAIN_WRITE_TOKEN;
  else process.env.GALAXY_BRAIN_WRITE_TOKEN = originalWriteToken;
});

describe('Galaxy Brain integration', () => {
  it('normalizes a Galaxy site origin to the ELN API base', async () => {
    process.env.GALAXY_BRAIN_API_URL = 'https://galaxybrain.example';
    const fetchMock = vi.fn(async () => new Response(JSON.stringify([]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(getGalaxyBrainConnectionStatus()).resolves.toEqual({
      configured: true,
      connected: true,
      surfaceWritesConfigured: true,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://galaxybrain.example/api/eln/experiments',
      expect.any(Object),
    );
  });

  it('reports an unconfigured connection without making a request', async () => {
    delete process.env.GALAXY_BRAIN_API_TOKEN;
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(getGalaxyBrainConnectionStatus()).resolves.toEqual({
      configured: false,
      connected: false,
      surfaceWritesConfigured: true,
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('uses the read-only bearer token and returns a bounded context projection', async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      const body = url.endsWith('/experiments')
        ? [
            {
              id: 'experiment-1',
              title: 'Parser reliability',
              hypothesis: 'Schema validation prevents canvas crashes',
              results: 'The renderer stayed online',
              protocol: 'private implementation detail',
              config_snapshot: { secretLikeValue: 'excluded' },
            },
          ]
        : [{ id: 'hypothesis-1', claim: 'Unrelated claim', confidence: 0.5 }];

      return new Response(JSON.stringify(body), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const context = await getGalaxyBrainContext('Help with parser reliability');

    expect(context).toContain('Parser reliability');
    expect(context).toContain('untrusted reference data');
    expect(context).not.toContain('private implementation detail');
    expect(context).not.toContain('secretLikeValue');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://galaxybrain.example/api/eln/experiments',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer gbk_${'a'.repeat(43)}`,
        }),
      }),
    );
  });

  it('keeps bounded surface writes on the separate write credential', async () => {
    const record = {
      id: '22a29f54-8cf2-41bf-b6e7-a7a9c1e8a98a',
      title: 'Research Board',
      status: 'draft',
      schema_version: 'gb.surface.v1',
      catalog_id: 'generous.a2ui',
      catalog_version: '1',
      current_version: 1,
      current_content_hash: 'a'.repeat(64),
      current_spec: {},
      provenance: {},
      tenant_id: 'must-not-reach-the-browser',
    };
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(record), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const created = await createGalaxySurface({
      title: record.title,
      spec: {},
      provenance: { source: 'generous.canvas' },
      idempotency_key: 'generous:message:block',
    });
    await promoteGalaxySurface({
      surfaceId: record.id,
      baseVersion: 1,
      provenance: { source: 'generous.canvas' },
      idempotencyKey: `generous-promote:${record.id}:1`,
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://galaxybrain.example/api/eln/surfaces',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer gbk_${'b'.repeat(43)}`,
        }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `https://galaxybrain.example/api/eln/surfaces/${record.id}/promote`,
      expect.objectContaining({ method: 'POST' }),
    );
    expect(created).not.toHaveProperty('tenant_id');
  });

  it('lists current surfaces and immutable revisions through the read credential', async () => {
    const surfaceId = '22a29f54-8cf2-41bf-b6e7-a7a9c1e8a98a';
    const provenance = {
      source: 'generous.canvas',
      actor_ref: 'clerk:abc123',
      galaxy: {
        event: 'created',
        principal_id: 'internal-principal',
        principal_kind: 'agent',
        recorded_at: '2026-08-30T12:00:00Z',
      },
    };
    const surface = {
      id: surfaceId,
      title: 'Research Board',
      status: 'draft',
      schema_version: 'gb.surface.v1',
      catalog_id: 'generous.a2ui',
      catalog_version: '1',
      current_version: 1,
      current_content_hash: 'a'.repeat(64),
      current_spec: {},
      provenance,
      tenant_id: 'internal-tenant',
      updated_at: '2026-08-30T12:00:00Z',
    };
    const revision = {
      id: 'c8077041-623e-47ee-b19b-fce05c5af48c',
      surface_id: surfaceId,
      version: 1,
      title: surface.title,
      status: 'draft',
      content_hash: surface.current_content_hash,
      spec: {},
      provenance,
      request_hash: 'internal-request-hash',
    };
    const fetchMock = vi.fn(async (input: string | URL | Request) =>
      new Response(JSON.stringify(String(input).includes('/revisions') ? [revision] : [surface])),
    );
    vi.stubGlobal('fetch', fetchMock);

    const listed = await listGalaxySurfaces();
    const revisions = await listGalaxySurfaceRevisions(surfaceId);

    expect(listed[0]).not.toHaveProperty('tenant_id');
    expect(listed[0].provenance).toEqual({
      source: 'generous.canvas',
      actor_ref: 'clerk:abc123',
      galaxy: { event: 'created', recorded_at: '2026-08-30T12:00:00Z' },
    });
    expect(revisions[0]).not.toHaveProperty('request_hash');
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://galaxybrain.example/api/eln/surfaces?limit=50',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: `Bearer gbk_${'a'.repeat(43)}` }),
      }),
    );
  });
});
