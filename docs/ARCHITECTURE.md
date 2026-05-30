# ARCHITECTURE.md — Taka Inside Site Web

> **Version** : 1.0  
> **Stack** : Next.js 14 (App Router) + Strapi v5 + PostgreSQL  
> **Date** : 2024-05-30  

---

## 1. Vue d'ensemble Technique

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              UTILISATEURS                                    │
│                        (Web / Mobile / Admin)                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND — Next.js 14                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   App Router │  │   React 18   │  │ Tailwind CSS │  │ shadcn/ui    │    │
│  │   (Server)   │  │   (Client)   │  │ + Animations │  │ + Customs    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│  │  ISR/SSR    │  │ SWR/Fetcher  │  │   Zustand    │                       │
│  │  (Caching)   │  │  (API Calls) │  │   (State)    │                       │
│  └──────────────┘  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
┌─────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────────┐
│   STRAPI API    │  │    API ROUTES Next.js   │  │     TIERCES SERVICES         │
│   (Headless)    │  │    (Server Actions)     │  │                              │
│                 │  │                         │  │  • Stripe Checkout           │
│  • REST / GQL   │  │  • Webhooks Stripe      │  │  • PayPal SDK               │
│  • Auth JWT     │  │  • Webhooks FedaPay     │  │  • FedaPay API              │
│  • Upload Media │  │  • Génération liens DL   │  │  • Cloudinary CDN           │
│  • Admin CMS    │  │  • Emails (Resend)      │  │  • Resend Email             │
└─────────────────┘  └─────────────────────────┘  └─────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BASE DE DONNÉES — PostgreSQL                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Projets    │  │   Artistes   │  │   Produits   │  │  Bénévoles   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │     Dons     │  │   Commandes   │  │  Utilisateurs│  │  Médias      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend — Next.js 14 App Router

### 2.1 Structure App Router

```
app/
├── layout.tsx              # Root layout : providers, metadata, analytics
├── globals.css             # Tailwind + custom CSS variables (charte graphique)
├── (site)/                 # Groupe de routes publiques
│   ├── page.tsx            # Accueil
│   ├── layout.tsx          # Layout site : Header + Footer + Nav
│   ├── association/
│   │   └── page.tsx
│   ├── projets/
│   │   ├── page.tsx        # Liste avec ISR (reval 60s)
│   │   └── [slug]/
│   │       └── page.tsx    # Détail avec generateStaticParams
│   ├── devenir-benevole/
│   │   └── page.tsx
│   ├── faire-un-don/
│   │   └── page.tsx
│   ├── boutique/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── panier/
│   │   └── page.tsx        # Client Component (state panier)
│   ├── label-musical/
│   │   └── page.tsx
│   ├── nos-artistes/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   └── made-in-benin-radio/
│       └── page.tsx
├── api/
│   ├── stripe/
│   │   ├── checkout/route.ts      # Création session Stripe
│   │   └── webhook/route.ts       # Réception webhooks Stripe
│   ├── fedapay/
│   │   └── initier/route.ts       # Initier paiement FedaPay
│   ├── download/
│   │   └── [token]/route.ts       # Livraison fichier sécurisé
│   └── contact/
│       └── route.ts             # Envoi email formulaire
└── _components/            # Components partagés (non route)
```

### 2.2 Fetching Data Pattern

