import { beforeEach, describe, expect, it, vi } from 'vitest';

const { cookiesMock, verifyReceiptMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
  verifyReceiptMock: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({ cookies: cookiesMock }));
vi.mock('@/lib/integrations/galaxy-link', () => ({
  GALAXY_LINK_COOKIE: 'generous_galaxy_link',
  verifyGalaxyLinkReceipt: verifyReceiptMock,
}));

import { getGalaxyBrainAccess } from './galaxy-access';

beforeEach(() => {
  vi.clearAllMocks();
  cookiesMock.mockResolvedValue({ get: vi.fn(() => ({ value: 'signed-receipt' })) });
});

describe('Galaxy Brain caller access', () => {
  it('requires a valid Nostr link receipt', async () => {
    verifyReceiptMock.mockReturnValue(null);

    await expect(getGalaxyBrainAccess('user_alpha')).resolves.toEqual({
      allowed: false,
      linkedWithNostr: false,
    });
    expect(verifyReceiptMock).toHaveBeenCalledWith('signed-receipt', 'user_alpha');
  });

  it('derives a stable non-sensitive actor reference from the linked Nostr identity', async () => {
    verifyReceiptMock.mockReturnValue({ nostrPubkey: 'a'.repeat(64) });

    const access = await getGalaxyBrainAccess('user_alpha');
    expect(access).toEqual(expect.objectContaining({
      allowed: true,
      linkedWithNostr: true,
      nostrPubkey: 'a'.repeat(64),
      actorRef: expect.stringMatching(/^nostr:[0-9a-f]{20}$/),
    }));
    expect(access.allowed && access.actorRef).not.toContain('a'.repeat(64));
  });
});
