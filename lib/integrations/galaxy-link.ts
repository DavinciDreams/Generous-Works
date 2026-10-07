import 'server-only';

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const GALAXY_LINK_COOKIE = 'generous_galaxy_link';
export const GALAXY_LINK_STATE_COOKIE = 'generous_galaxy_link_state';
export const GALAXY_LINK_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NOSTR_PUBKEY_PATTERN = /^[0-9a-f]{64}$/;
const AUTH_CODE_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const STATE_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export interface GalaxyLinkReceipt {
  version: 1;
  clerkUserId: string;
  principalId: string;
  tenantId: string;
  nostrPubkey: string;
  expiresAt: number;
}

function linkSecret(): string | null {
  return process.env.GALAXY_BRAIN_LINK_SECRET?.trim()
    || process.env.CLERK_SECRET_KEY?.trim()
    || null;
}

function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret)
    .update('generous.galaxy-link.v1\0', 'utf8')
    .update(payload, 'utf8')
    .digest('base64url');
}

function validReceipt(value: unknown): value is GalaxyLinkReceipt {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const candidate = value as Partial<GalaxyLinkReceipt>;
  return candidate.version === 1
    && typeof candidate.clerkUserId === 'string'
    && candidate.clerkUserId.length > 0
    && candidate.clerkUserId.length <= 200
    && typeof candidate.principalId === 'string'
    && UUID_PATTERN.test(candidate.principalId)
    && typeof candidate.tenantId === 'string'
    && UUID_PATTERN.test(candidate.tenantId)
    && typeof candidate.nostrPubkey === 'string'
    && NOSTR_PUBKEY_PATTERN.test(candidate.nostrPubkey)
    && Number.isSafeInteger(candidate.expiresAt);
}

export function createGalaxyLinkState(): string {
  return randomBytes(32).toString('base64url');
}

export function statesMatch(presented: string | null, stored: string | undefined): boolean {
  if (!presented || !stored || !STATE_PATTERN.test(presented) || !STATE_PATTERN.test(stored)) return false;
  const left = Buffer.from(presented, 'utf8');
  const right = Buffer.from(stored, 'utf8');
  return left.length === right.length && timingSafeEqual(left, right);
}

export function signGalaxyLinkReceipt(receipt: GalaxyLinkReceipt): string {
  const secret = linkSecret();
  if (!secret) throw new Error('Galaxy account linking is not configured');
  if (!validReceipt(receipt)) throw new Error('Galaxy returned an invalid identity receipt');
  const payload = Buffer.from(JSON.stringify(receipt), 'utf8').toString('base64url');
  return `${payload}.${signPayload(payload, secret)}`;
}

export function verifyGalaxyLinkReceipt(
  value: string | undefined,
  clerkUserId: string,
  now = Date.now(),
): GalaxyLinkReceipt | null {
  const secret = linkSecret();
  if (!secret || !value || value.length > 2_000) return null;
  const [payload, signature, extra] = value.split('.');
  if (!payload || !signature || extra !== undefined) return null;
  const expected = Buffer.from(signPayload(payload, secret), 'utf8');
  const actual = Buffer.from(signature, 'utf8');
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const decoded: unknown = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!validReceipt(decoded)) return null;
    if (decoded.clerkUserId !== clerkUserId || decoded.expiresAt <= now) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function getGalaxyWebOrigin(): string {
  const value = process.env.GALAXY_BRAIN_WEB_URL?.trim() || 'https://galaxybrain.info';
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid Galaxy Brain web URL');
  if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
    throw new Error('Galaxy Brain web URL must use HTTPS in production');
  }
  return parsed.origin;
}

export function getGenerousPublicOrigin(requestUrl: string): string {
  const value = process.env.GENEROUS_PUBLIC_URL?.trim() || new URL(requestUrl).origin;
  const parsed = new URL(value);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Invalid Generous public URL');
  if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
    throw new Error('Generous public URL must use HTTPS in production');
  }
  return parsed.origin;
}

export function galaxyAuthorizationUrl(requestUrl: string, state: string): URL {
  const url = new URL('/integrations/generous/connect', getGalaxyWebOrigin());
  url.searchParams.set(
    'callback',
    new URL('/api/galaxy-brain/connect/callback', getGenerousPublicOrigin(requestUrl)).toString(),
  );
  url.searchParams.set('state', state);
  return url;
}

export async function exchangeGalaxyAuthorizationCode(code: string): Promise<{
  principalId: string;
  tenantId: string;
  nostrPubkey: string;
}> {
  if (!AUTH_CODE_PATTERN.test(code)) throw new Error('Galaxy returned an invalid authorization code');
  const token = process.env.GALAXY_BRAIN_WRITE_TOKEN?.trim();
  if (!token) throw new Error('Galaxy Brain write access is not configured');
  const response = await fetch(
    new URL('/api/integrations/generous/connect/exchange', getGalaxyWebOrigin()),
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    },
  );
  const value: unknown = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Galaxy authorization exchange failed (${response.status})`);
  if (
    typeof value !== 'object'
    || value === null
    || !('principalId' in value)
    || typeof value.principalId !== 'string'
    || !UUID_PATTERN.test(value.principalId)
    || !('tenantId' in value)
    || typeof value.tenantId !== 'string'
    || !UUID_PATTERN.test(value.tenantId)
    || !('nostrPubkey' in value)
    || typeof value.nostrPubkey !== 'string'
    || !NOSTR_PUBKEY_PATTERN.test(value.nostrPubkey)
  ) {
    throw new Error('Galaxy returned an invalid identity receipt');
  }
  return {
    principalId: value.principalId,
    tenantId: value.tenantId,
    nostrPubkey: value.nostrPubkey,
  };
}

export function galaxySurfaceViewUrl(surfaceId: string): string {
  const url = new URL('/surfaces', getGalaxyWebOrigin());
  url.searchParams.set('surface', surfaceId);
  return url.toString();
}
