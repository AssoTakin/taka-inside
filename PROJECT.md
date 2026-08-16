# Taka Inside — Suivi de projet

> Point d'entrée central pour l'architecture, l'avancement et la feuille de route du site vitrine de l'association Taka Inside.  
> Les documents détaillés sont dans `docs/`. Ce fichier est le résumé exécutif et le suivi d'itération.  
> À mettre à jour à chaque livrable significatif.

---

## 1. Vision produit

**Taka Inside** est une association culturelle béninoise — *L'Art au Service de l'Humain*.

Son site web officiel a pour vocation de :
- Présenter l'association, ses projets et son équipe
- Mettre en avant les artistes et productions du label musical
- Permettre les dons et l'engagement bénévole
- Vendre des produits (tickets, albums, merchandising)
- Diffuser le contenu de MIBRADIO

---

## 2. Stack technique

| Couche | Technologie | Hébergement |
|--------|-------------|-------------|
| Frontend | Next.js 14 (App Router) | Vercel |
| CMS / API | Strapi v5 | Railway |
| Base de données | PostgreSQL 15 | Railway |
| Médias | Cloudinary (prévu) | Cloudinary |
| Paiement | Stripe / FedaPay | Stripe live, FedaPay Mobile Money |
| Email | Resend (prévu) | Resend |
| Dev local | Docker Compose | Local |

---

## 3. Architecture

L'architecture détaillée est dans `docs/ARCHITECTURE.md`.

Vue simplifiée :

```text
Utilisateurs
    │
    ▼
Next.js 14 (frontend)
    │
    ├─→ Strapi API (CMS, contenus, médias)
    │
    ├─→ API Routes Next.js (webhooks, emails, liens sécurisés)
    │
    └─→ Stripe / FedaPay (paiements)
```

---

## 4. Environnements

| Environnement | URL | Notes |
|---------------|-----|-------|
| Production | https://takainside.org | Domaine personnalisé, mode coming-soon activable |
| Vercel Preview | `frontend-*.vercel.app` | Deploys automatiques des branches |
| Strapi CMS | https://taka-inside-production.up.railway.app | Chemin admin : `/taka-admin-2026` |

---

## 5. Sécurité & conformité

- HTTPS forcé sur Vercel.
- Headers de sécurité dans `frontend/next.config.ts`.
- Données personnelles : RGPD (mentions légales + politique de confidentialité).
- Paiements Stripe en mode **live**.

---

## 6. Paiements

### Parcours don
1. Page `/faire-un-don`
2. Stripe Checkout ou FedaPay
3. Confirmation `/paiement/confirmation?status=success`
4. Enregistrement webhook Stripe → création du don dans Strapi

### Parcours boutique
1. Catalogue `/boutique`
2. Panier (`CartContext`)
3. Checkout `/checkout`
4. Paiement Stripe
5. Commande créée dans Strapi via webhook

---

## 7. Déploiement

### Frontend (Vercel)
- Déploiement automatique via GitHub Actions : `.github/workflows/frontend.yml`
- **Configuration actuelle** : remote build par Vercel (`vercel deploy --prod`)
- `vercel.json` à la racine pointe vers `frontend/` (monorepo)
- Secrets GitHub requis : `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

### Backend (Railway)
- Déploiement automatique depuis `master` via Railway + GitHub
- Variables d'environnement dans le dashboard Railway

---

## 8. Tests

### E2E
- Playwright : `frontend/e2e/`
- Lancer : `cd frontend && npx playwright test`

### Smoke test post-déploiement
- https://takainside.org/ → coming-soon (si actif)
- https://takainside.org/?preview=<PREVIEW_SECRET> → vrai site
- https://taka-inside-production.up.railway.app/taka-admin-2026 → admin Strapi
- `/boutique`, `/checkout`, `/faire-un-don` → 200

---

## 9. Commandes utiles

```bash
# Dev frontend
cd frontend
npm install
npm run dev

