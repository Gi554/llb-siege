"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { refreshSite } from "@/lib/revalidate";
import { SETTINGS } from "@/content/settings";

export type SettingsState = { ok?: string; error?: string };

export async function saveSettings(_: SettingsState, fd: FormData): Promise<SettingsState> {
  await requireUser();
  const values: { key: string; value: string }[] = [];
  for (const s of SETTINGS) {
    if (s.key === "announcement.enabled") {
      values.push({ key: s.key, value: fd.get(s.key) === "on" ? "1" : "0" });
      continue;
    }
    const value = String(fd.get(s.key) ?? "").trim();
    if (value.length > s.max) return { error: `« ${s.label} » (${s.group}) dépasse ${s.max} caractères.` };
    // Titles and texts cannot be emptied (the page would show a hole); the picture can.
    if (!value && s.key !== "home.heroImage") return { error: `« ${s.label} » (${s.group}) ne peut pas être vide.` };
    values.push({ key: s.key, value });
  }
  const phone = values.find((v) => v.key === "don.whatsapp")!.value.replace(/\D/g, "");
  if (phone.length < 8 || phone.length > 15) return { error: "Le numéro WhatsApp doit contenir entre 8 et 15 chiffres." };
  const image = values.find((v) => v.key === "home.heroImage")!.value;
  if (image && !(await db.media.findUnique({ where: { id: image } }))) return { error: "L'image principale choisie n'existe plus." };

  await db.$transaction(values.map((v) => db.setting.upsert({ where: { key: v.key }, update: { value: v.value }, create: v })));
  // The header (announcement) is in the shared layout: refresh every page.
  revalidatePath("/", "layout");
  refreshSite("/admin/contenus", "/projet");
  return { ok: "Les textes sont enregistrés et publiés sur le site." };
}

export async function resetSettings(): Promise<SettingsState> {
  await requireUser();
  await db.setting.deleteMany({ where: { key: { in: SETTINGS.map((s) => s.key) } } });
  revalidatePath("/", "layout");
  refreshSite("/admin/contenus", "/projet");
  return { ok: "Les textes d'origine sont rétablis." };
}
