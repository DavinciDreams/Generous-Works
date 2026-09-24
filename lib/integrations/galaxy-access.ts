import 'server-only';

import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';

import { GALAXY_LINK_COOKIE, verifyGalaxyLinkReceipt } from '@/lib/integrations/galaxy-link';

export type GalaxyBrainAccess =
  | { allowed: false; linkedWithNostr: false }
  | { allowed: true; linkedWithNostr: true; actorRef: string; nostrPubkey: string };

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
    allowed: false,
    linkedWithNostr: false,
  };
}
