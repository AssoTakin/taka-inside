# 🏳️ STATUS — Taka Inside

## 📅 Session: 2026-06-04
## 👤 Agent: Hermes (conversation avec Sam)
## 🎯 Action: Conversion universelle EUR + déploiement production

---

## 1. ✅ INFRASTRUCTURE DÉPLOIÉE

| Service | Plateforme | URL | Statut |
|---------|-----------|-----|--------|
| **Frontend** | Vercel | `https://frontend-rgnbnot1u-sam-takas-projects.vercel.app` | ✅ En ligne |
| **Backend API** | Railway | `https://taka-inside-production.up.railway.app` | ✅ Opérationnel |
| **Base de données** | PostgreSQL (Railway) | Interne | ✅ Connectée |
| **Stockage fichiers** | Cloudflare R2 | `taka-inside-digital` | ✅ Privé (streaming serveur) |
| **Domaine** | takainside.org | Vers Vercel | ✅ Actif |

---

## 2. 💶 SYSTÈME DE DEVISE (EUR)

### Helper `frontend/src/lib/price.ts`

| Fonction | Rôle | Heuristique |
|----------|------|-------------|
| `toEUR(amount)` | Conversion FCFA → EUR | `amount > 100` = FCFA (÷ 655.957), sinon EUR brut |
| `formatPrice(amount)` | Affichage `fr-FR` avec `€` | 2 décimales si < 1€, sinon 0 |
| `toEURCents(amount)` | Conversion → centimes EUR pour Stripe | `Math.round(toEUR(amount) * 100)` |
| `formatPriceRawFCFA(amount)` | Affichage FCFA brut | Dons/livraisons (non utilisé actuellement) |

**Taux fixe :** `1 EUR = 655.957 FCFA` (taux CFAO)

### Prix affichés actuellement

| Produit | Prix brut Strapi | Affichage EUR |
|---------|-----------------|---------------|
| T-Shirt Taka Inside | 25 | **25 €** |
| Ticket Festival Taka 2025 | 15 | **15 €** |
| KIKOKO (Album digital) | 2500 | **3,81 €** |

---

## 3. ✅ FRONTEND (Next.js 16.2.6 + Tailwind v4)

### Pages (22 routes)

| Route | Type | API |
|-------|------|-----|
| `/` | SSR + SSG | `projets`, `artistes` |
| `/projets` | SSR | `projets` |
| `/projets/[slug]` | SSG dynamique | `projets/${slug}` |
| `/label-musical` | SSR | `artistes` |
| `/label-musical/[slug]` | SSG dynamique | `artistes/${slug}` |
| `/boutique` | SSR + API Route | `produits` via `/api/produits` |
| `/boutique/[slug]` | SSG dynamique | fiche produit |
| `/checkout` | Statique | Panier client-side |
| `/commande/[commandeId]` | SSR | `commandes` |
| `/faire-un-don` | Statique | Stripe, FedaPay |
| `/paiement/confirmation` | Statique | — |
| `/association` | Statique | — |
| `/radio` | Statique | — |
| `/contact` | Statique + API | POST `/api/contact` |
| `/devenir-benevole` | Statique | — |
| `/conditions-generales-vente` | Statique | — |
| `/mentions-legales` | Statique | — |
| `/politique-confidentialite` | Statique | — |

### Routes API internes (11)

| Route | Méthode | Fonction |
|-------|---------|----------|
| `/api/produits` | GET | Proxy Strapi + fallback mock + résolution image absolue |
| `/api/create-payment-intent` | POST | Stripe payment intent (centimes EUR, currency=eur) |
| `/api/fedapay/create-transaction` | POST | FedaPay transaction (XOF) |
| `/api/paypal/create-order` | POST | PayPal order (USD) |
| `/api/paypal/capture-order` | POST | PayPal capture |
| `/api/webhooks/stripe` | POST | Webhook Stripe (création commande) |
| `/api/commandes` | POST | Création commande Strapi |
| `/api/livraison/calcul` | GET | Calcul frais livraison |
| `/api/telecharger/[token]` | GET | Streaming R2 direct (AWS SDK v3) |
| `/api/contact` | POST | Envoi formulaire |
| `/api/email/send` | POST | Envoi email (Resend) |

---

## 4. ✅ BACKEND (Strapi v5.47.0)

### Content-types (9)

| Content-type | Items | Description |
|--------------|-------|-------------|
| `projet` | 4 | Projets de l'association |
| `artiste` | 2 | DJ Kenza, MC Takin |
| `produit` | 3 | T-Shirt, Ticket, KIKOKO |
| `commande` | 0 | Commandes boutique |
| `categorie-produit` | 0 | Catégories |
| `benevole` | 0 | Formulaires bénévoles |
| `don` | 0 | Dons enregistrés |
| `page-content` | 0 | Contenus CMS |
| `config-menu` | 0 | Menus |

