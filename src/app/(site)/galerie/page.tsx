import type { Metadata } from "next";
import GalleryHero from "@/components/galerie/GalleryHero";
import Gallery from "@/components/galerie/Gallery";
import { getGallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Perspectives architecturales, plans et photographies du chantier du siège de la Ligue pour la Lecture de la Bible à Cotonou.",
};

export default async function GaleriePage() {
  const { items, espaces, kinds, stages } = await getGallery();
  const documented = new Set(items.map((g) => g.etape)).size;

  return (
    <>
      <GalleryHero items={items} documented={documented} />
      <Gallery items={items} espaces={espaces} kinds={kinds} stages={stages} />
    </>
  );
}
