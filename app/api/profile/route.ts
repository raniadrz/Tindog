import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { sql, initDB } from "@/lib/neon";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await initDB();
  const rows = await sql`SELECT * FROM users WHERE uid = ${session.uid}`;
  return NextResponse.json(rows[0] ?? null);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await initDB();
  await sql`
    INSERT INTO users (uid, email, owner_name, dog_name, breed, age, bio, photo_url, plan, location)
    VALUES (
      ${session.uid},
      ${session.email},
      ${body.owner_name ?? ""},
      ${body.dog_name},
      ${body.breed},
      ${body.age},
      ${body.bio ?? ""},
      ${body.photo_url ?? ""},
      'chihuahua',
      ${body.location}
    )
    ON CONFLICT (uid) DO UPDATE SET
      dog_name  = EXCLUDED.dog_name,
      breed     = EXCLUDED.breed,
      age       = EXCLUDED.age,
      bio       = EXCLUDED.bio,
      photo_url = EXCLUDED.photo_url,
      location  = EXCLUDED.location,
      owner_name = EXCLUDED.owner_name
  `;
  const rows = await sql`SELECT * FROM users WHERE uid = ${session.uid}`;
  return NextResponse.json(rows[0]);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json();
  await sql`UPDATE users SET plan = ${plan} WHERE uid = ${session.uid}`;
  return NextResponse.json({ ok: true });
}
