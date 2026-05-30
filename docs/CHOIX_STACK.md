# Choix de Stack Technique — Taka Inside

## Option A : WordPress + WooCommerce (Recommandation CDC)

| Critère | Évaluation |
|---------|------------|
| **Déploiement** | Rapide, hébergement mutualisé suffisant |
| **CMS natif** | Excellent — l'association gère seule |
| **E-commerce** | WooCommerce mature, plugins paiement existants |
| **Coût dev** | Plus faible à court terme |
| **Code propre** | Difficile — hooks, thèmes, plugins en cascade |
| **Versioning** | Possible (thème custom en git) mais limité |
| **Performance** | Nécessite caching agressif (WP Rocket, etc.) |
| **Évolutivité** | Moyenne — on touche vite au plafond |
| **Sécurité** | Bien documentée mais cible privilégiée (attaques WP) |
| **SEO** | Yoast SEO, très mature |
| **Headless possible ?** | Oui (WP REST API) mais lourd |

**Verdict** : Si l'association veut une autonomie totale sans dev, c'est le choix logique. Mais pour du BMAD propre avec versioning, CI/CD, tests, c'est un contre-sens technique.

---

## Option B : Next.js 14 (App Router) + Strapi + PostgreSQL + Stripe

| Critère | Évaluation |
|---------|------------|
| **Déploiement** | Vercel (frontend) + Railway/Render (backend) |
| **CMS** | Strapi headless — interface admin moderne, l'association peut gérer |
| **E-commerce** | Stripe + custom cart — plus de contrôle, moins de magic |
| **Code propre** | Excellent — TypeScript, composants, tests, linting |
| **Versioning** | Git natif sur 100% du code |
| **Performance** | SSR/ISR, images optimisées, edge caching |
| **Évolutivité** | Excellente — micro-services, API scaleable |
| **Sécurité** | API isolée, pas de surface d'attaque WP |
| **SEO** | Next.js natif (metadata API, sitemap, robots) |
| **BMAD Ready ?** | Parfait — agents peuvent travailler sur frontend/backend/CMS en parallèle |
| **Inconvénient** | Besoin d'un dev pour évolutions futures |

**Verdict** : Aligné avec BMAD, versioning, CI/CD, qualité de code. L'association gère le contenu via Strapi (WYSIWYG).

---

## Option C : Hybride (Recommandation Hermes)

**Next.js + Payload CMS** (alternative à Strapi)
- Payload = CMS headless basé sur Next.js, 100% TypeScript
- Même codebase frontend + backend
- Moins de context-switching pour les agents
- Admin UI proche de Strapi, plus intégré au code

**Stack proposée :**
```
Frontend    : Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
CMS/Backend : Payload CMS (Next-based, TypeScript, PostgreSQL)
Paiements   : Stripe (carte) + PayPal + FedaPay (API REST)
Base        : PostgreSQL (Supabase ou Railway)
Auth        : NextAuth.js (JWT, rôles admin/éditeur)
Storage     : Cloudinary (images/vidéos) + AWS S3 (fichiers numériques boutique)
Radio       : Lecteur HTML5 (Icecast/Shoutcast URL)
Hébergement : Vercel (Next.js) + Railway/Render (Payload)
```

---

## Décision Sam

**Quelle option tu choisis ?**

- [ ] **A** — WordPress/WooCommerce (rapide, autonome association)
- [ ] **B** — Next.js + Strapi (moderne, découplé)
- [ ] **C** — Next.js + Payload CMS (recommandation BMAD, codebase unifiée)
- [ ] **Autre** — précise ta préférence

Une fois choisi, je rédige `PLAN.md` + `ARCHITECTURE.md` et on initialise le repo Git avec la structure.
