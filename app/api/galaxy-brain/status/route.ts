import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { getGalaxyBrainConnectionStatus } from '@/lib/integrations/galaxy-brain';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const status = await getGalaxyBrainConnectionStatus();
  return NextResponse.json(status, {
    status: status.connected || !status.configured ? 200 : 503,
  });
}