```typescript
// lib/strapi.ts — Client API réutilisable
const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function fetchAPI(endpoint: string, options = {}) {
  const res = await fetch(`${STRAPI_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 }, // ISR par défaut
    ...options,
  });
  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
  return res.json();
}
```

### 2.3 State Management

| Scope | Solution | Raison |
|-------|----------|--------|
| **Panier** | Zustand + localStorage | Persistant, léger, SSR-safe |
| **Auth admin** | JWT Strapi | Pas de auth côté site public |
| **UI** | React Context (léger) | Toasts, modals, état formulaire |

---

## 3. Backend — Strapi v5 Headless CMS

### 3.1 Content Types (Schemas)

#### Projet
```json
{
  "kind": "collectionType",
  "attributes": {
    "titre": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "titre" },
    "description": { "type": "richtext" },
    "objectifs": { "type": "richtext" },
    "partenaires": { "type": "string" },
    "date_debut": { "type": "date" },
    "date_fin": { "type": "date" },
    "localisation": { "type": "string" },
    "statut": { "type": "enumeration", "enum": ["a_venir", "en_cours", "termine", "urgent"] },
    "tags": { "type": "component", "repeatable": true, "component": "shared.tag" },
    "image_couverture": { "type": "media", "multiple": false },
    "galerie": { "type": "media", "multiple": true },
    "cta_don": { "type": "boolean", "default": false },
    "cta_benevole": { "type": "boolean", "default": false }
  }
}
```

#### Artiste
```json
{
  "kind": "collectionType",
  "attributes": {
    "nom": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "nom" },
    "biographie": { "type": "richtext" },
    "photo": { "type": "media", "multiple": false },
    "genre_musical": { "type": "string" },
    "discographie": {
      "type": "component",
      "repeatable": true,
      "component": "musique.album"
    },
    "concerts": {
      "type": "component",
      "repeatable": true,
      "component": "evenement.concert"
    },
    "liens_externes": {
      "type": "component",
      "component": "shared.liens-sociaux"
    }
  }
}
```

#### Produit (E-commerce)
```json
{
  "kind": "collectionType",
  "attributes": {
    "titre": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "titre" },
    "prix": { "type": "decimal", "required": true, "min": 0 },
    "type": { "type": "enumeration", "enum": ["ticket", "album"] },
    "description": { "type": "richtext" },
    "image": { "type": "media", "multiple": false },
    "fichier_numerique": { "type": "media", "multiple": false, "private": true },
    "extrait_audio": { "type": "media", "multiple": false },
    "date_evenement": { "type": "datetime" },
    "lieu_evenement": { "type": "string" },
    "quantite_disponible": { "type": "integer", "default": -1 },
    "categorie": { "type": "relation", "relation": "manyToOne", "target": "api::categorie-produit.categorie-produit" }
  }
}
```

#### Bénévole
```json
{
  "kind": "collectionType",
  "attributes": {
    "nom": { "type": "string", "required": true },
    "prenom": { "type": "string", "required": true },
    "email": { "type": "email", "required": true },
    "telephone": { "type": "string" },
    "ville": { "type": "string" },
    "pays": { "type": "string" },
    "competences": { "type": "text" },
    "motivations": { "type": "text" },
    "disponibilites": { "type": "text" },
    "cv": { "type": "media", "multiple": false, "allowedTypes": ["files"] },
    "statut": { "type": "enumeration", "enum": ["recue", "en_cours", "acceptee", "refusee"], "default": "recue" },
    "projet_lie": { "type": "relation", "relation": "manyToOne", "target": "api::projet.projet" }
  }
}
```

#### Don
```json
{
  "kind": "collectionType",
  "attributes": {
    "montant": { "type": "decimal", "required": true, "min": 1 },
    "email_donateur": { "type": "email" },
    "nom_donateur": { "type": "string" },
    "methode": { "type": "enumeration", "enum": ["stripe", "paypal", "fedapay"] },
    "transaction_id": { "type": "string" },
    "statut": { "type": "enumeration", "enum": ["en_attente", "complete", "echoue", "rembourse"], "default": "en_attente" },
    "message": { "type": "text" }
  }
}
```

#### Commande (Boutique)
```json
{
  "kind": "collectionType",
  "attributes": {
    "email_client": { "type": "email", "required": true },
    "nom_client": { "type": "string" },
    "produits": {
      "type": "component",
      "repeatable": true,
      "component": "commerce.ligne-commande"
    },
    "total": { "type": "decimal", "required": true },
    "methode_paiement": { "type": "enumeration", "enum": ["stripe", "paypal", "fedapay"] },
    "statut": { "type": "enumeration", "enum": ["en_attente", "payee", "livree", "annulee"], "default": "en_attente" },
    "lien_telechargement": { "type": "string" },
    "token_telechargement": { "type": "string", "private": true },
    "date_expiration": { "type": "datetime" }
  }
}
```

### 3.2 Components Réutilisables

```
shared/
  ├── tag (string: label)
  ├── lien-social (string: plateforme, string: url)
  ├── liens-sociaux (repeatable: lien-social)
  └── media-caption (media: image, string: legende)

