import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

/**
 * Local SQLite file by default; a hosted libSQL database (Turso) when
 * TURSO_DATABASE_URL is set, for hosts without a persistent disk.
 * Dates keep the same storage format as the local engine, so a database
 * file can move from one to the other unchanged.
 */
export function createPrismaClient() {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) return new PrismaClient();
  const adapter = new PrismaLibSQL({ url, authToken: process.env.TURSO_AUTH_TOKEN }, { timestampFormat: "unixepoch-ms" });
  return new PrismaClient({ adapter });
}
