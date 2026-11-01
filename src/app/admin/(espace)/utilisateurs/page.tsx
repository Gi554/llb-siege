import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/admin/ui";
import { CreateUser, UserRow } from "@/components/admin/users/Users";

export const metadata: Metadata = { title: "Utilisateurs" };
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const me = await requireUser("ADMIN");
  const users = await db.user.findMany({ orderBy: [{ active: "desc" }, { role: "asc" }, { name: "asc" }] });

  return (
    <div className="space-y-8">
      <PageHeader title="Utilisateurs" outline="équipe" />
      <div className="grid gap-3 text-[13px] text-encre/70 md:grid-cols-2">
        <p className="rounded-2xl bg-blanc p-4">
          <strong className="text-encre">Éditeur</strong> — publie et modifie les étapes, photos, comparaisons, actualités et textes des pages.
        </p>
        <p className="rounded-2xl bg-blanc p-4">
          <strong className="text-encre">Administrateur</strong> — tout ce que fait un éditeur, plus la gestion des comptes.
        </p>
      </div>
      <CreateUser />
      <section aria-labelledby="comptes" className="space-y-4">
        <h2 id="comptes" className="display text-[1.5rem] text-encre">
          Comptes ({users.length})
        </h2>
        <ul className="space-y-3">
          {users.map((u) => (
            <UserRow
              key={u.id}
              user={{ id: u.id, name: u.name, email: u.email, role: u.role, active: u.active, createdAt: u.createdAt.toISOString(), me: u.id === me.id }}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
