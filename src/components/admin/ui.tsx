"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

// Small form kit for the back-office, in the site's visual language.

export const inputClass =
  "mt-2 block w-full rounded-2xl border border-encre/15 bg-blanc px-4 py-3 text-[15px] text-encre outline-none transition-colors placeholder:text-encre/35 focus:border-foret";

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-encre">{label}</span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-[12px] text-encre/55">{hint}</span>}
      {error && <span className="mt-1.5 block text-[12px] text-argile">{error}</span>}
    </label>
  );
}

export function PageHeader({ title, outline, back, actions }: { title: string; outline?: string; back?: { href: string; label: string }; actions?: ReactNode }) {
  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        {back && (
          <Link href={back.href} className="text-[13px] text-encre/60 hover:text-encre">
            ‹ {back.label}
          </Link>
        )}
        <h1 className="display mt-2 text-[clamp(2.2rem,3.6vw,3.2rem)] text-encre">{title}</h1>
        {outline && (
          <p aria-hidden="true" className="outline-text mt-1 text-[clamp(2.4rem,4.6vw,3.8rem)] leading-none text-sauge [--stroke:1.5px]">
            {outline}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

export function Notice({ tone = "ok", children }: { tone?: "ok" | "error"; children: ReactNode }) {
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`rounded-2xl px-5 py-3 text-[14px] ${tone === "ok" ? "bg-menthe/60 text-foret" : "bg-terracotta/10 text-argile"}`}>
      {children}
    </p>
  );
}

const TONES = {
  primary: "bg-foret text-blanc hover:bg-foret-2",
  ghost: "border border-encre/20 bg-blanc text-encre hover:border-foret",
  mint: "bg-menthe text-foret hover:bg-blanc",
};

/**
 * Submit button showing a pending label while the action runs. Pass `value`
 * to show the pending label only on the button that was clicked (it is
 * matched against the submitted "intent" field).
 */
export function SubmitButton({
  children,
  pendingLabel = "Enregistrement…",
  variant,
  tone,
  value,
  onClick,
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "ghost";
  tone?: keyof typeof TONES;
  value?: string;
  onClick?: () => void;
}) {
  const { pending, data } = useFormStatus();
  const mine = pending && (!value || data?.get("intent") === value);
  return (
    <button type="submit" onClick={onClick} disabled={pending} className={`pill h-12 px-6 text-[14px] disabled:opacity-60 ${TONES[tone ?? variant ?? "primary"]}`}>
      {mine ? pendingLabel : children}
    </button>
  );
}

/** Two-step destructive button: first click asks, second confirms. */
export function ConfirmAction({ action, label, confirmLabel = "Confirmer la suppression", hidden }: { action: (fd: FormData) => void | Promise<void>; label: string; confirmLabel?: string; hidden?: Record<string, string> }) {
  const [asking, setAsking] = useState(false);
  return asking ? (
    <form action={action} className="flex items-center gap-2">
      {hidden && Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <button type="submit" className="rounded-full bg-terracotta px-4 py-2 text-[13px] text-blanc hover:bg-argile">
        {confirmLabel}
      </button>
      <button type="button" onClick={() => setAsking(false)} className="rounded-full px-3 py-2 text-[13px] text-encre/70 hover:text-encre">
        Annuler
      </button>
    </form>
  ) : (
    <button type="button" onClick={() => setAsking(true)} className="rounded-full px-4 py-2 text-[13px] text-argile hover:bg-terracotta/10">
      {label}
    </button>
  );
}

export function StatePill({ state }: { state: string }) {
  return state === "PUBLISHED" ? (
    <span className="rounded-full bg-menthe px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-foret">Publié</span>
  ) : (
    <span className="rounded-full border border-dashed border-encre/30 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-encre/60">Brouillon</span>
  );
}
