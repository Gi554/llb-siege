"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";
import { refreshSite } from "@/lib/revalidate";
import { NEWS_CATEGORIES } from "@/content/types";

export type NewsFormState = { error?: string; fields?: Record<string, string> };

const LABELS: Record<string, string> = {
  title: "Titre",
  category: "Catégorie",
  excerpt: "Résumé",
  body: "Texte de l'article",
  coverId: "Image principale",
  intent: "Action (brouillon ou publication)",
};

const schema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(5, "Le titre doit compter au moins 5 caractères.").max(140),
  category: z.enum(NEWS_CATEGORIES),
  publishedAt: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]),
  dateLabel: z.string().trim().max(60),
  excerpt: z.string().trim().min(10, "Le résumé doit compter au moins 10 caractères.").max(300),
  body: z.string().trim().min(20, "Le texte de l'article doit compter au moins 20 caractères.").max(20000),
  coverId: z.string().min(1, "Choisissez une image principale."),
  intent: z.enum(["draft", "publish"]),
});

const frDate = (iso: string) => {
  const s = new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return s;
};

export async function saveNews(_: NewsFormState, fd: FormData): Promise<NewsFormState> {
  await requireUser();
  const fields = Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
  const parsed = schema.safeParse(fields);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const label = LABELS[String(issue.path[0])] ?? String(issue.path[0]);
    return { error: issue.code === "invalid_type" ? `Le champ « ${label} » est manquant.` : issue.message, fields };
  }
  const d = parsed.data;
  const mediaIds = [...new Set(fd.getAll("mediaIds").map(String))];
  const known = await db.media.count({ where: { id: { in: [d.coverId, ...mediaIds] } } });
  if (known !== new Set([d.coverId, ...mediaIds]).size) return { error: "Une des images choisies n'existe plus.", fields };

  const data = {
    title: d.title,
    category: d.category,
    excerpt: d.excerpt,
    // Normalise paragraphs: one blank line between each.
    body: d.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).join("\n\n"),
    publishedAt: d.publishedAt ? new Date(`${d.publishedAt}T12:00:00`) : null,
    // The label shown on the site: explicit text, else the formatted date.
    dateLabel: d.dateLabel || (d.publishedAt ? frDate(d.publishedAt) : "Date à venir"),
    coverId: d.coverId,
    state: d.intent === "publish" ? "PUBLISHED" : "DRAFT",
  };

  let slug: string;
  if (d.id) {
    ({ slug } = await db.news.update({ where: { id: d.id }, data: { ...data, source: "chantier", media: { set: mediaIds.map((id) => ({ id })) } } }));
  } else {
    slug = await uniqueSlug(d.title, async (s) => !!(await db.news.findUnique({ where: { slug: s } })));
    await db.news.create({ data: { ...data, slug, source: "chantier", media: { connect: mediaIds.map((id) => ({ id })) } } });
  }

  // The article page is cached once generated: refresh its exact URL too.
  refreshSite("/admin/actualites", `/actualites/${slug}`);
  redirect(`/admin/actualites?ok=${d.intent === "publish" ? "publie" : "brouillon"}`);
}

export async function deleteNews(fd: FormData) {
  await requireUser();
  const removed = await db.news.delete({ where: { id: String(fd.get("id")) } }).catch(() => null);
  refreshSite("/admin/actualites", ...(removed ? [`/actualites/${removed.slug}`] : []));
  redirect("/admin/actualites?ok=supprime");
}
