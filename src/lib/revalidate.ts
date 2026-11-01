import "server-only";
import { revalidatePath } from "next/cache";

/** Refresh the public pages and the dashboard after a content change. */
export function refreshSite(...extra: string[]) {
  for (const p of ["/", "/chantier", "/galerie", "/avant-apres", "/actualites", "/admin", ...extra]) revalidatePath(p);
  revalidatePath("/actualites/[slug]", "page");
}
