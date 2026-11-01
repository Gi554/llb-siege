"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { endSession, startSession } from "@/lib/auth";

export type LoginState = { error?: string };

// Basic brute-force brake: 5 failed attempts per email lock it for 15 minutes.
const failures = new Map<string, { count: number; until: number }>();
const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
  suite: z.string().optional(),
});

export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Adresse e-mail ou mot de passe invalide." };
  const { email, password, suite } = parsed.data;

  const f = failures.get(email);
  if (f && f.count >= MAX_FAILURES && f.until > Date.now()) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  const user = await db.user.findUnique({ where: { email } });
  const ok = !!user && user.active && (await bcrypt.compare(password, user.passwordHash));
  if (!ok || !user) {
    const count = (f && f.until > Date.now() ? f.count : 0) + 1;
    failures.set(email, { count, until: Date.now() + LOCK_MS });
    return { error: "Adresse e-mail ou mot de passe invalide." };
  }

  failures.delete(email);
  await startSession({ id: user.id, name: user.name, email: user.email, role: user.role === "ADMIN" ? "ADMIN" : "EDITOR" });
  // Only follow internal admin paths after login.
  redirect(suite && /^\/admin(\/[\w\-/]*)?$/.test(suite) ? suite : "/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/connexion");
}
