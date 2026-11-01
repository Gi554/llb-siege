"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";
import { refreshSite } from "@/lib/revalidate";

export type StageFormState = { error?: string; fields?: Record<string, string> };

const schema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, "Le titre doit compter au moins 3 caractères.").max(120),
  description: z.string().trim().min(10, "Ajoutez une description d'au moins 10 caractères.").max(2000),
  status: z.enum(["realise", "en-cours", "a-venir"]),
  publishedAt: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]),
  dateLabel: z.string().trim().max(60),
  highlights: z.string().max(2000),
  intent: z.enum(["draft", "publish"]),
});

const LABELS: Record<string, string> = {
  title: "Titre",
  description: "Description",
  status: "Statut",
  publishedAt: "Date",
  dateLabel: "Libellé de date",
  highlights: "Points clés",
  intent: "Action (brouillon ou publication)",
};

const video = z.object({ title: z.string().trim().min(1), src: z.string().trim().url("Lien de vidéo invalide."), poster: z.string().trim() });

export async function saveStage(_: StageFormState, fd: FormData): Promise<StageFormState> {
  await requireUser();
  const parsed = schema.safeParse(Object.fromEntries(fd));
  const fields = Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const label = LABELS[String(issue.path[0])] ?? String(issue.path[0]);
    return { error: issue.code === "invalid_type" ? `Le champ « ${label} » est manquant.` : issue.message, fields };
  }
  const d = parsed.data;

  const mediaIds = fd.getAll("mediaIds").map(String);
  const titles = fd.getAll("videoTitle").map(String);
  const srcs = fd.getAll("videoSrc").map(String);
  const posters = fd.getAll("videoPoster").map(String);
  const videos: z.infer<typeof video>[] = [];
  for (let i = 0; i < titles.length; i++) {
    if (!titles[i].trim() && !srcs[i].trim()) continue;
    const v = video.safeParse({ title: titles[i], src: srcs[i], poster: posters[i] ?? "" });
    if (!v.success) return { error: `Vidéo ${i + 1} : ${v.error.issues[0].message === "Required" ? "titre et lien requis." : v.error.issues[0].message}`, fields };
    videos.push(v.data);
  }

  const data = {
    title: d.title,
    description: d.description,
    status: d.status,
    publishedAt: d.publishedAt ? new Date(`${d.publishedAt}T12:00:00`) : null,
    dateLabel: d.dateLabel || null,
    highlights: d.highlights.split("\n").map((l) => l.trim()).filter(Boolean).join("\n"),
    state: d.intent === "publish" ? "PUBLISHED" : "DRAFT",
  };

  await db.$transaction(async (tx) => {
    const stage = d.id
      ? await tx.stage.update({ where: { id: d.id }, data })
      : await tx.stage.create({
          data: {
            ...data,
            slug: await uniqueSlug(d.title, async (s) => !!(await tx.stage.findUnique({ where: { slug: s } }))),
            order: ((await tx.stage.aggregate({ _max: { order: true } }))._max.order ?? -1) + 1,
            source: "chantier",
          },
        });
    // Pictures: detach the ones removed, attach the selection in the chosen order.
    await tx.media.updateMany({ where: { stageId: stage.id, id: { notIn: mediaIds } }, data: { stageId: null } });
    for (const [order, id] of mediaIds.entries()) await tx.media.update({ where: { id }, data: { stageId: stage.id, order } });
    await tx.video.deleteMany({ where: { stageId: stage.id } });
    if (videos.length) await tx.video.createMany({ data: videos.map((v) => ({ ...v, poster: v.poster || null, stageId: stage.id })) });
  });

  refreshSite("/admin/etapes");
  redirect(`/admin/etapes?ok=${d.intent === "publish" ? "publie" : "brouillon"}`);
}

export async function deleteStage(fd: FormData) {
  await requireUser();
  const id = String(fd.get("id"));
  await db.stage.delete({ where: { id } });
  // Keep positions contiguous (0, 1, 2…) after a removal.
  const rest = await db.stage.findMany({ orderBy: { order: "asc" }, select: { id: true } });
  await db.$transaction(rest.map((s, order) => db.stage.update({ where: { id: s.id }, data: { order } })));
  refreshSite("/admin/etapes");
  redirect("/admin/etapes?ok=supprime");
}

/** Swap a stage with its neighbour in the timeline order. */
export async function moveStage(fd: FormData) {
  await requireUser();
  const id = String(fd.get("id"));
  const dir = fd.get("dir") === "up" ? -1 : 1;
  const all = await db.stage.findMany({ orderBy: { order: "asc" }, select: { id: true } });
  const i = all.findIndex((s) => s.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= all.length) return;
  [all[i], all[j]] = [all[j], all[i]];
  await db.$transaction(all.map((s, order) => db.stage.update({ where: { id: s.id }, data: { order } })));
  refreshSite("/admin/etapes");
}
