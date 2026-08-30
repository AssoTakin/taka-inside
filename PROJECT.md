# Taka Inside — Suivi de projet

> Point d'entrée central pour l'architecture, l'avancement et la feuille de route du site vitrine de l'association Taka Inside.  
> Les documents détaillés sont dans `docs/`. Ce fichier est le résumé exécutif et le suivi d'itération.  
> À mettre à jour à chaque livraison significative.

## Dernière livraison — 30 août 2026 (fix cron + sécurité)

### Cron / Vercel
- ✅ Remplacement du `VERCEL_TOKEN` du profil taka-inside par un token disposant du scope `sam-takas-projects` (teamId `team_2TiT1AA6anAkAK8mgnDthhah`).
- ✅ L'API Vercel retourne désormais HTTP 200 sur `v9/projects`, `v4/aliases` et `v13/deployments`.
- ✅ Auto-fix de redeploy via `v9/deployments` (POST JSON avec `gitSource` GitHub/master) corrigé dans `/root/devops/taka-inside-daily-healthcheck/scripts/check.py`.
- ✅ Corrigé la liste des aliases Vercel pour utiliser l'endpoint `v4/aliases` (exclut les aliases supprimés).
- ✅ Géré le faux-positif 404 sur les branch-aliases `frontend-git-master-*.vercel.app` (alias réservé Vercel, ignoré par le healthcheck).
- ✅ Alias obsolète `frontend-oypbrlxgx-sam-takas-projects.vercel.app` confirmé n'appartenant plus au projet actif ; le healthcheck ne le signale plus.

### Sécurité / Repo
- ✅ Suppression du fichier `scripts/daily_healthcheck.py` du repo (contenait des références de noms de variables sensibles).
- ✅ Ajout de `scripts/daily_healthcheck.py` et `frontend/.env.local` dans `.gitignore`.
- ✅ Création d'un template `scripts/daily_healthcheck.py.example` sans secret.
- ✅ Vérification historique Git (git-filter-repo) : aucun `frontend/.env.local` ou secret Stripe/Strapi dans l'historique du repo public.
- ✅ Le scan de secrets du healthcheck est propre : 0 secret actif, 5 faux-positifs documentaires dans `docs/ARCHITECTURE.md`.
- ✅ Scan `taka-security-audit` mis à jour pour ignorer les variables d'environnement (`env.get`) et le fichier `frontend/.env.local` non versionné.

### Vérification post-fix
- ✅ Healthcheck principal : verdict `HEALTHY` (Strapi, Vercel, GitHub, live site, headers, API publique, scan secrets).
- ✅ Audit sécurité secondaire : verdict `HEALTHY` après mise à jour des filtres.
- ✅ Site live `https://takainside.org` et les 8 routes publiques répondent HTTP 200.
- ✅ Déploiement Vercel automatique du commit `4d03aee` (fix .gitignore) SUCCESS.

### Rotation des secrets
- ⏸️ **Reportée** : `frontend/.env.local` n'est pas versionné, aucun secret n'a fuité dans GitHub. La rotation reste une bonne pratique future.

## Dernière livraison — 29 août 2026

### Sécurité API Strapi
- ✅ Restriction des endpoints publics : `page-contents`, `site-config`, `legal-page`, `payment-method`, `global-cta` restent publics (nécessaires au healthcheck et au contenu statique).
- ✅ `/api/menu-items` et `/api/homepage` passent en **Authenticated** au démarrage de Strapi (bootstrap `backend/src/index.ts`) **et** via le middleware `global::private-content` qui force un header `Authorization`.
- ✅ Injection du token Strapi côté client dans `frontend/src/hooks/useStrapi.ts` (`getCleanToken()` + `Authorization: Bearer ...`).
- ✅ Build frontend Next.js OK (`npm run build` exit 0), lint OK (0 erreur).
- ✅ Déploiement backend Railway SUCCESS, frontend Vercel SUCCESS.
- ✅ Tests anti-régression : `/api/homepage` et `/api/menu-items` retournent **401** sans token, **200** avec token valide ; contenus publics restent **200**.
- ✅ Le hook client `useStrapi.ts` envoie désormais systématiquement le token d'authentification.
- ✅ Aucune régression détectée : build Next.js réussi (`npm run build`), lint OK (0 erreur).

### Déploiement / Infrastructure
- ✅ Création d'un `Dockerfile` à la racine du repo pour forcer Railway à builder le backend explicitement (builder `NIXPACKS` + `dockerfilePath: Dockerfile`).
- ✅ Configuration Railway mise à jour : `rootDirectory` vide, `dockerfilePath: Dockerfile`.
- ✅ Workflows GitHub Actions backend et frontend dispatchés avec succès.

| Élément | Détail |
|---------|--------|
| Commit | `à venir` |
| URL de production | https://takainside.org?preview=taka2026 |
| Strapi CMS | https://taka-inside-production.up.railway.app |
| Fichiers modifiés | `backend/src/index.ts`, `frontend/src/hooks/useStrapi.ts`, `backend/config/middlewares.ts`, `backend/src/middlewares/private-content.ts`, `Dockerfile`, `PROJECT.md` |

