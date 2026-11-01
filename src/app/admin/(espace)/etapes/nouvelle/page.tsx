import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/admin/ui";
import StageForm from "@/components/admin/StageForm";
import { pickableMedia } from "../data";

export const metadata: Metadata = { title: "Nouvelle étape" };
export const dynamic = "force-dynamic";

export default async function NewStagePage() {
  await requireUser();
  return (
    <div className="space-y-8">
      <PageHeader title="Nouvelle étape" back={{ href: "/admin/etapes", label: "Étapes du chantier" }} />
      <StageForm
        media={await pickableMedia()}
        values={{ title: "", description: "", status: "a-venir", publishedAt: "", dateLabel: "", highlights: "", mediaIds: [], videos: [] }}
      />
    </div>
  );
}