# Build local
cd frontend
npm run build

# Tests E2E
cd frontend
npx playwright test

# Dev backend (Docker)
docker compose up -d

# Arrêt
docker compose down
```

---

## 10. Notes et conventions

- **CMS source de vérité** : tous les contenus textes, images et projets passent par Strapi.
- **Mobile first** : le design suit une approche responsive mobile-first.
- **Pas de données codées en dur** : tout contenu administrable doit provenir de Strapi.
- **Accessibilité** : objectif WCAG 2.1 AA.
- **Ce fichier est le point d'entrée** : les détails techniques restent dans `docs/`.

---

## 11. Historique

| Date | Événement |
|------|-----------|
| 2024-05-30 | Rédaction PLAN.md, ARCHITECTURE.md, CDC.md |
| 2024-05-30 | Création charte graphique et UI kit |
| 2026-07-27 | Création de ce `PROJECT.md` pour centraliser le suivi |
| 2026-08-05 | Mise à jour sécurité, paiement et stabilisation backend |
| 2026-08-10 | Nettoyage projets Vercel parasites (`taka-inside-paypal-cleanup-v3`, `frontend-mu-one-82`), correction régression du mot de passe coming-soon, backup des configs sur le VPS. |
| 2026-08-11 | Désactivation du middleware `admin-ip-restriction` qui bloquait l'accès admin Strapi. L'admin reste sécurisé par son chemin personnalisé `/taka-admin-2026` et les credentials forts. |
| 2026-08-11 | Correction du workflow GitHub Actions Vercel : le secret `VERCEL_PROJECT_ID` pointait sur le projet `solideat` au lieu de `frontend`. Nettoyage du workflow en remote build (`vercel deploy --prod`), suppression des rewrites legacy et des commits de debug. Alignement Vercel ↔ GitHub `master` rétabli. |
| 2026-08-12 | Optimisation homepage : parallélisation des appels Strapi, cache SSR passé à 60 s / revalidate 300 s, remplacement des balises `<a>` internes par `<Link />`. Page Association branchée sur le content-type Strapi `page-content` (slug `association`). Header : logo dynamique depuis `site-config.logo`. Cronjob healthcheck mis à jour avec sondes preview et vérification admin `/taka-admin-2026`. |
| 2026-08-12 | Refacto qualité : utilisation systématique de `<Image />` Next.js à la place de `<img>` (Header, Footer, Coming Soon, Boutique). Logo du footer dynamique via Strapi. Nettoyage du warning `ctaDon` unused. Mise à jour du middleware avec `runtime: 'nodejs'`. Contenu texte et stats de la page Association écrits dans Strapi. |
| 2026-08-14 | **Refonte homepage 100 % dynamique** : réécriture de `frontend/src/app/page.tsx` avec mapping des sections Strapi (`hero`, `radio-section`, `about-section`, `featured-projects-section`, `featured-artists-section`, `stats-section`, `cta-don-section`, `cta-benevole-section`, `newsletter-section`, `social-section`). Ajout des components Strapi `cta-don-section`, `cta-benevole-section`, `social-section`. Ajout du champ `slug` sur le content-type `artiste`. |
| 2026-08-14 | **Migration du hardcoding restant** : pages `/coming-soon`, `/contact`, `/devenir-benevole` et `/association` entièrement pilotées par le content-type Strapi `page-content`. Metadata `layout.tsx` dynamique via `site-config.defaultSeo`. |
| 2026-08-14 | **Correction du preview bypass** : le middleware accepte maintenant le paramètre `?preview=taka2026` en plus du cookie, permettant d'accéder au vrai site sans action manuelle préalable. |
| 2026-08-14 | **Healthcheck autocorrectif finalisé** : skill `taka-inside-daily-healthcheck` réparé et enrichi de sondes live + preview, auto-fix de redeploy si SHA Vercel ≠ GitHub master, sections `AUTO-FIXES` et `ACTIONS MANUELLES`. Verdict final : **HEALTHY**. |
| 2026-08-14 | **Finalisation itération** : `og:image` dynamique depuis `site-config.logo` (fallback local). Suppression de `frontend/src/app/opengraph-image.tsx` qui retournait un PNG vide en edge runtime. Backend Strapi déjà déployé et SUCCESS. Alignement Vercel ↔ GitHub `master` confirmé. Tests anti-régression OK sur toutes les pages critiques. |
| 2026-08-14 | **Corrections visuelles homepage** : suppression de la carte bénévole dupliquée dans `CtaDonSection` (il ne reste plus qu'une seule section `CtaBenevoleSection`). Suppression du contour noir sur le bouton "Rejoindre l'équipe". Correction du logo cassé : upload d'un nouveau logo dans Strapi, ajout d'un volume Railway persisté `/app/public/uploads` pour ne plus perdre les médias, `alt` du logo forcé à `siteName`, chargement `eager`. Correction du contraste du lien "En savoir plus" dans la section À propos (texte noir sur fond clair). |
| 2026-08-14 | **Corrections about + radio + association** : suppression du titre "À Propos" dupliqué dans la section À propos (conservation du seul H2). Transformation du "En savoir plus" en lien texte sobre avec flèche (comme "Découvrir nos projets"). Correction de l'affichage des images : logo MIB Radio et logo association sur la home, image association sur la page `/association` via Strapi. Fallback local des images activé si Strapi n'a pas de sections. |
| 2026-08-14 | **Paiements pilotables depuis Strapi** : les pages `/faire-un-don.html` et `/checkout` chargent désormais les méthodes de paiement actives depuis Strapi via le proxy `/api/payment-methods`. Désactiver une méthode dans Strapi (`Méthode de paiement` → `isActive = false`) la cache automatiquement sur les pages de don et de checkout. Vérification visuelle : PayPal a été désactivé en test et n'apparaît plus sur `/faire-un-don.html`. |
| 2026-08-15 | **Backend Railway redeploy synchronisé** : montée de version Strapi `5.47.0 → 5.52.0` et synchronisation du `package-lock.json` pour corriger l'erreur `railpack prepare exited with an error` / `Rollup failed to resolve @strapi/content-manager/strapi-admin`. Le backend est redeployé avec succès et aligné avec le frontend sur le même commit GitHub. |
| 2026-08-16 | **Résolution : rubriques homepage réapparues après disparition** : le bootstrap backend a écrasé les sections homepage en voulant seed les liens radio, ne laissant que la section Radio. Restauration des 7 sections via script Python et correction du bootstrap pour ne jamais réécrire les sections existantes. Ajout d'une garde qui bloque le seed si moins de 2 sections sont présentes. Simplification du populate frontend `fetchHomepage`/`fetchHomepageLight` pour éviter un timeout sur le dynamiczone complexe. Ajout d'un fallback des stats (10+/5+/3/50+) dans `AboutSection` au cas où le composant `stats-section` serait vide. Restauration du CTA secondaire Hero "Donner de la force" dans Strapi et correction du populate hero pour qu'il remonte les CTAs. Uniformisation des dimensions des 2 boutons du Hero (même min-width et texte centré). |
| 2026-08-15 | **Liens/logos radio modifiables via Strapi** : ajout d'un champ `links` répétable au composant `homepage.radio-section`. Le frontend consomme cette liste et affiche les icônes Facebook/Instagram/X. Le backend bootstrap seede 3 liens par défaut si le champ est vide. La modification/ajout se fait dans Content Manager → Page d'accueil → Sections → Radio Section → Liens. |
| 2026-08-14 | **Logo MIB Radio + homepage modifiable** : agrandissement du logo radio (`w-32 h-32 md:w-44 md:h-44 lg:w-52 lg:h-52`). Population des sections Strapi de la homepage (radio + about) pour qu'elles soient éditables dans le Content Manager. |

*Dernière mise à jour : 2026-08-14*
