// Content model shared by the public site and the future back-office.
// Every record carries a `source`: "projet" = taken from the architectural
// file (NPS GROUP), "demo" = placeholder to be replaced from the admin.

export type Source = "projet" | "demo";

export type Media = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

export type Space = {
  slug: string;
  index: string;
  title: string;
  lede: string;
  image: Media;
};

export type StageStatus = "realise" | "en-cours" | "a-venir";

export type Stage = {
  slug: string;
  title: string;
  description: string;
  status: StageStatus;
  /** ISO date of publication. Absent when not yet known. */
  publishedAt?: string;
  /** Human label shown instead of a date (e.g. "Octobre 2026"). */
  dateLabel?: string;
  /** Short key points shown as a list (deliverables, works done…). */
  highlights?: string[];
  media: Media[];
  videos?: { src: string; poster?: string; title: string }[];
  source: Source;
};

export const STATUS_LABEL: Record<StageStatus, string> = {
  realise: "Réalisé",
  "en-cours": "En cours",
  "a-venir": "À venir",
};

export type Comparison = {
  slug: string;
  title: string;
  before: Media & { label: string; date?: string };
  after: Media & { label: string; date?: string };
  source: Source;
};

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Annonce" | "Compte rendu" | "Événement";
  dateLabel: string;
  image: Media;
  source: Source;
};

export type GalleryKind = "rendu" | "plan" | "photo";

export type GalleryItem = Media & {
  id: string;
  /** Space slug (see `galleryEspaces`). */
  espace: string;
  /** Stage slug the image is attached to. */
  etape: string;
  kind: GalleryKind;
  dateLabel: string;
  source: Source;
};

export type Material = {
  name: string;
  note: string;
  texture: string;
  tone: string;
};
