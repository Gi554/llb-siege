// Data access layer. Pages only talk to these functions, so the static
// modules below can later be swapped for a CMS or an API without touching
// any component.
import { comparisons, news, stages, viewpoints } from "@/content/chantier";
import { actors, facts, images, intentions, materials, planRooms, projet, spaces } from "@/content/projet";
import { gallery, galleryEspaces, galleryKinds } from "@/content/galerie";

export async function getProjet() {
  return { projet, facts, images, materials, planRooms, spaces, intentions, actors };
}

export async function getStages() {
  return stages;
}

export async function getComparisons() {
  return comparisons;
}

export async function getViewpoints() {
  return viewpoints;
}

export async function getGallery() {
  return { items: gallery, espaces: galleryEspaces, kinds: galleryKinds, stages: stages.map(({ slug, title }) => ({ slug, title })) };
}

export async function getArticle(slug: string) {
  const i = news.findIndex((n) => n.slug === slug);
  if (i < 0) return null;
  return { article: news[i], prev: news[i - 1] ?? null, next: news[i + 1] ?? null };
}

export async function getNews(limit?: number) {
  return typeof limit === "number" ? news.slice(0, limit) : news;
}
