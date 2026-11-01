import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/admin/ui";
import NewsForm from "@/components/admin/NewsForm";
import { pickerMedia } from "@/lib/picker";

export const metadata: Metadata = { title: "Nouvel article" };
export const dynamic = "force-dynamic";

export default async function NewNewsPage() {
  await requireUser();
  return (
    <div className="space-y-8">
      <PageHeader title="Nouvel article" back={{ href: "/admin/actualites", label: "Actualités" }} />
      <NewsForm
        media={await pickerMedia()}
        values={{ title: "", category: "Compte rendu", publishedAt: new Date().toISOString().slice(0, 10), dateLabel: "", excerpt: "", body: "", coverId: "", mediaIds: [] }}
      />
    </div>
  );
}
