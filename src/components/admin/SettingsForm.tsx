"use client";

import { useActionState, useState } from "react";
import { resetSettings, saveSettings, type SettingsState } from "@/app/admin/(espace)/contenus/actions";
import { SETTINGS, type Settings } from "@/content/settings";
import MediaPicker, { type PickerMedia } from "./MediaPicker";
import { Field, inputClass, Notice, SubmitButton } from "./ui";

const GROUPS = [...new Set(SETTINGS.map((s) => s.group))];
const LINKS: Record<string, string> = {
  "Bandeau d'annonce": "/",
  Accueil: "/",
  "Le projet": "/projet",
  "Évolution des travaux": "/chantier",
  "Avant / Après": "/avant-apres",
  Galerie: "/galerie",
  Actualités: "/actualites",
  "Faire un don": "/faire-un-don",
};

export default function SettingsForm({ values, media }: { values: Settings; media: PickerMedia[] }) {
  const [state, action] = useActionState<SettingsState, FormData>(saveSettings, {});
  const [resetState, reset] = useActionState<SettingsState, FormData>(resetSettings, {});
  const [confirmReset, setConfirmReset] = useState(false);
  // After a reset the server sends back the defaults: remount the fields.
  const version = resetState.ok ? "reset" : "saved";

  return (
    <div className="space-y-6">
      {(state.error || resetState.error) && <Notice tone="error">{state.error ?? resetState.error}</Notice>}
      {(state.ok || resetState.ok) && <Notice>{resetState.ok ?? state.ok}</Notice>}

      <form action={action} key={version} className="space-y-6">
        {GROUPS.map((group) => (
          <section key={group} className="rounded-[28px] bg-blanc p-6 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="display text-[1.5rem] text-encre">{group}</h2>
              <a href={LINKS[group]} target="_blank" className="text-[13px] text-encre/60 underline-offset-2 hover:underline">
                Voir la page ↗
              </a>
            </div>
            <div className="mt-6 grid gap-5">
              {SETTINGS.filter((s) => s.group === group).map((s) => {
                const value = values[s.key];
                if (s.key === "announcement.enabled") {
                  return (
                    <label key={s.key} className="flex items-center gap-3 text-[14px] text-encre">
                      <input type="checkbox" name={s.key} defaultChecked={value === "1"} className="h-5 w-5 accent-foret" />
                      {s.label}
                    </label>
                  );
                }
                if (s.key === "home.heroImage") {
                  return (
                    <div key={s.key}>
                      <MediaPicker name={s.key} label={s.label} media={media} value={value} allowNone emptyLabel="Image par défaut : façade principale" />
                      <p className="mt-1.5 text-[12px] text-encre/55">{s.hint}</p>
                    </div>
                  );
                }
                const changed = value !== s.default;
                return (
                  <Field key={s.key} label={s.label} hint={"hint" in s ? s.hint : changed ? `Texte d'origine : « ${s.default} »` : undefined}>
                    {"multiline" in s && s.multiline ? (
                      <textarea name={s.key} defaultValue={value} required maxLength={s.max} rows={3} className={inputClass} />
                    ) : (
                      <input name={s.key} defaultValue={value} required maxLength={s.max} className={inputClass} />
                    )}
                  </Field>
                );
              })}
            </div>
          </section>
        ))}

        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-3 rounded-full bg-foret/95 p-2 pl-6 shadow-[0_20px_50px_rgba(6,37,33,.25)] backdrop-blur">
          <span className="mr-auto hidden text-[13px] text-blanc/70 sm:inline">Les modifications sont publiées immédiatement.</span>
          <SubmitButton tone="mint">Enregistrer et publier</SubmitButton>
        </div>
      </form>

      <section className="rounded-[28px] border border-dashed border-encre/20 p-6">
        <p className="text-[14px] text-encre">Rétablir les textes d&apos;origine</p>
        <p className="mono mt-1 text-[12px] text-encre/60">Remet tous les textes et l&apos;image de l&apos;accueil comme à la livraison du site.</p>
        {confirmReset ? (
          <form action={reset} className="mt-4 flex flex-wrap gap-2" onSubmit={() => setConfirmReset(false)}>
            <button type="submit" className="rounded-full bg-terracotta px-4 py-2 text-[13px] text-blanc hover:bg-argile">
              Confirmer le rétablissement
            </button>
            <button type="button" onClick={() => setConfirmReset(false)} className="rounded-full px-3 py-2 text-[13px] text-encre/70">
              Annuler
            </button>
          </form>
        ) : (
          <button type="button" onClick={() => setConfirmReset(true)} className="mt-4 rounded-full border border-encre/20 px-4 py-2 text-[13px] hover:border-terracotta">
            Rétablir
          </button>
        )}
      </section>
    </div>
  );
}
