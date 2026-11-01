"use client";

import { useActionState, useRef, useState } from "react";
import { saveComparison, type CompareFormState } from "@/app/admin/(espace)/comparaisons/actions";
import BeforeAfter from "@/components/BeforeAfter";
import MediaPicker, { type PickerMedia } from "./MediaPicker";
import { Field, inputClass, Notice, SubmitButton } from "./ui";

export type ComparisonValues = {
  id?: string;
  title: string;
  beforeId: string;
  afterId: string;
  beforeLabel: string;
  afterLabel: string;
  beforeDate: string;
  afterDate: string;
  featured: boolean;
};

export default function ComparisonForm({ values, media }: { values: ComparisonValues; media: PickerMedia[] }) {
  const [state, action] = useActionState<CompareFormState, FormData>(saveComparison, {});
  const v = { ...values, ...(state.fields ?? {}) } as ComparisonValues;
  const intent = useRef<HTMLInputElement>(null);
  const [beforeId, setBeforeId] = useState(v.beforeId);
  const [afterId, setAfterId] = useState(v.afterId);
  const [labels, setLabels] = useState({ before: v.beforeLabel, after: v.afterLabel, beforeDate: v.beforeDate, afterDate: v.afterDate });
  const before = media.find((m) => m.id === beforeId);
  const after = media.find((m) => m.id === afterId);

  return (
    <form action={action} className="space-y-8">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      {state.error && <Notice tone="error">{state.error}</Notice>}

      <section className="grid gap-6 rounded-[28px] bg-blanc p-6 md:p-8">
        <Field label="Titre de la comparaison" hint="Ex. « Façade principale » ou « Le patio, de la maquette au chantier ».">
          <input name="title" defaultValue={v.title} required maxLength={120} className={inputClass} />
        </Field>
        <label className="flex items-center gap-3 text-[14px] text-encre">
          <input type="checkbox" name="featured" defaultChecked={v.featured} className="h-5 w-5 accent-foret" />
          Mettre à la une de la page Avant / Après (remplace la comparaison actuellement à la une)
        </label>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {(["before", "after"] as const).map((side) => (
          <div key={side} className="space-y-5 rounded-[28px] bg-blanc p-6 md:p-8">
            <h2 className="display text-[1.5rem] text-encre">{side === "before" ? "Avant" : "Après"}</h2>
            <MediaPicker
              name={`${side}Id`}
              label={side === "before" ? "Image « avant »" : "Image « après »"}
              media={media}
              value={side === "before" ? v.beforeId : v.afterId}
              onChange={side === "before" ? setBeforeId : setAfterId}
            />
            <Field label="Libellé" hint={side === "before" ? "Ex. « Rendu architectural » ou « Terrain nu »." : "Ex. « Photo du chantier »."}>
              <input
                name={`${side}Label`}
                defaultValue={side === "before" ? v.beforeLabel : v.afterLabel}
                required
                maxLength={60}
                onChange={(e) => setLabels((l) => ({ ...l, [side]: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Date (facultatif)" hint="Ex. « Octobre 2026 ».">
              <input
                name={`${side}Date`}
                defaultValue={side === "before" ? v.beforeDate : v.afterDate}
                maxLength={60}
                onChange={(e) => setLabels((l) => ({ ...l, [`${side}Date`]: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </div>
        ))}
      </section>

      <section className="rounded-[28px] bg-blanc p-6 md:p-8">
        <h2 className="display text-[1.5rem] text-encre">Aperçu</h2>
        <p className="mt-1 text-[13px] text-encre/60">Faites glisser le curseur pour vérifier que les deux images sont bien alignées.</p>
        <div className="mt-6">
          {before && after ? (
            <BeforeAfter
              key={`${beforeId}-${afterId}`}
              frameClass="aspect-[16/9]"
              comparison={{
                slug: "apercu",
                title: "Aperçu",
                before: { ...before, width: 0, height: 0, caption: before.caption ?? undefined, label: labels.before || "Avant", ...(labels.beforeDate ? { date: labels.beforeDate } : {}) },
                after: { ...after, width: 0, height: 0, caption: after.caption ?? undefined, label: labels.after || "Après", ...(labels.afterDate ? { date: labels.afterDate } : {}) },
                source: "projet",
              }}
            />
          ) : (
            <p className="rounded-2xl border border-dashed border-encre/20 p-8 text-center text-[14px] text-encre/60">Choisissez les deux images pour voir l&apos;aperçu.</p>
          )}
        </div>
      </section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-3 rounded-full bg-foret/95 p-2 pl-6 shadow-[0_20px_50px_rgba(6,37,33,.25)] backdrop-blur">
        <span className="mr-auto hidden text-[13px] text-blanc/70 sm:inline">Enregistrez en brouillon ou publiez sur la page Avant / Après.</span>
        <input ref={intent} type="hidden" name="intent" defaultValue="draft" />
        <SubmitButton variant="ghost" value="draft" onClick={() => (intent.current!.value = "draft")}>
          Enregistrer en brouillon
        </SubmitButton>
        <SubmitButton tone="mint" value="publish" pendingLabel="Publication…" onClick={() => (intent.current!.value = "publish")}>
          Publier
        </SubmitButton>
      </div>
    </form>
  );
}
