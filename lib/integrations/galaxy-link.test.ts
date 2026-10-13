import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  createGalaxyLinkState,
  galaxyAuthorizationUrl,
  signGalaxyLinkReceipt,
  statesMatch,
  verifyGalaxyLinkReceipt,
} from './galaxy-link';

const originalLinkSecret = process.env.GALAXY_BRAIN_LINK_SECRET;
const originalWebUrl = process.env.GALAXY_BRAIN_WEB_URL;
const originalPublicUrl = process.env.GENEROUS_PUBLIC_URL;

beforeEach(() => {
  process.env.GALAXY_BRAIN_LINK_SECRET = 'test-secret-that-is-long-enough-for-hmac';
  process.env.GALAXY_BRAIN_WEB_URL = 'https://galaxy.example';
  process.env.GENEROUS_PUBLIC_URL = 'https://generous.example';
});

afterEach(() => {
  if (originalLinkSecret === undefined) delete process.env.GALAXY_BRAIN_LINK_SECRET;
  else process.env.GALAXY_BRAIN_LINK_SECRET = originalLinkSecret;
  if (originalWebUrl === undefined) delete process.env.GALAXY_BRAIN_WEB_URL;
  else process.env.GALAXY_BRAIN_WEB_URL = originalWebUrl;
  if (originalPublicUrl === undefined) delete process.env.GENEROUS_PUBLIC_URL;
  else process.env.GENEROUS_PUBLIC_URL = originalPublicUrl;
});

describe('Galaxy Nostr account links', () => {
  it('binds a signed receipt to one Clerk user and rejects tampering or expiry', () => {
    const receipt = signGalaxyLinkReceipt({
      version: 1,
      clerkUserId: 'user_alpha',
      principalId: '22a29f54-8cf2-41bf-b6e7-a7a9c1e8a98a',
      tenantId: 'c8077041-623e-47ee-b19b-fce05c5af48c',
      nostrPubkey: 'a'.repeat(64),
      expiresAt: 2_000,
    });

    expect(verifyGalaxyLinkReceipt(receipt, 'user_alpha', 1_000)?.nostrPubkey).toBe('a'.repeat(64));
    expect(verifyGalaxyLinkReceipt(receipt, 'user_beta', 1_000)).toBeNull();
    expect(verifyGalaxyLinkReceipt(`${receipt}x`, 'user_alpha', 1_000)).toBeNull();
    expect(verifyGalaxyLinkReceipt(receipt, 'user_alpha', 2_000)).toBeNull();
  });

  it('uses an opaque, constant-length state and an exact callback URL', () => {
    const state = createGalaxyLinkState();
    expect(state).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(statesMatch(state, state)).toBe(true);
    expect(statesMatch(state, createGalaxyLinkState())).toBe(false);

    const authorization = galaxyAuthorizationUrl('https://ignored.example/request', state);
    expect(authorization.origin).toBe('https://galaxy.example');
    expect(authorization.pathname).toBe('/integrations/generous/connect');
    expect(authorization.searchParams.get('callback')).toBe(
      'https://generous.example/api/galaxy-brain/connect/callback',
    );
    expect(authorization.searchParams.get('state')).toBe(state);
  });
});
