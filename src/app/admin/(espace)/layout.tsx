import AdminShell from "@/components/admin/AdminShell";
import { requireUser } from "@/lib/auth";

// Every page of the back-office (except the login screen) lives here.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <AdminShell user={user}>{children}</AdminShell>;
}
