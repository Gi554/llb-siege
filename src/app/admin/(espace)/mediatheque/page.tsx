import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { galleryEspaces } from "@/content/galerie";
import { PageHeader } from "@/components/admin/ui";
import Uploader from "@/components/admin/media/Uploader";
import MediaLibrary from "@/components/admin/media/MediaLibrary";

export const metadata: Metadata = { title: "Médiathèque" };
export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requireUser();
  const [media, stages] = await Promise.all([
    db.media.findMany({ orderBy: [{ createdAt: "desc" }, { order: "asc" }], include: { stage: { select: { title: true } } } }),
    db.stage.findMany({ orderBy: { order: "asc" }, select: { id: true, title: true } }),
  ]);
  const albums = [...new Set(media.map((m) => m.album).filter((a): a is string => !!a))].sort((a, b) => a.localeCompare(b, "fr"));
  const stageOptions = stages.map((s) => ({ value: s.id, label: s.title }));
  const espaces = galleryEspaces.map((e) => ({ value: e.slug, label: e.label }));

  return (
    <div className="space-y-8">
      <PageHeader title="Médiathèque" outline="photographies" />
      <Uploader stages={stageOptions} espaces={espaces} albums={albums} />
      <MediaLibrary
        stages={stageOptions}
        espaces={espaces}
        albums={albums}
        media={media.map((m) => ({
          id: m.id,
          src: m.src,
          alt: m.alt,
          caption: m.caption,
          width: m.width,
          height: m.height,
          kind: m.kind,
          espace: m.espace,
          album: m.album,
          dateLabel: m.dateLabel,
          inGallery: m.inGallery,
          stageId: m.stageId,
          stageTitle: m.stage?.title ?? null,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
