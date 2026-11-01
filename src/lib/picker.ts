import "server-only";
import { db } from "@/lib/db";
import type { PickerMedia } from "@/components/admin/MediaPicker";

export async function pickerMedia(): Promise<PickerMedia[]> {
  const rows = await db.media.findMany({ orderBy: [{ createdAt: "desc" }, { order: "asc" }], include: { stage: { select: { title: true } } } });
  return rows.map((m) => ({ id: m.id, src: m.src, alt: m.alt, caption: m.caption, kind: m.kind, stageTitle: m.stage?.title ?? null }));
}
