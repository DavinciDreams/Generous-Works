import { beforeEach, describe, expect, it, vi } from 'vitest';

const { accessMock, authMock, createSurfaceMock, listSurfacesMock } = vi.hoisted(() => ({
  accessMock: vi.fn(),
  authMock: vi.fn(),
  createSurfaceMock: vi.fn(),
  listSurfacesMock: vi.fn(),
}));

vi.mock('@clerk/nextjs/server', () => ({ auth: authMock }));
vi.mock('server-only', () => ({}));
vi.mock('@/lib/integrations/galaxy-access', () => ({ getGalaxyBrainAccess: accessMock }));
vi.mock('@/lib/integrations/galaxy-brain', () => ({
  createGalaxySurface: createSurfaceMock,
  listGalaxySurfaces: listSurfacesMock,
}));

import { GET, POST } from './route';

const requestSpec = {
  surfaceUpdate: {
    surfaceId: 'research-board',
    components: [
      {
        id: 'board-title',
        component: { Title: { text: 'Research Board' } },
      },
    ],
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  authMock.mockResolvedValue({ userId: 'user_denied' });
  accessMock.mockResolvedValue({ allowed: false, linkedWithNostr: false });
});

describe('Galaxy surface route authorization', () => {
  it('denies reads and writes from an authenticated but unlinked user', async () => {
    const getResponse = await GET(new Request('https://generous.example/api/galaxy-brain/surfaces'));
    const postResponse = await POST(
      new Request('https://generous.example/api/galaxy-brain/surfaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spec: requestSpec, idempotencyKey: 'message:block' }),
      }),
    );

    expect(getResponse.status).toBe(403);
    expect(postResponse.status).toBe(403);
    expect(listSurfacesMock).not.toHaveBeenCalled();
    expect(createSurfaceMock).not.toHaveBeenCalled();
  });

  it('records the linked Nostr actor reference for a connected writer', async () => {
    authMock.mockResolvedValue({ userId: 'user_allowed' });
    accessMock.mockResolvedValue({
      allowed: true,
      linkedWithNostr: true,
      actorRef: 'nostr:0123456789abcdef0123',
      nostrPubkey: 'a'.repeat(64),
    });
    createSurfaceMock.mockResolvedValue({
      id: '22a29f54-8cf2-41bf-b6e7-a7a9c1e8a98a',
      title: 'Research Board',
      status: 'draft',
      current_version: 1,
    });

    const response = await POST(
      new Request('https://generous.example/api/galaxy-brain/surfaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spec: requestSpec,
          messageId: 'message-1',
          idempotencyKey: 'message:block',
        }),
      }),
    );

    expect(response.status).toBe(201);
    expect(createSurfaceMock).toHaveBeenCalledWith(
      expect.objectContaining({
        provenance: expect.objectContaining({
          source: 'generous.canvas',
          actor_ref: 'nostr:0123456789abcdef0123',
        }),
      }),
    );
    expect(JSON.stringify(createSurfaceMock.mock.calls[0][0])).not.toContain('user_allowed');
    expect(JSON.stringify(createSurfaceMock.mock.calls[0][0])).not.toContain('a'.repeat(64));
  });
});
