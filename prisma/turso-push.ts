// Creates the tables on the hosted libSQL database (Turso) from the Prisma
// schema. Prisma Migrate cannot talk to libSQL directly, so the SQL comes
// from `prisma migrate diff`. Run with `npm run db:turso`.
import { execSync } from "node:child_process";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
if (!url) throw new Error("TURSO_DATABASE_URL manquant (fichier .env.turso).");
const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });

async function main() {
  const existing = await client.execute("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'User'");
  if (existing.rows.length) {
    console.log("Tables déjà présentes : rien à créer.");
    return;
  }
  const sql = execSync("npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script", { encoding: "utf8" });
  await client.executeMultiple(sql);
  console.log("Tables créées.");
}

main().finally(() => client.close());
