"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { saveNews, type NewsFormState } from "@/app/admin/(espace)/actualites/actions";
import { NEWS_CATEGORIES } from "@/content/types";
import MediaPicker, { type PickerMedia } from "./MediaPicker";
import { Field, inputClass, Notice, SubmitButton } from "./ui";

export type NewsValues = {
  id?: string;
  title: string;
  category: string;
  publishedAt: string;
  dateLabel: string;
  excerpt: string;
  body: string;
  coverId: string;
  mediaIds: string[];
};

export default function NewsForm({ values, media }: { values: NewsValues; media: PickerMedia[] }) {
  const [state, action] = useActionState<NewsFormState, FormData>(saveNews, {});
  const v = { ...values, ...(state.fields ?? {}) } as NewsValues;
  const intent = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<string[]>(values.mediaIds);
  const [showAll, setShowAll] = useState(false);
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  // Selected pictures first, then the most recent ones.
  const ordered = [...media.filter((m) => selected.includes(m.id)), ...media.filter((m) => !selected.includes(m.id))];
  const visible = showAll ? ordered : ordered.slice(0, 15);

  return (
    <form action={action} className="space-y-8">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      {selected.map((id) => <input key={id} type="hidden" name="mediaIds" value={id} />)}
      {state.error && <Notice tone="error">{state.error}</Notice>}

      <section className="grid gap-6 rounded-[28px] bg-blanc p-6 md:grid-cols-3 md:p-8">
        <div className="md:col-span-3">
          <Field label="Titre de l'article">
            <input name="title" defaultValue={v.title} required maxLength={140} className={inputClass} placeholder="Ex. Les fondations sont coulées" />
          </Field>
        </div>
        <Field label="Catégorie">
          <select name="category" defaultValue={v.category} className={inputClass}>
            {NEWS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Date de publication" hint="Détermine l'ordre des articles (le plus récent en premier).">
          <input type="date" name="publishedAt" defaultValue={v.publishedAt} className={inputClass} />
        </Field>
        <Field label="Libellé de date (facultatif)" hint="Sinon, la date est affichée en toutes lettres.">
          <input name="dateLabel" defaultValue={v.dateLabel} maxLength={60} className={inputClass} placeholder="Ex. Printemps 2027" />
        </Field>
        <div className="md:col-span-3">
          <Field label="Résumé" hint="Une ou deux phrases affichées sur les cartes et dans les moteurs de recherche.">
            <textarea name="excerpt" defaultValue={v.excerpt} required rows={2} maxLength={300} className={inputClass} />
          </Field>
        </div>
        <div className="md:col-span-3">
          <Field label="Texte de l'article" hint="Séparez les paragraphes par une ligne vide.">
            <textarea name="body" defaultValue={v.body} required rows={12} className={inputClass} />
          </Field>
        </div>
      </section>

      <section className="rounded-[28px] bg-blanc p-6 md:p-8">
        <MediaPicker name="coverId" label="Image principale" media={media} value={v.coverId} />
      </section>

      <section className="rounded-[28px] bg-blanc p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="display text-[1.6rem] text-encre">Images de l&apos;article</h2>
          <p className="text-[13px] text-encre/60">
            {selected.length} sélectionnée{selected.length > 1 ? "s" : ""} — affichées dans « En images » en bas de l&apos;article
          </p>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {visible.map((m) => {
            const rank = selected.indexOf(m.id);
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => toggle(m.id)}
                  aria-pressed={rank >= 0}
                  aria-label={`${rank >= 0 ? "Retirer" : "Ajouter"} : ${m.caption ?? m.alt}`}
                  className={`relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-lin ring-offset-2 transition ${rank >= 0 ? "ring-2 ring-foret" : "hover:opacity-90"}`}
                >
                  <Image src={m.src} alt="" fill sizes="200px" className={m.kind === "plan" ? "bg-blanc object-contain" : "object-cover"} />
                  {rank >= 0 && <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-foret text-[12px] text-blanc">{rank + 1}</span>}
                </button>
                <p className="mt-1.5 truncate text-[12px] text-encre/70">{m.caption ?? m.alt}</p>
              </li>
            );
          })}
        </ul>
        {ordered.length > 15 && (
          <button type="button" onClick={() => setShowAll((s) => !s)} className="mt-4 rounded-full border border-encre/20 px-4 py-2 text-[13px] hover:border-foret">
            {showAll ? "Afficher moins" : `Afficher toutes les images (${ordered.length})`}
          </button>
        )}
      </section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-3 rounded-full bg-foret/95 p-2 pl-6 shadow-[0_20px_50px_rgba(6,37,33,.25)] backdrop-blur">
        <span className="mr-auto hidden text-[13px] text-blanc/70 sm:inline">Enregistrez en brouillon ou publiez sur la page Actualités.</span>
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
