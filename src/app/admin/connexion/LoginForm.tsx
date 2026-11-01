"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export default function LoginForm({ suite }: { suite?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="space-y-5" noValidate>
      {suite && <input type="hidden" name="suite" value={suite} />}
      <label className="block">
        <span className="text-[13px] font-medium text-encre">Adresse e-mail</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-2 block h-12 w-full rounded-full border border-encre/20 bg-blanc px-5 text-[15px] outline-none transition-colors focus:border-foret"
        />
      </label>
      <label className="block">
        <span className="text-[13px] font-medium text-encre">Mot de passe</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 block h-12 w-full rounded-full border border-encre/20 bg-blanc px-5 text-[15px] outline-none transition-colors focus:border-foret"
        />
      </label>
      {state.error && (
        <p role="alert" className="rounded-2xl bg-terracotta/10 px-4 py-3 text-[13px] text-argile">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="pill h-[54px] w-full bg-foret text-[15px] text-blanc hover:bg-foret-2 disabled:opacity-60">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