### Champs produit

- `titre`, `prix`, `description`, `type` (`merch`/`ticket`/`digital`)
- `image` (média upload Strapi — ⚠️ URLs relatives `/uploads/...` éphémères)
- `url_telechargement` (lien fichier digital)
- `slug` (URL SEO)

---

## 5. 💳 PAIEMENTS

| Provider | Statut | Devise API | Remarque |
|----------|--------|-----------|----------|
| **Stripe** | ✅ LIVE | `eur` (centimes) | Compte `kwabo@takainside.org` |
| **FedaPay** | ✅ Configuré | `xof` (FCFA) | Mobile Money — API opérationnelle |
| **PayPal** | 🔲 Non activé | `usd` | Structure présente, clés manquantes |

---

## 6. 🖼️ STOCKAGE & MÉDIAS

| Ressource | Solution | Statut |
|-----------|----------|--------|
| Images Strapi | Railway filesystem local | ⚠️ Éphémère (disparaît au redémarrage) |
| Image KIKOKO | `frontend/public/images/kikoko-cover.jpg` | ✅ Asset statique Vercel |
| Fichiers digitaux | Cloudflare R2 (`taka-inside-digital`) | ✅ Privé, streaming serveur |
| Uploads futurs | R2 via API Strapi (S3 provider) | 🔲 À configurer |

---

## 7. 🔑 STACK TECHNIQUE

| Couche | Techno | Version |
|--------|--------|---------|
| Frontend | Next.js | 16.2.6 |
| Frontend | React | 19.2.4 |
| Frontend | Tailwind CSS | v4 |
| Frontend | TypeScript | ^5 |
| Backend | Strapi | 5.47.0 |
| Backend | Node.js | 22.22.3 |
| Base de données | PostgreSQL | 15 |
| Paiements | Stripe | ^22.2.0 |
| Paiements | FedaPay | API v1 |
| Stockage | Cloudflare R2 | AWS SDK v3 |

---

## 8. 📋 TODO RESTANT

| # | Priorité | Tâche | Blocage |
|---|----------|-------|---------|
| 1 | 🟡 P1 | Configurer provider S3/R2 côté Strapi pour uploads persistants | — |
| 2 | 🟡 P1 | Ajouter images pour T-Shirt et Ticket (actuellement `null`) | — |
| 3 | 🟡 P1 | Tester flux d'achat digital complet (paiement → token → téléchargement) | — |
| 4 | 🟢 P2 | Activer PayPal (besoin `PAYPAL_CLIENT_ID` + `PAYPAL_SECRET`) | Sam |
| 5 | 🟢 P2 | Ajouter champ `url_telechargement` au produit KIKOKO dans Strapi | — |
| 6 | 🟢 P2 | Seed données `page-contents` et `config-menus` | — |
| 7 | 🟢 P2 | Mettre en place Jest + Playwright tests | — |
| 8 | 🔵 P3 | Renommer branche `master` → `main` (alignement convention) | — |

---

## 9. 🔐 SECRETS (à ne PAS commiter)

| Secret | Localisation | Statut |
|--------|-------------|--------|
| `STRIPE_SECRET_KEY` | Vercel env + local `.env` | ✅ Configuré |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Vercel env | ✅ Configuré |
| `FEDAPAY_SECRET_KEY` | Vercel env | ✅ Configuré |
| `R2_ACCESS_KEY_ID` | Vercel env | ✅ Configuré |
| `R2_SECRET_ACCESS_KEY` | Vercel env | ✅ Configuré |
| `R2_ENDPOINT` | Vercel env | ✅ Configuré |
| `RAILWAY_TOKEN` | GitHub Secrets | ✅ Configuré |
| `VERCEL_TOKEN` | `/tmp/vercel_token.txt` | ✅ Configuré |
| `PAYPAL_CLIENT_ID` | — | 🔲 Manquant |
| `PAYPAL_SECRET` | — | 🔲 Manquant |

---

## 10. 📝 HISTORIQUE RÉCENT

| Date | Commit | Description |
|------|--------|-------------|
| 2026-06-04 | `42b28d4` | Conversion universelle EUR — boutique, panier, checkout, commande, dons, CGV, API Stripe en centimes EUR |
| 2026-06-04 | `23d6769` | Image KIKOKO hébergée localement dans `public/images/` |
| 2026-06-04 | `e44a174` | Fiche produit SSG + liens "En savoir plus" |
| 2026-06-04 | `dad50ed` | Images fixes + formatPrice EUR sur cartes produits |
| 2026-06-03 | (multiples) | Streaming R2, variables d'env Vercel, fix build |

---

*Dernière MAJ : 2026-06-04*
*URL production : https://frontend-rgnbnot1u-sam-takas-projects.vercel.app*
*Commit actuel : `42b28d4`*
