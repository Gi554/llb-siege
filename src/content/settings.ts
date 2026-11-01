// Page texts editable from the back-office. The defaults are used until the
// team saves its own version (stored in the Setting table under the same key).

export type SettingField = {
  key: string;
  group: string;
  label: string;
  hint?: string;
  default: string;
  multiline?: boolean;
  max: number;
};

export const SETTINGS = [
  { key: "announcement.enabled", group: "Bandeau d'annonce", label: "Afficher le bandeau", default: "1", max: 1 },
  {
    key: "announcement.text",
    group: "Bandeau d'annonce",
    label: "Texte du bandeau",
    hint: "Affiché en haut de toutes les pages, avec un lien « Voir » vers le suivi du chantier.",
    default: "Dossier architectural publié — Octobre 2026 · Suivez la construction du siège étape par étape.",
    max: 160,
  },
  { key: "home.eyebrow", group: "Accueil", label: "Surtitre", default: "Cotonou, Bénin", max: 60 },
  { key: "home.title", group: "Accueil", label: "Titre principal", default: "Une vision prend vie.", max: 80 },
  {
    key: "home.text",
    group: "Accueil",
    label: "Texte d'introduction",
    default:
      "Le futur siège de la Ligue pour la Lecture de la Bible : une librairie, des bureaux, une salle de conférence et un patio planté, réunis de plain-pied au cœur de Cotonou.",
    multiline: true,
    max: 400,
  },
  { key: "home.heroImage", group: "Accueil", label: "Image principale", hint: "Image affichée à droite du titre.", default: "", max: 40 },
  { key: "projet.title", group: "Le projet", label: "Titre", default: "Un siège à l'image de sa mission.", max: 80 },
  { key: "chantier.title", group: "Évolution des travaux", label: "Titre", default: "Évolution des travaux.", max: 80 },
  {
    key: "chantier.text",
    group: "Évolution des travaux",
    label: "Texte d'introduction",
    default: "De la conception à l'inauguration, chaque étape du chantier est documentée ici par des photographies, des vidéos et des comptes rendus.",
    multiline: true,
    max: 400,
  },
  {
    key: "avantApres.text",
    group: "Avant / Après",
    label: "Texte d'introduction",
    default: "Le projet et le chantier, sous le même angle : faites glisser le curseur, superposez, comparez.",
    multiline: true,
    max: 400,
  },
  {
    key: "galerie.text",
    group: "Galerie",
    label: "Texte d'introduction",
    default: "Perspectives, plans et, bientôt, photographies du chantier : toutes les images du futur siège réunies.",
    multiline: true,
    max: 400,
  },
  { key: "actualites.title", group: "Actualités", label: "Titre", default: "Le journal du chantier.", max: 80 },
  {
    key: "actualites.text",
    group: "Actualités",
    label: "Texte d'introduction",
    default: "Annonces, comptes rendus de visite et événements : toutes les nouvelles du futur siège, au fil de la construction.",
    multiline: true,
    max: 400,
  },
] as const satisfies readonly SettingField[];

export type SettingKey = (typeof SETTINGS)[number]["key"];
export type Settings = Record<SettingKey, string>;