### Rotation des secrets
- ⏸️ **Reportée** : `frontend/.env.local` n'est pas versionné, donc aucun secret n'a fuité dans GitHub. La rotation reste une bonne pratique (notamment via cron / gestion de secrets Vercel/Railway), mais elle n'est pas strictement nécessaire immédiatement. On verra plus tard si c'est vraiment nécessaire.

## Dernière livraison — 20 août 2026

### Monitoring / Healthcheck
- ✅ Mise à jour du script `taka-inside-daily-healthcheck` : correction du chemin `.env` (`~/.hermes/profiles/taka-inside/.env`), mise à jour des endpoints Strapi réels, et du chemin admin (`/taka-admin-2026`).
- ✅ Migration des tokens `VERCEL_TOKEN` et `GITHUB_TOKEN` dans le `.env` du profil taka-inside.
- ✅ Healthcheck passe au vert (`HEALTHY`) : Strapi, Vercel, GitHub, headers, API publique et scan secrets validés.

### Boutique / Paiement Single
- ✅ Correction du formulaire de paiement statique (`public/checkout.html`) qui ne chargeait plus les moyens de paiement et restait bloqué sur "Impossible de charger les moyens de paiement".
- ✅ Suppression d'une référence cassée à `mapLegacyCode()` qui provoquait une exception JS et désactivait le chargement des méthodes.
- ✅ Ajout du rewrite `/paiement → /checkout.html` dans `vercel.json` pour que l'URL utilisée par le boutique (panier → "Procéder au paiement") serve le checkout statique corrigé.
- ✅ Vérification visuelle en production : les méthodes "Carte Bancaire" et "Mobile Money" s'affichent, le changement de méthode fonctionne, le bouton "Payer" est actif, et les deux méthodes redirigent vers leur page de paiement (Stripe / FedaPay).

| Élément | Détail |
|---------|--------|
| Commit | `88f7af9` |
| URL de production | https://takainside.org/paiement?preview=taka2026 |
| Strapi CMS | https://taka-inside-production.up.railway.app |
| Fichiers modifiés | `frontend/public/checkout.html`, `frontend/vercel.json` |

---

