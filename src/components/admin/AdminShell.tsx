"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/LampMark";
import type { SessionUser } from "@/lib/session";
import { logout } from "@/app/admin/actions";

type Item = { href: string; label: string; ready: boolean; adminOnly?: boolean };

// `ready: false` sections are announced but arrive in the next releases.
const NAV: Item[] = [
  { href: "/admin", label: "Tableau de bord", ready: true },
  { href: "/admin/etapes", label: "Étapes du chantier", ready: false },
  { href: "/admin/mediatheque", label: "Médiathèque", ready: false },
  { href: "/admin/comparaisons", label: "Avant / Après", ready: false },
  { href: "/admin/actualites", label: "Actualités", ready: false },
  { href: "/admin/contenus", label: "Textes des pages", ready: false },
  { href: "/admin/utilisateurs", label: "Utilisateurs", ready: false, adminOnly: true },
];

export default function AdminShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const items = NAV.filter((i) => !i.adminOnly || user.role === "ADMIN");
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  const nav = (
    <nav aria-label="Administration" className="flex flex-1 flex-col">
      <ul className="space-y-1">
        {items.map((i) =>
          i.ready ? (
            <li key={i.href}>
              <Link
                href={i.href}
                aria-current={isActive(i.href) ? "page" : undefined}
                className="flex items-center justify-between rounded-full px-4 py-2.5 text-[14px] text-blanc/80 transition-colors hover:bg-blanc/10 hover:text-blanc aria-[current=page]:bg-menthe aria-[current=page]:text-foret"
              >
                {i.label}
              </Link>
            </li>
          ) : (
            <li key={i.href} className="flex items-center justify-between rounded-full px-4 py-2.5 text-[14px] text-blanc/35" aria-disabled="true">
              {i.label}
              <span className="rounded-full border border-blanc/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]">bientôt</span>
            </li>
          ),
        )}
      </ul>
      <div className="mt-auto space-y-4 border-t border-blanc/10 pt-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-menthe font-display text-[15px] font-semibold text-foret" aria-hidden="true">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 text-[13px] leading-tight">
            <span className="block truncate text-blanc">{user.name}</span>
            <span className="block text-blanc/55">{user.role === "ADMIN" ? "Administrateur" : "Éditeur"}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/" target="_blank" className="rounded-full border border-blanc/25 px-4 py-2 text-[12px] text-blanc/85 hover:bg-blanc/10">
            Voir le site ↗
          </Link>
          <form action={logout}>
            <button type="submit" className="rounded-full border border-blanc/25 px-4 py-2 text-[12px] text-blanc/85 hover:bg-blanc/10">
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col gap-10 bg-foret px-5 py-8 text-blanc lg:flex">
        <Link href="/admin" aria-label="Tableau de bord" className="px-2">
          <Logo tone="light" />
        </Link>
        {nav}
      </aside>

      {/* Mobile bar + drawer */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between bg-foret px-[var(--gutter)] text-blanc lg:hidden">
        <Link href="/admin" aria-label="Tableau de bord">
          <Logo tone="light" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="admin-nav"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="relative grid h-10 w-10 place-items-center rounded-full border border-blanc/30"
        >
          <span className={`absolute h-[1.5px] w-4 bg-current transition-transform ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
          <span className={`absolute h-[1.5px] w-4 bg-current transition-transform ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
        </button>
      </div>
      {open && (
        <div id="admin-nav" className="fixed inset-x-0 bottom-0 top-16 z-30 flex flex-col overflow-y-auto bg-foret px-[var(--gutter)] py-6 text-blanc lg:hidden">
          {nav}
        </div>
      )}

      <main id="contenu" className="min-w-0 px-[var(--gutter)] py-8 md:py-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
