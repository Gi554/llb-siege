"use server";

import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export type UserFormState = { ok?: string; error?: string; password?: string; email?: string };

const ROLE = z.enum(["ADMIN", "EDITOR"]);
const MIN_PASSWORD = 10;

/** Readable temporary password, shown once to the administrator. */
const tempPassword = () => randomBytes(9).toString("base64url");

/** Refuses a change that would leave the site without an active administrator. */
async function keepsAnAdmin(changedId: string, next: { role?: string; active?: boolean; deleted?: boolean }) {
  const admins = await db.user.findMany({ where: { role: "ADMIN", active: true }, select: { id: true } });
  const remaining = admins.filter((a) => a.id !== changedId).length;
  const stillAdmin = !next.deleted && (next.role ?? "ADMIN") === "ADMIN" && next.active !== false;
  return remaining > 0 || (stillAdmin && admins.some((a) => a.id === changedId));
}

const createSchema = z.object({
  name: z.string().trim().min(2, "Indiquez le nom de la personne.").max(80),
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide."),
  role: ROLE,
});

export async function createUser(_: UserFormState, fd: FormData): Promise<UserFormState> {
  await requireUser("ADMIN");
  const parsed = createSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;
  if (await db.user.findUnique({ where: { email: d.email } })) return { error: "Un compte existe déjà avec cette adresse e-mail." };

  const password = tempPassword();
  await db.user.create({ data: { ...d, passwordHash: await bcrypt.hash(password, 12) } });
  revalidatePath("/admin/utilisateurs");
  return { ok: `Compte créé pour ${d.name}.`, password, email: d.email };
}

const updateSchema = z.object({ id: z.string().min(1), name: z.string().trim().min(2).max(80), role: ROLE, active: z.string().optional() });

export async function updateUser(_: UserFormState, fd: FormData): Promise<UserFormState> {
  const me = await requireUser("ADMIN");
  const parsed = updateSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: "Nom invalide (2 caractères minimum)." };
  const d = parsed.data;
  const active = d.active === "on";
  if (d.id === me.id && (!active || d.role !== "ADMIN")) return { error: "Vous ne pouvez pas retirer vos propres droits d'administrateur ni désactiver votre compte." };
  if (!(await keepsAnAdmin(d.id, { role: d.role, active }))) return { error: "Le site doit garder au moins un administrateur actif." };

  await db.user.update({ where: { id: d.id }, data: { name: d.name, role: d.role, active } });
  revalidatePath("/admin/utilisateurs");
  return { ok: "Modifications enregistrées." };
}

export async function resetPassword(_: UserFormState, fd: FormData): Promise<UserFormState> {
  await requireUser("ADMIN");
  const user = await db.user.findUnique({ where: { id: String(fd.get("id")) } });
  if (!user) return { error: "Ce compte n'existe plus." };
  const password = tempPassword();
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(password, 12) } });
  return { ok: `Nouveau mot de passe pour ${user.name}.`, password, email: user.email };
}

export async function deleteUser(_: UserFormState, fd: FormData): Promise<UserFormState> {
  const me = await requireUser("ADMIN");
  const id = String(fd.get("id"));
  if (id === me.id) return { error: "Vous ne pouvez pas supprimer votre propre compte." };
  if (!(await keepsAnAdmin(id, { deleted: true }))) return { error: "Le site doit garder au moins un administrateur actif." };
  await db.user.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/utilisateurs");
  return { ok: "Compte supprimé." };
}

const accountSchema = z
  .object({
    name: z.string().trim().min(2, "Indiquez votre nom.").max(80),
    current: z.string(),
    password: z.string(),
    confirm: z.string(),
  })
  .refine((d) => !d.password || d.password.length >= MIN_PASSWORD, { message: `Le nouveau mot de passe doit compter au moins ${MIN_PASSWORD} caractères.` })
  .refine((d) => d.password === d.confirm, { message: "Les deux mots de passe ne correspondent pas." });

/** Any user: update own name and, with the current password, own password. */
export async function updateAccount(_: UserFormState, fd: FormData): Promise<UserFormState> {
  const me = await requireUser();
  const parsed = accountSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  const data: { name: string; passwordHash?: string } = { name: d.name };
  if (d.password) {
    const user = await db.user.findUniqueOrThrow({ where: { id: me.id } });
    if (!(await bcrypt.compare(d.current, user.passwordHash))) return { error: "Le mot de passe actuel est incorrect." };
    data.passwordHash = await bcrypt.hash(d.password, 12);
  }
  await db.user.update({ where: { id: me.id }, data });
  revalidatePath("/admin", "layout");
  return { ok: d.password ? "Nom et mot de passe mis à jour." : "Nom mis à jour." };
}
