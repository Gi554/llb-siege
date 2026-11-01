import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { STATUS_LABEL, type StageStatus } from "@/content/types";

export const metadata: Metadata = { title: "Tableau de bord" };
export const dynamic = "force-dynamic";

const fmt = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ refus?: string }> }) {
  const user = await requireUser();
  const { refus } = await searchParams;

  const [stages, photos, renders, videos, newsPublished, drafts, recentStages, recentNews, draftStages, draftNews, draftComparisons] = await Promise.all([
    db.stage.findMany({ where: { state: "PUBLISHED" }, orderBy: { order: "asc" }, select: { title: true, status: true, dateLabel: true } }),
    db.media.count({ where: { kind: "photo" } }),
    db.media.count({ where: { kind: { in: ["rendu", "plan"] } } }),
    db.video.count(),
    db.news.count({ where: { state: "PUBLISHED" } }),
    Promise.all([db.stage.count({ where: { state: "DRAFT" } }), db.news.count({ where: { state: "DRAFT" } }), db.comparison.count({ where: { state: "DRAFT" } })]),
    db.stage.findMany({ where: { state: "PUBLISHED" }, orderBy: { updatedAt: "desc" }, take: 4, include: { media: { take: 1, orderBy: { order: "asc" } } } }),
    db.news.findMany({ where: { state: "PUBLISHED" }, orderBy: { updatedAt: "desc" }, take: 4, include: { cover: true } }),
    db.stage.findMany({ where: { state: "DRAFT" }, orderBy: { updatedAt: "desc" }, take: 5 }),
    db.news.findMany({ where: { state: "DRAFT" }, orderBy: { updatedAt: "desc" }, take: 5 }),
    db.comparison.findMany({ where: { state: "DRAFT" }, orderBy: { updatedAt: "desc" }, take: 5 }),
  ]);

  const count = (st: StageStatus) => stages.filter((s) => s.status === st).length;
  const current = stages.find((s) => s.status === "en-cours") ?? [...stages].reverse().find((s) => s.status === "realise");
  const draftTotal = drafts.reduce((a, b) => a + b, 0);
  const recent = [
    ...recentStages.map((s) => ({ key: `s-${s.id}`, type: "Étape", title: s.title, date: s.updatedAt, img: s.media[0]?.src })),
    ...recentNews.map((n) => ({ key: `n-${n.id}`, type: "Actualité", title: n.title, date: n.updatedAt, img: n.cover.src })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
  const draftItems = [
    ...draftStages.map((s) => ({ key: `s-${s.id}`, type: "Étape", title: s.title, date: s.updatedAt })),
    ...draftNews.map((n) => ({ key: `n-${n.id}`, type: "Actualité", title: n.title, date: n.updatedAt })),
    ...draftComparisons.map((c) => ({ key: `c-${c.id}`, type: "Comparaison", title: c.title, date: c.updatedAt })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const stats = [
    { label: "Photos du chantier", value: photos },
    { label: "Rendus et plans", value: renders },
    { label: "Vidéos", value: videos },
    { label: "Actualités publiées", value: newsPublished },
    { label: "Brouillons", value: draftTotal },
  ];

  return (
    <div className="space-y-10">
      {refus && (
        <p role="alert" className="rounded-2xl bg-terracotta/10 px-5 py-3 text-[14px] text-argile">
          Cette section est réservée aux administrateurs.
        </p>
      )}

      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[13px] text-encre/60">{fmt(new Date())}</p>
          <h1 className="display mt-2 text-[clamp(2.4rem,4vw,3.4rem)] text-encre">Bonjour {user.name.split(" ")[0]}.</h1>
        </div>
        <p className="outline-text text-[clamp(3rem,6vw,5rem)] leading-none text-sauge [--stroke:1.5px]" aria-hidden="true">
          tableau de bord
        </p>
      </header>

      {/* Project overview */}
      <section aria-labelledby="vue" className="grid overflow-hidden rounded-[28px] bg-foret text-blanc md:grid-cols-[1.2fr_1fr]">
        <div className="p-7 md:p-10">
          <h2 id="vue" className="font-display text-[15px] font-medium text-menthe">Vue générale du projet</h2>
          <p className="display mt-4 text-[clamp(1.8rem,2.6vw,2.4rem)] leading-tight">
            {current ? (
              <>
                {current.status === "en-cours" ? "En cours : " : "Dernière étape réalisée : "}
                {current.title}
              </>
            ) : (
              "Aucune étape commencée"
            )}
          </p>
          <div className="mt-8 flex gap-1" aria-hidden="true">
            {stages.map((s, i) => (
              <span key={i} className={`h-2 flex-1 rounded-full ${s.status === "realise" ? "bg-menthe" : s.status === "en-cours" ? "bg-terracotta" : "bg-blanc/15"}`} />
            ))}
          </div>
          <dl className="mt-6 grid grid-cols-3 gap-4">
            {(["realise", "en-cours", "a-venir"] as const).map((st) => (
              <div key={st}>
                <dt className="text-[11px] uppercase tracking-[0.12em] text-blanc/55">{STATUS_LABEL[st]}</dt>
                <dd className="display mt-1 text-[2.2rem] leading-none tabular-nums">{String(count(st)).padStart(2, "0")}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="grid content-center gap-3 border-t border-blanc/10 p-7 md:border-l md:border-t-0 md:p-10">
          <p className="font-display text-[15px] font-medium text-menthe">Raccourcis</p>
          {[
            { label: "Ajouter une étape", href: "/admin/etapes/nouvelle" },
            { label: "Importer des photos", href: "/admin/mediatheque" },
            { label: "Rédiger une actualité", href: "/admin/actualites/nouvelle" },
          ].map((s) =>
            s.href ? (
              <Link key={s.label} href={s.href} className="flex items-center justify-between rounded-full border border-blanc/25 px-5 py-3 text-[14px] text-blanc transition-colors hover:bg-blanc/10">
                {s.label}
                <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <span key={s.label} className="flex items-center justify-between rounded-full border border-blanc/15 px-5 py-3 text-[14px] text-blanc/45" aria-disabled="true">
                {s.label}
                <span className="text-[11px] uppercase tracking-[0.12em]">bientôt</span>
              </span>
            ),
          )}
          <Link href="/" target="_blank" className="pill mt-2 h-12 bg-menthe text-[14px] text-foret hover:bg-blanc">
            Voir le site public ↗
          </Link>
        </div>
      </section>

      {/* Figures */}
      <section aria-label="Chiffres" className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[22px] bg-blanc p-5">
            <p className="display text-[2.6rem] leading-none tabular-nums text-foret">{s.value}</p>
            <p className="mt-2 text-[13px] text-encre/70">{s.label}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="recent" className="min-w-0 rounded-[28px] bg-blanc p-6 md:p-8">
          <h2 id="recent" className="display text-[1.6rem] text-encre">Dernières publications</h2>
          <ul className="mt-6 divide-y divide-encre/10">
            {recent.map((r) => (
              <li key={r.key} className="flex items-center gap-4 py-3">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-ivoire">
                  {r.img && <Image src={r.img} alt="" fill sizes="48px" className="object-cover" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] text-encre">{r.title}</span>
                  <span className="block text-[12px] text-encre/55">
                    {r.type} · mis à jour le {fmt(r.date)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="drafts" className="min-w-0 rounded-[28px] bg-blanc p-6 md:p-8">
          <h2 id="drafts" className="display text-[1.6rem] text-encre">Brouillons</h2>
          {draftItems.length ? (
            <ul className="mt-6 divide-y divide-encre/10">
              {draftItems.map((d) => (
                <li key={d.key} className="flex items-center justify-between gap-4 py-3">
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] text-encre">{d.title}</span>
                    <span className="block text-[12px] text-encre/55">{d.type}</span>
                  </span>
                  <span className="shrink-0 text-[12px] text-encre/55">{fmt(d.date)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-[20px] border border-dashed border-encre/20 p-6 text-center">
              <p className="text-[14px] text-encre/70">Aucun brouillon en attente.</p>
              <p className="mono mt-2 text-[12px] text-encre/55">Les étapes et actualités enregistrées sans être publiées apparaîtront ici.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
