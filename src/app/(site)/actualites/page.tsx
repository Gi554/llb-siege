import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SplitHero from "@/components/SplitHero";
import NewsList from "@/components/actualites/NewsList";
import NextLinks from "@/components/NextLinks";
import { getNews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Annonces, comptes rendus et événements liés à la construction du siège de la Ligue pour la Lecture de la Bible à Cotonou.",
};

export default async function ActualitesPage() {
  const news = await getNews();
  const lead = news.find((n) => n.source === "projet") ?? news[0];

  return (
    <>
      <SplitHero
        eyebrow="Actualités"
        title="Le journal du chantier."
        text={<p>Annonces, comptes rendus de visite et événements : toutes les nouvelles du futur siège, au fil de la construction.</p>}
        footer={
          <Link href="#a-la-une" className="pill h-[60px] w-[217px] bg-menthe text-[15px] text-foret hover:bg-blanc">
            Lire les actualités
          </Link>
        }
      >
        <Image src={lead.image.src} alt={lead.image.alt} fill priority quality={85} sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
        <Link
          href={`/actualites/${lead.slug}`}
          className="group absolute bottom-0 left-0 w-full bg-blanc p-6 shadow-[0_30px_60px_rgba(6,37,33,.2)] sm:w-[min(28rem,80%)] md:bottom-10 md:left-10 md:p-7"
        >
          <p className="text-[11px] uppercase tracking-[0.12em] text-terracotta">
            Dernière annonce · {lead.dateLabel}
          </p>
          <p className="display mt-3 text-[1.7rem] leading-tight text-encre">{lead.title}</p>
          <span className="mt-4 inline-block text-[13px] font-medium text-encre">
            Lire l&apos;article <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">›</span>
          </span>
        </Link>
      </SplitHero>

      <NewsList items={news} />

      <NextLinks
        items={[
          { href: "/chantier", eyebrow: "Suivre", title: "Évolution des travaux", text: "Chaque étape du chantier, de la conception à l'inauguration." },
          { href: "/galerie", eyebrow: "Explorer", title: "Galerie", text: "Toutes les images du projet, filtrables par espace et par étape." },
        ]}
      />
    </>
  );
}
