"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { inputClass } from "../ui";

type Option = { value: string; label: string };
type Item = { key: string; name: string; preview: string; progress: number; status: "attente" | "envoi" | "ok" | "erreur"; error?: string };

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/tiff";
const PARALLEL = 2;

/** Drag-and-drop multi-upload, one request per file with its own progress bar. */
export default function Uploader({ stages, espaces, albums }: { stages: Option[]; espaces: Option[]; albums: string[] }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const defaults = useRef<HTMLFormElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [over, setOver] = useState(false);
  const busy = items.some((i) => i.status === "attente" || i.status === "envoi");

  const patch = (key: string, p: Partial<Item>) => setItems((list) => list.map((i) => (i.key === key ? { ...i, ...p } : i)));

  const send = (file: File, key: string) =>
    new Promise<void>((resolve) => {
      const fd = new FormData(defaults.current!);
      fd.append("file", file);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/admin/api/upload");
      xhr.upload.onprogress = (e) => e.lengthComputable && patch(key, { progress: Math.round((e.loaded / e.total) * 100) });
      xhr.onload = () => {
        let error: string | undefined;
        try {
          error = JSON.parse(xhr.responseText).error;
        } catch {
          error = "Réponse inattendue du serveur.";
        }
        patch(key, xhr.status === 200 ? { status: "ok", progress: 100 } : { status: "erreur", error });
        resolve();
      };
      xhr.onerror = () => {
        patch(key, { status: "erreur", error: "Connexion interrompue." });
        resolve();
      };
      patch(key, { status: "envoi" });
      xhr.send(fd);
    });

  const start = async (files: FileList | File[]) => {
    const batch = [...files].map((f) => ({ file: f, key: `${f.name}-${f.size}-${Math.random()}` }));
    if (!batch.length) return;
    setItems((list) => [...batch.map(({ file, key }) => ({ key, name: file.name, preview: URL.createObjectURL(file), progress: 0, status: "attente" as const })), ...list]);
    const queue = [...batch];
    await Promise.all(
      Array.from({ length: PARALLEL }, async () => {
        for (let next = queue.shift(); next; next = queue.shift()) await send(next.file, next.key);
      }),
    );
    router.refresh();
  };

  const done = items.filter((i) => i.status === "ok").length;
  const failed = items.filter((i) => i.status === "erreur").length;

  return (
    <section aria-labelledby="import" className="rounded-[28px] bg-blanc p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="import" className="display text-[1.6rem] text-encre">Importer des photos</h2>
        {items.length > 0 && (
          <p className="text-[13px] text-encre/60" aria-live="polite">
            {done} importée{done > 1 ? "s" : ""}
            {failed > 0 && <span className="text-argile"> · {failed} en erreur</span>}
            {busy && " · envoi en cours…"}
          </p>
        )}
      </div>

      <form ref={defaults} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" onSubmit={(e) => e.preventDefault()}>
        <label className="block">
          <span className="text-[12px] font-medium text-encre/70">Étape</span>
          <select name="stageId" className={inputClass} defaultValue="">
            <option value="">Aucune</option>
            {stages.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[12px] font-medium text-encre/70">Album</span>
          <input name="album" list="albums" className={inputClass} placeholder="Ex. Visite du 12 mars" />
          <datalist id="albums">
            {albums.map((a) => <option key={a} value={a} />)}
          </datalist>
        </label>
        <label className="block">
          <span className="text-[12px] font-medium text-encre/70">Espace</span>
          <select name="espace" className={inputClass} defaultValue="exterieur">
            {espaces.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[12px] font-medium text-encre/70">Type</span>
          <select name="kind" className={inputClass} defaultValue="photo">
            <option value="photo">Photo du chantier</option>
            <option value="rendu">Rendu 3D</option>
            <option value="plan">Plan technique</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[12px] font-medium text-encre/70">Date affichée</span>
          <input name="dateLabel" className={inputClass} placeholder="Ex. Mars 2027" />
        </label>
      </form>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          start(e.dataTransfer.files);
        }}
        className={`mt-6 flex flex-col items-center justify-center gap-4 rounded-[24px] border-2 border-dashed px-6 py-12 text-center transition-colors ${
          over ? "border-foret bg-menthe/40" : "border-encre/15 bg-lin"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-9 w-9 text-foret" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
        </svg>
        <p className="text-[15px] text-encre">Glissez vos photos ici</p>
        <p className="mono text-[12px] text-encre/60">JPEG, PNG, WebP, AVIF ou TIFF · 20 Mo maximum par fichier</p>
        <button type="button" onClick={() => input.current?.click()} className="pill h-11 bg-foret px-6 text-[14px] text-blanc hover:bg-foret-2">
          Choisir des fichiers
        </button>
        <input
          ref={input}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          aria-label="Choisir des photos à importer"
          onChange={(e) => {
            if (e.target.files) start(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="max-w-md text-[12px] text-encre/55">
          Les photos sont redimensionnées pour le web et leurs métadonnées (dont la position GPS) sont supprimées.
        </p>
      </div>

      {items.length > 0 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <li key={i.key} className="flex items-center gap-3 rounded-2xl bg-lin p-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
              <img src={i.preview} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] text-encre">{i.name}</p>
                {i.status === "erreur" ? (
                  <p className="text-[12px] text-argile">{i.error}</p>
                ) : (
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-encre/10" role="progressbar" aria-valuenow={i.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Envoi de ${i.name}`}>
                    <div className={`h-full rounded-full transition-all ${i.status === "ok" ? "bg-foret" : "bg-terracotta"}`} style={{ width: `${i.progress}%` }} />
                  </div>
                )}
              </div>
              <span className="shrink-0 text-[12px] text-encre/60">{i.status === "ok" ? "✓" : i.status === "attente" ? "en attente" : i.status === "envoi" ? `${i.progress} %` : ""}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
