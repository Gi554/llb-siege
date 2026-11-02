"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ACCEPTED, removeUpload, storeImage } from "@/lib/storage";
import { refreshSite } from "@/lib/revalidate";

// `fields` gives the typed values back: React empties the form after an action.
export type PartnerFormState = { error?: string; fields?: { name: string; url: string; visible: boolean } };

const MAX_LOGO = 4 * 1024 * 1024;

const schema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Le nom doit compter au moins 2 caractères.").max(120),
  url: z
    .string()
    .trim()
    .max(300)
    .transform((u) => (u && !/^https?:\/\//i.test(u) ? `https://${u}` : u))
    .refine((u) => !u || z.string().url().safeParse(u).success, "L'adresse du site n'est pas valide."),
  visible: z.string().optional(),
});

export async function savePartner(_: PartnerFormState, fd: FormData): Promise<PartnerFormState> {
  await requireUser();
  const fields = { name: String(fd.get("name") ?? ""), url: String(fd.get("url") ?? ""), visible: fd.get("visible") === "on" };
  const parsed = schema.safeParse({
    id: fd.get("id") || undefined,
    name: fd.get("name") ?? "",
    url: fd.get("url") ?? "",
    visible: fd.get("visible") ?? undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message, fields };
  const d = parsed.data;

  const existing = d.id ? await db.partner.findUnique({ where: { id: d.id } }) : null;
  if (d.id && !existing) return { error: "Ce partenaire n'existe plus.", fields };

  const file = fd.get("logo");
  const hasFile = file instanceof File && file.size > 0;
  if (!hasFile && !existing) return { error: "Ajoutez le logo du partenaire.", fields };

  let logo: { logo: string; logoWidth: number; logoHeight: number } | null = null;
  if (hasFile) {
    if (![...ACCEPTED, "image/svg+xml"].includes(file.type)) return { error: "Format de logo non pris en charge (PNG, JPEG, WebP, SVG).", fields };
    if (file.size > MAX_LOGO) return { error: "Logo trop lourd (4 Mo maximum).", fields };
    try {
      const stored = await storeImage(Buffer.from(await file.arrayBuffer()), { maxEdge: 800, density: 300 });
      logo = { logo: stored.src, logoWidth: stored.width, logoHeight: stored.height };
    } catch {
      return { error: "Logo illisible ou endommagé.", fields };
    }
  }

  const data = { name: d.name, url: d.url || null, visible: d.visible === "on" };
  if (existing) {
    await db.partner.update({ where: { id: existing.id }, data: { ...data, ...logo } });
    if (logo) await removeUpload(existing.logo);
  } else {
    const order = await db.partner.count();
    await db.partner.create({ data: { ...data, ...logo!, order } });
  }

  refreshSite("/admin/partenaires");
  redirect(`/admin/partenaires?ok=${existing ? "modifie" : "ajoute"}`);
}

export async function deletePartner(fd: FormData) {
  await requireUser();
  const partner = await db.partner.delete({ where: { id: String(fd.get("id")) } }).catch(() => null);
  if (partner) await removeUpload(partner.logo);
  refreshSite("/admin/partenaires");
  redirect("/admin/partenaires?ok=supprime");
}

/** Swaps a partner with its neighbour in the home page order. */
export async function movePartner(fd: FormData) {
  await requireUser();
  const all = await db.partner.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  const i = all.findIndex((p) => p.id === fd.get("id"));
  const j = fd.get("dir") === "up" ? i - 1 : i + 1;
  if (i >= 0 && j >= 0 && j < all.length) {
    [all[i], all[j]] = [all[j], all[i]];
    await db.$transaction(all.map((p, k) => db.partner.update({ where: { id: p.id }, data: { order: k } })));
    refreshSite("/admin/partenaires");
  }
  redirect("/admin/partenaires");
}
