import Image from "next/image";
import Link from "next/link";
import SplitHero from "@/components/SplitHero";
import type { Media } from "@/content/types";

export default function ComingSoon({ eyebrow, title, text, image }: { eyebrow: string; title: string; text: string; image: Media }) {
  return (
    <SplitHero
      eyebrow={eyebrow}
      title={title}
      text={<p>{text}</p>}
      footer={
        <Link href="/" className="pill h-[60px] w-[217px] bg-menthe text-[15px] text-foret hover:bg-blanc">
          Retour à l&apos;accueil
        </Link>
      }
    >
      <Image src={image.src} alt={image.alt} fill priority quality={85} sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
    </SplitHero>
  );
}
