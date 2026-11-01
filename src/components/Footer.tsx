import Link from "next/link";
import { nav } from "@/content/navigation";
import { projet } from "@/content/projet";

export default function Footer() {
  const words = ["Suivre la construction", "Une vision prend vie", "Cotonou · Bénin"];
  return (
    <footer data-header="on-dark" className="grain relative overflow-hidden bg-foret text-ivoire">
      <Link href="/chantier" className="group block border-b border-ivoire/10 py-[clamp(3rem,7vw,6rem)]" aria-label="Suivre la construction">
        <div className="flex w-max marquee-track group-hover:[animation-play-state:paused]" aria-hidden="true">
          {[0, 1].map((k) => (
            <div key={k} className="display flex shrink-0 items-center gap-[4vw] pr-[4vw] text-[clamp(3.5rem,10vw,10rem)] leading-none">
              {words.map((w, i) => (
                <span key={i} className="flex items-center gap-[4vw]">
                  <span className={i % 2 ? "italic text-or" : "transition-colors duration-500 group-hover:text-or"}>{w}</span>
                  <span className="inline-block h-[0.14em] w-[0.14em] rounded-full bg-terracotta" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </Link>

      <div className="wrap grid grid-cols-2 gap-x-[var(--gutter)] gap-y-12 py-16 md:grid-cols-12">
        <div className="col-span-2 md:col-span-5">
          <p className="display text-3xl leading-tight md:text-4xl">
            {projet.name}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivoire/60">{projet.intro}</p>
        </div>
        <nav aria-label="Pied de page" className="md:col-span-3 md:col-start-7">
          <p className="eyebrow text-ivoire/45">Explorer</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-underline pb-0.5 text-ivoire/85 hover:text-ivoire">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="eyebrow text-ivoire/45">Le projet</p>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-ivoire/50">Maître d&apos;ouvrage</dt>
              <dd>{projet.owner}</dd>
            </div>
            <div>
              <dt className="text-ivoire/50">Architecture</dt>
              <dd>{projet.architect}</dd>
            </div>
            <div>
              <dt className="text-ivoire/50">Lieu</dt>
              <dd>{projet.city}, {projet.country}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="wrap flex flex-col gap-3 border-t border-ivoire/10 py-6 text-xs text-ivoire/45 md:flex-row md:justify-between">
        <span>© {new Date().getFullYear()} {projet.owner}</span>
        <span>Visuels : perspectives architecturales NPS GROUP</span>
      </div>

      <p aria-hidden="true" className="display pointer-events-none select-none px-[var(--gutter)] pb-2 text-[31vw] leading-[0.72] text-ivoire/[0.06]">
        LLB
      </p>
    </footer>
  );
}
