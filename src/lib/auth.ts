import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { readSession, SESSION_COOKIE, SESSION_DAYS, signSession, type SessionUser } from "@/lib/session";

export async function startSession(user: SessionUser) {
  (await cookies()).set(SESSION_COOKIE, await signSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Current user, re-checked against the database (deactivated accounts lose access). */
export async function currentUser(): Promise<SessionUser | null> {
  const session = await readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const user = await db.user.findUnique({ where: { id: session.id } });
  if (!user || !user.active) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role === "ADMIN" ? "ADMIN" : "EDITOR" };
}

/** Use at the top of every admin page and server action. */
export async function requireUser(role?: "ADMIN") {
  const user = await currentUser();
  if (!user) redirect("/admin/connexion");
  if (role && user.role !== role) redirect("/admin?refus=1");
  return user;
}
