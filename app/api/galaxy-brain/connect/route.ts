import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { GALAXY_LINK_COOKIE } from '@/lib/integrations/galaxy-link';

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const response = NextResponse.json({ disconnected: true });
  response.cookies.delete(GALAXY_LINK_COOKIE);
  return response;
}
