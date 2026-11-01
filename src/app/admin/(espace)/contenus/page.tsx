import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { pickerMedia } from "@/lib/picker";
import { PageHeader } from "@/components/admin/ui";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Textes des pages" };
export const dynamic = "force-dynamic";

export default async function ContentPage() {
  await requireUser();
  const [values, media] = await Promise.all([getSettings(), pickerMedia()]);
  return (
    <div className="space-y-8">
      <PageHeader title="Textes des pages" outline="contenus" />
      <SettingsForm values={values} media={media} />
    </div>
  );
}