musique/
  ├── album (string: titre, string: annee, media: pochette, string: lien_spotify)
  └── extrait (media: fichier, string: titre)

evenement/
  └── concert (string: ville, datetime: date, string: salle)

commerce/
  └── ligne-commande (relation: produit, integer: quantite, decimal: prix_unitaire)
```

---

## 4. API & Endpoints

### 4.1 Strapi REST API (Public — read-only)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/projets` | GET | Liste projets (populate=* pour relations) |
| `/api/projets/:slug` | GET | Détail projet |
| `/api/artistes` | GET | Liste artistes |
| `/api/artistes/:slug` | GET | Détail artiste |
| `/api/produits` | GET | Catalogue boutique (filtre type) |
| `/api/produits/:slug` | GET | Fiche produit |
| `/api/page-contents/:slug` | GET | Pages statiques (À Propos, etc.) |

### 4.2 Next.js API Routes (Server Actions)

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/stripe/checkout` | POST | Créer session checkout Stripe | ❌ |
| `/api/stripe/webhook` | POST | Webhook Stripe (signature vérifiée) | Signature Stripe |
| `/api/fedapay/initier` | POST | Initier transaction FedaPay | ❌ |
| `/api/download/:token` | GET | Télécharger fichier (token unique) | Token URL |
| `/api/contact` | POST | Envoyer email formulaire contact | ❌ |
| `/api/benevole` | POST | Soumettre candidature bénévole | ❌ |

---

## 5. Authentification & Sécurité

### 5.1 Auth

- **Site public** : Pas d'authentification utilisateur. Données collectées via formulaires (email, nom) stockées dans Strapi.
- **Admin Strapi** : JWT stocké en httpOnly cookie. Rôles :
  - `Super Admin` : Tout
  - `Éditeur` : CRUD contenu (projets, artistes, produits), lecture bénévoles/dons
  - `Bénévole Manager` : Lecture/écriture bénévoles seulement
  - `Finance` : Lecture/écriture dons + commandes

### 5.2 Sécurité

| Menace | Mesure |
|--------|--------|
| **Injection SQL** | Strapi ORM (Knex) + requêtes paramétrées |
| **XSS** | React escape automatique + CSP headers |
| **CSRF** | SameSite cookies + token JWT côté admin |
| **Injection fichiers** | Validation type MIME, taille max, scan antivirus (Cloudinary) |
| **Fuite données** | Variables d'environnement, jamais de secrets en client |
| **Attaque brute force** | Rate limiting API (Next.js middleware) |
| **Webhook spoofing** | Vérification signature Stripe (HMAC) |

### 5.3 Headers de sécurité (Next.js)

```typescript
// next.config.js
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.cloudinary.com; connect-src 'self' *.stripe.com; font-src 'self'; frame-src *.stripe.com;" },
];
```

---

## 6. Base de Données — PostgreSQL

### 6.1 Schema simplifié (relations)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              PostgreSQL                                     │
│                                                                             │
│   ┌──────────────┐       ┌──────────────┐       ┌──────────────┐           │
│   │   projets    │       │  categories  │       │   artistes   │           │
│   │──────────────│       │──────────────│       │──────────────│           │
│   │ id (PK)      │──┐    │ id (PK)      │       │ id (PK)      │           │
│   │ titre        │  │    │ nom          │       │ nom          │           │
│   │ slug         │  └───▶│ slug         │       │ slug         │           │
│   │ statut       │       │              │       │ genre        │           │
│   │ categorie_id │───────│              │       │ biographie   │           │
│   └──────────────┘       └──────────────┘       │ photo_id     │───┐       │
│                                                 └──────────────┘   │       │
│   ┌──────────────┐       ┌──────────────┐       ┌──────────────┐  │       │
│   │   produits   │       │  commandes   │       │   medias     │◀─┘       │
│   │──────────────│       │──────────────│       │──────────────│          │
│   │ id (PK)      │       │ id (PK)      │       │ id (PK)      │          │
│   │ titre        │       │ email_client │       │ url          │          │
│   │ prix         │       │ total        │       │ type         │          │
│   │ type         │       │ statut       │       │ size         │          │
│   │ categorie_id │──────▶│              │       │              │          │
│   │ fichier_id   │──────▶│              │       │              │          │
│   └──────────────┘       └──────────────┘       └──────────────┘          │
│                                                                             │
│   ┌──────────────┐       ┌──────────────┐       ┌──────────────┐           │
│   │  benevoles   │       │    dons      │       │ up__users    │           │
│   │──────────────│       │──────────────│       │──────────────│           │
│   │ id (PK)      │       │ id (PK)      │       │ id (PK)      │           │
│   │ nom          │       │ montant      │       │ email        │           │
│   │ email        │       │ email        │       │ role         │           │
│   │ statut       │       │ methode      │       │              │           │
│   │ cv_id        │──────▶│ statut       │       │              │           │
│   │ projet_id    │──────▶│ transaction  │       │              │           │
│   └──────────────┘       └──────────────┘       └──────────────┘           │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Migrations

- Strapi gère automatiquement les migrations de schéma via `strapi develop`.
- Pour les données : scripts de seed dans `scripts/seed-strapi.js`.
- Backup : `pg_dump` automatisé via cron sur le serveur de production.

---

## 7. Paiements — Architecture

### 7.1 Stripe (Cartes bancaires + dons)

```
Utilisateur          Frontend              API Next.js             Stripe
    │                   │                       │                    │
    │─── sélection ────▶│                       │                    │
    │   montant/produit │                       │                    │
    │                   │──── POST /api/stripe/checkout ─────────────▶│
    │                   │   { items, email, type: "don"|"achat" }     │
    │                   │                       │◀── session.id ──────│
    │                   │◀── clientSecret ──────│                    │
    │◀── redirect Stripe Checkout ──────────────│                    │
    │                   │                       │                    │
    │─── paiement OK ──▶│                       │                    │
    │                   │                       │◀── webhook ────────│
    │                   │                       │  checkout.completed │
    │                   │                       │──▶ créer Don/Commande
    │◀── confirmation email ───────────────────│                    │
