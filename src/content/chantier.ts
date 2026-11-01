import type { Comparison, NewsItem, Stage } from "./types";
import { images } from "./projet";

// Only the first stage is real (the architectural file, dated October 2026).
// Everything flagged `source: "demo"` is placeholder content: no date, no
// progress figure, no completed work is claimed. It is meant to be replaced
// from the back-office as the construction advances.

export const stages: Stage[] = [
  {
    slug: "conception",
    title: "Conception architecturale",
    description: "Remise du dossier architectural par NPS GROUP : perspectives, plans du rez-de-chaussée, coupes et façades du futur siège.",
    status: "realise",
    dateLabel: "Octobre 2026",
    highlights: [
      "11 perspectives intérieures et extérieures",
      "Plan aménagé du rez-de-chaussée",
      "Plans de plomberie et d'électricité",
      "Coupe C-C et quatre façades",
    ],
    media: [
      images.facade,
      images.patio,
      images.librairie,
      images.conference,
      images.plan,
      images.jardin,
      images.accueil,
      images.facades,
      images.direction,
      images.cour,
    ],
    source: "projet",
  },
  {
    slug: "preparation-terrain",
    title: "Préparation du terrain",
    description: "Étape d'exemple. Implantation, nettoyage de la parcelle et installation du chantier.",
    status: "a-venir",
    media: [],
    source: "demo",
  },
  {
    slug: "fondations",
    title: "Fondations",
    description: "Étape d'exemple. Terrassement et coulage des fondations.",
    status: "a-venir",
    media: [],
    source: "demo",
  },
  {
    slug: "gros-oeuvre",
    title: "Gros œuvre",
    description: "Étape d'exemple. Élévation des murs, du patio et des volumes de plain-pied.",
    status: "a-venir",
    media: [],
    source: "demo",
  },
  {
    slug: "toiture",
    title: "Toiture et étanchéité",
    description: "Étape d'exemple. Mise hors d'eau du bâtiment.",
    status: "a-venir",
    media: [],
    source: "demo",
  },
  {
    slug: "second-oeuvre",
    title: "Second œuvre et finitions",
    description: "Étape d'exemple. Menuiseries, enduits terracotta et béton, aménagements intérieurs.",
    status: "a-venir",
    media: [],
    source: "demo",
  },
  {
    slug: "paysage",
    title: "Jardins et terrasses",
    description: "Étape d'exemple. Plantations, allées et pergola.",
    status: "a-venir",
    media: [],
    source: "demo",
  },
];

export const comparisons: Comparison[] = [
  {
    slug: "facade-plan-rendu",
    title: "Façade principale",
    before: { ...images.elevation, label: "Élévation technique" },
    after: { ...images.facade1, label: "Rendu architectural" },
    source: "demo",
  },
];

export const news: NewsItem[] = [
  {
    slug: "presentation-projet",
    title: "Le projet architectural du siège est dévoilé",
    excerpt: "NPS GROUP présente onze perspectives et les plans du futur siège de la Ligue à Cotonou.",
    category: "Annonce",
    dateLabel: "Octobre 2026",
    image: images.patio,
    source: "projet",
  },
  {
    slug: "exemple-compte-rendu",
    title: "Exemple — compte rendu de visite de chantier",
    excerpt: "Contenu de démonstration. Les comptes rendus seront publiés ici depuis l'administration.",
    category: "Compte rendu",
    dateLabel: "Date à venir",
    image: images.cour,
    source: "demo",
  },
  {
    slug: "exemple-evenement",
    title: "Exemple — cérémonie de lancement des travaux",
    excerpt: "Contenu de démonstration. Aucun événement n'est encore programmé.",
    category: "Événement",
    dateLabel: "Date à venir",
    image: images.jardin,
    source: "demo",
  },
];
