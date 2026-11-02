import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import type { PartnerItem } from "@/lib/partners";

/** Thanks to the partners and donors, with their logos (managed in the back-office). */
export default function Partners({ partners }: { partners: PartnerItem[] }) {
  if (partners.length === 0) return null;

  return (
    <section aria-labelledby="partenaires" className="bg-blanc py-24 md:py-32">
      <div className="container-site">
        <div className="grid items-end gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-5 md:pb-6">
            <p className="font-mono text-[17px] text-encre/60">Ils soutiennent le projet</p>
            <span className="mt-6 block h-px w-[215px] bg-encre/60" aria-hidden="true" />
          </Reveal>
          <Reveal as="h2" className="outline-text text-[clamp(3.4rem,7vw,6.4rem)] text-foret [--stroke:1.8px] md:col-span-7">
            <span id="partenaires" className="block">merci à nos</span>
            <span className="block">partenaires</span>
          </Reveal>
        </div>

        {/* Centred rows, so a handful of partners still looks deliberate */}
        <ul className="mt-16 flex flex-wrap justify-center gap-4">
          {partners.map((p, i) => {
            const logo = (
              <Image src={p.logo} alt={p.name} width={p.width} height={p.height} unoptimized className="max-h-16 w-auto max-w-[80%] object-contain md:max-h-20" />
            );
            const tile = "grid aspect-[3/2] w-full place-items-center rounded-[24px] bg-brume p-6 md:p-8";
            return (
              <Reveal as="li" key={p.id} delay={(i % 4) * 0.06} className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" title={p.name} className={`${tile} transition-colors hover:bg-menthe/50`}>
                    {logo}
                  </a>
                ) : (
                  <div className={tile}>{logo}</div>
                )}
              </Reveal>
            );
          })}
        </ul>

        <div className="mt-14 flex justify-center">
          <Link href="/faire-un-don" className="pill h-[58px] bg-foret px-7 text-[16px] text-blanc hover:bg-foret-2">
            Soutenir le projet
          </Link>
        </div>
      </div>
    </section>
  );
}