```

### 7.2 FedaPay (Mobile Bénin)

- API REST FedaPay v2
- Frontend redirige vers page de paiement FedaPay
- Webhook FedaPay → Next.js API → mise à jour statut commande

### 7.3 Livraison Numérique

```typescript
// api/download/[token]/route.ts
export async function GET(req, { params }) {
  const commande = await strapi.findOne('commande', {
    filters: { token_telechargement: params.token }
  });
  
  if (!commande || new Date() > commande.date_expiration) {
    return new Response('Lien expiré', { status: 410 });
  }
  
  // Générer URL signée Cloudinary (valide 5min)
  const signedUrl = cloudinary.utils.private_download_link(commande.fichier_id);
  return Response.redirect(signedUrl);
}
```

---

## 8. Performance & SEO

### 8.1 Optimisations Next.js

| Technique | Implémentation |
|-----------|----------------|
| **Images** | `next/image` → WebP/AVIF auto, lazy loading, responsive sizes |
| **Fonts** | `next/font` → Polices auto-optimisées, zero layout shift |
| **ISR** | `revalidate: 60` sur pages projets/artistes/produits |
| **Streaming** | `loading.tsx` + Suspense pour chunks UI |
| **Edge** | Pages statiques sur Vercel Edge Network |

### 8.2 SEO

```typescript
// app/layout.tsx — Metadata globale
export const metadata = {
  title: { template: '%s | Taka Inside', default: 'Taka Inside — L\'Art au Service de l\'Humain' },
  description: 'Association culturelle et label musical basée au Bénin. Projets innovants, brassage culturel, Made In Bénin Radio.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://takainside.org',
    siteName: 'Taka Inside',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', site: '@takainsideasso' },
  robots: { index: true, follow: true },
};
```

- **Sitemap** : `app/sitemap.ts` → génération dynamique depuis Strapi
- **Robots.txt** : `app/robots.ts`
- **JSON-LD** : Schema.org Organization + Event + Product sur pages pertinentes

---

## 9. Déploiement — Architecture Production

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCTION                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────┐         ┌─────────────────────────────┐ │
│   │        VERCEL (Edge)         │         │       RENDER / Railway       │ │
│   │                              │         │                              │ │
│   │   Next.js 14 Frontend        │◀───────▶│   Strapi v5 Backend          │ │
│   │   • ISR / SSR                │  HTTPS  │   • API REST / GraphQL       │ │
│   │   • API Routes (webhooks)    │         │   • PostgreSQL               │ │
│   │   • Static Assets (CDN)      │         │   • Upload / Cloudinary      │ │
│   └─────────────────────────────┘         └─────────────────────────────┘ │
│              │                                              │               │
│              ▼                                              ▼               │
│   ┌─────────────────────────────┐         ┌─────────────────────────────┐ │
│   │   Cloudflare DNS + SSL       │         │   Cloudinary CDN             │ │
│   │   takainside.org             │         │   • Images optimisées        │ │
│   │   www.madeinbeninradio.bj    │         │   • Vidéos / Audio           │ │
│   └─────────────────────────────┘         └─────────────────────────────┘ │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                         TIERS SERVICES                               │  │
│   │   Stripe · PayPal · FedaPay · Resend · Sentry · Google Analytics    │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.1 Variables d'Environnement

```bash
# Frontend (.env.local)
NEXT_PUBLIC_STRAPI_API_URL=https://api.takainside.org
NEXT_PUBLIC_SITE_URL=https://takainside.org
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
NEXT_PUBLIC_WHATSAPP_NUMBER=2290756987473

