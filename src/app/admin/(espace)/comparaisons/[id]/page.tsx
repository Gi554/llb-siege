import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PageHeader, StatePill } from "@/components/admin/ui";
import ComparisonForm from "@/components/admin/ComparisonForm";
import { pickerMedia } from "@/lib/picker";

export const metadata: Metadata = { title: "Modifier une comparaison" };
export const dynamic = "force-dynamic";

export default async function EditComparisonPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const c = await db.comparison.findUnique({ where: { id: (await params).id } });
  if (!c) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        title={c.title}
        back={{ href: "/admin/comparaisons", label: "Avant / Après" }}
        actions={
          <>
            <StatePill state={c.state} />
            {c.state === "PUBLISHED" && (
              <Link href="/avant-apres" target="_blank" className="rounded-full border border-encre/20 px-4 py-2 text-[13px] hover:border-foret">
                Voir sur le site ↗
              </Link>
            )}
          </>
        }
      />
      <ComparisonForm
        media={await pickerMedia()}
        values={{
          id: c.id,
          title: c.title,
          beforeId: c.beforeId,
          afterId: c.afterId,
          beforeLabel: c.beforeLabel,
          afterLabel: c.afterLabel,
          beforeDate: c.beforeDate ?? "",
          afterDate: c.afterDate ?? "",
          featured: c.featured,
        }}
      />
    </div>
  );
}
