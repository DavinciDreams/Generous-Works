import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { getGalaxyBrainConnectionStatus } from '@/lib/integrations/galaxy-brain';
import { getGalaxyBrainAccess } from '@/lib/integrations/galaxy-access';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const access = await getGalaxyBrainAccess(userId);
  if (!access.allowed) {
    return NextResponse.json({
      configured: true,
      connected: false,
      surfaceWritesConfigured: false,
      accessAllowed: false,
      linkedWithNostr: false,
      connectUrl: '/api/galaxy-brain/connect/start',
    });
  }

  const status = await getGalaxyBrainConnectionStatus();
  return NextResponse.json({
    ...status,
    accessAllowed: true,
    linkedWithNostr: access.linkedWithNostr,
    connectUrl: '/api/galaxy-brain/connect/start',
  }, {
    status: status.connected || !status.configured ? 200 : 503,
  });
}
