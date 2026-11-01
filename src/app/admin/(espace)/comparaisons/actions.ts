"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";
import { refreshSite } from "@/lib/revalidate";

export type CompareFormState = { error?: string; fields?: Record<string, string> };

const LABELS: Record<string, string> = {
  title: "Titre",
  beforeId: "Image « avant »",
  afterId: "Image « après »",
  beforeLabel: "Libellé « avant »",
  afterLabel: "Libellé « après »",
  intent: "Action (brouillon ou publication)",
};

const schema = z
  .object({
    id: z.string().optional(),
    title: z.string().trim().min(3, "Le titre doit compter au moins 3 caractères.").max(120),
    beforeId: z.string().min(1, "Choisissez l'image « avant ».").max(40),
    afterId: z.string().min(1, "Choisissez l'image « après ».").max(40),
    beforeLabel: z.string().trim().min(1, "Donnez un libellé à l'image « avant ».").max(60),
    afterLabel: z.string().trim().min(1, "Donnez un libellé à l'image « après ».").max(60),
    beforeDate: z.string().trim().max(60),
    afterDate: z.string().trim().max(60),
    featured: z.string().optional(),
    intent: z.enum(["draft", "publish"]),
  })
  .refine((d) => d.beforeId !== d.afterId, { message: "Choisissez deux images différentes.", path: ["afterId"] });

export async function saveComparison(_: CompareFormState, fd: FormData): Promise<CompareFormState> {
  await requireUser();
  const fields = Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
  const parsed = schema.safeParse(fields);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const label = LABELS[String(issue.path[0])] ?? String(issue.path[0]);
    return { error: issue.code === "invalid_type" ? `Le champ « ${label} » est manquant.` : issue.message, fields };
  }
  const d = parsed.data;
  const found = await db.media.count({ where: { id: { in: [d.beforeId, d.afterId] } } });
  if (found !== 2) return { error: "Une des images choisies n'existe plus.", fields };

  const featured = d.featured === "on";
  const data = {
    title: d.title,
    beforeId: d.beforeId,
    afterId: d.afterId,
    beforeLabel: d.beforeLabel,
    afterLabel: d.afterLabel,
    beforeDate: d.beforeDate || null,
    afterDate: d.afterDate || null,
    featured,
    state: d.intent === "publish" ? "PUBLISHED" : "DRAFT",
  };

  await db.$transaction(async (tx) => {
    // Only one comparison is featured at the top of the public page.
    if (featured) await tx.comparison.updateMany({ where: { featured: true, ...(d.id ? { id: { not: d.id } } : {}) }, data: { featured: false } });
    if (d.id) {
      // A demo comparison edited by the team becomes real content.
      await tx.comparison.update({ where: { id: d.id }, data: { ...data, source: "chantier" } });
    } else {
      const slug = await uniqueSlug(d.title, async (s) => !!(await tx.comparison.findUnique({ where: { slug: s } })));
      await tx.comparison.create({ data: { ...data, slug, source: "chantier" } });
    }
  });

  refreshSite("/admin/comparaisons");
  redirect(`/admin/comparaisons?ok=${d.intent === "publish" ? "publie" : "brouillon"}`);
}

export async function deleteComparison(fd: FormData) {
  await requireUser();
  await db.comparison.delete({ where: { id: String(fd.get("id")) } }).catch(() => null);
  refreshSite("/admin/comparaisons");
  redirect("/admin/comparaisons?ok=supprime");
}

const viewpointSchema = z.object({
  id: z.string().min(1),
  photoId: z.string().max(40),
  photoDate: z.string().trim().max(60),
});

/** Attaches (or removes) the site photo taken from a viewpoint's angle. */
export async function saveViewpoint(fd: FormData) {
  await requireUser();
  const d = viewpointSchema.parse(Object.fromEntries(fd));
  await db.viewpoint.update({
    where: { id: d.id },
    data: { photoId: d.photoId || null, photoDate: d.photoId ? d.photoDate || null : null },
  });
  refreshSite("/admin/comparaisons");
  redirect("/admin/comparaisons?ok=point");
}
