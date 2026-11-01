import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleGallery from "@/components/actualites/ArticleGallery";
import { getArticle, getNews } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getNews()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const found = await getArticle((await params).slug);
  if (!found) return {};
  const { article } = found;
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { type: "article", images: [{ url: article.image.src, alt: article.image.alt }] },
  };
}

export default async function ArticlePage({ params }: Params) {
  const found = await getArticle((await params).slug);
  if (!found) notFound();
  const { article, prev, next } = found;

  return (
    <article className="bg-blanc">
      <header className="container-site pb-12 pt-14 md:pt-20">
        <nav aria-label="Fil d'Ariane" className="text-[13px] text-encre/60">
          <Link href="/actualites" className="link-underline pb-0.5 hover:text-encre">
            Actualités
          </Link>
          <span aria-hidden="true" className="mx-2">›</span>
          <span className="text-encre">{article.category}</span>
        </nav>

        {article.source === "demo" && (
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-dashed border-terracotta px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-terracotta">
            Article de démonstration
          </p>
        )}

        <div className="mt-8 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="text-[11px] uppercase tracking-[0.12em] text-encre/55">
              {article.category} · {article.dateLabel}
            </p>
            <h1 className="display mt-4 text-[clamp(2.6rem,5vw,4.4rem)] leading-[0.98] text-encre">{article.title}</h1>
          </div>
          <p className="mono self-end text-[13px] text-encre/80 md:col-span-4">{article.excerpt}</p>
        </div>
      </header>

      <div className="container-site">
        <div className="relative aspect-[16/9] overflow-hidden bg-ivoire">
          <Image src={article.image.src} alt={article.image.alt} fill priority quality={85} sizes="(min-width: 1240px) 1200px, 100vw" className="object-cover" />
        </div>
        {article.image.caption && <p className="mt-3 text-[12px] text-encre/60">{article.image.caption} — NPS GROUP</p>}
      </div>

      <div className="container-site grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <aside className="md:col-span-3">
          <span aria-hidden="true" className="block h-px w-full max-w-[12rem] bg-terracotta" />
          <dl className="mt-6 space-y-4 text-[13px]">
            <div>
              <dt className="text-encre/55">Catégorie</dt>
              <dd className="text-encre">{article.category}</dd>
            </div>
            <div>
              <dt className="text-encre/55">Date</dt>
              <dd className="text-encre">{article.dateLabel}</dd>
            </div>
          </dl>
        </aside>
        <div className="space-y-6 text-[17px] leading-[1.75] text-encre/85 md:col-span-7">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      {article.media && article.media.length > 0 && (
        <section aria-label="Images de l'article" className="bg-ivoire py-16 md:py-20">
          <div className="container-site">
            <h2 className="display text-[clamp(1.8rem,2.6vw,2.4rem)] text-encre">En images</h2>
            <div className="mt-8">
              <ArticleGallery items={article.media} label={article.title} />
            </div>
          </div>
        </section>
      )}

      {(prev || next) && (
        <nav aria-label="Autres actualités" className="border-t border-encre/10 bg-lin">
          <div className="container-site grid md:grid-cols-2">
            {[prev, next].map((n, i) =>
              n ? (
                <Link
                  key={n.slug}
                  href={`/actualites/${n.slug}`}
                  className={`group flex items-center gap-5 py-12 ${i === 1 ? "border-t border-encre/10 md:justify-end md:border-l md:border-t-0 md:pl-[var(--gutter)] md:text-right" : "md:pr-[var(--gutter)]"}`}
                >
                  <span className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-full ${i === 1 ? "md:order-last" : ""}`}>
                    <Image src={n.image.src} alt="" fill sizes="80px" className="object-cover" />
                  </span>
                  <span>
                    <span className="block text-[11px] uppercase tracking-[0.12em] text-terracotta">{i === 0 ? "Précédent" : "Suivant"}</span>
                    <span className="display mt-1 block text-[1.4rem] leading-tight text-encre transition-colors group-hover:text-foret-2">{n.title}</span>
                  </span>
                </Link>
              ) : (
                <span key={i} className="hidden md:block" />
              ),
            )}
          </div>
        </nav>
      )}
    </article>
  );
}
