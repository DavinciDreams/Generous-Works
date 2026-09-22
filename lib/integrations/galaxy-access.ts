import 'server-only';

import { createHash } from 'node:crypto';

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
