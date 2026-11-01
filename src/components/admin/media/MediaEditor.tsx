"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { deleteMedia, updateMedia, type MediaFormState } from "@/app/admin/(espace)/mediatheque/actions";
import { Field, inputClass, Notice, SubmitButton } from "../ui";
import type { LibraryMedia, Option } from "./MediaLibrary";

/** Side panel to edit one picture's description, classification and visibility. */
export default function MediaEditor({ media, stages, espaces, albums, onClose }: { media: LibraryMedia; stages: Option[]; espaces: Option[]; albums: string[]; onClose: () => void }) {
  const router = useRouter();
  const [saved, save] = useActionState<MediaFormState, FormData>(updateMedia, {});
  const [removed, remove] = useActionState<MediaFormState, FormData>(deleteMedia, {});
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    if (saved.ok) router.refresh();
  }, [saved, router]);
  useEffect(() => {
    if (removed.ok) {
      router.refresh();
      onClose();
    }
  }, [removed, router, onClose]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-encre/40 backdrop-blur-sm" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Modifier l'image"
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-lin shadow-[0_0_60px_rgba(6,37,33,.3)]"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <p className="font-display text-[1.2rem] font-medium text-encre">Modifier l&apos;image</p>
          <button type="button" onClick={onClose} aria-label="Fermer" className="grid h-10 w-10 place-items-center rounded-full border border-encre/20 hover:border-foret">
            ✕
          </button>
        </div>
        <div className="relative mx-6 aspect-[4/3] overflow-hidden rounded-2xl bg-sable">
          <Image src={media.src} alt={media.alt} fill sizes="560px" className={media.kind === "plan" ? "object-contain" : "object-cover"} />
        </div>
        <p className="mx-6 mt-2 text-[12px] text-encre/55">
          {media.width} × {media.height} px · ajoutée le {new Date(media.createdAt).toLocaleDateString("fr-FR")}
        </p>

        <form action={save} key={media.id} className="space-y-5 px-6 py-6">
          <input type="hidden" name="id" value={media.id} />
          {saved.error && <Notice tone="error">{saved.error}</Notice>}
          {saved.ok && <Notice>{saved.ok}</Notice>}
          <Field label="Description de l'image" hint="Décrit ce que montre la photo, pour les personnes malvoyantes et le référencement.">
            <input name="alt" defaultValue={media.alt} required maxLength={200} className={inputClass} />
          </Field>
          <Field label="Légende (facultatif)" hint="Texte affiché sous la photo, ex. « Coulage de la dalle, vue depuis la rue ».">
            <input name="caption" defaultValue={media.caption ?? ""} maxLength={200} className={inputClass} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Étape">
              <select name="stageId" defaultValue={media.stageId ?? ""} className={inputClass}>
                <option value="">Aucune</option>
                {stages.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Album">
              <input name="album" list="albums-edit" defaultValue={media.album ?? ""} maxLength={80} className={inputClass} />
              <datalist id="albums-edit">
                {albums.map((a) => <option key={a} value={a} />)}
              </datalist>
            </Field>
            <Field label="Espace">
              <select name="espace" defaultValue={media.espace} className={inputClass}>
                {espaces.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Type">
              <select name="kind" defaultValue={media.kind} className={inputClass}>
                <option value="photo">Photo du chantier</option>
                <option value="rendu">Rendu 3D</option>
                <option value="plan">Plan technique</option>
              </select>
            </Field>
            <Field label="Date affichée">
              <input name="dateLabel" defaultValue={media.dateLabel ?? ""} maxLength={60} className={inputClass} placeholder="Ex. Mars 2027" />
            </Field>
            <label className="flex items-center gap-3 self-end pb-3 text-[14px] text-encre">
              <input type="checkbox" name="inGallery" defaultChecked={media.inGallery} className="h-5 w-5 accent-foret" />
              Visible dans la galerie
            </label>
          </div>
          <SubmitButton>Enregistrer</SubmitButton>
        </form>

        <div className="mt-auto border-t border-encre/10 px-6 py-5">
          {removed.error && <Notice tone="error">{removed.error}</Notice>}
          {asking ? (
            <form action={remove} className="mt-3 flex flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={media.id} />
              <span className="text-[13px] text-encre/70">Supprimer définitivement cette image ?</span>
              <button type="submit" className="rounded-full bg-terracotta px-4 py-2 text-[13px] text-blanc hover:bg-argile">
                Supprimer
              </button>
              <button type="button" onClick={() => setAsking(false)} className="rounded-full px-3 py-2 text-[13px] text-encre/70">
                Annuler
              </button>
            </form>
          ) : (
            <button type="button" onClick={() => setAsking(true)} className="mt-3 rounded-full px-4 py-2 text-[13px] text-argile hover:bg-terracotta/10">
              Supprimer l&apos;image
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
