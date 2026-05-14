import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { sql, initDB } from "@/lib/neon";

// Returns all other dog profiles except the current user
// (client handles filtering out already-swiped UIDs)
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await initDB();
  const rows = await sql`
    SELECT * FROM users
    WHERE uid != ${session.uid}
    ORDER BY created_at DESC
    LIMIT 50
  `;
  return NextResponse.json(rows);
}
