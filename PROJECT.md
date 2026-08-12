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

*Dernière mise à jour : 2026-08-12*
