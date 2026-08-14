# Notice admin — Gérer le contenu depuis Strapi

## URL de l'admin

https://taka-inside-production.up.railway.app/taka-admin-2026

> L'ancien chemin `/admin` est volontairement masqué (404). Utilise uniquement `/taka-admin-2026`.

## Modifier l'image de la page Association

1. Dans Strapi, aller dans **Content Manager**.
2. Sélectionner la collection **Page Content**.
3. Ouvrir l'entrée avec le slug **`association`**.
4. Dans le champ **Hero Image**, supprimer l'image actuelle et en uploader une nouvelle.
5. Cliquer sur **Save** puis **Publish**.
6. Le site se met à jour automatiquement (revalidate toutes les 5 minutes).

## Modifier le logo du site (header + footer)

1. Dans Strapi, aller dans **Content Manager**.
2. Sélectionner le single type **Configuration du site** (`site-config`).
3. Dans le champ **Logo**, remplacer le média.
4. **Save** → **Publish**.
5. Le logo s'affiche dans le header et le footer au prochain rechargement.

## Modifier le menu du header

1. Dans Strapi, aller dans **Content Manager**.
2. Sélectionner la collection **Menu Item**.
3. Ajouter, modifier ou supprimer des entrées avec `position = header`.
4. Publier les changements.

## Modifier les pages statiques (Coming Soon, Contact, Bénévole, Association)

1. Dans Strapi, aller dans **Content Manager**.
2. Sélectionner la collection **Page Content**.
3. Ouvrir l'entrée correspondant au slug :
   - `coming-soon` : page d'attente affichée sur `takainside.org`
   - `contact` : page Contact
   - `devenir-benevole` : page Bénévole
   - `association` : page Association
4. Modifier les champs **Title**, **Subtitle**, **Content**, **SEO**, etc.
5. **Save** → **Publish**.
6. Le site se met à jour automatiquement dans les 5 minutes (cache ISR).

## Modifier l'image de partage sociale (Open Graph)

1. Dans Strapi, aller dans **Content Manager**.
2. Sélectionner le single type **Configuration du site** (`site-config`).
3. Utiliser le champ **OG Image** (si renseigné) ou le champ **Logo** comme image de partage.
4. **Save** → **Publish**.

## API publique / sécurité

- Les endpoints sensibles (`artistes`, `produits`, `projets`, `categorie-produits`) sont **protégés** (403 sans token).
- Les endpoints nécessaires au site (`menu-items`, `homepage`) restent publics pour que le header et la page d'accueil fonctionnent.
- Ne pas modifier les permissions du rôle **Public** sans vérifier avec l'équipe technique.

## Cache

Le frontend met en cache les données Strapi côté serveur :
- Cache mémoire interne : **60 secondes**
- Revalidate Next.js ISR : **300 secondes (5 minutes)**

Donc après une modification dans Strapi, le changement peut prendre jusqu'à 5 minutes pour apparaître sur le site en production.

## Besoin d'aide ?

Si un changement ne s'affiche pas après 10 minutes, contacter l'équipe technique pour vérifier le déploiement Vercel ou le statut de Strapi.
