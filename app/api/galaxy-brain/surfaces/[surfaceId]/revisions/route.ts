import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { listGalaxySurfaceRevisions } from '@/lib/integrations/galaxy-brain';
import { isGalaxyBrainUserAllowed } from '@/lib/integrations/galaxy-access';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function upstreamStatus(error: unknown): number {
  if (!(error instanceof Error)) return 502;
  const match = error.message.match(/Galaxy Brain returned (\d{3})/);
  return match ? Number(match[1]) : 502;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ surfaceId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isGalaxyBrainUserAllowed(userId)) {
    return NextResponse.json({ error: 'Galaxy Brain access is not allowed' }, { status: 403 });
  }

  const { surfaceId } = await params;
  if (!UUID_PATTERN.test(surfaceId)) {
    return NextResponse.json({ error: 'Invalid surface identifier' }, { status: 400 });
  }

  try {
    return NextResponse.json(await listGalaxySurfaceRevisions(surfaceId));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Galaxy Brain read failed';
    return NextResponse.json({ error: message }, { status: upstreamStatus(error) });
  }
}
