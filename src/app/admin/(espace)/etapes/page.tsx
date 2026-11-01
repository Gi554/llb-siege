import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL, type StageStatus } from "@/content/types";
import { ConfirmAction, Notice, PageHeader, StatePill } from "@/components/admin/ui";
import { deleteStage, moveStage } from "./actions";

export const metadata: Metadata = { title: "Étapes du chantier" };
export const dynamic = "force-dynamic";

const MESSAGES: Record<string, string> = {
  publie: "L'étape est publiée sur le site.",
  brouillon: "L'étape est enregistrée en brouillon.",
  supprime: "L'étape a été supprimée.",
};

export default async function StagesPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  await requireUser();
  const { ok } = await searchParams;
  const stages = await db.stage.findMany({
    orderBy: { order: "asc" },
    include: { media: { orderBy: { order: "asc" }, take: 1 }, _count: { select: { media: true, videos: true } } },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Étapes du chantier"
        outline="chronologie"
        actions={
          <Link href="/admin/etapes/nouvelle" className="pill h-12 bg-foret px-6 text-[14px] text-blanc hover:bg-foret-2">
            + Nouvelle étape
          </Link>
        }
      />
      {ok && MESSAGES[ok] && <Notice>{MESSAGES[ok]}</Notice>}

      <ol className="space-y-3">
        {stages.map((s, i) => (
          <li key={s.id} className="flex flex-col gap-4 rounded-[24px] bg-blanc p-4 sm:flex-row sm:items-center md:p-5">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                {(["up", "down"] as const).map((dir) => (
                  <form key={dir} action={moveStage}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="dir" value={dir} />
                    <button
                      type="submit"
                      disabled={(dir === "up" && i === 0) || (dir === "down" && i === stages.length - 1)}
                      aria-label={`${dir === "up" ? "Monter" : "Descendre"} l'étape ${s.title}`}
                      className="grid h-7 w-7 place-items-center rounded-full text-encre/60 hover:bg-lin hover:text-encre disabled:opacity-25"
                    >
                      <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${dir === "down" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M6 15l6-6 6 6" />
                      </svg>
                    </button>
                  </form>
                ))}
              </div>
              <span className="font-mono text-[13px] tabular-nums text-encre/45">{String(i + 1).padStart(2, "0")}</span>
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-lin">
                {s.media[0] && <Image src={s.media[0].src} alt="" fill sizes="56px" className="object-cover" />}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[1.2rem] font-medium text-encre">{s.title}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-encre/60">
                <span className={s.status === "realise" ? "text-foret" : s.status === "en-cours" ? "text-terracotta" : ""}>
                  {STATUS_LABEL[s.status as StageStatus]}
                </span>
                <span>{s.publishedAt ? s.publishedAt.toLocaleDateString("fr-FR") : s.dateLabel ?? "Sans date"}</span>
                <span>
                  {s._count.media} photo{s._count.media > 1 ? "s" : ""} · {s._count.videos} vidéo{s._count.videos > 1 ? "s" : ""}
                </span>
                {s.source === "demo" && <span className="text-terracotta">exemple</span>}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatePill state={s.state} />
              <Link href={`/admin/etapes/${s.id}`} className="rounded-full border border-encre/20 px-4 py-2 text-[13px] hover:border-foret">
                Modifier
              </Link>
              <ConfirmAction action={deleteStage} label="Supprimer" hidden={{ id: s.id }} />
            </div>
          </li>
        ))}
      </ol>
      {stages.length === 0 && <Notice>Aucune étape pour le moment. Commencez par en créer une.</Notice>}
    </div>
  );
}
