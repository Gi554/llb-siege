import "server-only";
import type { PrismaClient } from "@prisma/client";
import { createPrismaClient } from "@/lib/prisma";

// One client per process (avoids exhausting connections during dev reloads).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
