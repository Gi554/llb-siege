import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import { images } from "@/content/projet";

export const metadata: Metadata = { title: "Le projet" };

export default function Page() {
  return (
    <ComingSoon
      eyebrow="Le projet — en préparation"
      title="L'histoire et la vision du futur siège."
      text="Cette page fait partie de la prochaine version du site. La page d'accueil présente déjà un aperçu de son contenu."
      image={images.patio}
    />
  );
}