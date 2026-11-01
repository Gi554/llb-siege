import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import { images } from "@/content/projet";

export const metadata: Metadata = { title: "Évolution des travaux" };

export default function Page() {
  return (
    <ComingSoon
      eyebrow="Évolution des travaux — en préparation"
      title="La chronologie du chantier arrive bientôt."
      text="Cette page fait partie de la prochaine version du site. La page d'accueil présente déjà un aperçu de son contenu."
      image={images.cour}
    />
  );
}