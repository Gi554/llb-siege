import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PageHeader, StatePill } from "@/components/admin/ui";
import NewsForm from "@/components/admin/NewsForm";
import { pickerMedia } from "@/lib/picker";

export const metadata: Metadata = { title: "Modifier un article" };
export const dynamic = "force-dynamic";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const n = await db.news.findUnique({ where: { id: (await params).id }, include: { media: { select: { id: true } } } });
  if (!n) notFound();
  // A label equal to the formatted date was generated automatically: show it empty.
  const auto = n.publishedAt?.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-8">
      <PageHeader
        title={n.title}
        back={{ href: "/admin/actualites", label: "Actualités" }}
        actions={
          <>
            <StatePill state={n.state} />
            {n.state === "PUBLISHED" && (
              <Link href={`/actualites/${n.slug}`} target="_blank" className="rounded-full border border-encre/20 px-4 py-2 text-[13px] hover:border-foret">
                Voir sur le site ↗
              </Link>
            )}
          </>
        }
      />
      <NewsForm
        media={await pickerMedia()}
        values={{
          id: n.id,
          title: n.title,
          category: n.category,
          publishedAt: n.publishedAt ? n.publishedAt.toISOString().slice(0, 10) : "",
          dateLabel: n.dateLabel === auto || n.dateLabel === "Date à venir" ? "" : n.dateLabel,
          excerpt: n.excerpt,
          body: n.body,
          coverId: n.coverId,
          mediaIds: n.media.map((m) => m.id),
        }}
      />
    </div>
  );
}
