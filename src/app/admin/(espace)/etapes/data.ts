import "server-only";
import { db } from "@/lib/db";
import type { PickableMedia } from "@/components/admin/StageForm";

/** All pictures, with the stage each one currently belongs to. */
export async function pickableMedia(): Promise<PickableMedia[]> {
  const rows = await db.media.findMany({ orderBy: [{ createdAt: "desc" }, { order: "asc" }], include: { stage: { select: { title: true } } } });
  return rows.map((m) => ({ id: m.id, src: m.src, alt: m.alt, caption: m.caption, stageId: m.stageId, stageTitle: m.stage?.title ?? null }));
}
