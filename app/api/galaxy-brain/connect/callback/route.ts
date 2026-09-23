import { auth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  GALAXY_LINK_COOKIE,
  GALAXY_LINK_MAX_AGE_SECONDS,
  GALAXY_LINK_STATE_COOKIE,
  exchangeGalaxyAuthorizationCode,
  signGalaxyLinkReceipt,
  statesMatch,
} from '@/lib/integrations/galaxy-link';

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(request.url);
  const cookieStore = await cookies();
  const storedState = cookieStore.get(GALAXY_LINK_STATE_COOKIE)?.value;
  cookieStore.delete(GALAXY_LINK_STATE_COOKIE);
  if (!statesMatch(url.searchParams.get('state'), storedState)) {
    return NextResponse.json({ error: 'Galaxy connection state is invalid or expired' }, { status: 400 });
  }
  const code = url.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Galaxy did not return an authorization code' }, { status: 400 });

  try {
    const linked = await exchangeGalaxyAuthorizationCode(code);
    const expiresAt = Date.now() + GALAXY_LINK_MAX_AGE_SECONDS * 1_000;
    const receipt = signGalaxyLinkReceipt({
      version: 1,
      clerkUserId: userId,
      principalId: linked.principalId,
      tenantId: linked.tenantId,
      nostrPubkey: linked.nostrPubkey,
      expiresAt,
    });
    const response = NextResponse.redirect(new URL('/canvas?galaxy=connected', request.url));
    response.cookies.set(GALAXY_LINK_COOKIE, receipt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: GALAXY_LINK_MAX_AGE_SECONDS,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Galaxy connection failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
