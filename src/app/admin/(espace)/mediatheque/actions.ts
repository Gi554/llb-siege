"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { removeUpload } from "@/lib/storage";
import { refreshSite } from "@/lib/revalidate";

export type MediaFormState = { ok?: string; error?: string };

const schema = z.object({
  id: z.string().min(1),
  alt: z.string().trim().min(3, "La description doit compter au moins 3 caractères.").max(200),
  caption: z.string().trim().max(200),
  album: z.string().trim().max(80),
  stageId: z.string(),
  espace: z.string().trim().min(1).max(40),
  kind: z.enum(["photo", "rendu", "plan"]),
  dateLabel: z.string().trim().max(60),
  inGallery: z.string().optional(),
});

export async function updateMedia(_: MediaFormState, fd: FormData): Promise<MediaFormState> {
  await requireUser();
  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;
  const current = await db.media.findUnique({ where: { id: d.id } });
  if (!current) return { error: "Ce média n'existe plus." };

  const stageChanged = (current.stageId ?? "") !== d.stageId;
  await db.media.update({
    where: { id: d.id },
    data: {
      alt: d.alt,
      caption: d.caption || null,
      album: d.album || null,
      espace: d.espace,
      kind: d.kind,
      dateLabel: d.dateLabel || null,
      inGallery: d.inGallery === "on",
      stageId: d.stageId || null,
      // Joining a stage puts the picture at the end of its sequence.
      ...(stageChanged && d.stageId ? { order: await db.media.count({ where: { stageId: d.stageId } }) } : {}),
    },
  });
  refreshSite("/admin/mediatheque", "/admin/etapes");
  return { ok: "Modifications enregistrées." };
}

/** Where a picture is used, in words (empty when it can be deleted). */
async function usages(id: string) {
  const m = await db.media.findUnique({
    where: { id },
    include: { _count: { select: { newsCover: true, news: true, comparisonsFrom: true, comparisonsTo: true, viewpointRender: true, viewpointPhoto: true } } },
  });
  if (!m) return [];
  const c = m._count;
  const out: string[] = [];
  if (c.newsCover + c.news) out.push("une actualité");
  if (c.comparisonsFrom + c.comparisonsTo) out.push("une comparaison avant / après");
  if (c.viewpointRender + c.viewpointPhoto) out.push("un point de vue suivi");
  return out;
}

export async function deleteMedia(_: MediaFormState, fd: FormData): Promise<MediaFormState> {
  await requireUser();
  const id = String(fd.get("id"));
  const used = await usages(id);
  if (used.length) return { error: `Impossible de supprimer : cette image est utilisée dans ${used.join(", ")}.` };
  const m = await db.media.delete({ where: { id } }).catch(() => null);
  if (m) await removeUpload(m.src);
  refreshSite("/admin/mediatheque", "/admin/etapes");
  return { ok: "deleted" };
}

const bulk = z.object({ ids: z.array(z.string()).min(1), stageId: z.string().optional(), album: z.string().trim().max(80).optional() });

/** Applies a stage and/or an album to several pictures at once. */
export async function bulkUpdate(_: MediaFormState, fd: FormData): Promise<MediaFormState> {
  await requireUser();
  const parsed = bulk.safeParse({
    ids: fd.getAll("ids").map(String),
    stageId: fd.get("stageId") === "__keep" ? undefined : String(fd.get("stageId") ?? ""),
    album: fd.get("album") ? String(fd.get("album")) : undefined,
  });
  if (!parsed.success) return { error: "Sélectionnez au moins une image." };
  const { ids, stageId, album } = parsed.data;

  let next = stageId ? await db.media.count({ where: { stageId } }) : 0;
  for (const id of ids) {
    await db.media.update({
      where: { id },
      data: {
        ...(stageId !== undefined ? { stageId: stageId || null, ...(stageId ? { order: next++ } : {}) } : {}),
        ...(album !== undefined ? { album: album || null } : {}),
      },
    });
  }
  refreshSite("/admin/mediatheque", "/admin/etapes");
  return { ok: `${ids.length} image${ids.length > 1 ? "s" : ""} mise${ids.length > 1 ? "s" : ""} à jour.` };
}
