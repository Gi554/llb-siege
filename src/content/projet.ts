import type { Material, Media, Space } from "./types";

// All facts in this file come from the architectural file
// « Projet de construction du siège de la LLB » — NPS GROUP, octobre 2026.

const img = (file: string, alt: string, width: number, height: number, caption?: string): Media => ({
  src: `/images/projet/${file}`,
  alt,
  width,
  height,
  caption,
});

export const images = {
  facade: img("facade-principale.jpg", "Façade principale du futur siège de la LLB vue depuis la rue, avec la vitrine de la librairie", 3150, 1053, "Façade principale sur rue"),
  facadeDetail: img("facade-detail.jpg", "Entrée du futur siège : parement de pierre, vitrine et portail en bois", 999, 725),
  facade1: img("perspective-01-facade.jpg", "Perspective 1 — façade sur rue", 1024, 342, "Perspective 1"),
  facade2: img("perspective-02-facade.jpg", "Perspective 2 — façade et portail d'entrée", 1024, 458, "Perspective 2"),
  librairie: img("perspective-03-librairie.jpg", "La librairie et son comptoir d'accueil en bois", 1853, 849, "Perspective 3 — la librairie"),
  librairieHd: img("librairie-hd.jpg", "Intérieur de la librairie, rayonnages éclairés et comptoir", 3150, 1444),
  conference: img("perspective-04-conference.jpg", "La salle de réunion et de conférence", 1866, 843, "Perspective 4 — salle de réunion et de conférence"),
  direction: img("perspective-05-direction.jpg", "Le bureau du directeur", 1880, 837, "Perspective 5 — bureau directeur"),
  cour: img("perspective-06-cour.jpg", "La cour pavée et l'entrée du bâtiment", 1851, 850, "Perspective 6 — la cour"),
  bureau: img("perspective-07-bureau.jpg", "Un bureau administratif", 1883, 835, "Perspective 7 — bureau"),
  jardin: img("perspective-08-jardin.jpg", "Le jardin, son allée en pas japonais et la pergola", 1868, 842, "Perspective 8 — jardin et pergola"),
  accueil: img("perspective-09-accueil.jpg", "Le hall d'accueil", 1854, 848, "Perspective 9 — hall d'accueil"),
  patio: img("perspective-10-patio.jpg", "Le patio central planté d'un palmier, entouré de murs terracotta", 1820, 864, "Perspective 10 — le patio central"),
  terrasse: img("perspective-11-terrasse.jpg", "Terrasse et jardin bordés par un mur en enduit terracotta", 1024, 468, "Perspective 11 — terrasse"),
  plan: img("plan-amenage-rdc.jpg", "Plan aménagé du rez-de-chaussée", 3097, 2189, "Plan aménagé RDC"),
  elevation: img("elevation-facade-principale.jpg", "Élévation technique de la façade principale", 2264, 608, "Façade principale — élévation"),
} satisfies Record<string, Media>;

export const projet = {
  name: "Siège de la Ligue pour la Lecture de la Bible",
  short: "Siège LLB",
  city: "Cotonou",
  country: "Bénin",
  owner: "Ligue pour la Lecture de la Bible",
  architect: "NPS GROUP",
  fileDate: "Octobre 2026",
  values: ["accueil", "sérénité", "partage", "transmission"],
  intro:
    "Un siège contemporain et accueillant, de plain-pied, où librairie, bureaux et salle de conférence s'articulent autour d'un patio central, dans un cadre de jardins et de terrasses.",
  descriptif: [
    "La construction du siège de la Ligue pour la Lecture de la Bible à Cotonou s'inscrit dans une dynamique de structuration et de rayonnement de l'institution. L'intervention vise à renforcer son image, à travers une architecture contemporaine, accueillante et représentative de sa mission.",
    "La composition des volumes, de plain-pied, privilégie des lignes épurées, des proportions maîtrisées et une organisation lisible. L'ensemble propose une architecture institutionnelle sobre, cohérente et pérenne, conciliant modernisation et identité locale.",
  ],
};

export const facts = [
  { value: 1, label: "Niveau", note: "Une composition de plain-pied" },
  { value: 1, label: "Patio central", note: "Le cœur autour duquel tout s'organise" },
  { value: 4, label: "Matériaux de façade", note: "Une palette volontairement sobre" },
  { value: 11, label: "Perspectives", note: "Rendus du dossier architectural" },
];

export const spaces: Space[] = [
  { slug: "librairie", index: "01", title: "La librairie", lede: "Ouverte sur la rue par une large vitrine, elle est le premier visage de la Ligue pour les passants.", image: images.librairie },
  { slug: "patio", index: "02", title: "Le patio central", lede: "Planté et baigné de lumière, il distribue les espaces et donne au bâtiment son calme.", image: images.patio },
  { slug: "conference", index: "03", title: "Salle de réunion et de conférence", lede: "Un grand volume pour se réunir, former et transmettre.", image: images.conference },
  { slug: "bureaux", index: "04", title: "Les bureaux", lede: "Direction, secrétariat et ministères réunis dans des espaces de travail chaleureux.", image: images.bureau },
  { slug: "accueil", index: "05", title: "Le hall d'accueil", lede: "Un lieu lumineux pour recevoir les visiteurs.", image: images.accueil },
  { slug: "jardins", index: "06", title: "Jardins et terrasses", lede: "Allées, pergola et espaces ombragés prolongent le bâtiment vers l'extérieur.", image: images.jardin },
  { slug: "cour", index: "07", title: "La cour", lede: "Un parvis pavé qui accueille les arrivées et les départs.", image: images.cour },
];

export const planRooms = [
  "Librairie", "Hall", "Patio", "Salle de réunion et de conférence", "Bureau directeur", "Secrétariat",
  "Ministère biblique", "Bureaux", "Magasin", "Terrasses", "Jardins", "Cour et garage",
];

export const materials: Material[] = [
  { name: "Enduit effet terracotta", note: "Un écho aux terres et aux tonalités de Cotonou.", texture: "/images/projet/materiau-terracotta.jpg", tone: "#B4532E" },
  { name: "Enduit effet béton", note: "La sobriété d'un minéral contemporain.", texture: "/images/projet/materiau-beton.jpg", tone: "#A9A6A0" },
  { name: "Peinture acrylique", note: "Des surfaces claires qui captent la lumière.", texture: "/images/projet/materiau-acrylique.jpg", tone: "#EEECE6" },
  { name: "Verre transparent", note: "L'ouverture sur la rue et sur les jardins.", texture: "/images/projet/materiau-verre.jpg", tone: "#9DB3C4" },
];
