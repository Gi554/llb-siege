import type { Metadata } from "next";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { ConfirmAction, Notice, PageHeader } from "@/components/admin/ui";
import PartnerForm, { PartnerRow } from "@/components/admin/PartnerForm";
import { deletePartner, movePartner } from "./actions";

export const metadata: Metadata = { title: "Partenaires" };
export const dynamic = "force-dynamic";

const MESSAGES: Record<string, string> = {
  ajoute: "Le partenaire est ajouté.",
  modifie: "Le partenaire est mis à jour.",
  supprime: "Le partenaire a été supprimé.",
};

const arrow = "grid h-9 w-9 place-items-center rounded-full border border-encre/20 text-[14px] hover:border-foret disabled:opacity-30";

export default async function PartnersPage({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  await requireUser();
  const { ok } = await searchParams;
  const partners = await db.partner.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });

  return (
    <div className="space-y-10">
      <PageHeader title="Partenaires" outline="merci" />
      {ok && MESSAGES[ok] && <Notice>{MESSAGES[ok]}</Notice>}

      <section aria-labelledby="ajout" className="rounded-[28px] bg-blanc p-6 md:p-8">
        <h2 id="ajout" className="display text-[1.5rem] text-encre">Ajouter un partenaire</h2>
        <p className="mono mt-2 max-w-2xl text-[13px] text-encre/65">
          Les partenaires affichés apparaissent sur la page d&apos;accueil, dans la section « Merci à nos partenaires ». Tant
          qu&apos;aucun n&apos;est affiché, la section reste masquée.
        </p>
        <div className="mt-6">
          <PartnerForm />
        </div>
      </section>

      <section aria-labelledby="liste" className="space-y-4">
        <h2 id="liste" className="display text-[1.6rem] text-encre">Ordre d&apos;affichage</h2>
        <ol className="space-y-3">
          {partners.map((p, i) => (
            <li key={p.id}>
              <PartnerRow partner={{ id: p.id, name: p.name, url: p.url, visible: p.visible, logo: p.logo }}>
                <form action={movePartner} className="flex gap-1">
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" name="dir" value="up" disabled={i === 0} aria-label={`Monter ${p.name}`} className={arrow}>
                    ↑
                  </button>
                  <button type="submit" name="dir" value="down" disabled={i === partners.length - 1} aria-label={`Descendre ${p.name}`} className={arrow}>
                    ↓
                  </button>
                </form>
                <ConfirmAction action={deletePartner} label="Supprimer" hidden={{ id: p.id }} />
              </PartnerRow>
            </li>
          ))}
        </ol>
        {partners.length === 0 && <Notice>Aucun partenaire pour le moment.</Notice>}
      </section>
    </div>
  );
}
