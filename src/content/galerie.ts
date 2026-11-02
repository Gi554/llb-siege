import type { GalleryItem, GalleryKind, Media } from "./types";
import { existant } from "./chantier";
import { images } from "./projet";

// Every image below comes from the architectural file (stage "conception"),
// except the two photos of the existing building (February 2025 request).
// Later site photographs are added from the back-office with kind "photo".

export const galleryEspaces = [
  { slug: "exterieur", label: "Façades et rue" },
  { slug: "librairie", label: "Librairie" },
  { slug: "patio", label: "Patio" },
  { slug: "conference", label: "Salle de conférence" },
  { slug: "bureaux", label: "Bureaux" },
  { slug: "accueil", label: "Hall d'accueil" },
  { slug: "jardins", label: "Jardins et terrasses" },
  { slug: "cour", label: "Cour" },
  { slug: "plans", label: "Plans et façades" },
] as const;

export const galleryKinds: { slug: GalleryKind; label: string }[] = [
  { slug: "rendu", label: "Rendus 3D" },
  { slug: "plan", label: "Plans techniques" },
  { slug: "photo", label: "Photos du chantier" },
];

const item = (id: string, media: Media, espace: string, kind: GalleryKind = "rendu"): GalleryItem => ({
  ...media,
  id,
  espace,
  etape: "conception",
  kind,
  dateLabel: "Octobre 2026",
  source: "projet",
});

export const gallery: GalleryItem[] = [
  item("facade-principale", images.facade, "exterieur"),
  item("patio", images.patio, "patio"),
  item("librairie", images.librairie, "librairie"),
  item("facade-detail", images.facadeDetail, "exterieur"),
  item("conference", images.conference, "conference"),
  item("jardin", images.jardin, "jardins"),
  item("librairie-hd", images.librairieHd, "librairie"),
  item("direction", images.direction, "bureaux"),
  item("cour", images.cour, "cour"),
  item("plan-rdc", images.plan, "plans", "plan"),
  item("accueil", images.accueil, "accueil"),
  item("bureau", images.bureau, "bureaux"),
  item("facade-2", images.facade2, "exterieur"),
  item("terrasse", images.terrasse, "jardins"),
  item("facades", images.facades, "plans", "plan"),
  item("facade-1", images.facade1, "exterieur"),
  item("elevation", images.elevation, "plans", "plan"),
  ...[existant.facade, existant.cour].map((media, i) => ({
    ...item(`batiment-existant-${i + 1}`, media, "exterieur", "photo"),
    etape: "batiment-existant",
    dateLabel: "Février 2025",
  })),
];
