import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import sql, { initChatsTable } from "@/lib/db";

// Ensure table exists (no-op after first call thanks to IF NOT EXISTS)
const ready = initChatsTable();

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await ready;
  const rows = await sql`
    SELECT
      id,
      title,
      created_at AS "createdAt",
      jsonb_array_length(messages) AS "messageCount"
    FROM chats
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT 100
  `;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, messages, createdAt } = await req.json();
  if (!id || !title || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const body = JSON.stringify(messages);
  // History is ordered by created_at, so a chat saved again moves to the top
  const savedAt = new Date(createdAt).toISOString();
  const messageIds = messages.map((message: { id?: unknown }) => message?.id);

  await ready;
  const [existing] = await sql`
    SELECT user_id AS "userId", jsonb_path_query_array(messages, '$[*].id') AS "messageIds"
    FROM chats
    WHERE id = ${id}
  `;

  if (existing?.userId === userId) {
    const savedIds: unknown[] = existing.messageIds ?? [];
    // Continues the saved chat: save it back to the same row
    if (startsWith(messageIds, savedIds)) {
      await sql`
        UPDATE chats SET title = ${title}, messages = ${body}, created_at = ${savedAt}
        WHERE id = ${id} AND user_id = ${userId}
      `;
      return NextResponse.json({ ok: true, id });
    }
    // An older copy (another tab saved more since): nothing new to keep
    if (startsWith(savedIds, messageIds)) return NextResponse.json({ ok: true, id });
  }

  // A new chat, or one that went a different way in another tab (or belongs to
  // someone else): save it as its own chat rather than overwrite that one
  const savedId = existing ? crypto.randomUUID() : id;
  await sql`
    INSERT INTO chats (id, user_id, title, messages, created_at)
    VALUES (${savedId}, ${userId}, ${title}, ${body}, ${savedAt})
  `;
  return NextResponse.json({ ok: true, id: savedId });
}

function startsWith(ids: unknown[], prefix: unknown[]) {
  return prefix.length <= ids.length && prefix.every((id, index) => ids[index] === id);
}
