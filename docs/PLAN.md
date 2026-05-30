# PLAN.md — Taka Inside Site Web

> **Version** : 1.0  
> **Date** : 2024-05-30  
> **Méthodologie** : BMAD (Blueprint → Maquettes → Architecture → Développement)  
> **Stack** : Next.js 14 + Strapi v5 + PostgreSQL + Stripe/PayPal/FedaPay  

---

## 1. Vue d'ensemble

| Élément | Valeur |
|---------|--------|
| **Nom** | Taka Inside — Site Web Officiel |
| **Objectif** | Vitrine culturelle + label musical + e-commerce + engagement communautaire |
| **Public** | National (Bénin) + International (diaspora, partenaires) |
| **Langue** | Français principal, i18n-ready pour futur multilingue |
| **Deadline cible** | 14 sprints × 1 semaine = ~3.5 mois (ajustable) |

---

## 2. Phases BMAD

```
Phase 0 │ Blueprint (docs, archi, setup)
        ├─ S0.1  Choix stack ✅
        ├─ S0.2  PLAN.md + ARCHITECTURE.md ← ON EST LÀ
        ├─ S0.3  Setup repo Git + CI/CD + env
        └─ S0.4  Strapi scaffolding + DB init

Phase 1 │ Maquettes & Design
        ├─ S1.1  Charte graphique (couleurs, typos, composants)
        ├─ S1.2  Wireframes textuels → toutes les pages
        ├─ S1.3  Maquettes HTML statiques (3 variantes Accueil)
        └─ S1.4  Design system / UI kit (Tailwind + shadcn)

Phase 2 │ Architecture & Backend
        ├─ S2.1  Strapi content-types (Projets, Artistes, Produits, Bénévoles)
        ├─ S2.2  API REST + GraphQL, auth JWT, rôles
        ├─ S2.3  Upload Cloudinary, médias
        └─ S2.4  Seed data (projets fictifs pour test)

Phase 3 │ Frontend Core
        ├─ S3.1  Next.js 14 App Router, layout global, navigation
        ├─ S3.2  Page Accueil (hero, projets vedettes, artistes, radio, CTA)
        ├─ S3.3  Pages statiques (Association, Contact, Équipe)
        └─ S3.4  Page Projets (liste + filtre + détail)

Phase 4 │ Engagement & Donnateurs
        ├─ S4.1  Formulaire bénévole + upload CV
        ├─ S4.2  Page Faire un Don (montants + impact)
        ├─ S4.3  Intégration Stripe checkout (don unique)
        └─ S4.4  Tableau de bord dons (Strapi admin)

Phase 5 │ E-commerce
        ├─ S5.1  Catalogue produits (tickets, albums)
        ├─ S5.2  Fiche produit + lecteur extrait audio
        ├─ S5.3  Panier (localStorage + server sync)
        ├─ S5.4  Checkout Stripe (produits numériques)
        └─ S5.5  Livraison numérique (liens sécurisés uniques)

Phase 6 │ Label Musical & MIBRADIO
        ├─ S6.1  Page Label + section Artistes
        ├─ S6.2  Page détail Artiste (bio, discographie, concerts)
        ├─ S6.3  Lecteur audio extrait albums
        └─ S6.4  Widget MIBRADIO (streaming + liens app/site)

Phase 7 │ Polish & Déploiement
        ├─ S7.1  SEO (sitemap, robots, metadata, Open Graph)
        ├─ S7.2  Accessibilité WCAG 2.1 AA (keyboard, ARIA, contrastes)
        ├─ S7.3  Responsive (mobile first, tablette, desktop)
        ├─ S7.4  Tests (E2E Playwright, Lighthouse 90+)
        ├─ S7.5  Performance (images WebP, ISR, edge caching)
        └─ S7.6  Déploiement production (Vercel + Render)

Phase 8 │ Post-launch
        ├─ S8.1  Monitoring (Vercel Analytics, Sentry)
        ├─ S8.2  Documentation utilisateur association
        └─ S8.3  Formation admin Strapi (30min call)
```

---

## 3. Structure du Repository

```
taka-inside/
├── .github/
│   └── workflows/
│       ├── ci-frontend.yml          # Lint + Build + Test Next.js
│       └── ci-backend.yml           # Strapi tests + deploy Render
├── backend/                          # Strapi v5 Headless CMS
│   ├── src/
│   │   ├── api/                     # Content-types + controllers + services
│   │   │   ├── projet/
│   │   │   ├── artiste/
│   │   │   ├── produit/
│   │   │   ├── categorie-produit/
│   │   │   ├── benevole/
│   │   │   ├── don/
│   │   │   ├── page-content/        # Pages statiques (À Propos, etc.)
│   │   │   └── config-menu/       # Liens réseaux sociaux, WhatsApp
│   │   ├── extensions/
│   │   └── config/
│   ├── database/                    # Migrations SQL
│   └── config/
├── frontend/                         # Next.js 14 App Router
│   ├── app/
│   │   ├── (site)/                  # Groupe routes publiques
│   │   │   ├── page.tsx             # Accueil
│   │   │   ├── association/
│   │   │   ├── projets/
│   │   │   ├── devenir-benevole/
│   │   │   ├── faire-un-don/
│   │   │   ├── boutique/
│   │   │   ├── label-musical/
│   │   │   └── made-in-benin-radio/
│   │   ├── api/                     # Routes API Next.js (webhooks, checkout)
│   │   └── layout.tsx               # Root layout (nav, footer, providers)
│   ├── components/
│   │   ├── ui/                      # shadcn/ui + customs
│   │   ├── layout/                  # Header, Footer, Navigation
│   │   ├── sections/                # Blocs réutilisables (Hero, Projets, CTA)
│   │   └── forms/                   # Formulaires (bénévole, contact, don)
│   ├── hooks/                       # React custom hooks
│   ├── lib/                         # Utils, API clients, constants
│   ├── types/                       # TypeScript interfaces
│   ├── public/
│   │   └── uploads/                 # Assets statiques (logo, favicon)
│   └── styles/
│       └── globals.css              # Tailwind directives + customs
├── docs/
│   ├── PLAN.md                      # ← Ce fichier
│   ├── ARCHITECTURE.md              # Specs techniques détaillées
│   ├── CHOIX_STACK.md               # Comparatif stacks
│   ├── API.md                       # Endpoints + payloads
│   ├── DEPLOIEMENT.md               # Procédures prod
│   ├── wireframes/                  # Wireframes textuels + sketches
│   └── design/                      # Charte graphique + UI kit
├── scripts/
│   ├── seed-strapi.js               # Data initiale (projets, artistes)
│   └── sync-media.js                # Upload batch Cloudinary
└── docker-compose.yml                # Dev local : Next.js + Strapi + PostgreSQL
```

