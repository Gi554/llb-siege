import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/content/types";
import Reveal, { Lines } from "@/components/ui/Reveal";

export default function NewsPreview({ items }: { items: NewsItem[] }) {
  return (
    <section data-header="on-light" aria-label="Actualités" className="bg-ivoire py-[clamp(6rem,12vw,11rem)]">
      <div className="wrap">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal className="flex items-center gap-4">
              <span className="eyebrow text-terracotta">07</span>
              <span className="h-px w-10 bg-encre/25" />
              <span className="eyebrow text-pierre">Actualités</span>
            </Reveal>
            <Reveal as="h2" mode="lines" className="display mt-6 text-[clamp(2.8rem,6.4vw,6.6rem)]">
              <Lines text={"Le journal"} />
              <Lines text={"du chantier."} className="italic text-terracotta" />
            </Reveal>
          </div>
          <Link href="/actualites" className="link-underline self-start pb-0.5 text-sm font-medium md:self-auto">
            Toutes les actualités
          </Link>
        </div>

        <ul className="mt-14 grid gap-x-[var(--gutter)] gap-y-14 md:grid-cols-3">
          {items.map((n, i) => (
            <Reveal as="li" key={n.slug} delay={i * 0.1} className={i === 1 ? "md:mt-24" : i === 2 ? "md:mt-12" : undefined}>
              <article className="group">
                <Link href={`/actualites#${n.slug}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
                    <Image
                      src={n.image.src}
                      alt={n.image.alt}
                      fill
                      sizes="(min-width: 768px) 32vw, 100vw"
                      className={`object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.08] ${n.source === "demo" ? "grayscale-[.35]" : ""}`}
                    />
                    {n.source === "demo" && (
                      <span className="absolute left-4 top-4 rounded-full border border-dashed border-ivoire/80 bg-encre/50 px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ivoire backdrop-blur">
                        Démo
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex items-center gap-3 text-sm text-encre/55">
                    <span className="text-terracotta">{n.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{n.dateLabel}</span>
                  </div>
                  <h3 className="display mt-3 text-[clamp(1.5rem,2.2vw,2.1rem)] leading-[1.08] transition-colors duration-500 group-hover:text-terracotta">
                    {n.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-encre/65">{n.excerpt}</p>
                </Link>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
