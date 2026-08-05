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
    └─→ Services tiers (Stripe, PayPal, FedaPay, Cloudinary, Resend)
                │
                ▼
        PostgreSQL ( données métier )
```

---

## 4. États d'avancement

### ✅ Livré / actif

- [x] Choix de stack (`docs/CHOIX_STACK.md`)
- [x] Architecture initiale (`docs/ARCHITECTURE.md`)
- [x] Cahier des charges (`docs/CDC.md`)
- [x] Charte graphique et UI kit (`docs/design/`)
- [x] Wireframes (`docs/wireframes/`)
- [x] Setup Docker Compose local
- [x] Strapi v5 en production sur Railway
- [x] PostgreSQL en production sur Railway
- [x] Déploiement Vercel frontend
- [x] SSL configuré (`docs/RAPPORT_SSL.md`)
- [x] **Sécurité : headers HTTP durcis** (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- [x] **Sécurité : nettoyage des placeholders de secrets** dans `docs/DEPLOIEMENT.md`
- [x] **Sécurité : durcissement de l'admin Strapi** (chemin secret personnalisé + restriction IP)
- [x] **Paiement : confirmation Stripe côté serveur** via `/api/verify-checkout-session`
- [x] **Paiement : suppression du code PayPal sandbox mort**
- [x] **Backend : stabilisation du build Strapi / Railway**

### 🚧 En cours / itéré régulièrement

- [ ] Pages frontend selon wireframes
- [ ] Intégration contenus Strapi ↔ Next.js
- [ ] Page Projets (liste + filtre + détail)
- [ ] Système de dons Stripe / FedaPay
- [ ] E-commerce (produits, panier, checkout)

### 🔴 Non démarré

- [ ] Lecteur audio MIBRADIO
- [ ] Espace bénévole
- [ ] SEO avancé (sitemap, Open Graph, metadata)
- [ ] Tests E2E Playwright
- [ ] Documentation admin pour l'association

---

## 5. URLs clés

| Environnement | URL |
|---------------|-----|
| Production frontend | https://takainside.org |
| Production frontend (Vercel) | https://frontend-oypbrlxgx-sam-takas-projects.vercel.app |
| Backend Strapi | https://taka-inside-production.up.railway.app |

---

## 6. Variables d'environnement

Voir `.env.example` à la racine. Les secrets incluent :
- `STRAPI_API_TOKEN`
- `NEXT_PUBLIC_STRAPI_URL`
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `FEDAPAY_SECRET_KEY`
- `CLOUDINARY_*` (si activé)
- `RESEND_API_KEY` (si activé)

> **Note sécurité :** les placeholders de secrets ont été retirés de la documentation (`docs/DEPLOIEMENT.md`). Aucune valeur sensible ne doit être versionnée.

---

## 7. Sécurité

- **Headers HTTP** ajoutés côté Next.js : `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **Admin Strapi durci** : chemin personnalisé (`/taka-admin-2026`) + restriction IP en amont, désactivation de l'inscription publique.
- **Secrets** : nettoyage des placeholders de credentials dans `docs/DEPLOIEMENT.md`.

---

## 8. Paiement

- **Stripe** est la méthode principale en production (`pk_live_*`, `sk_live_*`).
- La page `/paiement/confirmation` vérifie le `session_id` Stripe côté serveur via `/api/verify-checkout-session` avant d'afficher le récapitulatif.
- **FedaPay** reste utilisée pour le Mobile Money.
- **PayPal sandbox mort retiré** : suppression des routes `/api/paypal/*`, du provider React et de la dépendance `@paypal/react-paypal-js`.

---

## 9. Commandes utiles

```bash
# Dev local
./scripts/setup-dev.sh

# Docker
docker compose up -d --build
docker compose logs -f backend
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

---

*Dernière mise à jour : 2026-08-05*
