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

  const messages = (...ids: string[]) => ids.map((id) => ({ id, role: 'user', content: id }));
  const save = (id: string, ...ids: string[]) => POST(new Request('http://localhost/api/chats', {
    method: 'POST',
    body: JSON.stringify({ id, title: 'Earlier chat', messages: messages(...ids), createdAt: 1 }),
  }));
  const query = (call: number) => (sqlMock.mock.calls[call][0] as TemplateStringsArray).join('?').replace(/\s+/g, ' ');

  it('saves a new chat under its own id', async () => {
    sqlMock.mockResolvedValueOnce([]).mockResolvedValue([]);

    const response = await save('chat-1', 'msg-1');

    expect(await response.json()).toEqual({ ok: true, id: 'chat-1' });
    expect(query(1)).toContain('INSERT INTO chats');
    expect(sqlMock.mock.calls[1]).toContain('chat-1');
  });

  it('saves a chat that continues the saved one back to the same row, moving it to the top', async () => {
    sqlMock.mockResolvedValueOnce([{ userId: 'user-1', messageIds: ['msg-1'] }]).mockResolvedValue([]);

    const response = await save('chat-1', 'msg-1', 'msg-2');

    expect(await response.json()).toEqual({ ok: true, id: 'chat-1' });
    expect(query(1)).toContain('UPDATE chats SET title = ?, messages = ?, created_at = ? WHERE id = ? AND user_id = ?');
    expect(sqlMock.mock.calls[1]).toEqual(expect.arrayContaining(['chat-1', 'user-1']));
  });

  it('keeps a chat that went a different way in another tab as its own chat', async () => {
    sqlMock.mockResolvedValueOnce([{ userId: 'user-1', messageIds: ['msg-1', 'tab-1'] }]).mockResolvedValue([]);

    const response = await save('chat-1', 'msg-1', 'tab-2');
    const { id } = await response.json();

    expect(id).not.toBe('chat-1');
    expect(query(1)).toContain('INSERT INTO chats');
    expect(sqlMock.mock.calls[1]).toContain(id);
  });

  it('does not overwrite a newer save with an older copy', async () => {
    sqlMock.mockResolvedValueOnce([{ userId: 'user-1', messageIds: ['msg-1', 'msg-2'] }]);

    const response = await save('chat-1', 'msg-1');

    expect(await response.json()).toEqual({ ok: true, id: 'chat-1' });
    expect(sqlMock).toHaveBeenCalledTimes(1);
  });

  it('never writes to another user’s chat', async () => {
    sqlMock.mockResolvedValueOnce([{ userId: 'user-2', messageIds: ['msg-1'] }]).mockResolvedValue([]);

    const response = await save('chat-1', 'msg-1', 'msg-2');
    const { id } = await response.json();

    expect(id).not.toBe('chat-1');
    expect(query(1)).not.toContain('UPDATE');
    expect(sqlMock.mock.calls[1]).toEqual(expect.arrayContaining([id, 'user-1']));
  });

  it('does not query chats for an unauthenticated request', async () => {
    authMock.mockResolvedValue({ userId: null });

    const response = await GET();

    expect(response.status).toBe(401);
    expect(sqlMock).not.toHaveBeenCalled();
  });
});
