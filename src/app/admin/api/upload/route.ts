import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ACCEPTED, MAX_BYTES, storeImage } from "@/lib/storage";
import { refreshSite } from "@/lib/revalidate";

// One picture per request, so the media library can show progress per file.
const fields = z.object({
  album: z.string().trim().max(80).optional().default(""),
  stageId: z.string().optional().default(""),
  espace: z.string().trim().max(40).optional().default("exterieur"),
  kind: z.enum(["photo", "rendu", "plan"]).optional().default("photo"),
  dateLabel: z.string().trim().max(60).optional().default(""),
});

const altFromName = (name: string) =>
  name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 140) || "Photographie du chantier";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Session expirée, reconnectez-vous." }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  if (!ACCEPTED.includes(file.type)) return NextResponse.json({ error: "Format non pris en charge (JPEG, PNG, WebP, AVIF ou TIFF)." }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Fichier trop lourd (20 Mo maximum)." }, { status: 413 });

  const meta = fields.parse(Object.fromEntries([...form.entries()].filter(([k]) => k !== "file")));
  const stage = meta.stageId ? await db.stage.findUnique({ where: { id: meta.stageId } }) : null;

  let stored;
  try {
    stored = await storeImage(Buffer.from(await file.arrayBuffer()));
  } catch {
    return NextResponse.json({ error: "Image illisible ou endommagée." }, { status: 422 });
  }

  const order = stage ? await db.media.count({ where: { stageId: stage.id } }) : 0;
  const media = await db.media.create({
    data: {
      src: stored.src,
      width: stored.width,
      height: stored.height,
      alt: altFromName(file.name),
      kind: meta.kind,
      espace: meta.espace,
      album: meta.album || null,
      dateLabel: meta.dateLabel || null,
      source: meta.kind === "photo" ? "chantier" : "projet",
      stageId: stage?.id ?? null,
      order,
    },
  });

  refreshSite("/admin/mediatheque");
  return NextResponse.json({ id: media.id, src: media.src, alt: media.alt, width: media.width, height: media.height });
}
