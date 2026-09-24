import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { POST } from './route';

const { galaxyAccessMock, zhipuModelMock, createZhipuMock } = vi.hoisted(() => {
  const zhipuModelMock = vi.fn(() => ({ provider: 'mock-zhipu-model' }));
  return {
    galaxyAccessMock: vi.fn(),
    zhipuModelMock,
    createZhipuMock: vi.fn(() => zhipuModelMock),
  };
});

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => undefined }) }));

vi.mock('server-only', () => ({}));

vi.mock('@/lib/integrations/galaxy-access', () => ({
  getGalaxyBrainAccess: galaxyAccessMock,
}));

vi.mock('zhipu-ai-provider', () => ({
  createZhipu: createZhipuMock,
}));

vi.mock('ai', () => ({
  streamText: vi.fn(),
}));

vi.mock('@/lib/a2ui/catalog', () => ({
  getCatalogPrompt: vi.fn(() => ''),
}));

vi.mock('@/lib/integrations/galaxy-brain', () => ({
  getGalaxyBrainContext: vi.fn(async () => '\nGALAXY_CONTEXT'),
}));

import { auth } from '@clerk/nextjs/server';
import { streamText } from 'ai';
import { getGalaxyBrainContext } from '@/lib/integrations/galaxy-brain';

const originalZhipuApiKey = process.env.ZHIPU_API_KEY;

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.ZHIPU_API_KEY = 'test-api-key';
  galaxyAccessMock.mockResolvedValue({
    allowed: true,
    linkedWithNostr: true,
    actorRef: 'nostr:0123456789abcdef0123',
    nostrPubkey: 'a'.repeat(64),
  });
});

afterAll(() => {
  if (originalZhipuApiKey === undefined) {
    delete process.env.ZHIPU_API_KEY;
  } else {
    process.env.ZHIPU_API_KEY = originalZhipuApiKey;
  }
});

describe('POST /api/chat — auth', () => {
  it('returns 401 when auth() returns { userId: null }', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const res = await POST(makeRequest({ messages: [{ role: 'user', content: 'Hi' }] }) as any);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });
});

