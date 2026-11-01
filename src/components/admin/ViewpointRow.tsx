"use client";

import Image from "next/image";
import { saveViewpoint } from "@/app/admin/(espace)/comparaisons/actions";
import MediaPicker, { type PickerMedia } from "./MediaPicker";
import { inputClass, SubmitButton } from "./ui";

export type ViewpointItem = { id: string; title: string; espace: string; renderSrc: string; renderAlt: string; photoId: string; photoDate: string };

/** One tracked camera position: its fixed render and the site photo attached to it. */
export default function ViewpointRow({ vp, media, index }: { vp: ViewpointItem; media: PickerMedia[]; index: number }) {
  const photos = media.filter((m) => m.kind === "photo" || m.id === vp.photoId);
  return (
    <li className="grid gap-5 rounded-[24px] bg-blanc p-5 md:grid-cols-[220px_1fr] md:items-start">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sable">
          <Image src={vp.renderSrc} alt={vp.renderAlt} fill sizes="220px" className="object-cover" />
          <span className="absolute left-2 top-2 rounded-full bg-encre/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-blanc">Rendu</span>
        </div>
        <p className="mt-3 font-display text-[1.1rem] font-medium text-encre">
          <span className="mr-2 font-mono text-[12px] text-encre/45">{String(index + 1).padStart(2, "0")}</span>
          {vp.title}
        </p>
        <p className="text-[12px] text-encre/55">{vp.espace}</p>
      </div>
      <form action={saveViewpoint} className="grid gap-4">
        <input type="hidden" name="id" value={vp.id} />
        <MediaPicker
          name="photoId"
          label="Photo du chantier prise sous le même angle"
          media={photos}
          value={vp.photoId}
          allowNone
          emptyLabel="Pas encore de photo — le site affiche « Photo à venir »"
        />
        <div className="flex flex-wrap items-end gap-3">
          <label className="block min-w-[200px] flex-1">
            <span className="text-[13px] font-medium text-encre">Date de la photo</span>
            <input name="photoDate" defaultValue={vp.photoDate} maxLength={60} placeholder="Ex. Avril 2027" className={inputClass} />
          </label>
          <SubmitButton>Enregistrer</SubmitButton>
        </div>
      </form>
    </li>
  );
}
