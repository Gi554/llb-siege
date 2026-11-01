"use client";

import { useActionState } from "react";
import { updateAccount, type UserFormState } from "@/app/admin/(espace)/utilisateurs/actions";
import { Field, inputClass, Notice, SubmitButton } from "../ui";

export default function AccountForm({ name, email, role }: { name: string; email: string; role: string }) {
  const [state, action] = useActionState<UserFormState, FormData>(updateAccount, {});
  return (
    <form action={action} key={state.ok} className="max-w-2xl space-y-6 rounded-[28px] bg-blanc p-6 md:p-8">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.ok && <Notice>{state.ok}</Notice>}
      <p className="text-[14px] text-encre/70">
        {email} · {role === "ADMIN" ? "Administrateur" : "Éditeur"}
      </p>
      <Field label="Nom affiché">
        <input name="name" defaultValue={name} required maxLength={80} className={inputClass} />
      </Field>
      <fieldset className="space-y-4 border-t border-encre/10 pt-6">
        <legend className="font-display text-[1.2rem] font-medium text-encre">Changer de mot de passe</legend>
        <p className="text-[13px] text-encre/60">Laissez vide pour garder le mot de passe actuel. 10 caractères minimum.</p>
        <Field label="Mot de passe actuel">
          <input name="current" type="password" autoComplete="current-password" className={inputClass} />
        </Field>
        <Field label="Nouveau mot de passe">
          <input name="password" type="password" autoComplete="new-password" minLength={10} className={inputClass} />
        </Field>
        <Field label="Confirmer le nouveau mot de passe">
          <input name="confirm" type="password" autoComplete="new-password" className={inputClass} />
        </Field>
      </fieldset>
      <SubmitButton>Enregistrer</SubmitButton>
    </form>
  );
}
