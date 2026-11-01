import Link from "next/link";

type Item = { href: string; eyebrow: string; title: string; text: string };

/** Two large links closing a page, pointing to related sections. */
export default function NextLinks({ items }: { items: [Item, Item] }) {
  return (
    <section aria-label="Pour aller plus loin" className="border-t border-encre/10 bg-lin">
      <div className="wrap grid md:grid-cols-2">
        {items.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            className={`group flex items-end justify-between gap-6 py-16 md:py-24 ${i === 1 ? "border-t border-encre/10 md:border-l md:border-t-0 md:pl-[var(--gutter)]" : "md:pr-[var(--gutter)]"}`}
          >
            <div>
              <p className="eyebrow text-terracotta">{c.eyebrow}</p>
              <p className="display mt-4 text-[clamp(2.4rem,5vw,4.6rem)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3">
                {c.title}
              </p>
              <p className="mt-3 text-sm text-encre/60">{c.text}</p>
            </div>
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-encre/20 transition-colors duration-500 group-hover:border-terracotta group-hover:bg-terracotta group-hover:text-ivoire">
              <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform duration-500 group-hover:-rotate-45" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
