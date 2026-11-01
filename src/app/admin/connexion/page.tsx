import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { images } from "@/content/projet";
import { Logo } from "@/components/ui/LampMark";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ suite?: string }> }) {
  if (await currentUser()) redirect("/admin");
  const { suite } = await searchParams;

  return (
    <div className="grid min-h-screen md:grid-cols-[34%_1fr]">
      <div className="flex flex-col justify-between bg-foret px-[var(--gutter)] py-10 text-blanc md:pl-[max(var(--gutter),5vw)]">
        <Link href="/" aria-label="Retour au site">
          <Logo tone="light" />
        </Link>
        <div className="my-16 max-w-sm">
          <p className="font-display text-[15px] font-medium">Espace d&apos;administration</p>
          <h1 className="display mt-4 text-[clamp(2.4rem,3.6vw,3.2rem)] text-menthe">Bon retour.</h1>
          <p className="mono mt-6 text-[13px] text-blanc/80">
            Connectez-vous pour publier les étapes du chantier, les photographies et les actualités du siège.
          </p>
          <div className="mt-10 rounded-[28px] bg-lin p-6 text-encre md:p-8">
            <LoginForm suite={suite} />
          </div>
        </div>
        <p className="text-[12px] text-blanc/50">Ligue pour la Lecture de la Bible — Cotonou</p>
      </div>
      <div className="relative hidden md:block">
        <Image src={images.patio.src} alt="" fill priority sizes="66vw" className="object-cover" />
      </div>
    </div>
  );
}
