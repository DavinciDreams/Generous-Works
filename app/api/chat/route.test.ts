import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { POST } from './route';

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

vi.mock('zhipu-ai-provider', () => ({
  createZhipu: vi.fn(() => vi.fn()),
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
});
