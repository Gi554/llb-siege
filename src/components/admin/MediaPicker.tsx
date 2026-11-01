"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { inputClass } from "./ui";

export type PickerMedia = { id: string; src: string; alt: string; caption: string | null; kind: string; stageTitle: string | null };

const KINDS = [
  { value: "", label: "Tous les types" },
  { value: "photo", label: "Photos du chantier" },
  { value: "rendu", label: "Rendus 3D" },
  { value: "plan", label: "Plans techniques" },
];

/**
 * Chooses one picture from the media library. Renders a hidden input named
 * `name` with the selected id, a preview and a button opening a searchable grid.
 */
export default function MediaPicker({
  name,
  label,
  media,
  value,
  onChange,
  emptyLabel = "Aucune image choisie",
  allowNone = false,
}: {
  name: string;
  label: string;
  media: PickerMedia[];
  value: string;
  onChange?: (id: string) => void;
  emptyLabel?: string;
  allowNone?: boolean;
}) {
  const [selected, setSelected] = useState(value);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("");
  const current = media.find((m) => m.id === selected);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return media.filter((m) => (!kind || m.kind === kind) && (!s || `${m.alt} ${m.caption ?? ""} ${m.stageTitle ?? ""}`.toLowerCase().includes(s)));
  }, [media, q, kind]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const choose = (id: string) => {
    setSelected(id);
    onChange?.(id);
    setOpen(false);
  };

  return (
    <div>
      <input type="hidden" name={name} value={selected} />
      <span className="text-[13px] font-medium text-encre">{label}</span>
      <div className="mt-2 flex items-center gap-4 rounded-2xl border border-encre/15 bg-blanc p-3">
        <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-lin">
          {current && <Image src={current.src} alt={current.alt} fill sizes="112px" className={current.kind === "plan" ? "object-contain" : "object-cover"} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] text-encre">{current ? current.caption ?? current.alt : emptyLabel}</span>
          {current?.stageTitle && <span className="block truncate text-[12px] text-encre/55">{current.stageTitle}</span>}
        </span>
        <div className="flex shrink-0 flex-col gap-1.5">
          <button type="button" onClick={() => setOpen(true)} className="rounded-full border border-encre/20 px-4 py-2 text-[13px] hover:border-foret">
            {current ? "Changer" : "Choisir"}
          </button>
          {allowNone && current && (
            <button type="button" onClick={() => choose("")} className="rounded-full px-4 py-1.5 text-[12px] text-argile hover:bg-terracotta/10">
              Retirer
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-encre/40 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] bg-lin shadow-[0_30px_80px_rgba(6,37,33,.35)]"
          >
            <div className="flex items-center justify-between gap-4 px-6 pt-5">
              <p className="font-display text-[1.2rem] font-medium text-encre">{label}</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="grid h-10 w-10 place-items-center rounded-full border border-encre/20 hover:border-foret">
                ✕
              </button>
            </div>
            <div className="grid gap-3 px-6 py-4 sm:grid-cols-[1fr_200px]">
              <input type="search" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" aria-label="Rechercher une image" className={inputClass.replace("mt-2 ", "")} />
              <select value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Type d'image" className={inputClass.replace("mt-2 ", "")}>
                {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
              </select>
            </div>
            <ul className="grid grid-cols-2 gap-3 overflow-y-auto px-6 pb-6 sm:grid-cols-3 md:grid-cols-4">
              {shown.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => choose(m.id)}
                    aria-pressed={m.id === selected}
                    className={`relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-sable ring-offset-2 ring-offset-lin ${m.id === selected ? "ring-2 ring-foret" : "hover:opacity-90"}`}
                  >
                    <Image src={m.src} alt={m.alt} fill sizes="220px" className={m.kind === "plan" ? "bg-blanc object-contain" : "object-cover"} />
                  </button>
                  <p className="mt-1.5 truncate text-[12px] text-encre/75">{m.caption ?? m.alt}</p>
                </li>
              ))}
              {shown.length === 0 && <li className="col-span-full py-10 text-center text-[14px] text-encre/60">Aucune image ne correspond.</li>}
            </ul>
            <p className="border-t border-encre/10 px-6 py-3 text-[12px] text-encre/60">
              Image manquante ?{" "}
              <Link href="/admin/mediatheque" target="_blank" className="underline underline-offset-2">
                Importez-la dans la médiathèque
              </Link>
              , puis rechargez cette page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
