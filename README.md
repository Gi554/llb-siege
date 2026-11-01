# Siège de la LLB — Une vision prend vie

Site de présentation et de suivi de la construction du futur siège de la
**Ligue pour la Lecture de la Bible** à Cotonou (Bénin). Projet architectural : **NPS GROUP**.

Le site présente la vision architecturale du bâtiment (librairie, bureaux, salle de réunion et de
conférence, patio central, jardins et terrasses) et permettra de suivre l'évolution réelle du chantier,
étape par étape.

## Version actuelle

Première version haute fidélité de la **page d'accueil** :

- préchargement et hero plein écran animés ;
- manifeste dont les mots s'éclairent au défilement ;
- patio révélé à travers une arche, en écho aux panneaux sculptés du projet ;
- défilement horizontal des sept espaces du bâtiment ;
- plan aménagé, chiffres clés et matériaux de façade ;
- aperçu de la chronologie du chantier ;
- comparateur avant / après (souris, tactile, clavier) ;
- verset, actualités et pied de page.

Les autres pages (`/projet`, `/chantier`, `/avant-apres`, `/galerie`, `/actualites`) sont en préparation.

## Contenus réels et données de démonstration

- Les visuels, textes et chiffres proviennent du dossier architectural NPS GROUP (octobre 2026).
- Toutes les données sans source réelle sont marquées `source: "demo"` dans `src/content/` et
  signalées comme telles sur le site. Aucune date, aucun pourcentage d'avancement et aucune étape
  réalisée n'est inventé.

## Direction artistique

| Rôle | Couleur |
| --- | --- |
| Ivoire (fond clair) | `#F3EEE5` |
| Lin | `#E9E1D3` |
| Vert forêt (fond sombre) | `#0D2620` |
| Terracotta | `#B4532E` |
| Or (lumière, accents) | `#D8A23B` |
| Encre (texte) | `#1B1813` |

Typographies : **Fraunces** (titres, italique expressif) et **Inter Tight** (texte courant).
Motifs : l'arche des panneaux du patio, la lampe (Psaume 119.105), les matériaux de façade.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router, génération statique) et React 19
- Tailwind CSS 4
- GSAP + ScrollTrigger pour les animations, Lenis pour le défilement doux
- `prefers-reduced-motion` respecté : les animations sont désactivées et le contenu reste visible

## Architecture

```
src/
  app/            routes (accueil + pages en préparation)
  components/     en-tête, pied de page, comparateur, préchargement
    home/         sections de la page d'accueil
    ui/           révélations et badges
  content/        modèle de contenu typé (types.ts) et données
  lib/content.ts  couche d'accès aux données (à brancher sur un CMS / une API)
public/images/projet/  perspectives et plans extraits du dossier architectural
```

Les composants ne lisent les données qu'à travers `src/lib/content.ts`. Le back-office prévu
(étapes, médiathèque, comparaisons, actualités, utilisateurs et rôles) pourra remplacer les modules
de `src/content/` sans modifier l'interface.

## Démarrer

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.
