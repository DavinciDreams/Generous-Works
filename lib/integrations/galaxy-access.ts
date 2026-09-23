import 'server-only';

import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';

import { GALAXY_LINK_COOKIE, verifyGalaxyLinkReceipt } from '@/lib/integrations/galaxy-link';

const MAX_ALLOWED_USERS = 100;

function allowedUserIds(): Set<string> {
  const configured = process.env.GALAXY_BRAIN_ALLOWED_USER_IDS ?? '';
  const values = configured
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  if (values.length > MAX_ALLOWED_USERS) return new Set();
  return new Set(values);
}

export function isGalaxyBrainUserAllowed(userId: string): boolean {
  return allowedUserIds().has(userId);
}

export function galaxyActorRef(userId: string): string {
  const digest = createHash('sha256').update(userId, 'utf8').digest('hex').slice(0, 20);
  return `clerk:${digest}`;
}

export interface GalaxyBrainAccess {
  allowed: boolean;
  linkedWithNostr: boolean;
  actorRef: string;
  nostrPubkey?: string;
}

export async function getGalaxyBrainAccess(userId: string): Promise<GalaxyBrainAccess> {
  const cookieStore = await cookies();
  const receipt = verifyGalaxyLinkReceipt(cookieStore.get(GALAXY_LINK_COOKIE)?.value, userId);
  if (receipt) {
    const digest = createHash('sha256').update(receipt.nostrPubkey, 'utf8').digest('hex').slice(0, 20);
    return {
      allowed: true,
      linkedWithNostr: true,
      actorRef: `nostr:${digest}`,
      nostrPubkey: receipt.nostrPubkey,
    };
  }
  return {
    allowed: isGalaxyBrainUserAllowed(userId),
    linkedWithNostr: false,
    actorRef: galaxyActorRef(userId),
  };
}
