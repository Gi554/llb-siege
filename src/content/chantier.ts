import type { Comparison, Media, NewsItem, Stage, Viewpoint } from "./types";
import { images } from "./projet";

// The first two stages are real: the existing building, photographed in the
// LLB funding request of February 2025, and the architectural file of
// October 2026. Everything flagged `source: "demo"` is placeholder content:
// no date, no progress figure, no completed work is claimed. It is meant to
// be replaced from the back-office as the construction advances.

const photo = (file: string, alt: string, width: number, height: number, caption?: string): Media => ({
  src: `/images/chantier/${file}`,
  alt,
  width,
  height,
  caption,
});

/** The two photographs on the cover of the February 2025 funding request. */
export const existant = {
  facade: photo("batiment-existant-1.jpg", "Le bâtiment existant du siège : véranda à piliers et toiture posée, sur un terrain en terre battue", 944, 726, "Le bâtiment existant — février 2025"),
  cour: photo("batiment-existant-2.jpg", "Le bâtiment existant vu depuis la parcelle : murs en parpaings non enduits, toiture en place", 944, 726, "Le bâtiment existant — février 2025"),
} satisfies Record<string, Media>;

/** The building as it stands, photographed on site on 2 November 2026. */
const actuel = (file: string, alt: string, width = 1440, height = 1920) => photo(file, alt, width, height, "État actuel — novembre 2026");
// The wide view of the façade comes first: it opens the stage and the comparison.
export const etatActuel: Media[] = [
  actuel("etat-actuel-facade-large.jpg", "Le bâtiment existant vu de face depuis la parcelle, avec le puits au premier plan", 1920, 1440),
  actuel("etat-actuel-interieur.jpg", "Vue intérieure du bâtiment existant vers la toiture en tôles, murs en parpaings"),
  actuel("etat-actuel-piece.jpg", "Une pièce du bâtiment existant : sol en sable, murs en parpaings, toiture en tôles sur charpente bois et baie sans menuiserie"),
  actuel("etat-actuel-facade.jpg", "La façade du bâtiment existant : murs en parpaings non enduits, ouvertures sans menuiseries, toiture en place et puits au premier plan"),
  actuel("etat-actuel-puits.jpg", "Le puits, entre les murs en parpaings du bâtiment existant"),
  actuel("etat-actuel-volume-arrondi.jpg", "Un volume arrondi du bâtiment existant et le passage le long des murs"),
  actuel("etat-actuel-cote.jpg", "Le côté du bâtiment existant et les arbres de la parcelle"),
  actuel("etat-actuel-parcelle.jpg", "La parcelle et son mur de clôture"),
  actuel("etat-actuel-facade-laterale.jpg", "Une façade du bâtiment existant : murs en parpaings et ouvertures sans menuiseries"),
  actuel("etat-actuel-angle.jpg", "Un angle du bâtiment existant, gagné par la végétation"),
];

export const stages: Stage[] = [
  {
    slug: "batiment-existant",
    title: "Le bâtiment existant",
    description: "Le plan de construction a été établi, les fondations posées et le bâtiment élevé jusqu'à la toiture. Les travaux ont ensuite été suspendus au profit du développement des ministères de la LLB-Bénin.",
    status: "realise",
    dateLabel: "Février 2025",
    highlights: [
      "Plan de construction établi",
      "Fondations posées",
      "Construction poursuivie jusqu'à la toiture",
      "Travaux suspendus au profit des ministères",
    ],
    media: [...etatActuel, existant.facade, existant.cour],
    source: "projet",
  },
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

// The first comparison is the featured one.
export const comparisons: Comparison[] = [
  {
    slug: "batiment-existant-futur-siege",
    title: "Du bâtiment existant au futur siège",
    before: { ...etatActuel[0], label: "Bâtiment existant", date: "Novembre 2026" },
    after: { ...images.facade2, label: "Projet NPS GROUP", date: "Octobre 2026" },
    source: "projet",
  },
  {
    slug: "facade-plan-rendu",
    title: "Façade principale",
    before: { ...images.elevation, label: "Élévation technique" },
    after: { ...images.facade1, label: "Rendu architectural" },
    source: "demo",
  },
];

// Camera positions to repeat on site so each render gets its real photo.
// No photo exists yet: every viewpoint is waiting for its first shot.
export const viewpoints: Viewpoint[] = [
  { slug: "facade-rue", title: "Façade sur rue", espace: "Extérieur", render: images.facade1 },
  { slug: "entree", title: "Entrée et portail", espace: "Extérieur", render: images.facade2 },
  { slug: "librairie", title: "La librairie", espace: "Intérieur", render: images.librairie },
  { slug: "patio", title: "Le patio central", espace: "Intérieur", render: images.patio },
  { slug: "conference", title: "Salle de conférence", espace: "Intérieur", render: images.conference },
  { slug: "jardin", title: "Jardin et pergola", espace: "Extérieur", render: images.jardin },
  { slug: "cour", title: "La cour", espace: "Extérieur", render: images.cour },
  { slug: "accueil", title: "Hall d'accueil", espace: "Intérieur", render: images.accueil },
];

export const news: NewsItem[] = [
  {
    slug: "presentation-projet",
    title: "Le projet architectural du siège est dévoilé",
    excerpt: "NPS GROUP présente onze perspectives et les plans du futur siège de la Ligue à Calavi.",
    category: "Annonce",
    dateLabel: "Octobre 2026",
    image: images.patio,
    body: [
      "Le dossier architectural du futur siège de la Ligue pour la Lecture de la Bible a été remis par NPS GROUP en octobre 2026. Il présente un bâtiment contemporain de plain-pied, organisé autour d'un patio central, dans un cadre de jardins et de terrasses.",
      "Onze perspectives donnent à voir les principaux espaces : la façade sur rue et sa librairie vitrée, le hall d'accueil, les bureaux, la salle de réunion et de conférence, le patio, la cour et les jardins.",
      "Le dossier comprend également le plan aménagé du rez-de-chaussée, les plans de plomberie et d'électricité, une coupe et les quatre façades du bâtiment.",
      "Les façades associent enduit à effet béton, peinture acrylique, verre et enduit à effet terracotta, une palette sobre qui fait écho à l'environnement de Calavi.",
    ],
    media: [images.facade, images.librairie, images.conference, images.jardin, images.plan, images.facades],
    source: "projet",
  },
  {
    slug: "exemple-compte-rendu",
    title: "Exemple — compte rendu de visite de chantier",
    excerpt: "Contenu de démonstration. Les comptes rendus seront publiés ici depuis l'administration.",
    category: "Compte rendu",
    dateLabel: "Date à venir",
    image: images.cour,
    body: [
      "Ceci est un article de démonstration. Les comptes rendus de visite de chantier seront rédigés et publiés par l'équipe de la Ligue depuis l'interface d'administration.",
      "Chaque compte rendu pourra présenter les travaux réalisés, les prochaines étapes et une sélection de photographies du chantier.",
    ],
    source: "demo",
  },
  {
    slug: "exemple-evenement",
    title: "Exemple — cérémonie de lancement des travaux",
    excerpt: "Contenu de démonstration. Aucun événement n'est encore programmé.",
    category: "Événement",
    dateLabel: "Date à venir",
    image: images.jardin,
    body: [
      "Ceci est un article de démonstration. Aucun événement n'est programmé à ce jour.",
      "Les annonces d'événements liés au projet, comme le lancement des travaux ou l'inauguration, seront publiées ici avec leur date et leurs informations pratiques.",
    ],
    source: "demo",
  },
];
