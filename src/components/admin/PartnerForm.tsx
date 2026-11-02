"use client";

import { useActionState, useState, type ReactNode } from "react";
import { savePartner, type PartnerFormState } from "@/app/admin/(espace)/partenaires/actions";
import { Field, inputClass, Notice, SubmitButton } from "./ui";

type Partner = { id: string; name: string; url: string | null; visible: boolean; logo: string };

/** Adds a partner, or edits one when `partner` is given (the logo is then optional). */
export default function PartnerForm({ partner, onCancel }: { partner?: Partner; onCancel?: () => void }) {
  const [state, action] = useActionState<PartnerFormState, FormData>(savePartner, {});
  const [preview, setPreview] = useState<string | null>(null);
  const v = state.fields ?? { name: partner?.name ?? "", url: partner?.url ?? "", visible: partner?.visible ?? true };
  const shown = preview ?? partner?.logo;

  // The file input is emptied with the rest of the form: drop its preview too.
  const submit = (fd: FormData) => {
    setPreview(null);
    action(fd);
  };

  return (
    <form action={submit} className="space-y-5">
      {partner && <input type="hidden" name="id" value={partner.id} />}
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Nom du partenaire">
          <input name="name" defaultValue={v.name} required minLength={2} maxLength={120} className={inputClass} />
        </Field>
        <Field label="Site internet" hint="Facultatif. Le logo devient un lien vers ce site.">
          <input name="url" type="text" inputMode="url" defaultValue={v.url} maxLength={300} placeholder="www.exemple.org" className={inputClass} />
        </Field>
      </div>
      <div className="flex flex-wrap items-end gap-5">
        <div className="grid h-24 w-40 shrink-0 place-items-center rounded-2xl border border-encre/10 bg-brume p-3">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-[12px] text-encre/45">Aperçu du logo</span>
          )}
        </div>
        <Field label={partner ? "Remplacer le logo" : "Logo"} hint="PNG ou SVG sur fond transparent de préférence, 4 Mo maximum.">
          <input
            name="logo"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
            required={!partner}
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
            className="mt-2 block text-[14px] text-encre file:mr-4 file:rounded-full file:border-0 file:bg-foret file:px-4 file:py-2 file:text-[13px] file:text-blanc"
          />
        </Field>
      </div>
      <label className="flex items-center gap-3 text-[14px] text-encre">
        <input type="checkbox" name="visible" defaultChecked={v.visible} className="h-5 w-5 accent-foret" />
        Afficher sur la page d&apos;accueil
      </label>
      <div className="flex flex-wrap gap-3">
        <SubmitButton>{partner ? "Enregistrer" : "Ajouter le partenaire"}</SubmitButton>
        {onCancel && (
          <button type="button" onClick={onCancel} className="pill h-12 border border-encre/20 bg-blanc px-6 text-[14px] text-encre hover:border-foret">
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}

/** A partner in the list, switching to its edit form on demand. `children`: order and delete controls. */
export function PartnerRow({ partner, children }: { partner: Partner; children: ReactNode }) {
  const [editing, setEditing] = useState(false);
  return editing ? (
    <div className="rounded-[24px] bg-blanc p-6">
      <PartnerForm partner={partner} onCancel={() => setEditing(false)} />
    </div>
  ) : (
    <div className="flex flex-wrap items-center gap-4 rounded-[24px] bg-blanc p-4 pr-5">
      <div className="grid h-20 w-32 shrink-0 place-items-center rounded-2xl bg-brume p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={partner.logo} alt={`Logo ${partner.name}`} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="mr-auto min-w-0">
        <p className="truncate font-display text-[1.15rem] font-medium text-encre">{partner.name}</p>
        {partner.url && <p className="truncate text-[12px] text-encre/55">{partner.url}</p>}
      </div>
      {partner.visible ? (
        <span className="rounded-full bg-menthe px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-foret">Affiché</span>
      ) : (
        <span className="rounded-full border border-dashed border-encre/30 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-encre/60">Masqué</span>
      )}
      <button type="button" onClick={() => setEditing(true)} className="rounded-full border border-encre/20 px-4 py-2 text-[13px] hover:border-foret">
        Modifier
      </button>
      {children}
    </div>
  );
}
