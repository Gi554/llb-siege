"use client";

import Image from "next/image";
import { useActionState, useRef, useState } from "react";
import { saveStage, type StageFormState } from "@/app/admin/(espace)/etapes/actions";
import { Field, inputClass, Notice, SubmitButton } from "./ui";

export type PickableMedia = { id: string; src: string; alt: string; caption: string | null; stageId: string | null; stageTitle: string | null };
type Video = { title: string; src: string; poster: string };
export type StageValues = {
  id?: string;
  title: string;
  description: string;
  status: string;
  publishedAt: string;
  dateLabel: string;
  highlights: string;
  mediaIds: string[];
  videos: Video[];
};

export default function StageForm({ values, media }: { values: StageValues; media: PickableMedia[] }) {
  const [state, action] = useActionState<StageFormState, FormData>(saveStage, {});
  const v = { ...values, ...(state.fields ?? {}) } as StageValues;
  const [selected, setSelected] = useState<string[]>(values.mediaIds);
  const [videos, setVideos] = useState<Video[]>(values.videos);
  const intent = useRef<HTMLInputElement>(null);

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <form action={action} className="space-y-8">
      {values.id && <input type="hidden" name="id" value={values.id} />}
      {selected.map((id) => (
        <input key={id} type="hidden" name="mediaIds" value={id} />
      ))}
      {state.error && <Notice tone="error">{state.error}</Notice>}

      <section className="grid gap-6 rounded-[28px] bg-blanc p-6 md:grid-cols-2 md:p-8">
        <div className="md:col-span-2">
          <Field label="Titre de l'étape">
            <input name="title" defaultValue={v.title} required maxLength={120} className={inputClass} placeholder="Ex. Coulage des fondations" />
          </Field>
        </div>
        <Field label="Statut d'avancement">
          <select name="status" defaultValue={v.status} className={inputClass}>
            <option value="a-venir">À venir</option>
            <option value="en-cours">En cours</option>
            <option value="realise">Réalisé</option>
          </select>
        </Field>
        <Field label="Date de l'étape" hint="Laisser vide si la date n'est pas encore connue.">
          <input type="date" name="publishedAt" defaultValue={v.publishedAt} className={inputClass} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Libellé de date (facultatif)" hint="Affiché à la place de la date exacte, ex. « Octobre 2026 » ou « Premier trimestre ».">
            <input name="dateLabel" defaultValue={v.dateLabel} maxLength={60} className={inputClass} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Description">
            <textarea name="description" defaultValue={v.description} required rows={5} maxLength={2000} className={inputClass} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Points clés (facultatif)" hint="Un point par ligne : travaux réalisés, livrables…">
            <textarea name="highlights" defaultValue={v.highlights} rows={4} className={inputClass} />
          </Field>
        </div>
      </section>

      <section className="rounded-[28px] bg-blanc p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="display text-[1.6rem] text-encre">Photographies</h2>
          <p className="text-[13px] text-encre/60">
            {selected.length} sélectionnée{selected.length > 1 ? "s" : ""} — l&apos;ordre de sélection est l&apos;ordre d&apos;affichage
          </p>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {media.map((m) => {
            const rank = selected.indexOf(m.id);
            const elsewhere = m.stageId && m.stageId !== values.id && rank < 0 ? m.stageTitle : null;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => toggle(m.id)}
                  aria-pressed={rank >= 0}
                  className={`group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-lin ring-offset-2 transition ${rank >= 0 ? "ring-2 ring-foret" : "hover:opacity-90"}`}
                >
                  <Image src={m.src} alt={m.alt} fill sizes="200px" className="object-cover" />
                  {rank >= 0 && (
                    <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-foret text-[12px] font-medium text-blanc">{rank + 1}</span>
                  )}
                </button>
                <p className="mt-1.5 truncate text-[12px] text-encre/70">{m.caption ?? m.alt}</p>
                {elsewhere && <p className="truncate text-[11px] text-terracotta">Dans : {elsewhere}</p>}
              </li>
            );
          })}
        </ul>
        <p className="mono mt-4 text-[12px] text-encre/55">
          Une photo appartient à une seule étape : la sélectionner ici la retire de son étape actuelle. L&apos;import de nouvelles
          photos se fera depuis la médiathèque.
        </p>
      </section>

      <section className="rounded-[28px] bg-blanc p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="display text-[1.6rem] text-encre">Vidéos</h2>
          <button type="button" onClick={() => setVideos((vs) => [...vs, { title: "", src: "", poster: "" }])} className="rounded-full border border-encre/20 px-4 py-2 text-[13px] hover:border-foret">
            + Ajouter une vidéo
          </button>
        </div>
        {videos.length === 0 && <p className="mt-4 text-[14px] text-encre/60">Aucune vidéo pour cette étape.</p>}
        <ul className="mt-4 space-y-4">
          {videos.map((vid, i) => (
            <li key={i} className="grid gap-3 rounded-2xl bg-lin p-4 md:grid-cols-[1fr_1.4fr_1fr_auto] md:items-end">
              <Field label="Titre">
                <input name="videoTitle" defaultValue={vid.title} className={inputClass} />
              </Field>
              <Field label="Lien du fichier vidéo (.mp4)">
                <input name="videoSrc" type="url" defaultValue={vid.src} className={inputClass} placeholder="https://…" />
              </Field>
              <Field label="Image d'aperçu (facultatif)">
                <input name="videoPoster" defaultValue={vid.poster} className={inputClass} placeholder="https://…" />
              </Field>
              <button type="button" onClick={() => setVideos((vs) => vs.filter((_, k) => k !== i))} className="h-12 rounded-full px-4 text-[13px] text-argile hover:bg-terracotta/10">
                Retirer
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-3 rounded-full bg-foret/95 p-2 pl-6 shadow-[0_20px_50px_rgba(6,37,33,.25)] backdrop-blur">
        <span className="mr-auto hidden text-[13px] text-blanc/70 sm:inline">Enregistrez en brouillon ou publiez directement sur le site.</span>
        {/* The clicked button writes its intent here before the form is submitted. */}
        <input ref={intent} type="hidden" name="intent" defaultValue="draft" />
        <SubmitButton variant="ghost" value="draft" onClick={() => (intent.current!.value = "draft")}>
          Enregistrer en brouillon
        </SubmitButton>
        <SubmitButton value="publish" pendingLabel="Publication…" onClick={() => (intent.current!.value = "publish")} tone="mint">
          Publier
        </SubmitButton>
      </div>
    </form>
  );
}