---

## 4. Arborescence des Pages (Next.js)

```
/
├── /                              → Accueil
├── /association
│   └── /qui-sommes-nous           → Mission, valeurs, histoire
│   └── /notre-equipe              → Membres clés
├── /contact                       → Formulaire + coordonnées
├── /nos-projets                   → Liste + filtres
│   └── /[slug]                    → Détail projet
├── /devenir-benevole
│   └── /formulaire                → Candidature + upload CV
├── /faire-un-don                  → Options montants + paiement
├── /boutique                      → Catalogue produits
│   └── /[slug]                    → Fiche produit
├── /panier                        → Panier + checkout
├── /label-musical
│   └── /nos-artistes              → Grille artistes
│       └── /[slug]                → Détail artiste
├── /made-in-benin-radio           → Lecteur + liens MIBRADIO
├── /mentions-legales
├── /politique-confidentialite
├── /conditions-generales-vente
│
└── /admin (Strapi)                → CMS externe (port 1337)
```

---

## 5. Content Types Strapi

| Collection | Champs clés | Relations |
|------------|-------------|-----------|
| **Projet** | titre, slug, description(rich), objectifs, partenaires, dates, localisation, statut(enum), tags, image_couverture(galerie) | → Catégorie |
| **Artiste** | nom, slug, bio(rich), photo, genre, discographie(compo), concerts | → Produit(album) |
| **Produit** | titre, slug, prix, description(rich), image, type(enum:ticket/album), fichier_numerique, extrait_audio | → Catégorie |
| **CatégorieProduit** | nom, slug | ← Produit |
| **Benevole** | nom, prenom, email, telephone, ville, pays, competences, motivations, disponibilites, CV(media), statut(enum) | |
| **Don** | montant, email, methode(enum), transaction_id, statut | |
| **PageContent** | titre, slug, contenu(rich), seo(meta) | |
| **ConfigMenu** | reseaux_sociaux(JSON), whatsapp_num, email, adresse | |

---

## 6. Intégrations Tierces

| Service | Usage | Implémentation |
|---------|-------|----------------|
| **Stripe** | Paiement carte (don + boutique) | Stripe Checkout (server-side) |
| **PayPal** | Paiement compte PayPal | PayPal Checkout SDK |
| **FedaPay** | Paiement mobile Afrique Ouest | API REST FedaPay (Bénin) |
| **Cloudinary** | Images + vidéos + CDN | SDK Node.js, transformations |
| **WhatsApp** | Contact rapide | Lien wa.me/2290756987473 |
| **MIBRADIO** | Streaming radio | Lecteur HTML5 + flux Icecast |
| **Resend/SendGrid** | Emails transactionnels | API email (confirmation don, commande) |

---

## 7. Critères de Qualité (Definition of Done)

- [ ] Code review par un autre agent avant merge
- [ ] Tests passent (unitaires + E2E)
- [ ] Lighthouse score ≥ 90 (Performance, Accessibilité, SEO, Best Practices)
- [ ] Responsive validé sur 3 breakpoints (360px, 768px, 1440px)
- [ ] WCAG 2.1 AA validé (contrastes, navigation clavier, ARIA)
- [ ] Sécurité : pas de secrets en dur, requêtes paramétrées, CSP headers
- [ ] Documentation à jour (README, API.md, DEPLOIEMENT.md)
- [ ] Push Git avec message conventionnel (`feat:`, `fix:`, `docs:`, `refactor:`)

---

## 8. Prochaines Actions Immédiates

1. **Valider ce PLAN.md** → ✅ (après ton go)
2. **Rédiger ARCHITECTURE.md** → Specs DB, API, auth, sécurité
3. **Wireframes textuels** → Toutes les pages, section par section
4. **Charte graphique** → Couleurs, typos, composants base
5. **Setup dev** → Docker compose (Next.js + Strapi + PostgreSQL)
6. **Premier push Git** → Structure propre, README.md

---

**Sam, tu valides ce plan ?** Tu veux ajuster les sprints, les priorités, ou on passe à ARCHITECTURE.md et aux wireframes ? 🚀
