import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/admin/ui";
import AccountForm from "@/components/admin/users/AccountForm";

export const metadata: Metadata = { title: "Mon compte" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const me = await requireUser();
  return (
    <div className="space-y-8">
      <PageHeader title="Mon compte" back={{ href: "/admin", label: "Tableau de bord" }} />
      <AccountForm name={me.name} email={me.email} role={me.role} />
    </div>
  );
}
