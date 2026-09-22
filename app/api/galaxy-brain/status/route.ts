import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { getGalaxyBrainConnectionStatus } from '@/lib/integrations/galaxy-brain';
import { isGalaxyBrainUserAllowed } from '@/lib/integrations/galaxy-access';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isGalaxyBrainUserAllowed(userId)) {
    return NextResponse.json({
      configured: false,
      connected: false,
      surfaceWritesConfigured: false,
      accessAllowed: false,
    });
  }

  const status = await getGalaxyBrainConnectionStatus();
  return NextResponse.json({ ...status, accessAllowed: true }, {
    status: status.connected || !status.configured ? 200 : 503,
  });
}