## 1. Vision produit

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
| 2026-08-15 | **Liens/logos radio modifiables via Strapi** : ajout d'un champ `links` répétable au composant `homepage.radio-section`. Le frontend consomme cette liste et affiche les icônes Facebook/Instagram/X. Le backend bootstrap seede 3 liens par défaut si le champ est vide. La modification/ajout se fait dans Content Manager → Page d'accueil → Sections → Radio Section → Liens. |
| 2026-08-16 | **Résolution : rubriques homepage réapparues après disparition** : le bootstrap backend a écrasé les sections homepage en voulant seed les liens radio, ne laissant que la section Radio. Restauration des 7 sections via script Python et correction du bootstrap pour ne jamais réécrire les sections existantes. Ajout d'une garde qui bloque le seed si moins de 2 sections sont présentes. Simplification du populate frontend `fetchHomepage`/`fetchHomepageLight` pour éviter un timeout sur le dynamiczone complexe. Ajout d'un fallback des stats (10+/5+/3/50+) dans `AboutSection` au cas où le composant `stats-section` serait vide. Restauration du CTA secondaire Hero "Donner de la force" dans Strapi et correction du populate hero pour qu'il remonte les CTAs. Uniformisation des dimensions des 2 boutons du Hero : `w-full sm:w-[200px]`, texte centré, même hauteur, alignés sur mobile et desktop. Ajout d'un `Dockerfile` explicite et d'un `railway.json` pour stabiliser le build et le healthcheck backend, afin de réduire les fausses alertes "Deploy Crashed". Suppression des titres dupliqués sur les sections homepage : seul le gros titre principal est conservé, les petits labels verts en doublon sont retirés. Les champs `title`/`description` des composants homepage sont désormais optionnels dans Strapi. Amélioration responsive mobile des en-têtes de section Projets/Artistes et des cartes CTA Don/Bénévole. Boutons CTA de pied de page "Je fais un don" / "Rejoindre l'équipe" passés en pleine largeur arrondie horizontale, comme le style de la référence. |
|| 2026-08-17 | **Formulaire bénévole refondu et pilotable par Strapi** : la page `/devenir-benevole` devient un formulaire interactif avec état React. Tous les labels, placeholders, champs requis, liste des compétences, liste des disponibilités, texte du bouton et messages de succès/erreur sont configurables via `formConfig` du `page-content` slug `devenir-benevole` dans Strapi. Sélection multiple des compétences et des disponibilités. Quand "Autre" est sélectionné, un champ de saisie obligatoire apparaît. Création de la route API `/api/benevole` qui enregistre la candidature dans le content-type `benevole` de Strapi et envoie deux emails transactionnels via Resend : un email de confirmation au candidat (Reply-To `kwabo@takainside.org`) et une notification à `benevole@takainside.org` (Reply-To l'email du candidat). Schéma `benevole` mis à jour pour stocker `competences`/`disponibilites` en JSON et `autreCompetence`. Variables d'environnement `BENEVOLE_ADMIN_EMAIL` et `BENEVOLE_REPLY_TO_EMAIL` ajoutées à Vercel. |
|| 2026-08-17 | **Correction formulaire bénévole en production** : `/devenir-benevole` était bloqué par l'écran coming-soon → le middleware l'autorise explicitement. Le Client Component `BenevolePageClient.tsx` a été nettoyé pour ne plus dupliquer header/footer/menu (il repose sur `SiteLayout`). Ajout d'un message d'erreur détaillé en cas d'échec API. Correction des tests E2E TypeScript (`errors: string[]`, `textContent ?? ''`). Ajout de 2 tests Playwright (desktop + mobile) qui valident la soumission complète du formulaire en production. |
|| 2026-08-18 | **Configuration Resend et envoi d'email bénévole validés** : remplacement temporaire du domaine Resend `solid-eat.com` par `takainside.org` pour les tests (à restaurer : `solid-eat.com` était un projet en cours). Domaine `takainside.org` vérifié avec DKIM/SPF. Les emails transactionnels partent désormais depuis `benevole@takainside.org`. La notification admin arrive bien sur `benevole@takainside.org` (`delivered`). Les templates de confirmation candidat et de notification admin sont externalisés dans `formConfig.emailTemplates` du `page-content` `devenir-benevole` et modifiables depuis Strapi. Correction du titre de l'email admin qui n'interpolait pas `{{candidateName}}`. Ajout d'un scroll automatique vers la notification de succès/erreur après soumission. Tests Playwright desktop + mobile repassent en production. |
|| 2026-08-18 | **Restauration du domaine Resend `solid-eat.com`** : suppression de `takainside.org` du compte Resend (plan gratuit limité à 1 domaine) et recréation de `solid-eat.com`. Les enregistrements DNS DKIM/SPF/MX étaient déjà présents chez Hostinger et n'ont pas été touchés. Vérification Resend lancée manuellement : domaine `verified`, DKIM `verified`, SPF `verified`, envoi `enabled`. Impact temporaire : `benevole@takainside.org` n'est plus actif sur Resend jusqu'à upgrade de compte ou retour au domaine Taka Inside. |
||| 2026-08-18 | **Pages Label Musical enrichies** : correction des liens section "Nos artistes" (cartes artistes → page individuelle, bouton rouge → page globale `/label-musical`). Refonte des pages artistes avec bio, cover, réseaux sociaux/streaming, actualités, discographie avec extraits audio, concerts, produits liés. Enrichissement du schéma Strapi `artiste` avec `slug`, `genre_musical`, `citation`, `photo_cover`, `liens_streaming`, `discographie`, `actualites`, `concerts`, `produits_lies`. Page `/label-musical` globale enrichie (hero, stats, grille artistes, CTA). Génération automatique des slugs `dj-kenza` et `mc-takin`. Sitemap mis à jour avec les pages artistes. |
|||| 2026-08-18 | **Pages Label Musical enrichies** : correction des liens section "Nos artistes" (cartes artistes → page individuelle, bouton rouge → page globale `/label-musical`). Refonte des pages artistes avec bio, cover, réseaux sociaux/streaming, actualités, discographie avec extraits audio, concerts, produits liés. Enrichissement du schéma Strapi `artiste` avec `slug`, `genre_musical`, `citation`, `photo_cover`, `liens_streaming`, `discographie`, `actualites`, `concerts`, `produits_lies`. Page `/label-musical` globale enrichie (hero, stats, grille artistes, CTA). Génération automatique des slugs `dj-kenza` et `mc-takin`. Sitemap mis à jour avec les pages artistes. |
|||| 2026-08-18 | **Page `/label-musical` 100 % paramétrable via Strapi** : création du single type `label-musical-page` avec composants `label-musical.hero`, `label-musical.stat`, `label-musical.callout` et CTA réutilisable. Suppression de `backend/nixpacks.toml` qui bloquait le build Railway (`railpack`). Frontend rebranché sur `fetchLabelMusicalPage()` avec deep populate des CTAs/SEO. Création de l'entrée Strapi en production. |
|||| 2026-08-18 | **Corrections contact + footer + CTA bénévole** : suppression de la zone Téléphone dans la section "Nos coordonnées" de `/contact`. Footer Contact réduit à Email + WhatsApp uniquement. Bouton "Devenir bénévole" du callout Label Musical pointe vers `https://takainside.org/devenir-benevole`, configurable depuis Strapi. |

*Dernière mise à jour : 2026-08-18 (contact, footer WhatsApp, CTA bénévole)*