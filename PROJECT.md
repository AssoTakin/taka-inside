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
| Paiement | Stripe / PayPal / FedaPay | Selon marché |
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
- `CLOUDINARY_*` (si activé)
- `RESEND_API_KEY` (si activé)

---

## 7. Commandes utiles

```bash
# Dev local
./scripts/setup-dev.sh

# Docker
docker compose up -d --build
docker compose logs -f backend
docker compose down
```

---

## 8. Notes et conventions

- **CMS source de vérité** : tous les contenus textes, images et projets passent par Strapi.
- **Mobile first** : le design suit une approche responsive mobile-first.
- **Pas de données codées en dur** : tout contenu administrable doit provenir de Strapi.
- **Accessibilité** : objectif WCAG 2.1 AA.
- **Ce fichier est le point d'entrée** : les détails techniques restent dans `docs/`.

---

## 9. Historique

| Date | Événement |
|------|-----------|
| 2024-05-30 | Rédaction PLAN.md, ARCHITECTURE.md, CDC.md |
| 2024-05-30 | Création charte graphique et UI kit |
| 2026-07-27 | Création de ce `PROJECT.md` pour centraliser le suivi |

---

*Dernière mise à jour : 2026-07-27*
