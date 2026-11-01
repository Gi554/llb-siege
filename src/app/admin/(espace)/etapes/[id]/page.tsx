import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PageHeader, StatePill } from "@/components/admin/ui";
import StageForm from "@/components/admin/StageForm";
import { pickableMedia } from "../data";

export const metadata: Metadata = { title: "Modifier une étape" };
export const dynamic = "force-dynamic";

export default async function EditStagePage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const stage = await db.stage.findUnique({ where: { id }, include: { media: { orderBy: { order: "asc" } }, videos: true } });
  if (!stage) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        title={stage.title}
        back={{ href: "/admin/etapes", label: "Étapes du chantier" }}
        actions={
          <>
            <StatePill state={stage.state} />
            {stage.state === "PUBLISHED" && (
              <Link href={`/chantier#${stage.slug}`} target="_blank" className="rounded-full border border-encre/20 px-4 py-2 text-[13px] hover:border-foret">
                Voir sur le site ↗
              </Link>
            )}
          </>
        }
      />
      <StageForm
        media={await pickableMedia()}
        values={{
          id: stage.id,
          title: stage.title,
          description: stage.description,
          status: stage.status,
          publishedAt: stage.publishedAt ? stage.publishedAt.toISOString().slice(0, 10) : "",
          dateLabel: stage.dateLabel ?? "",
          highlights: stage.highlights,
          mediaIds: stage.media.map((m) => m.id),
          videos: stage.videos.map((v) => ({ title: v.title, src: v.src, poster: v.poster ?? "" })),
        }}
      />
    </div>
  );
}
