// Creates the tables on the hosted libSQL database (Turso) from the Prisma
// schema. Prisma Migrate cannot talk to libSQL directly, so the SQL comes
// from `prisma migrate diff`. Run with `npm run db:turso`.
// Safe to run again: tables and indexes that already exist are left as they
// are, so only new models are added (new columns on an existing model need a
// manual ALTER TABLE).
import { execSync } from "node:child_process";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
if (!url) throw new Error("TURSO_DATABASE_URL manquant (fichier .env.turso).");
const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });

async function main() {
  const before = await client.execute("SELECT name FROM sqlite_master WHERE type = 'table'");
  const sql = execSync("npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script", { encoding: "utf8" })
    .replace(/CREATE TABLE "/g, 'CREATE TABLE IF NOT EXISTS "')
    .replace(/CREATE (UNIQUE )?INDEX "/g, 'CREATE $1INDEX IF NOT EXISTS "');
  await client.executeMultiple(sql);
  const after = await client.execute("SELECT name FROM sqlite_master WHERE type = 'table'");
  const known = new Set(before.rows.map((r) => r.name));
  const created = after.rows.map((r) => String(r.name)).filter((n) => !known.has(n));
  console.log(created.length ? `Tables créées : ${created.join(", ")}.` : "Tables déjà présentes : rien à créer.");
}

main().finally(() => client.close());
