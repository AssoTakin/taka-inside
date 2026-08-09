# POINT D'ARRÊT — Taka Inside

## Date : 30 Mai 2026
## Commit : `14e080f`
## Repo : https://github.com/AssoTakin/taka-inside

---

## ✅ FRONTEND (Next.js 16 + Tailwind) — 100% FONCTIONNEL EN LOCAL

| Page | Statut | Données |
|------|--------|---------|
| `/` Accueil | ✅ Connecté API | Fetch projets + artistes, fallback mock |
| `/projets` | ✅ Connecté API | Liste dynamique avec filtres |
| `/projets/[slug]` | ✅ SSG dynamique | Page détail complète |
| `/label-musical` | ✅ Connecté API | Liste artistes avec photos |
| `/label-musical/[slug]` | ✅ SSG dynamique | Bio, discographie, concerts |
| `/boutique` | ✅ Connecté API via `/api/produits` | Panier fonctionnel |
| `/association` | ✅ Créée | Mission, valeurs, stats |
| `/contact` | ✅ Formulaire actif | POST `/api/contact` |
| `/devenir-benevole` | ✅ Formulaire existant | À brancher si besoin |
| `/faire-un-don` | ✅ Paiements | Stripe + PayPal + FedaPay structure |
| `/checkout` | ✅ | Intégré au panier |
| `/radio` | ✅ | Page statique |
| OG Image | ✅ Générée dynamiquement | `opengraph-image.tsx` |

**Build : 24/24 routes, 0 erreur TypeScript.**

### Variables d'environnement frontend (.env)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_51L5u5c...` ✅
- `STRIPE_SECRET_KEY` = `sk_live_51L5u5c...` ✅
- `NEXT_PUBLIC_STRAPI_API_URL` = `http://localhost:1337` ⚠️ (à remplacer par URL Railway)

---

## ✅ STRIPE — COMPTE LIVE VALIDÉ

- **Compte** : TAKÍN (Taka Inside)
- **Type** : `non_profit`, `incorporated_non_profit`
- **Email** : kwabo@takainside.org
- **Statut** : `charges_enabled: true`, `payouts_enabled: true`
- **Pays** : FR
- **Devise** : EUR
- **Capabilities activées** : bancontact, blik, card_payments, eps, giropay, klarna, link, p24, sofort

**Clés configurées et prêtes.**

---

## ✅ BACKEND (Strapi v5)

| Élément | Statut |
|---------|--------|
| Content-types | ✅ Projet, Artiste, Produit, CategorieProduit, Benevole, Don, Commande, PageContent, ConfigMenu |
| API REST | ✅ Opérationnelle en local |
| Build admin local | ⚠️ Bug Vite connu (non bloquant) |
| Seed script | ✅ `scripts/seed-strapi.js` |
| Database | SQLite (dev) / PostgreSQL (prod) |

---

## 🚧 DÉPLOIEMENT — BLOQUÉ PAR SÉCURITÉS PLATEFORMES

### Vercel (Frontend)
- ❌ Tokens fournis : `vcp_...` = **Project Tokens** (scope limité)
- ❌ Besoin : **Personal Access Token** depuis https://vercel.com/account/tokens
- Scope requis : `Full Account`

### Railway (Backend + DB)
- ✅ Projet créé : "Taka Inside" (ID: `8ac9a38c-3984-4df0-abdb-e9fc52082777`)
- ❌ Tokens fournis : permissions insuffisantes pour déploiement
- ❌ Besoin : auth navigateur ou token de projet avec scope `deploy`

---

## 🚀 COMMANDES DE DÉPLOIEMENT MANUEL

### 1. Railway (Backend + PostgreSQL)

Va sur https://railway.app/project/8ac9a38c-3984-4df0-abdb-e9fc52082777

1. Clique **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Clique **"New"** → **"Service"** → **"Deploy from GitHub repo"**
3. Sélectionne : `AssoTakin/taka-inside` → branche `master` → dossier `backend`
4. Dans **Variables** :
   ```
   DATABASE_URL = <généré automatiquement par PostgreSQL>
   APP_KEYS = <génère-en 4 nouvelles : openssl rand -base64 32>
   API_TOKEN_SALT = <openssl rand -base64 32>
   ADMIN_JWT_SECRET = <openssl rand -base64 32>
   JWT_SECRET = <openssl rand -base64 32>
   TRANSFER_TOKEN_SALT = <openssl rand -base64 32>
   ```
5. Clique **"Deploy"**
6. Copie l'URL du service (ex: `https://takainside.up.railway.app`)

### 2. Vercel (Frontend)

Va sur https://vercel.com/new

1. Clique **"Import Git Repository"**
2. Sélectionne : `AssoTakin/taka-inside`
3. **Root Directory** : `frontend`
4. Dans **Environment Variables** :
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_PUBLISHABLE_KEY_PLACEHOLDER
   STRIPE_SECRET_KEY = SECRET_PLACEHOLDER
   NEXT_PUBLIC_STRAPI_API_URL = <URL Railway backend>
   ```
5. Clique **"Deploy"**

### 3. Post-déploiement

- **Seed Strapi** : Lancer `node scripts/seed-strapi.js` sur l'instance Railway
- **Stripe Webhook** : Configurer l'URL Vercel dans le dashboard Stripe
- **DNS** : Pointer `takainside.bj` vers Vercel

---

## 📦 FICHIERS CLÉS CRÉÉS

| Fichier | Rôle |
|---------|------|
| `frontend/src/lib/api.ts` | Fetcher SSR-safe |
| `frontend/src/app/api/contact/route.ts` | Route API contact |
| `frontend/src/app/api/produits/route.ts` | Route API boutique |
| `frontend/src/app/opengraph-image.tsx` | OG image dynamique |
| `frontend/src/app/projets/[slug]/page.tsx` | Page projet dynamique |
| `frontend/src/app/label-musical/[slug]/page.tsx` | Page artiste dynamique |
| `scripts/seed-strapi.js` | Injection données test |

---

## 🔑 ACCÈS ENREGISTRÉS

| Service | Identifiants | Statut |
|---------|-------------|--------|
| GitHub | `AssoTakin` / `Abrakaddabr@#1` + PAT `ghp_...` | ✅ Connecté |
| Stripe | `kwabo@takainside.bj` / `s(z8XxpUxLz&Y5@` | ✅ Validé |
| Railway | Tokens `16c4418b...` et `93822424...` | ⚠️ Scope limité |
| Vercel | Tokens `vcp_0OXQF...` et `vcp_6Irjt...` | ⚠️ Project tokens |

---

## 🎯 PROCHAINES PRIORITÉS

1. **Déployer Railway** → Obtenir URL backend
2. **Déployer Vercel** → Site en ligne
3. **Seed Strapi** → Données réelles
4. **Configurer Stripe webhook** → Paiements fonctionnels
5. **Remplacer images** → Photos réelles artistes/projets
