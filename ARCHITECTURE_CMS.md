# Architecture CMS : Taka Inside

## Objectif
Tout le contenu "en dur" du frontend devient modifiable via Strapi Admin. Aucun texte, image, lien ou CTA ne reste hardcodé.

---

## Content-types à créer

### 1. `site-config` (Single Type) — Configuration globale
Modifiable via : Strapi Admin → Site Config

| Champ | Type | Description |
|-------|------|-------------|
| `siteName` | string | "Taka Inside" |
| `tagline` | string | "L'Art au Service de l'Humain" |
| `logo` | media | Logo principal |
| `favicon` | media | Favicon |
| `ogImage` | media | Image OpenGraph par défaut |
| `defaultSeo` | component:seo | Meta title/description par défaut |
| `contactEmail` | email | contact@takainside.org |
| `contactPhone` | string | +229... |
| `contactAddress` | string | Marseille, France |
| `whatsappNumber` | string | Numéro WhatsApp CTA |
| `copyrightText` | string | "© {year} Taka Inside..." |
| `socialLinks` | component:social-link (repeat) | Facebook, Insta, etc. |

### 2. `homepage` (Single Type) — Page d'accueil
Modifiable via : Strapi Admin → Homepage

| Champ | Type | Description |
|-------|------|-------------|
| `hero` | component:hero-section | Section hero complète |
| `sections` | dynamicZone | Sections empilables |

**Component `hero-section` :**
- badgeText (string) : "Association culturelle · Label musical · Bénin"
- title (string) : "L'Art au Service de"
- highlightedWord (string) : "l'Humain"
- description (richtext)
- primaryCta (component:cta-button)
- secondaryCta (component:cta-button)
- backgroundImage (media)

**Components pour `sections` dynamic zone :**
- `radio-section` : titre, description, logo, lien écoute, lien projet
- `about-section` : titre, description, image, cta
- `featured-projects-section` : titre, nombre à afficher
- `featured-artists-section` : titre, nombre à afficher
- `stats-section` : chiffres clés (repeat)
- `newsletter-section` : titre, description

### 3. `page-content` (Collection Type) — Pages statiques
Modifiable via : Strapi Admin → Page Contents

| Champ | Type | Description |
|-------|------|-------------|
| `slug` | UID | `/association`, `/contact`, `/faire-un-don`, `/devenir-benevole`, `/label-musical` |
| `title` | string | Titre de la page |
| `subtitle` | string | Sous-titre |
| `content` | blocks (richtext) | Contenu principal |
| `heroImage` | media | Image de bannière |
| `seo` | component:seo | Meta balises |
| `ctas` | component:cta-button (repeat) | Boutons d'action |
| `formConfig` | json | Configuration spécifique formulaire |

**Pages à migrer :**
- `/association` (Qui sommes-nous)
- `/contact`
- `/faire-un-don`
- `/devenir-benevole`
- `/label-musical` (page liste)

### 4. `menu-item` (Collection Type) — Navigation
Modifiable via : Strapi Admin → Menu Items

| Champ | Type | Description |
|-------|------|-------------|
| `label` | string | Texte du lien |
| `link` | string | URL (ex: `/projets`) |
| `position` | enumeration | header / footer / both |
| `order` | integer | Ordre d'affichage |
| `parent` | relation | Sous-menu (relation to menu-item) |
| `isExternal` | boolean | Ouvre dans nouvel onglet |
| `icon` | string | Nom d'icône (optionnel) |
| `isVisible` | boolean | Afficher/masquer |

### 5. `legal-page` (Collection Type) — Pages légales
Modifiable via : Strapi Admin → Legal Pages

| Champ | Type | Description |
|-------|------|-------------|
| `slug` | UID | `cgv`, `mentions-legales`, `politique-confidentialite` |
| `title` | string | Titre |
| `lastUpdated` | date | Date de dernière mise à jour |
| `content` | blocks (richtext) | Contenu complet |
| `sections` | component:legal-section (repeat) | Sections avec titre + contenu |
| `seo` | component:seo | Meta balises |

**Pages à migrer :**
- `/conditions-generales-vente`
- `/mentions-legales`
- `/politique-confidentialite`

### 6. `payment-method` (Collection Type) — Méthodes de paiement
Modifiable via : Strapi Admin → Payment Methods

| Champ | Type | Description |
|-------|------|-------------|
| `name` | string | "Stripe", "PayPal", "FedaPay" |
| `displayName` | string | "Carte bancaire (SSL 256-bit)" |
| `description` | text | Description affichée |
| `icon` | media | Icône |
| `isActive` | boolean | Visible ou non |
| `displayOrder` | integer | Ordre |
| `config` | json | Config technique (clés, URLs) |

### 7. `global-cta` (Collection Type) — CTAs réutilisables
Modifiable via : Strapi Admin → Global CTAs

| Champ | Type | Description |
|-------|------|-------------|
| `key` | UID | Identifiant unique (ex: `hero-primary`, `don-stripe`) |
| `label` | string | Texte du bouton |
| `link` | string | URL |
| `style` | enumeration | primary / secondary / outline |
| `icon` | string | Icône (optionnel) |
| `isVisible` | boolean | Actif/Inactif |

---

## Components partagés

### `cta-button`
- label (string)
- link (string)
- style (enumeration: primary, secondary, outline)
- icon (string, optionnel)
- isExternal (boolean)

### `seo`
- metaTitle (string)
- metaDescription (text)
- keywords (string)

### `social-link`
- platform (enumeration: facebook, instagram, twitter, youtube, spotify, linkedin)
- url (string)
- icon (string, optionnel)

### `legal-section`
- title (string)
- content (richtext)

---

## Ordre de migration (priorité)

1. ✅ **site-config** → Header, Footer, WhatsApp, SEO global
2. ✅ **menu-item** → Navigation header/footer
3. ✅ **homepage** → Hero + sections page d'accueil
4. ✅ **page-content** → Association, Contact, Don, Bénévolat, Label Musical
5. ✅ **legal-page** → CGV, Mentions légales, Confidentialité
6. ✅ **payment-method** → Méthodes de paiement page Don
7. ✅ **global-cta** → Tous les CTAs réutilisables

---

## Impact frontend (fichiers à refactorer)

| Fichier | Contenu à migrer vers |
|---------|----------------------|
| `layout/Header.tsx` | site-config + menu-item |
| `layout/Footer.tsx` | site-config + menu-item |
| `layout/WhatsAppButton.tsx` | site-config |
| `app/page.tsx` | homepage |
| `app/association/page.tsx` | page-content |
| `app/contact/page.tsx` | page-content |
| `app/faire-un-don/page.tsx` | page-content + payment-method + don-config |
| `app/devenir-benevole/page.tsx` | page-content |
| `app/label-musical/page.tsx` | page-content |
| `app/conditions-generales-vente/page.tsx` | legal-page |
| `app/mentions-legales/page.tsx` | legal-page |
| `app/politique-confidentialite/page.tsx` | legal-page |
| `app/not-found.tsx` | global-cta + site-config |
| `app/opengraph-image.tsx` | site-config |
| `components/payments/*.tsx` | payment-method |

---

## Workflow éditorial final

Sam se connecte à Strapi Admin → modifie un texte/image/lien → clique Publish → le site se met à jour instantanément (ISR/revalidate).

Aucun commit, aucun deploy, aucune intervention technique nécessaire.
