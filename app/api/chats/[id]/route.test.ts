import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authMock, sqlMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  sqlMock: vi.fn(),
}));

vi.mock('@clerk/nextjs/server', () => ({ auth: authMock }));
vi.mock('@/lib/db', () => ({ default: sqlMock }));

import { GET } from './route';

beforeEach(() => {
  vi.clearAllMocks();
  authMock.mockResolvedValue({ userId: 'user-1' });
});

describe('chat detail route', () => {
  it('returns one full chat for its owner', async () => {
    sqlMock.mockResolvedValue([{
      id: 'chat-1',
      title: 'Earlier chat',
      createdAt: '2026-09-23T00:00:00.000Z',
      messageCount: 1,
      messages: [{ id: 'msg-1', role: 'user', content: 'Hello' }],
    }]);

    const response = await GET(
      new Request('https://generous.example/api/chats/chat-1'),
      { params: Promise.resolve({ id: 'chat-1' }) },
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.messages).toHaveLength(1);
    expect(sqlMock.mock.calls[0].slice(1)).toEqual(['chat-1', 'user-1']);
  });

  it('returns not found when the chat is outside the user tenant', async () => {
    sqlMock.mockResolvedValue([]);

    const response = await GET(
      new Request('https://generous.example/api/chats/other-chat'),
      { params: Promise.resolve({ id: 'other-chat' }) },
    );

    expect(response.status).toBe(404);
  });
});
