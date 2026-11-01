// Data access layer for the public site. Pages only talk to these functions;
// editable content comes from the database (filled from the back-office),
// the fixed description of the project from `src/content/projet.ts`.
import "server-only";
import type { Media as DbMedia, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { actors, facts, images, intentions, materials, planRooms, projet, spaces } from "@/content/projet";
import { galleryEspaces, galleryKinds } from "@/content/galerie";
import type { Comparison, GalleryItem, GalleryKind, Media, NewsItem, Source, Stage, StageStatus, Viewpoint } from "@/content/types";

const PUBLISHED = "PUBLISHED";

export const toMedia = (m: DbMedia): Media => ({
  src: m.src,
  alt: m.alt,
  width: m.width,
  height: m.height,
  ...(m.caption ? { caption: m.caption } : {}),
});

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);

export async function getProjet() {
  return { projet, facts, images, materials, planRooms, spaces, intentions, actors };
}

export async function getStages(): Promise<Stage[]> {
  const rows = await db.stage.findMany({
    where: { state: PUBLISHED },
    orderBy: { order: "asc" },
    include: { media: { orderBy: { order: "asc" } }, videos: true },
  });
  return rows.map((s) => ({
    slug: s.slug,
    title: s.title,
    description: s.description,
    status: s.status as StageStatus,
    ...(s.publishedAt ? { publishedAt: s.publishedAt.toISOString() } : {}),
    ...(s.dateLabel ? { dateLabel: s.dateLabel } : {}),
    ...(s.highlights.trim() ? { highlights: lines(s.highlights) } : {}),
    media: s.media.map(toMedia),
    ...(s.videos.length ? { videos: s.videos.map((v) => ({ src: v.src, title: v.title, ...(v.poster ? { poster: v.poster } : {}) })) } : {}),
    source: s.source as Source,
  }));
}

export async function getComparisons(): Promise<Comparison[]> {
  const rows = await db.comparison.findMany({
    where: { state: PUBLISHED },
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    include: { before: true, after: true },
  });
  return rows.map((c) => ({
    slug: c.slug,
    title: c.title,
    before: { ...toMedia(c.before), label: c.beforeLabel, ...(c.beforeDate ? { date: c.beforeDate } : {}) },
    after: { ...toMedia(c.after), label: c.afterLabel, ...(c.afterDate ? { date: c.afterDate } : {}) },
    source: c.source as Source,
  }));
}

export async function getViewpoints(): Promise<Viewpoint[]> {
  const rows = await db.viewpoint.findMany({ orderBy: { order: "asc" }, include: { render: true, photo: true } });
  return rows.map((v) => ({
    slug: v.slug,
    title: v.title,
    espace: v.espace,
    render: toMedia(v.render),
    ...(v.photo ? { photo: { ...toMedia(v.photo), date: v.photoDate ?? "" } } : {}),
  }));
}

export async function getGallery() {
  const [rows, stages] = await Promise.all([
    db.media.findMany({ where: { inGallery: true }, orderBy: [{ order: "asc" }, { createdAt: "asc" }], include: { stage: true } }),
    db.stage.findMany({ where: { state: PUBLISHED }, orderBy: { order: "asc" }, select: { slug: true, title: true } }),
  ]);
  const items: GalleryItem[] = rows.map((m) => ({
    ...toMedia(m),
    id: m.id,
    espace: m.espace,
    etape: m.stage?.slug ?? "",
    kind: m.kind as GalleryKind,
    dateLabel: m.dateLabel ?? "",
    source: (m.source === "demo" ? "demo" : "projet") as Source,
  }));
  return { items, espaces: galleryEspaces, kinds: galleryKinds, stages };
}

const newsInclude = { cover: true, media: { orderBy: { order: "asc" as const } } } satisfies Prisma.NewsInclude;
type NewsRow = Prisma.NewsGetPayload<{ include: typeof newsInclude }>;

const toNews = (n: NewsRow): NewsItem => ({
  slug: n.slug,
  title: n.title,
  excerpt: n.excerpt,
  category: n.category as NewsItem["category"],
  dateLabel: n.dateLabel,
  image: toMedia(n.cover),
  body: n.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
  ...(n.media.length ? { media: n.media.map(toMedia) } : {}),
  source: n.source as Source,
});

async function publishedNews() {
  const rows = await db.news.findMany({
    where: { state: PUBLISHED },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "asc" }],
    include: newsInclude,
  });
  return rows.map(toNews);
}

export async function getNews(limit?: number) {
  const all = await publishedNews();
  return typeof limit === "number" ? all.slice(0, limit) : all;
}

export async function getArticle(slug: string) {
  const all = await publishedNews();
  const i = all.findIndex((n) => n.slug === slug);
  if (i < 0) return null;
  return { article: all[i], prev: all[i - 1] ?? null, next: all[i + 1] ?? null };
}
