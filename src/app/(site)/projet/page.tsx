import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SplitHero from "@/components/SplitHero";
import NextLinks from "@/components/NextLinks";
import Reveal from "@/components/ui/Reveal";
import PlanSection from "@/components/projet/PlanSection";
import MaterialsRail from "@/components/projet/MaterialsRail";
import { getProjet } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Le projet",
  description:
    "La vision architecturale du futur siège de la Ligue pour la Lecture de la Bible à Calavi : intentions, plan, espaces et matériaux du projet signé NPS GROUP.",
};

// Picks up content changed directly in the database (admin changes refresh at once).
export const revalidate = 300;

export default async function ProjetPage() {
  const [{ projet, images, intentions, planRooms, facts, spaces, materials, actors }, s] = await Promise.all([getProjet(), getSettings()]);

  return (
    <>
      <SplitHero
        eyebrow="Le projet"
        title={s["projet.title"]}
        text={<p>{projet.descriptif[0]}</p>}
        footer={
          <Link href="#plan" className="pill h-[60px] w-[217px] bg-menthe text-[15px] text-foret hover:bg-blanc">
            Voir le plan
          </Link>
        }
      >
        <Image src={images.patio.src} alt={images.patio.alt} fill priority quality={85} sizes="(min-width: 768px) 110vw, 200vw" className="object-cover object-[50%_50%]" />
      </SplitHero>

      {/* Intentions */}
      <section aria-label="Les intentions du projet" className="overflow-hidden bg-blanc py-24 md:py-36">
        <div className="container-site grid items-center gap-16 lg:grid-cols-12">
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:col-span-6">
            {intentions.map((f, i) => (
              <Reveal as="article" key={f.title} delay={i * 0.08}>
                <span aria-hidden="true" className="block h-px w-full bg-encre/70" />
                <h2 className="mt-4 font-sans text-[clamp(1.4rem,1.9vw,1.65rem)] font-medium leading-tight text-encre">{f.title}</h2>
                <p className="mono mt-4 text-[13px] text-encre/80">{f.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="relative h-[420px] sm:h-[520px] lg:col-span-6" delay={0.15}>
            <div className="absolute right-0 top-0 h-[85%] w-[78%] overflow-hidden">
              <Image src={images.facadeDetail.src} alt={images.facadeDetail.alt} fill sizes="(min-width: 1024px) 40vw, 80vw" className="object-cover" />
            </div>
            <figure className="absolute bottom-0 left-0 w-[62%] overflow-hidden bg-foret shadow-[0_30px_60px_rgba(6,37,33,.25)]">
              <div className="relative aspect-[16/10]">
                <Image src={images.facade2.src} alt={images.facade2.alt} fill sizes="(min-width: 1024px) 42vw, 84vw" className="object-cover" />
              </div>
              <figcaption className="px-4 py-3 font-display text-[15px] font-medium text-blanc">
                Façade et portail d&apos;entrée
                <span className="block font-sans text-[11px] font-normal text-blanc/60">Perspective 2 — NPS GROUP</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Values band */}
      <section aria-label="Les valeurs" className="bg-ocre py-20 md:py-28">
        <div className="container-site grid items-end gap-12 md:grid-cols-12">
          <Reveal as="h2" className="outline-text stroke-ink text-[clamp(3.4rem,7.5vw,7rem)] [--stroke:2.5px] md:col-span-8">
            {projet.values.map((v) => (
              <span key={v} className="block">
                {v}
              </span>
            ))}
          </Reveal>
          <Reveal className="md:col-span-4" delay={0.15}>
            <span aria-hidden="true" className="block h-[2px] w-[180px] bg-encre" />
            <p className="mono mt-8 text-[13px] text-encre/85">
              Le projet s&apos;appuie sur une charte architecturale sobre et contemporaine, traduisant les valeurs associées à
              l&apos;institution : accueil, sérénité, partage, transmission.
            </p>
          </Reveal>
        </div>
      </section>

      <PlanSection plan={images.plan} rooms={planRooms} facts={facts} />

      {/* Spaces */}
      <section aria-label="Les espaces" className="bg-ivoire py-24 md:py-32">
        <div className="container-site">
          <div className="grid items-end gap-10 md:grid-cols-12">
            <Reveal className="md:col-span-5 md:pb-6">
              <p className="font-mono text-[17px] text-encre/60">Les perspectives</p>
              <span className="mt-6 block h-px w-[215px] bg-encre/60" aria-hidden="true" />
            </Reveal>
            <Reveal as="h2" className="outline-text text-[clamp(4rem,8vw,7.2rem)] text-foret [--stroke:1.8px] md:col-span-7">
              <span className="block">les</span>
              <span className="block">espaces</span>
            </Reveal>
          </div>
          <ul className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {spaces.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={(i % 3) * 0.08}>
                <div className="relative aspect-[4/3] overflow-hidden bg-sable">
                  <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 43vw, (min-width: 640px) 75vw, 165vw" className="object-cover transition-transform duration-700 hover:scale-105" />
                </div>
                <p className="mt-5 text-[11px] uppercase tracking-[0.12em] text-encre/55">{s.image.caption}</p>
                <h3 className="mt-2 font-sans text-[1.15rem] font-medium leading-snug text-encre">{s.title}</h3>
                <p className="mono mt-3 border-b border-encre/40 pb-5 text-[12.5px] text-encre/75">{s.lede}</p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-14 flex justify-center">
            <Link href="/galerie" className="pill h-[58px] bg-foret px-7 text-[16px] text-blanc hover:bg-foret-2">
              Toutes les images
            </Link>
          </div>
        </div>
      </section>

      <MaterialsRail materials={materials} />

      {/* Façades */}
      <section aria-label="Les façades" className="bg-blanc pb-24 md:pb-32">
        <div className="container-site">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="display text-[clamp(2.3rem,3.6vw,3.2rem)] leading-tight text-encre">Quatre façades</h2>
            <p className="mono mx-auto mt-6 max-w-md text-[13px] text-encre/80">
              Façade principale, façade postérieure et façades latérales : une composition de plain-pied, entre enduits
              terracotta et béton, au milieu des palmiers.
            </p>
          </Reveal>
          <Reveal className="mt-12">
            <div className="relative aspect-[3097/2189] overflow-hidden bg-blanc">
              <Image src={images.facades.src} alt={images.facades.alt} fill quality={85} sizes="(min-width: 1240px) 1200px, 100vw" className="object-contain" />
            </div>
            <p className="mt-3 text-center text-[12px] text-encre/60">Planche des façades — NPS GROUP</p>
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section aria-label="L'équipe du projet" className="bg-foret py-20 text-blanc md:py-24">
        <div className="container-site">
          <h2 className="display text-[clamp(2.3rem,3.6vw,3.2rem)] text-menthe">L&apos;équipe du projet</h2>
          <dl className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {actors.map((a) => (
              <div key={a.label} className="border-t border-blanc/30 pt-5">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-blanc/60">{a.label}</dt>
                <dd className="mt-3 font-display text-[1.4rem] font-medium leading-tight">{a.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <NextLinks
        items={[
          { href: "/chantier", eyebrow: "Suivre", title: "Évolution des travaux", text: "Chaque étape du chantier, de la conception à l'inauguration." },
          { href: "/avant-apres", eyebrow: "Comparer", title: "Avant / Après", text: "Le projet et la réalité, sous le même angle." },
        ]}
      />
    </>
  );
}
