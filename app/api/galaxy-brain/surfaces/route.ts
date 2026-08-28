import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import type { A2UIMessage } from '@/lib/a2ui/types';
import { createGalaxySurface } from '@/lib/integrations/galaxy-brain';
import {
  GalaxySurfaceContractError,
  deriveGalaxySurfaceTitle,
  toGalaxySurfaceSpec,
} from '@/lib/integrations/galaxy-surface';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function upstreamStatus(error: unknown): number {
  if (!(error instanceof Error)) return 502;
  const match = error.message.match(/Galaxy Brain returned (\d{3})/);
  return match ? Number(match[1]) : 502;
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || !isRecord(body.spec)) {
      return NextResponse.json({ error: 'A2UI surface spec is required' }, { status: 422 });
    }
    if (
      typeof body.idempotencyKey !== 'string' ||
      body.idempotencyKey.length < 8 ||
      body.idempotencyKey.length > 200
    ) {
      return NextResponse.json({ error: 'A stable idempotency key is required' }, { status: 422 });
    }

    const message = body.spec as unknown as A2UIMessage;
    const spec = toGalaxySurfaceSpec(message);
    const derivedTitle = deriveGalaxySurfaceTitle(message);
    const requestedTitle = typeof body.title === 'string' ? body.title.trim() : '';
    const title = (requestedTitle || derivedTitle).slice(0, 200);

    const surface = await createGalaxySurface({
      title,
      spec,
      provenance: {
        source: 'generous.canvas',
        ...(typeof body.messageId === 'string' ? { message_id: body.messageId } : {}),
        note: 'Saved from a rendered A2UI preview in Generous',
      },
      idempotency_key: body.idempotencyKey,
    });
    return NextResponse.json(surface, { status: surface.replayed ? 200 : 201 });
  } catch (error) {
    if (error instanceof GalaxySurfaceContractError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    const message = error instanceof Error ? error.message : 'Galaxy Brain write failed';
    return NextResponse.json({ error: message }, { status: upstreamStatus(error) });
  }
}
