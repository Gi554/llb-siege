# Siège de la LLB — Une vision prend vie

Site de présentation et de suivi de la construction du futur siège de la
**Ligue pour la Lecture de la Bible** à Cotonou (Bénin). Projet architectural : **NPS GROUP**.

Le site présente la vision architecturale du bâtiment (librairie, bureaux, salle de réunion et de
conférence, patio central, jardins et terrasses) et permettra de suivre l'évolution réelle du chantier,
étape par étape.

## Version actuelle

**Page d'accueil** :

- bandeau d'annonce, en-tête blanc avec bouton « Suivre le chantier » ;
- hero en deux parties : panneau vert profond et façade du bâtiment ;
- grille des quatre usages du siège et images superposées ;
- bandeau « Visitez le siège » au titre détouré ;
- carrousel des sept espaces sur le mot détouré « espaces » ;
- ce que réunit le siège (icônes) ;
- le chantier étape par étape (visuels ronds, défilement horizontal) ;
- actualités et pied de page.

Autres pages :

- `/projet` : intentions, valeurs, plan, espaces, matériaux et façades du projet ;
- `/chantier` : chronologie interactive des étapes ;
- `/avant-apres` : comparateur en trois modes et points de vue suivis ;
- `/galerie` : grille filtrable et visionneuse plein écran ;
- `/actualites` et `/actualites/[slug]` : journal du chantier et pages d'article.


## Contenus réels et données de démonstration

- Les visuels, textes et chiffres proviennent du dossier architectural NPS GROUP (octobre 2026).
- Toutes les données sans source réelle sont marquées `source: "demo"` dans `src/content/` et
  signalées comme telles sur le site. Aucune date, aucun pourcentage d'avancement et aucune étape
  réalisée n'est inventé.

## Direction artistique

| Rôle | Couleur |
| --- | --- |
| Blanc (fond principal) | `#FFFFFF` |
| Ivoire (fond chaud) | `#F1ECE0` |
| Vert forêt (fond sombre, boutons) | `#062521` |
| Menthe (titres sur vert, boutons) | `#C1E2BC` |
| Ocre clair (bandeau) | `#F6E2A8` |
| Terracotta (accents) | `#B4532E` |
| Encre (texte) | `#141F1C` |

Typographies : **Urbanist** (titres, y compris les grands titres détourés), **DM Sans** (interface)
et **DM Mono** (textes courants). Motif : la lampe (Psaume 119.105), reprise dans le logo.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router, génération statique) et React 19
- Tailwind CSS 4
- GSAP + ScrollTrigger pour les animations, Lenis pour le défilement doux
- `prefers-reduced-motion` respecté : les animations sont désactivées et le contenu reste visible

## Architecture

```
prisma/
  schema.prisma   modèle de données (étapes, médias, comparaisons, actualités, utilisateurs)
  seed.ts         données initiales issues du dossier architectural
src/
  app/(site)/     pages publiques
  app/admin/      back-office (connexion, tableau de bord…)
  components/     en-tête, pied de page, sections, back-office
  content/        modèle typé, description fixe du projet, données initiales
  lib/content.ts  accès aux données pour le site public
  lib/auth.ts     sessions et rôles
public/images/projet/  perspectives et plans extraits du dossier architectural
```

Le site public lit les contenus éditables (étapes, médias, comparaisons, actualités) dans la base,
uniquement à travers `src/lib/content.ts`.

## Back-office

Accessible sur `/admin`. Deux rôles : **administrateur** (tout, y compris les comptes) et
**éditeur** (contenus). Base SQLite gérée par Prisma ; pour passer sur PostgreSQL, changer
`provider` dans `prisma/schema.prisma` et `DATABASE_URL`.

Sections : tableau de bord, étapes du chantier, médiathèque (import multiple, légendes,
albums), comparaisons avant / après et points de vue, actualités, textes des pages,
utilisateurs (réservé aux administrateurs) et « Mon compte » (changement de mot de passe).
Un compte désactivé perd l'accès immédiatement ; le site garde toujours au moins un
administrateur actif.

Les photos importées sont converties en WebP (2560 px maximum), débarrassées de leurs
métadonnées (dont la position GPS) et stockées dans `UPLOAD_DIR` (par défaut
`storage/uploads`, hors dépôt). Ce dossier doit être sauvegardé avec la base.

## Démarrer

```bash
npm install
cp .env.example .env   # puis renseigner AUTH_SECRET, ADMIN_EMAIL et ADMIN_PASSWORD
npm run db:push        # crée la base
npm run db:seed        # charge les contenus et crée le premier administrateur
npm run dev
```

Puis ouvrir http://localhost:3000 (site) et http://localhost:3000/admin (administration).

## Mise en ligne sur Netlify

Netlify n'a pas de disque persistant : la base passe sur [Turso](https://turso.tech) (compatible SQLite) et les images envoyées sur Netlify Blobs. Le code choisit tout seul selon les variables d'environnement ; sans elles, il reste en mode local (fichier SQLite et dossier `storage/uploads`), par exemple sur un VPS.

1. Créer une base Turso et un jeton d'accès, puis les écrire dans un fichier `.env.turso` (non versionné) :
   ```bash
   TURSO_DATABASE_URL="libsql://…"
   TURSO_AUTH_TOKEN="…"
   ```
2. Créer les tables et charger les contenus : `npm run db:turso`.
3. Sur Netlify, importer le dépôt GitHub (la configuration est dans `netlify.toml`) et définir les variables : `AUTH_SECRET`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` et `UPLOAD_STORAGE=netlify`.
