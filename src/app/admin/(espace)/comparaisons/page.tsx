import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ConfirmAction, Notice, PageHeader, StatePill } from "@/components/admin/ui";
import ViewpointRow from "@/components/admin/ViewpointRow";
import { deleteComparison } from "./actions";
import { pickerMedia } from "@/lib/picker";

export const metadata: Metadata = { title: "Avant / Après" };
export const dynamic = "force-dynamic";

const MESSAGES: Record<string, string> = {
  publie: "La comparaison est publiée sur la page Avant / Après.",
  brouillon: "La comparaison est enregistrée en brouillon.",
  supprime: "La comparaison a été supprimée.",
  point: "Le point de vue a été mis à jour.",
};

export default async function ComparisonsPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  await requireUser();
  const { ok } = await searchParams;
  const [comparisons, viewpoints, media] = await Promise.all([
    db.comparison.findMany({ orderBy: [{ featured: "desc" }, { updatedAt: "desc" }], include: { before: true, after: true } }),
    db.viewpoint.findMany({ orderBy: { order: "asc" }, include: { render: true } }),
    pickerMedia(),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader
        title="Avant / Après"
        outline="comparaisons"
        actions={
          <Link href="/admin/comparaisons/nouvelle" className="pill h-12 bg-foret px-6 text-[14px] text-blanc hover:bg-foret-2">
            + Nouvelle comparaison
          </Link>
        }
      />
      {ok && MESSAGES[ok] && <Notice>{MESSAGES[ok]}</Notice>}

      <section aria-labelledby="liste" className="space-y-4">
        <h2 id="liste" className="display text-[1.6rem] text-encre">Comparaisons</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {comparisons.map((c) => (
            <li key={c.id} className="overflow-hidden rounded-[24px] bg-blanc">
              <div className="grid grid-cols-2">
                {[c.before, c.after].map((m, i) => (
                  <div key={m.id} className="relative aspect-[4/3] bg-sable">
                    <Image src={m.src} alt={m.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className={m.kind === "plan" ? "bg-blanc object-contain" : "object-cover"} />
                    <span className="absolute bottom-2 left-2 rounded-full bg-encre/70 px-2 py-0.5 text-[10px] text-blanc">{i === 0 ? c.beforeLabel : c.afterLabel}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 p-5">
                <p className="mr-auto min-w-0 truncate font-display text-[1.15rem] font-medium text-encre">{c.title}</p>
                {c.featured && <span className="rounded-full bg-terracotta px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-blanc">À la une</span>}
                {c.source === "demo" && <span className="text-[12px] text-terracotta">exemple</span>}
                <StatePill state={c.state} />
                <Link href={`/admin/comparaisons/${c.id}`} className="rounded-full border border-encre/20 px-4 py-2 text-[13px] hover:border-foret">
                  Modifier
                </Link>
                <ConfirmAction action={deleteComparison} label="Supprimer" hidden={{ id: c.id }} />
              </div>
            </li>
          ))}
        </ul>
        {comparisons.length === 0 && <Notice>Aucune comparaison pour le moment.</Notice>}
      </section>

      <section aria-labelledby="points" className="space-y-4">
        <div>
          <h2 id="points" className="display text-[1.6rem] text-encre">Points de vue suivis</h2>
          <p className="mono mt-2 max-w-2xl text-[13px] text-encre/65">
            Chaque perspective du dossier est un angle à reproduire sur le chantier. Associez la photo prise depuis le même
            endroit : elle remplace « Photo à venir » sur la page publique, avec un curseur de comparaison. Seules les images de
            type « Photo du chantier » sont proposées.
          </p>
        </div>
        <ol className="space-y-4">
          {viewpoints.map((vp, i) => (
            <ViewpointRow
              key={vp.id}
              index={i}
              media={media}
              vp={{ id: vp.id, title: vp.title, espace: vp.espace, renderSrc: vp.render.src, renderAlt: vp.render.alt, photoId: vp.photoId ?? "", photoDate: vp.photoDate ?? "" }}
            />
          ))}
        </ol>
      </section>
    </div>
  );
}
