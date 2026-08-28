import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  getGalaxyBrainConnectionStatus,
  getGalaxyBrainContext,
} from './galaxy-brain';

const originalUrl = process.env.GALAXY_BRAIN_API_URL;
const originalToken = process.env.GALAXY_BRAIN_API_TOKEN;

beforeEach(() => {
  process.env.GALAXY_BRAIN_API_URL = 'https://galaxybrain.example/api/eln';
  process.env.GALAXY_BRAIN_API_TOKEN = `gbk_${'a'.repeat(43)}`;
});

afterEach(() => {
  vi.unstubAllGlobals();

  if (originalUrl === undefined) delete process.env.GALAXY_BRAIN_API_URL;
  else process.env.GALAXY_BRAIN_API_URL = originalUrl;

  if (originalToken === undefined) delete process.env.GALAXY_BRAIN_API_TOKEN;
  else process.env.GALAXY_BRAIN_API_TOKEN = originalToken;
});

describe('Galaxy Brain integration', () => {
  it('reports an unconfigured connection without making a request', async () => {
    delete process.env.GALAXY_BRAIN_API_TOKEN;
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(getGalaxyBrainConnectionStatus()).resolves.toEqual({
      configured: false,
      connected: false,
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
});
