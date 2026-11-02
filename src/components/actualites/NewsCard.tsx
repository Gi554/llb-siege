import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/content/types";

/** Square picture, category and date, title, excerpt and an underlined "read" link. */
export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="group">
      <Link href={`/actualites/${item.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-sable">
          <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width: 1024px) 58vw, (min-width: 640px) 100vw, 220vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          {item.source === "demo" && (
            <span className="absolute left-3 top-3 rounded-full bg-blanc px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-encre">
              Exemple
            </span>
          )}
        </div>
        <p className="mt-5 text-[11px] uppercase tracking-[0.12em] text-encre/55">
          {item.category} · {item.dateLabel}
        </p>
        <h3 className="mt-2 font-sans text-[1.15rem] font-medium leading-snug text-encre">{item.title}</h3>
        <p className="mono mt-3 text-[12.5px] text-encre/75">{item.excerpt}</p>
        <span className="mt-6 block border-b border-encre/50 pb-4 text-[13px] font-medium text-encre">
          Lire l&apos;article <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">›</span>
        </span>
      </Link>
    </article>
  );
}
