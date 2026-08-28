import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { promoteGalaxySurface } from '@/lib/integrations/galaxy-brain';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function upstreamStatus(error: unknown): number {
  if (!(error instanceof Error)) return 502;
  const match = error.message.match(/Galaxy Brain returned (\d{3})/);
  return match ? Number(match[1]) : 502;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ surfaceId: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { surfaceId } = await params;
  if (!UUID_PATTERN.test(surfaceId)) {
    return NextResponse.json({ error: 'Invalid surface identifier' }, { status: 400 });
  }

  try {
    const body: unknown = await request.json();
    if (
      typeof body !== 'object' ||
      body === null ||
      !('baseVersion' in body) ||
      !Number.isInteger(body.baseVersion) ||
      Number(body.baseVersion) < 1 ||
      !('idempotencyKey' in body) ||
      typeof body.idempotencyKey !== 'string' ||
      body.idempotencyKey.length < 8 ||
      body.idempotencyKey.length > 200
    ) {
      return NextResponse.json({ error: 'Base version and idempotency key are required' }, { status: 422 });
    }

    const surface = await promoteGalaxySurface({
      surfaceId,
      baseVersion: Number(body.baseVersion),
      idempotencyKey: body.idempotencyKey,
      provenance: {
        source: 'generous.canvas',
        note: 'Explicitly promoted from Generous after preview',
      },
    });
    return NextResponse.json(surface);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Galaxy Brain promotion failed';
    return NextResponse.json({ error: message }, { status: upstreamStatus(error) });
  }
}
