import { neon } from "@neondatabase/serverless";

// sql is a tagged template literal that runs queries against Neon Postgres
export const sql = neon(process.env.DATABASE_URL!);

export type DogProfile = {
  uid: string;
  email: string;
  owner_name: string;
  dog_name: string;
  breed: string;
  age: number;
  bio: string;
  photo_url: string;
  plan: "chihuahua" | "labrador" | "mastiff";
  location: string;
  created_at: string;
};

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      uid         TEXT PRIMARY KEY,
      email       TEXT NOT NULL,
      owner_name  TEXT NOT NULL DEFAULT '',
      dog_name    TEXT NOT NULL DEFAULT '',
      breed       TEXT NOT NULL DEFAULT '',
      age         INTEGER NOT NULL DEFAULT 0,
      bio         TEXT NOT NULL DEFAULT '',
      photo_url   TEXT NOT NULL DEFAULT '',
      plan        TEXT NOT NULL DEFAULT 'chihuahua',
      location    TEXT NOT NULL DEFAULT '',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
