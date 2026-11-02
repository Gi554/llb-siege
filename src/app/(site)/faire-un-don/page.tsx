import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SplitHero from "@/components/SplitHero";
import Reveal from "@/components/ui/Reveal";
import { etatActuel } from "@/content/chantier";
import { images } from "@/content/projet";
import { displayNumber, steps, whatsappLink } from "@/content/don";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Faire un don",
  description:
    "Contribuez à la construction du siège de la Ligue pour la Lecture de la Bible à Calavi : écrivez à l'équipe sur WhatsApp pour connaître les moyens de donner.",
};

function WhatsAppButton({ href, className = "" }: { href: string; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`pill h-[60px] gap-3 whitespace-nowrap px-7 text-[15px] ${className}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
      </svg>
      Donner via WhatsApp
    </a>
  );
}

// Picks up content changed directly in the database (admin changes refresh at once).
export const revalidate = 300;

export default async function DonPage() {
  const s = await getSettings();
  const href = whatsappLink(s["don.whatsapp"]);

  return (
    <>
      <SplitHero
        eyebrow="Faire un don"
        title={s["don.title"]}
        text={<p>{s["don.text"]}</p>}
        footer={<WhatsAppButton href={href} className="bg-menthe text-foret hover:bg-blanc" />}
      >
        <Image src={images.facade2.src} alt={images.facade2.alt} fill priority quality={85} sizes="(min-width: 768px) 110vw, 200vw" className="object-cover" />
      </SplitHero>

      {/* From the suspended building to the future headquarters */}
      <section aria-label="Ce que votre don permet" className="bg-blanc py-24 md:py-32">
        <div className="container-site grid items-center gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="font-mono text-[17px] text-encre/60">Pourquoi donner</p>
            <h2 className="display mt-6 text-[clamp(2.3rem,3.6vw,3.2rem)] leading-tight text-encre">Reprendre le chantier, achever le siège.</h2>
            <p className="mono mt-8 max-w-md text-[13px] text-encre/80">
              Le plan de construction a été établi, les fondations posées et le bâtiment élevé jusqu&apos;à la toiture. Les travaux ont
              ensuite été suspendus au profit des ministères de la LLB-Bénin. Le nouveau projet dessiné par NPS GROUP donne au siège sa
              forme définitive : une librairie, des bureaux, une salle de conférence et un patio planté.
            </p>
            <Link href="/chantier" className="mt-10 inline-block text-[14px] text-encre underline underline-offset-4 hover:text-vert">
              Voir l&apos;évolution des travaux
            </Link>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {[
              { media: etatActuel[0], label: "Aujourd'hui", sub: "Le bâtiment existant — novembre 2026" },
              { media: images.facade1, label: "Demain", sub: "Le futur siège — perspective NPS GROUP" },
            ].map((f, i) => (
              <Reveal as="figure" key={f.media.src} delay={i * 0.1}>
                <div className="relative aspect-[4/3] overflow-hidden bg-sable">
                  <Image src={f.media.src} alt={f.media.alt} fill sizes="(min-width: 1024px) 46vw, (min-width: 640px) 75vw, 165vw" className="object-cover" />
                </div>
                <figcaption className="mt-4">
                  <span className="block font-sans text-[1.15rem] font-medium text-encre">{f.label}</span>
                  <span className="text-[12px] text-encre/60">{f.sub}</span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How to give */}
      <section aria-label="Comment contribuer" className="bg-ivoire py-24 md:py-32">
        <div className="container-site">
          <Reveal as="h2" className="outline-text text-[clamp(3.4rem,7vw,6.4rem)] text-foret [--stroke:1.8px]">
            comment donner
          </Reveal>
          <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 0.08}>
                <span aria-hidden="true" className="block h-px w-full bg-encre/70" />
                <span className="mt-4 block font-mono text-xs text-encre/50">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-sans text-[clamp(1.3rem,1.8vw,1.55rem)] font-medium leading-tight text-encre">{step.title}</h3>
                <p className="mono mt-4 text-[13px] text-encre/80">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Call to action */}
      <section aria-label="Contacter la Ligue" className="bg-foret py-24 text-blanc md:py-32">
        <Reveal className="container-site flex flex-col items-center text-center">
          <h2 className="display max-w-2xl text-[clamp(2.4rem,4vw,3.6rem)] leading-tight text-menthe">Chaque contribution fait avancer le chantier.</h2>
          <p className="mono mt-6 max-w-md text-[13px] text-blanc/80">
            Écrivez à l&apos;équipe de la Ligue : elle vous donnera toutes les informations pour contribuer au projet.
          </p>
          <WhatsAppButton href={href} className="mt-10 bg-menthe text-foret hover:bg-blanc" />
          <p className="mt-6 text-[13px] tracking-[0.04em] text-blanc/60">
            WhatsApp : <span className="tabular-nums text-blanc">{displayNumber(s["don.whatsapp"])}</span>
          </p>
        </Reveal>
      </section>
    </>
  );
}
