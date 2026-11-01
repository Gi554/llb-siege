import "server-only";
import { db } from "@/lib/db";
import { toMedia } from "@/lib/content";
import { images } from "@/content/projet";
import { SETTINGS, type Settings } from "@/content/settings";
import type { Media } from "@/content/types";

/** Every page text, the team's version when saved, else the default. */
export async function getSettings(): Promise<Settings> {
  const rows = await db.setting.findMany();
  const saved = new Map(rows.map((r) => [r.key, r.value]));
  return Object.fromEntries(SETTINGS.map((s) => [s.key, saved.get(s.key) ?? s.default])) as Settings;
}

/** The home hero picture: the chosen media, else the main façade render. */
export async function heroImage(settings: Settings): Promise<Media> {
  const id = settings["home.heroImage"];
  const m = id ? await db.media.findUnique({ where: { id } }) : null;
  return m ? toMedia(m) : images.facade;
}