describe('POST /api/chat — validation', () => {
  it('returns 400 when body has neither messages nor prompt', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);

    const res = await POST(makeRequest({}) as any);

    expect(res.status).toBe(400);
  });

  it('returns 400 when messages contains an invalid role', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);

    const res = await POST(
      makeRequest({ messages: [{ role: 'invalid', content: 'Hi' }] }) as any
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid request body');
  });

  it('returns 400 for an unknown render format', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);

    const res = await POST(
      makeRequest({
        messages: [{ role: 'user', content: 'Hi' }],
        renderFormat: 'partial-mystery-json',
      }) as any
    );

    expect(res.status).toBe(400);
    expect(streamText).not.toHaveBeenCalled();
  });

  it('returns a streaming response for valid input', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);

    const mockStreamResponse = new Response('test', { status: 200 });
    vi.mocked(streamText).mockReturnValue({
      toTextStreamResponse: () => mockStreamResponse,
    } as any);

    const res = await POST(
      makeRequest({ messages: [{ role: 'user', content: 'Hello' }] }) as any
    );

    expect(res.status).toBe(200);
    expect(streamText).toHaveBeenCalledOnce();
  });

  it('returns a labelled JSONL stream with the A2UI transport prompt', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);
    const toTextStreamResponse = vi.fn((init?: ResponseInit) => new Response('test', init));
    vi.mocked(streamText).mockReturnValue({ toTextStreamResponse } as any);

    const res = await POST(
      makeRequest({
        messages: [{ role: 'user', content: 'Explain quantum mechanics' }],
        renderFormat: 'a2ui-jsonl',
      }) as any
    );

    expect(res.headers.get('Content-Type')).toContain('application/x-ndjson');
    expect(res.headers.get('X-Generous-Render-Format')).toBe('a2ui-jsonl');
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringContaining('Required A2UI JSONL transport'),
      })
    );
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.stringContaining('a title or Text-only surface is never complete'),
      })
    );
    expect(toTextStreamResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Generous-Render-Format': 'a2ui-jsonl',
        }),
      })
    );
    expect(zhipuModelMock).toHaveBeenCalledWith(
      process.env.ZHIPU_MODEL || 'glm-4.7',
      { thinking: { type: 'disabled' } },
    );
  });

  it('overrides a requested JSONL stream for visual prompts', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);
    const toTextStreamResponse = vi.fn(() => new Response('test'));
    vi.mocked(streamText).mockReturnValue({ toTextStreamResponse } as any);

    const res = await POST(
      makeRequest({
        messages: [{ role: 'user', content: 'Build a live dashboard' }],
        renderFormat: 'a2ui-jsonl',
      }) as any
    );

    expect(res.headers.get('X-Generous-Render-Format')).toBeNull();
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        system: expect.not.stringContaining('Required A2UI JSONL transport'),
      })
    );
    expect(toTextStreamResponse).toHaveBeenCalledWith(undefined);
  });

  it('records completion metadata without logging generated content', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);
    const info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    type FinishEvent = {
      finishReason: string;
      rawFinishReason?: string;
      text: string;
      reasoningText?: string;
      usage: { inputTokens?: number; outputTokens?: number };
    };
    let onFinish: ((event: FinishEvent) => void) | undefined;
    vi.mocked(streamText).mockImplementation((options) => {
      onFinish = options.onFinish as unknown as typeof onFinish;
      return {
        toTextStreamResponse: () => new Response('test'),
      } as ReturnType<typeof streamText>;
    });

    await POST(makeRequest({ prompt: 'Hello', renderFormat: 'a2ui-jsonl' }) as any);
    onFinish?.({
      finishReason: 'length',
      rawFinishReason: 'length',
      text: '',
      reasoningText: 'private reasoning',
      usage: { inputTokens: 12, outputTokens: 4000 },
    });

    expect(info).toHaveBeenCalledWith('Chat API: Streaming finished:', {
      provider: 'zhipu',
      model: process.env.ZHIPU_MODEL || 'glm-4.7',
      renderFormat: 'a2ui-jsonl',
      finishReason: 'length',
      rawFinishReason: 'length',
      textChars: 0,
      reasoningChars: 17,
      inputTokens: 12,
      outputTokens: 4000,
    });
    expect(info.mock.calls.flat()).not.toContain('private reasoning');
    info.mockRestore();
  });

  it('clamps temperature 999 to 2 before forwarding to the AI provider', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);

    const mockStreamResponse = new Response('test', { status: 200 });
    vi.mocked(streamText).mockReturnValue({
      toTextStreamResponse: () => mockStreamResponse,
    } as any);

    await POST(
      makeRequest({
        messages: [{ role: 'user', content: 'Hello' }],
        temperature: 999,
      }) as any
    );

    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({ temperature: 2 })
    );
  });

  it('clamps maxTokens 999999 to 8000 before forwarding to the AI provider', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);

    const mockStreamResponse = new Response('test', { status: 200 });
    vi.mocked(streamText).mockReturnValue({
      toTextStreamResponse: () => mockStreamResponse,
    } as any);

    await POST(
      makeRequest({
        messages: [{ role: 'user', content: 'Hello' }],
        maxTokens: 999999,
      }) as any
    );

    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({ maxOutputTokens: 8000 })
    );
  });

  it('adds Galaxy Brain context only when explicitly requested', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_123' } as any);
    vi.mocked(streamText).mockReturnValue({
      toTextStreamResponse: () => new Response('test', { status: 200 }),
    } as any);

    await POST(
      makeRequest({
        messages: [{ role: 'user', content: 'Show my current experiments' }],
        useGalaxyBrain: true,
      }) as any
    );

    expect(getGalaxyBrainContext).toHaveBeenCalledWith('Show my current experiments');
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({ system: expect.stringContaining('GALAXY_CONTEXT') })
    );
  });

  it('denies Galaxy Brain context to an authenticated but unlinked user', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_denied' } as any);
    galaxyAccessMock.mockResolvedValue({ allowed: false, linkedWithNostr: false });

    const res = await POST(
      makeRequest({
        messages: [{ role: 'user', content: 'Show my current experiments' }],
        useGalaxyBrain: true,
      }) as any
    );

    expect(res.status).toBe(403);
    expect(getGalaxyBrainContext).not.toHaveBeenCalled();
    expect(streamText).not.toHaveBeenCalled();
  });
});
