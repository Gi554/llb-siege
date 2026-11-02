import "server-only";
import { db } from "@/lib/db";

export type PartnerItem = { id: string; name: string; logo: string; width: number; height: number; url: string | null };

/** Partners shown on the home page, in the team's order. */
export async function getPartners(): Promise<PartnerItem[]> {
  const rows = await db.partner.findMany({ where: { visible: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return rows.map((p) => ({ id: p.id, name: p.name, logo: p.logo, width: p.logoWidth, height: p.logoHeight, url: p.url }));
}
