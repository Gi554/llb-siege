import Image from "next/image";
import Link from "next/link";
import type { Media } from "@/content/types";

export default function ComingSoon({ eyebrow, title, text, image }: { eyebrow: string; title: string; text: string; image: Media }) {
  return (
    <section data-header="on-dark" className="relative flex min-h-[100svh] items-end overflow-hidden bg-foret text-ivoire">
      <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-t from-foret via-foret/60 to-foret/20" />
      <div className="wrap relative pb-16 pt-40">
        <p className="eyebrow text-or">{eyebrow}</p>
        <h1 className="display mt-6 max-w-5xl text-[clamp(3rem,9vw,9rem)]">{title}</h1>
        <p className="mt-8 max-w-lg text-ivoire/75">{text}</p>
        <Link href="/" className="link-underline mt-10 inline-block pb-0.5 text-sm font-medium">
          Retour à l&apos;accueil
        </Link>
      </div>
    </section>
  );
}
