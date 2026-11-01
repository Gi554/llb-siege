import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ConfirmAction, Notice, PageHeader, StatePill } from "@/components/admin/ui";
import { deleteNews } from "./actions";

export const metadata: Metadata = { title: "Actualités" };
export const dynamic = "force-dynamic";

const MESSAGES: Record<string, string> = {
  publie: "L'article est publié sur le site.",
  brouillon: "L'article est enregistré en brouillon.",
  supprime: "L'article a été supprimé.",
};

export default async function NewsAdminPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  await requireUser();
  const { ok } = await searchParams;
  const news = await db.news.findMany({ orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }], include: { cover: true, _count: { select: { media: true } } } });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Actualités"
        outline="journal"
        actions={
          <Link href="/admin/actualites/nouvelle" className="pill h-12 bg-foret px-6 text-[14px] text-blanc hover:bg-foret-2">
            + Nouvel article
          </Link>
        }
      />
      {ok && MESSAGES[ok] && <Notice>{MESSAGES[ok]}</Notice>}

      <ul className="space-y-3">
        {news.map((n) => (
          <li key={n.id} className="flex flex-col gap-4 rounded-[24px] bg-blanc p-4 sm:flex-row sm:items-center md:p-5">
            <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-lin">
              <Image src={n.cover.src} alt="" fill sizes="112px" className="object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[1.2rem] font-medium text-encre">{n.title}</p>
              <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-encre/60">
                <span className="text-terracotta">{n.category}</span>
                <span>{n.dateLabel}</span>
                <span>
                  {n._count.media} image{n._count.media > 1 ? "s" : ""}
                </span>
                {n.source === "demo" && <span className="text-terracotta">exemple</span>}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatePill state={n.state} />
              {n.state === "PUBLISHED" && (
                <Link href={`/actualites/${n.slug}`} target="_blank" className="rounded-full px-3 py-2 text-[13px] text-encre/70 hover:text-encre">
                  Voir ↗
                </Link>
              )}
              <Link href={`/admin/actualites/${n.id}`} className="rounded-full border border-encre/20 px-4 py-2 text-[13px] hover:border-foret">
                Modifier
              </Link>
              <ConfirmAction action={deleteNews} label="Supprimer" hidden={{ id: n.id }} />
            </div>
          </li>
        ))}
      </ul>
      {news.length === 0 && <Notice>Aucun article pour le moment.</Notice>}
    </div>
  );
}
