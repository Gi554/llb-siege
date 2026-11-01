"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useCallback, useEffect, useMemo, useState } from "react";
import { bulkUpdate, type MediaFormState } from "@/app/admin/(espace)/mediatheque/actions";
import { inputClass, Notice, SubmitButton } from "../ui";
import MediaEditor from "./MediaEditor";

export type Option = { value: string; label: string };
export type LibraryMedia = {
  id: string;
  src: string;
  alt: string;
  caption: string | null;
  width: number;
  height: number;
  kind: string;
  espace: string;
  album: string | null;
  dateLabel: string | null;
  inGallery: boolean;
  stageId: string | null;
  stageTitle: string | null;
  createdAt: string;
};

const KINDS: Option[] = [
  { value: "photo", label: "Photos du chantier" },
  { value: "rendu", label: "Rendus 3D" },
  { value: "plan", label: "Plans techniques" },
];
const ALL = "";
const NONE = "__none";

export default function MediaLibrary({ media, stages, espaces, albums }: { media: LibraryMedia[]; stages: Option[]; espaces: Option[]; albums: string[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState(ALL);
  const [stage, setStage] = useState(ALL);
  const [album, setAlbum] = useState(ALL);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [bulkState, bulkAction] = useActionState<MediaFormState, FormData>(bulkUpdate, {});

  useEffect(() => {
    if (bulkState.ok) {
      setSelected([]);
      router.refresh();
    }
  }, [bulkState, router]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return media.filter(
      (m) =>
        (kind === ALL || m.kind === kind) &&
        (stage === ALL || (stage === NONE ? !m.stageId : m.stageId === stage)) &&
        (album === ALL || (album === NONE ? !m.album : m.album === album)) &&
        (!s || `${m.alt} ${m.caption ?? ""} ${m.album ?? ""}`.toLowerCase().includes(s)),
    );
  }, [media, q, kind, stage, album]);

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const close = useCallback(() => setEditing(null), []);
  const current = media.find((m) => m.id === editing);
  const espaceLabel = (v: string) => espaces.find((e) => e.value === v)?.label ?? v;

  return (
    <section aria-labelledby="bibliotheque" className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="bibliotheque" className="display text-[1.6rem] text-encre">Bibliothèque</h2>
        <p className="text-[13px] text-encre/60">
          {shown.length} image{shown.length > 1 ? "s" : ""} sur {media.length}
        </p>
      </div>

      <div className="grid gap-3 rounded-[24px] bg-blanc p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="sr-only">Rechercher</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une description, un album…" className={inputClass.replace("mt-2 ", "")} />
        </label>
        <label className="block">
          <span className="sr-only">Type</span>
          <select value={kind} onChange={(e) => setKind(e.target.value)} className={inputClass.replace("mt-2 ", "")}>
            <option value={ALL}>Tous les types</option>
            {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="sr-only">Étape</span>
          <select value={stage} onChange={(e) => setStage(e.target.value)} className={inputClass.replace("mt-2 ", "")}>
            <option value={ALL}>Toutes les étapes</option>
            <option value={NONE}>Sans étape</option>
            {stages.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="sr-only">Album</span>
          <select value={album} onChange={(e) => setAlbum(e.target.value)} className={inputClass.replace("mt-2 ", "")}>
            <option value={ALL}>Tous les albums</option>
            <option value={NONE}>Sans album</option>
            {albums.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
      </div>

      {selected.length > 0 && (
        <form action={bulkAction} className="sticky top-20 z-20 flex flex-wrap items-center gap-3 rounded-[24px] bg-foret p-3 pl-5 text-blanc shadow-[0_20px_50px_rgba(6,37,33,.25)] lg:top-4">
          {selected.map((id) => <input key={id} type="hidden" name="ids" value={id} />)}
          <span className="text-[14px]">{selected.length} sélectionnée{selected.length > 1 ? "s" : ""}</span>
          <select name="stageId" defaultValue="__keep" aria-label="Étape à associer" className="h-10 rounded-full border border-blanc/25 bg-foret px-4 text-[13px]">
            <option value="__keep">Étape : inchangée</option>
            <option value="">Retirer de l&apos;étape</option>
            {stages.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <input name="album" list="albums-bulk" placeholder="Album (facultatif)" aria-label="Album à associer" className="h-10 rounded-full border border-blanc/25 bg-foret px-4 text-[13px] placeholder:text-blanc/50" />
          <datalist id="albums-bulk">{albums.map((a) => <option key={a} value={a} />)}</datalist>
          <SubmitButton tone="mint" pendingLabel="Application…">Appliquer</SubmitButton>
          <button type="button" onClick={() => setSelected([])} className="ml-auto rounded-full px-4 py-2 text-[13px] text-blanc/80 hover:bg-blanc/10">
            Tout désélectionner
          </button>
        </form>
      )}
      {bulkState.error && <Notice tone="error">{bulkState.error}</Notice>}
      {bulkState.ok && <Notice>{bulkState.ok}</Notice>}

      {shown.length === 0 ? (
        <Notice>Aucune image ne correspond à ces filtres.</Notice>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {shown.map((m) => {
            const on = selected.includes(m.id);
            return (
              <li key={m.id} className="group relative">
                <button
                  type="button"
                  onClick={() => setEditing(m.id)}
                  aria-label={`Modifier : ${m.alt}`}
                  className={`relative block aspect-square w-full overflow-hidden rounded-2xl bg-sable ring-offset-2 ring-offset-lin transition ${on ? "ring-2 ring-foret" : ""}`}
                >
                  <Image src={m.src} alt="" fill sizes="(min-width: 1280px) 18vw, (min-width: 640px) 30vw, 45vw" className={m.kind === "plan" ? "bg-blanc object-contain p-2" : "object-cover"} />
                  {!m.inGallery && <span className="absolute bottom-2 left-2 rounded-full bg-encre/70 px-2 py-0.5 text-[10px] text-blanc">Masquée</span>}
                </button>
                <label className={`absolute left-2 top-2 grid h-8 w-8 cursor-pointer place-items-center rounded-full ${on ? "bg-foret text-blanc" : "bg-blanc/90 text-encre opacity-100 md:opacity-0 md:group-hover:opacity-100"} focus-within:opacity-100`}>
                  <input type="checkbox" checked={on} onChange={() => toggle(m.id)} className="sr-only" aria-label={`Sélectionner : ${m.alt}`} />
                  <span aria-hidden="true" className="text-[13px]">{on ? "✓" : "+"}</span>
                </label>
                <p className="mt-2 truncate text-[13px] text-encre">{m.caption ?? m.alt}</p>
                <p className="truncate text-[11px] text-encre/55">
                  {m.stageTitle ?? "Sans étape"}
                  {m.album ? ` · ${m.album}` : ""} · {espaceLabel(m.espace)}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {current && <MediaEditor media={current} stages={stages} espaces={espaces} albums={albums} onClose={close} />}
    </section>
  );
}
