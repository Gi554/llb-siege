import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import { images } from "@/content/projet";

export const metadata: Metadata = { title: "Actualités" };

export default function Page() {
  return (
    <ComingSoon
      eyebrow="Actualités — en préparation"
      title="Le journal du chantier."
      text="Cette page fait partie de la prochaine version du site. La page d'accueil présente déjà un aperçu de son contenu."
      image={images.jardin}
    />
  );
}