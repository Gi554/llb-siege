import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import GalleryHero from "@/components/galerie/GalleryHero";
import Gallery from "@/components/galerie/Gallery";
import { getGallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Perspectives architecturales, plans et photographies du chantier du siège de la Ligue pour la Lecture de la Bible à Calavi.",
};

// Picks up content changed directly in the database (admin changes refresh at once).
export const revalidate = 300;

export default async function GaleriePage() {
  const [{ items, espaces, kinds, stages }, s] = await Promise.all([getGallery(), getSettings()]);
  const documented = new Set(items.map((g) => g.etape)).size;

  return (
    <>
      <GalleryHero items={items} documented={documented} text={s["galerie.text"]} />
      <Gallery items={items} espaces={espaces} kinds={kinds} stages={stages} />
    </>
  );
}
