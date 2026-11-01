// Data access layer. Pages only talk to these functions, so the static
// modules below can later be swapped for a CMS or an API without touching
// any component.
import { comparisons, news, stages } from "@/content/chantier";
import { facts, images, materials, planRooms, projet, spaces } from "@/content/projet";

export async function getProjet() {
  return { projet, facts, images, materials, planRooms, spaces };
}

export async function getStages() {
  return stages;
}

export async function getComparisons() {
  return comparisons;
}

export async function getNews(limit?: number) {
  return typeof limit === "number" ? news.slice(0, limit) : news;
}
