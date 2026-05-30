# 🎵 Taka Inside — Site Web Officiel

> **L'Art au Service de l'Humain**

Site vitrine + e-commerce + engagement communautaire pour l'association culturelle et label musical **Taka Inside** (Bénin).

---

## 📦 Stack Technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | Next.js 14 (App Router) + React 18 + TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **CMS / API** | Strapi v5 (Headless) |
| **Base de données** | PostgreSQL |
| **Médias** | Cloudinary CDN |
| **Paiements** | Stripe + PayPal + FedaPay |
| **Hébergement** | Vercel (frontend) + Render/Railway (backend) |
| **Email** | Resend |

---

## 🗂️ Structure du Projet

```
taka-inside/
├── frontend/           # Next.js 14 — Site public
├── backend/            # Strapi v5 — Headless CMS
├── docs/               # Documentation (PLAN, ARCHITECTURE, wireframes)
├── scripts/            # Scripts utilitaires (seed, sync)
└── docker-compose.yml  # Dev local complet
```

---

## 🚀 Démarrage Rapide (Dev)

### Prérequis

- Node.js 20+
- Docker & Docker Compose
- Compte Cloudinary (images)
- Compte Stripe (test mode)

### 1. Cloner et entrer

```bash
git clone https://github.com/sam/taka-inside.git
cd taka-inside
```

### 2. Lancer l'environnement complet

```bash
docker-compose up
```

Cela démarre :
- **Frontend** : http://localhost:3000
- **Backend Strapi** : http://localhost:1337/admin
- **PostgreSQL** : localhost:5432

### 3. Créer le compte admin Strapi

```bash
cd backend && npx strapi admin:create-user
```

### 4. Lancer Next.js (si hors Docker)

```bash
cd frontend && npm install && npm run dev
```

---

## 📋 Documentation

| Document | Description |
|----------|-------------|
| [`docs/PLAN.md`](docs/PLAN.md) | Roadmap, sprints, arborescence |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Specs techniques, DB, API, sécurité |
| [`docs/CHOIX_STACK.md`](docs/CHOIX_STACK.md) | Comparatif des stacks considérées |
| [`docs/CDC.md`](docs/CDC.md) | Cahier des charges source (texte extrait) |
| [`docs/API.md`](docs/API.md) | Endpoints API (à venir) |
| [`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md) | Procédures production (à venir) |

---

## 🎯 Roadmap (BMAD)

- [x] **Phase 0** — Blueprint (stack, plan, archi)
- [ ] **Phase 1** — Maquettes & Design (wireframes, charte graphique, UI kit)
- [ ] **Phase 2** — Backend (Strapi content-types, API, auth)
- [ ] **Phase 3** — Frontend Core (layout, pages statiques, projets)
- [ ] **Phase 4** — Engagement (bénévoles, dons, paiements)
- [ ] **Phase 5** — E-commerce (boutique, panier, livraison numérique)
- [ ] **Phase 6** — Label Musical & MIBRADIO
- [ ] **Phase 7** — Polish (SEO, accessibilité, tests, responsive)
- [ ] **Phase 8** — Déploiement production

---

## 🤝 Contribuer

Ce projet suit la méthodologie **BMAD** (Blueprint → Maquettes → Architecture → Développement) avec approche multi-agent.

- Commits conventionnels : `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Branches : `main` (prod), `develop` (intégration), `feat/*` (features)
- Pull requests obligatoires avec review

---

## 📄 Licence

© 2024 Taka Inside. Tous droits réservés.

---

**Questions ?** Ouvrir une issue ou contacter l'équipe via [takainside.org](https://takainside.org)
