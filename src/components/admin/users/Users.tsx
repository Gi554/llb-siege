"use client";

import { useActionState, useState } from "react";
import { createUser, deleteUser, resetPassword, updateUser, type UserFormState } from "@/app/admin/(espace)/utilisateurs/actions";
import { inputClass, Notice, SubmitButton } from "../ui";

export type UserItem = { id: string; name: string; email: string; role: string; active: boolean; createdAt: string; me: boolean };

const ROLES = [
  { value: "EDITOR", label: "Éditeur — gère les contenus" },
  { value: "ADMIN", label: "Administrateur — contenus et comptes" },
];

/** Temporary password, shown once with a copy button. */
function OneTimePassword({ state }: { state: UserFormState }) {
  const [copied, setCopied] = useState(false);
  if (!state.password) return null;
  return (
    <div role="status" className="rounded-2xl bg-menthe/60 p-4 text-foret">
      <p className="text-[14px] font-medium">{state.ok}</p>
      <p className="mt-1 text-[13px]">
        Transmettez ces identifiants à la personne ; le mot de passe ne sera plus affiché. Elle pourra le changer dans « Mon compte ».
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <code className="rounded-xl bg-blanc px-3 py-2 font-mono text-[14px]">{state.email}</code>
        <code className="rounded-xl bg-blanc px-3 py-2 font-mono text-[14px]" data-temp-password>
          {state.password}
        </code>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(state.password!).then(() => setCopied(true))}
          className="rounded-full border border-foret/30 px-4 py-2 text-[13px] hover:bg-blanc"
        >
          {copied ? "Copié" : "Copier le mot de passe"}
        </button>
      </div>
    </div>
  );
}

export function CreateUser() {
  const [state, action] = useActionState<UserFormState, FormData>(createUser, {});
  return (
    <section aria-labelledby="nouveau" className="space-y-4 rounded-[28px] bg-blanc p-6 md:p-8">
      <h2 id="nouveau" className="display text-[1.5rem] text-encre">Ajouter une personne</h2>
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <OneTimePassword state={state} />
      <form action={action} className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
        <label className="block">
          <span className="text-[13px] font-medium text-encre">Nom</span>
          <input name="name" required maxLength={80} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-encre">Adresse e-mail</span>
          <input name="email" type="email" required className={inputClass} />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-encre">Rôle</span>
          <select name="role" defaultValue="EDITOR" className={inputClass}>
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </label>
        <SubmitButton pendingLabel="Création…">Créer le compte</SubmitButton>
      </form>
    </section>
  );
}

export function UserRow({ user }: { user: UserItem }) {
  const [saved, save] = useActionState<UserFormState, FormData>(updateUser, {});
  const [pwd, reset] = useActionState<UserFormState, FormData>(resetPassword, {});
  const [removed, remove] = useActionState<UserFormState, FormData>(deleteUser, {});
  const [asking, setAsking] = useState<null | "reset" | "delete">(null);
  if (removed.ok) return null;

  return (
    <li className="space-y-4 rounded-[24px] bg-blanc p-5" data-user={user.email}>
      <form action={save} className="grid gap-4 md:grid-cols-[1.2fr_1.4fr_1fr_auto_auto] md:items-end">
        <input type="hidden" name="id" value={user.id} />
        <label className="block">
          <span className="text-[12px] font-medium text-encre/70">Nom</span>
          <input name="name" defaultValue={user.name} required maxLength={80} className={inputClass} />
        </label>
        <div>
          <span className="text-[12px] font-medium text-encre/70">Adresse e-mail</span>
          <p className="mt-2 truncate py-3 text-[15px] text-encre">
            {user.email}
            {user.me && <span className="ml-2 rounded-full bg-menthe px-2 py-0.5 text-[11px] text-foret">vous</span>}
          </p>
        </div>
        <label className="block">
          <span className="text-[12px] font-medium text-encre/70">Rôle</span>
          <select name="role" defaultValue={user.role} disabled={user.me} className={inputClass}>
            <option value="EDITOR">Éditeur</option>
            <option value="ADMIN">Administrateur</option>
          </select>
          {user.me && <input type="hidden" name="role" value={user.role} />}
        </label>
        <label className="flex items-center gap-2 pb-3 text-[14px] text-encre">
          <input type="checkbox" name="active" defaultChecked={user.active} disabled={user.me} className="h-5 w-5 accent-foret" />
          Actif
          {user.me && <input type="hidden" name="active" value="on" />}
        </label>
        <SubmitButton variant="ghost">Enregistrer</SubmitButton>
      </form>

      {(saved.error || pwd.error || removed.error) && <Notice tone="error">{saved.error ?? pwd.error ?? removed.error}</Notice>}
      {saved.ok && <Notice>{saved.ok}</Notice>}
      <OneTimePassword state={pwd} />

      {!user.me && (
        <div className="flex flex-wrap items-center gap-2 border-t border-encre/10 pt-3 text-[13px]">
          <span className="mr-auto text-encre/50">Créé le {new Date(user.createdAt).toLocaleDateString("fr-FR")}</span>
          {asking === "reset" ? (
            <form action={reset} onSubmit={() => setAsking(null)} className="flex items-center gap-2">
              <input type="hidden" name="id" value={user.id} />
              <span className="text-encre/70">Remplacer son mot de passe ?</span>
              <button type="submit" className="rounded-full bg-foret px-4 py-2 text-blanc">Confirmer</button>
              <button type="button" onClick={() => setAsking(null)} className="rounded-full px-3 py-2 text-encre/70">Annuler</button>
            </form>
          ) : asking === "delete" ? (
            <form action={remove} className="flex items-center gap-2">
              <input type="hidden" name="id" value={user.id} />
              <span className="text-encre/70">Supprimer définitivement ce compte ?</span>
              <button type="submit" className="rounded-full bg-terracotta px-4 py-2 text-blanc hover:bg-argile">Supprimer</button>
              <button type="button" onClick={() => setAsking(null)} className="rounded-full px-3 py-2 text-encre/70">Annuler</button>
            </form>
          ) : (
            <>
              <button type="button" onClick={() => setAsking("reset")} className="rounded-full border border-encre/20 px-4 py-2 hover:border-foret">
                Nouveau mot de passe
              </button>
              <button type="button" onClick={() => setAsking("delete")} className="rounded-full px-4 py-2 text-argile hover:bg-terracotta/10">
                Supprimer
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
}