# Backend (Strapi)
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://...
JWT_SECRET=...
ADMIN_JWT_SECRET=...
API_TOKEN_SALT=...
CLOUDINARY_NAME=...
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...

# Paiements
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
FEDAPAY_API_KEY=...
FEDAPAY_SECRET=...

# Email
RESEND_API_KEY=re_...
```

---

## 10. Monitoring & Maintenance

| Outil | Usage |
|-------|-------|
| **Vercel Analytics** | Web Vitals, trafic, sources |
| **Sentry** | Error tracking frontend + backend |
| **Uptime Robot** | Monitoring uptime API + site |
| **Strapi Audit** | Logs admin, historique modifications |
| **pg_dump** | Backup quotidien base de données |

---

## 11. Prochaines Étapes Techniques

1. **Docker Compose dev** → `docker-compose.yml` (Next.js + Strapi + PostgreSQL)
2. **Installer Strapi** → `npx create-strapi-app backend --quickstart`
3. **Créer content types** → Projets, Artistes, Produits, Bénévoles
4. **Seed data** → 3 projets fictifs, 2 artistes, 3 produits
5. **Next.js init** → `npx create-next-app frontend --typescript --tailwind --app`
6. **Premier commit** → Structure propre, README.md

**Ready to code ?** 🚀
