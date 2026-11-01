import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/admin/ui";
import ComparisonForm from "@/components/admin/ComparisonForm";
import { pickerMedia } from "@/lib/picker";

export const metadata: Metadata = { title: "Nouvelle comparaison" };
export const dynamic = "force-dynamic";

export default async function NewComparisonPage() {
  await requireUser();
  return (
    <div className="space-y-8">
      <PageHeader title="Nouvelle comparaison" back={{ href: "/admin/comparaisons", label: "Avant / Après" }} />
      <ComparisonForm
        media={await pickerMedia()}
        values={{ title: "", beforeId: "", afterId: "", beforeLabel: "Rendu architectural", afterLabel: "Photo du chantier", beforeDate: "", afterDate: "", featured: false }}
      />
    </div>
  );
}
