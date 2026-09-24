import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import {
  GALAXY_LINK_STATE_COOKIE,
  createGalaxyLinkState,
  galaxyAuthorizationUrl,
} from '@/lib/integrations/galaxy-link';

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const state = createGalaxyLinkState();
  const destination = galaxyAuthorizationUrl(request.url, state);
  const response = NextResponse.redirect(destination);
  response.cookies.set(GALAXY_LINK_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/galaxy-brain/connect',
    maxAge: 10 * 60,
  });
  return response;
}
