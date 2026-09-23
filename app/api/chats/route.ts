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

  await ready;
  await sql`
    INSERT INTO chats (id, user_id, title, messages, created_at)
    VALUES (${id}, ${userId}, ${title}, ${JSON.stringify(messages)}, ${new Date(createdAt).toISOString()})
    ON CONFLICT (id) DO NOTHING
  `;
  return NextResponse.json({ ok: true });
}
