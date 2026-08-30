import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { galaxyActorRef, isGalaxyBrainUserAllowed } from './galaxy-access';

const originalAllowedUsers = process.env.GALAXY_BRAIN_ALLOWED_USER_IDS;

beforeEach(() => {
  process.env.GALAXY_BRAIN_ALLOWED_USER_IDS = 'user_alpha, user_beta';
});

afterEach(() => {
  if (originalAllowedUsers === undefined) delete process.env.GALAXY_BRAIN_ALLOWED_USER_IDS;
  else process.env.GALAXY_BRAIN_ALLOWED_USER_IDS = originalAllowedUsers;
});

describe('Galaxy Brain caller access', () => {
  it('allows only exact configured Clerk user IDs and fails closed without configuration', () => {
    expect(isGalaxyBrainUserAllowed('user_alpha')).toBe(true);
    expect(isGalaxyBrainUserAllowed('user_alph')).toBe(false);
    expect(isGalaxyBrainUserAllowed('USER_ALPHA')).toBe(false);

    delete process.env.GALAXY_BRAIN_ALLOWED_USER_IDS;
    expect(isGalaxyBrainUserAllowed('user_alpha')).toBe(false);
  });

  it('produces a stable non-sensitive actor reference', () => {
    const actorRef = galaxyActorRef('user_alpha');
    expect(actorRef).toMatch(/^clerk:[0-9a-f]{20}$/);
    expect(actorRef).not.toContain('user_alpha');
    expect(galaxyActorRef('user_alpha')).toBe(actorRef);
    expect(galaxyActorRef('user_beta')).not.toBe(actorRef);
  });
});
