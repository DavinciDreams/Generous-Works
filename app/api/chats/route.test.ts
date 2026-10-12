import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authMock, initChatsTableMock, sqlMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  initChatsTableMock: vi.fn(() => Promise.resolve()),
  sqlMock: vi.fn(),
}));

vi.mock('@clerk/nextjs/server', () => ({ auth: authMock }));
vi.mock('@/lib/db', () => ({
  default: sqlMock,
  initChatsTable: initChatsTableMock,
}));

import { GET, POST } from './route';

beforeEach(() => {
  vi.clearAllMocks();
  authMock.mockResolvedValue({ userId: 'user-1' });
});

describe('chat history route', () => {
  it('returns chat summaries without full message bodies', async () => {
    sqlMock.mockResolvedValue([{
      id: 'chat-1',
      title: 'Earlier chat',
      createdAt: '2026-09-23T00:00:00.000Z',
      messageCount: 42,
    }]);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual([expect.objectContaining({ id: 'chat-1', messageCount: 42 })]);
    expect(payload[0]).not.toHaveProperty('messages');
  });

  it('saves a reopened chat back to the same row, only for its owner', async () => {
    sqlMock.mockResolvedValue([]);

    const response = await POST(new Request('http://localhost/api/chats', {
      method: 'POST',
      body: JSON.stringify({
        id: 'chat-1',
        title: 'Earlier chat',
        messages: [{ id: 'msg-1', role: 'user', content: 'Hi' }],
        createdAt: 1,
      }),
    }));

    expect(response.status).toBe(200);
    const query = (sqlMock.mock.calls[0][0] as TemplateStringsArray).join('?').replace(/\s+/g, ' ');
    expect(query).toContain('ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, messages = EXCLUDED.messages');
    expect(query).toContain('WHERE chats.user_id = EXCLUDED.user_id');
    expect(sqlMock.mock.calls[0]).toContain('user-1');
  });

  it('does not query chats for an unauthenticated request', async () => {
    authMock.mockResolvedValue({ userId: null });

    const response = await GET();

    expect(response.status).toBe(401);
    expect(sqlMock).not.toHaveBeenCalled();
  });
});
