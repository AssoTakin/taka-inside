# WIREFRAMES — Taka Inside

> **Référence** : Cahier des Charges (CDC.md) + PLAN.md  
> **Méthodologie** : BMAD — Phase 1.2 (Wireframes Textuels)  
> **Breakpoints** : Mobile < 640px / Tablette 640–1024px / Desktop > 1024px  
> **Palette** : Jaune vif `#FFD700` · Rouge piment `#DC143C` · Vert `#228B22` · Noir `#111111` · Blanc `#FFFFFF`

---

## 1. Layout Global (Toutes les pages)

### 1.1 Header / Navigation

```
┌──────────────────────────────────────────────────────┐
│ [LOGO Taka Inside]  [Accueil] [L'Association ▼]     │
│ [Nos Projets] [Label Musical] [Boutique] [Contact]  │
│ [🎙 MIBRADIO] [❤ Faire un Don]                     │
├──────────────────────────────────────────────────────┤
│  ↳ L'Association : Qui Sommes-Nous ? · Notre Équipe  │
│  ↳ Label Musical : Présentation · Nos Artistes     │
└──────────────────────────────────────────────────────┘
```

- **Logo** : SVG, cliquable → Accueil. Position fixe gauche.
- **Nav principale** : liens texte, couleur blanche sur fond noir. Hover = soulignement jaune + scale 1.02.
- **Dropdowns** : desktop hover, mobile accordéon dans le menu burger.
- **CTA visibles** : bouton "Faire un Don" (rouge piment, blanc), badge "MIB RADIO" (vert).

**Responsive :**
- **Mobile** : burger menu (hamburger icon droite) → slide-in drawer noir depuis la droite, liens empilés, icônes réseaux sociaux en bas du drawer.
- **Tablette** : logo + nav horizontale compacte, dropdowns au clic.
- **Desktop** : nav horizontale complète, dropdowns au hover.

---

### 1.2 Footer (Toutes les pages)

```
┌─────────────────────────────────────────────────────────────────────┐
│ COL 1 (25%)          │ COL 2 (25%)       │ COL 3 (25%)  │ COL 4    │
│ Logo Taka Inside     │ Navigation        │ Contact      │ Réseaux  │
│ Slogan court         │ Accueil           │ +229 07…     │ [FB]     │
│                      │ Qui Sommes-Nous   │ contact@…    │ [X]      │
│                      │ Nos Projets       │ Cotonou, BJ  │ [Insta]  │
│                      │ Boutique          │              │ [WhatsApp]│
│                      │ Label Musical     │              │          │
│                      │ Devenir Bénévole  │              │          │
├─────────────────────────────────────────────────────────────────────┤
│ Mentions Légales  ·  Politique Confidentialité  ·  CGV  ·  © 2024  │
└─────────────────────────────────────────────────────────────────────┘
```

**Responsive :**
- **Mobile** : 1 colonne empilée, texte centré. Réseaux sociaux en ligne d'icônes horizontale.
- **Tablette** : 2 colonnes (Logo+Nav / Contact+Réseaux).
- **Desktop** : 4 colonnes égales.

---

### 1.3 WhatsApp Floating Button

- Icône WhatsApp vert fixée en bas à droite (`position: fixed; bottom: 20px; right: 20px`)
- Lien : `https://wa.me/2290756987473?text=Bonjour%20Taka%20Inside%20!`
- Hover : tooltip "Nous écrire sur WhatsApp" + scale 1.1
- Mobile : légèrement plus petit pour ne pas masquer le contenu.

---

## 2. Page Accueil — `/`

### Layout
```
Header
├── Section Hero
├── Section À Propos (mission)
├── Section Projets en Vedette (3–4 cartes)
├── Section Label Musical (1–2 artistes)
├── Section MIB RADIO (widget lecteur)
├── Section CTA Don + Bénévolat
├── Section Actualités / Événements (optionnel)
Footer
```

---

### 2.1 Section Hero

```
┌──────────────────────────────────────────────────────────────┐
│ [Image/Vidéo pleine largeur, hauteur 70vh, overlay noir 40%] │
│                                                              │
│         TAKA INSIDE                                          │
│         L'Art au Service de l'Humain                         │
│                                                              │
│         [Découvrir nos projets]   [Faire un Don]            │
│                                                              │
│  ↓ Scroll indicator (animation rebond)                      │
└──────────────────────────────────────────────────────────────┘
```

- **Image** : photo culturelle/musicale béninoise (fallback couleur dominante jaune/rouge/vert).
- **Texte** : H1 "Taka Inside" (jaune vif) + sous-titre blanc.
- **CTA primaire** : bouton jaune avec texte noir → `/nos-projets`
- **CTA secondaire** : bouton contour blanc → `/faire-un-don`

**Responsive :**
- **Mobile** : texte centré, boutons empilés full-width, hauteur 60vh.
- **Tablette** : texte centré, boutons côte à côte.
- **Desktop** : texte aligné gauche, boutons côte à côte.

---

### 2.2 Section À Propos

```
┌──────────────────────────────────────────────────────────────┐
│ TITRE : Qui Sommes-Nous ?                                    │
│ SOUS-TITRE : Carrefour culturel et label musical associatif  │
│                                                              │
│ ┌────────────┐  ┌───────────────────────────────────────┐   │
│ │ [Image     │  │ Paragraphe mission (2–3 lignes)       │   │
│ │  Bénin/    │  │ [En savoir plus →]                    │   │
│ │  Culture]  │  └───────────────────────────────────────┘   │
│ └────────────┘                                               │
└──────────────────────────────────────────────────────────────┘
```

- **Image** : ronde ou arrondie (border-radius 16px), à gauche sur desktop.
- **Texte** : paragraphe extrait du CMS (`page-content/qui-sommes-nous`).
- **Lien** : bouton outline → `/association/qui-sommes-nous`

**Responsive :**
- **Mobile** : image full-width en haut, texte dessous centré.
- **Tablette** : image 40% / texte 60% côte à côte.
- **Desktop** : image 35% / texte 65% côte à côte.

---

### 2.3 Section Projets en Vedette

```
┌──────────────────────────────────────────────────────────────┐
│ NOS PROJETS PHARES                                           │
│                                                              │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│ │ [IMG]   │ │ [IMG]   │ │ [IMG]   │ │ [IMG]   │             │
│ │ Statut  │ │ Statut  │ │ Statut  │ │ Statut  │             │
│ │ Titre   │ │ Titre   │ │ Titre   │ │ Titre   │             │
│ │ Desc…   │ │ Desc…   │ │ Desc…   │ │ Desc…   │             │
│ │ [→]     │ │ [→]     │ │ [→]     │ │ [→]     │             │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
│                                                              │
│              [Voir tous nos projets →]                      │
└──────────────────────────────────────────────────────────────┘
```

- **Carte** : image (16:9), badge statut (rouge=urgent, vert=en cours, gris=terminé), titre H3, extrait 2 lignes, flèche lien.
- **Hover carte** : image zoom 1.05, ombre portée accentuée, flèche décale droite.

**Responsive :**
- **Mobile** : carrousel swipeable (1 carte visible), ou grille 1 colonne.
- **Tablette** : grille 2 colonnes.
- **Desktop** : grille 4 colonnes.

---

### 2.4 Section Label Musical

```
┌──────────────────────────────────────────────────────────────┐
│ LABEL MUSICAL                                                │
│ Découvrez les artistes qui portent la voix du Bénin         │
│                                                              │
│ ┌─────────────────────┐  ┌─────────────────────┐          │
│ │ [Photo Artiste 1]   │  │ [Photo Artiste 2]   │          │
│ │ Nom Artiste           │  │ Nom Artiste           │          │
│ │ Genre / Style         │  │ Genre / Style         │          │
│ │ [Écouter →]           │  │ [Écouter →]           │          │
│ └─────────────────────┘  └─────────────────────┘          │
│                                                              │
│              [Découvrir tous nos artistes →]                │
└──────────────────────────────────────────────────────────────┘
```

**Responsive :**
- **Mobile** : 1 colonne, bouton full-width.
- **Tablette** : 2 colonnes.
- **Desktop** : 2 colonnes avec espacement large.

---

### 2.5 Section MIB RADIO (Widget)

```
┌──────────────────────────────────────────────────────────────┐
│ 🎙 MADE IN BÉNIN RADIO                                       │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [▶ Play]  Made In Bénin Radio — En direct                │ │
│ │ ─────────────●──────────────────────  [🔊]               │ │
│ │ [Visiter le site →]    [Télécharger l'app Android →]    │ │
│ └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

- **Lecteur** : HTML5 `<audio>` custom UI, streaming Icecast/Shoutcast.
- **Liens externes** : `www.madeinbeninradio.bj` et Google Play Store.
- **Fond** : dégradé subtil vert → noir, bordure jaune 2px.

**Responsive :**
- **Mobile** : lecteur compact, boutons empilés.
- **Tablette/Desktop** : lecteur + boutons côte à côte.

---

### 2.6 Section CTAs (Don + Bénévolat)

```
┌──────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────┐ ┌────────────────────────────┐│
│ │   SOUTENEZ-NOUS             │ │   REJOIGNEZ-NOUS           ││
│ │                             │ │                            ││
│ │   Chaque don compte.        │ │   Devenez acteur de la     ││
│ │   [Faire un Don ❤]         │ │   culture béninoise.       ││
│ │                             │ │   [Devenir Bénévole 🙌]     ││
│ └─────────────────────────────┘ └────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

- **Carte gauche** : fond noir, texte blanc, bouton rouge piment.
- **Carte droite** : fond blanc, texte noir, bouton vert.

**Responsive :**
- **Mobile** : empilées, full-width.
- **Tablette/Desktop** : côte à côte 50/50.

---

## 3. Page Qui Sommes-Nous — `/association/qui-sommes-nous`

### Layout
```
Header
├── Hero secondaire (titre de page)
├── Section Histoire / Origines
├── Section Mission & Valeurs (4–6 blocs icônes)
├── Section Chiffres clés (bannière colorée)
├── Section Partenaires (logos)
├── CTA (Devenir Bénévole / Faire un Don)
Footer
```

---

### 3.1 Hero Secondaire

```
┌──────────────────────────────────────────────────────────────┐
│ [Image pleine largeur, hauteur 40vh, overlay noir 30%]      │
│                                                              │
│              QUI SOMMES-NOUS ?                               │
│              L'histoire de Taka Inside                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- **H1** centré, blanc, taille 48px desktop / 32px mobile.
- **Breadcrumb** : Accueil > L'Association > Qui Sommes-Nous (sous le header).

---

### 3.2 Section Histoire

```
┌──────────────────────────────────────────────────────────────┐
│ ┌───────────────────────────────────────┐  ┌──────────────┐ │
│ │ Texte riche (histoire de l'asso)      │  │ [Image       │ │
│ │ Plusieurs paragraphes possibles       │  │  équipe/     │ │
│ │                                       │  │  événement]  │ │
│ └───────────────────────────────────────┘  └──────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**Responsive :** Mobile = empilé (image en haut), Tablette/Desktop = texte/image côte à côte.

---

### 3.3 Section Mission & Valeurs

```
┌──────────────────────────────────────────────────────────────┐
│ NOS VALEURS                                                  │
│                                                              │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│ │ [🎵]   │ │ [🤝]   │ │ [🌍]   │ │ [💡]   │ │ [❤]    │     │
│ │ Art    │ │ Partage│ │ Pont   │ │ Inno-  │ │ Humanité│     │
│ │        │ │        │ │ culture│ │ vation │ │        │     │
│ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │
└──────────────────────────────────────────────────────────────┘
```

- **Icônes** : style line-art, couleur jaune sur fond noir ou inverse.
- **Hover** : fond jaune, icône + texte noirs, scale 1.03.

**Responsive :**
- **Mobile** : grille 2 colonnes.
- **Tablette** : grille 3 colonnes.
- **Desktop** : grille 5 colonnes.

---

### 3.4 Section Chiffres Clés

```
┌──────────────────────────────────────────────────────────────┐
│ [Fond dégradé rouge→jaune→vert]                             │
│                                                              │
│    12+         50+         8          3        1000+        │
│   Projets    Artistes    Pays    Radios    Bénévoles         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- **Animation** : compteur animé au scroll (IntersectionObserver).

**Responsive :** grille 2×2 mobile, ligne complète desktop.

---

## 4. Page Notre Équipe — `/association/notre-equipe`

### Layout
```
Header
├── Hero secondaire
├── Section Équipe Dirigeante (3–5 membres)
├── Section Bénévoles Actifs (grille large, optionnel)
├── CTA Rejoindre
Footer
```

### 4.1 Grille Membres

```
┌──────────────────────────────────────────────────────────────┐
│ NOTRE ÉQUIPE                                                 │
│                                                              │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│ │ [Photo    │ │ [Photo    │ │ [Photo    │ │ [Photo    │     │
│ │  ronde]   │ │  ronde]   │ │  ronde]   │ │  ronde]   │     │
│ │ Prénom    │ │ Prénom    │ │ Prénom    │ │ Prénom    │     │
│ │ Nom       │ │ Nom       │ │ Nom       │ │ Nom       │     │
│ │ Rôle      │ │ Rôle      │ │ Rôle      │ │ Rôle      │     │
│ │ [LinkedIn]│ │ [LinkedIn]│ │ [LinkedIn]│ │ [LinkedIn]│     │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘     │
└──────────────────────────────────────────────────────────────┘
```

- **Photo** : circulaire (border-radius 50%), object-fit cover, 150×150px.
- **Rôle** : texte secondaire, couleur gris clair.
- **Hover** : photo légèrement zoomée, overlay avec icônes réseaux sociaux (LinkedIn, email).

**Responsive :**
- **Mobile** : 1 colonne centrée.
- **Tablette** : 2–3 colonnes.
- **Desktop** : 4–5 colonnes.

---

## 5. Page Contact — `/contact`

### Layout
```
Header
├── Hero secondaire
├── Section Formulaire + Coordonnées (2 colonnes)
├── Section Carte (iframe Google Maps, optionnel)
Footer
```

### 5.1 Formulaire + Coordonnées

```
┌──────────────────────────────────────────────────────────────┐
│ ┌──────────────────────────────────┐ ┌────────────────────────┐│
│ │ CONTACTEZ-NOUS                   │ │ NOS COORDONNÉES        ││
│ │                                  │ │                        ││
│ │ Nom *        [_______________]   │ │ 📍 Cotonou, Bénin      ││
│ │ Email *      [_______________]   │ │ 📧 contact@takainside…  ││
│ │ Téléphone    [_______________]   │ │ 📞 +229 07 56 98 74 73││
│ │ Sujet        [_______________]   │ │ 🕐 Lun–Ven 9h–18h      ││
│ │ Message *    [               ]   │ │                        ││
│ │              [               ]   │ │ [Nous écrire sur       ││
│ │              [               ]   │ │  WhatsApp]             ││
│ │                                  │ │ [Suivre sur Facebook]  ││
│ │ [Envoyer le message →]          │ │                        ││
│ └──────────────────────────────────┘ └────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

- **Champs obligatoires** : Nom, Email, Message (marqués `*`).
- **Validation** : email valide, message min 10 caractères, feedback inline (bordure rouge si erreur).
- **Bouton** : fond jaune, texte noir, full-width mobile.
- **Soumission** : états "Envoi en cours…" (spinner), "Message envoyé ✅", "Erreur ❌".
- **Backend** : email envoyé à `contact@takainside.bj` via API Next.js / service email.

**Responsive :**
- **Mobile** : empilé (formulaire en haut, coordonnées dessous).
- **Tablette/Desktop** : 2 colonnes, formulaire 60% / coordonnées 40%.

---

## 6. Page Nos Projets (Liste) — `/nos-projets`

### Layout
```
Header
├── Hero secondaire
├── Section Filtres (statut, catégorie, recherche)
├── Section Grille Projets
├── Pagination (ou scroll infini, optionnel)
Footer
```

### 6.1 Barre de Filtres

```
┌──────────────────────────────────────────────────────────────┐
│ [Tous ▼]  [En cours ▼]  [Culture ▼]  🔍 [Rechercher...]     │
└──────────────────────────────────────────────────────────────┘
```

- **Filtres** : dropdowns custom (statut : Tous/En cours/Terminé/À venir/Urgent ; catégorie : depuis Strapi).
- **Recherche** : input texte avec icône loupe, filtre en temps réel (debounce 300ms).
- **Compteur** : "12 projets trouvés" à droite des filtres.

**Responsive :**
- **Mobile** : filtres en accordéon vertical (1 colonne), recherche full-width.
- **Tablette** : 2 filtres par ligne + recherche.
- **Desktop** : filtres horizontaux + recherche alignée.

---

### 6.2 Grille Projets

```
┌──────────────────────────────────────────────────────────────┐
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│ │ [IMG 16:9]│ │ [IMG 16:9]│ │ [IMG 16:9]│ │ [IMG 16:9]│     │
│ │ 🟢 En cours│ │ 🔴 Urgent │ │ ⚪ Terminé│ │ 🟡 À venir│     │
│ │ Titre     │ │ Titre     │ │ Titre     │ │ Titre     │     │
│ │ Localisat.│ │ Localisat.│ │ Localisat.│ │ Localisat.│     │
│ │ Dates     │ │ Dates     │ │ Dates     │ │ Dates     │     │
│ │ [Voir le projet →]              │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘     │
└──────────────────────────────────────────────────────────────┘
```

- **Carte** : image cover, badge statut couleur, titre H3, localisation + dates, lien.
- **Hover** : overlay noir 20%, titre jaune, bouton apparaît.

**Responsive :**
- **Mobile** : 1 colonne, carte full-width.
- **Tablette** : 2 colonnes.
- **Desktop** : 3–4 colonnes.

---

## 7. Page Détail Projet — `/nos-projets/[slug]`

### Layout
```
Header
├── Hero projet (image pleine largeur + titre overlay)
├── Section Infos (statut, dates, lieu, partenaires)
├── Section Description (texte riche, éditeur CMS)
├── Section Galerie Média (grille images/vidéos)
├── Section Objectifs (liste iconisée)
├── Section CTA projet (Don + Bénévolat)
├── Section Projets similaires (3 cartes)
Footer
```

### 7.1 Hero Projet

```
┌──────────────────────────────────────────────────────────────┐
│ [Image pleine largeur, hauteur 50vh, overlay dégradé]       │
│                                                              │
│  🟢 En cours              Titre du Projet                    │
│  Cotonou, Bénin           01/01/2024 — 31/12/2024            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 7.2 Section Infos

```
┌──────────────────────────────────────────────────────────────┐
│ STATUT : 🟢 En cours    │   DATES : 01/01/24 – 31/12/24      │
│ LIEU : Cotonou, Bénin   │   CATÉGORIE : Culture, Musique     │
│ PARTENAIRES : [Logo A] [Logo B] [Logo C]                    │
└──────────────────────────────────────────────────────────────┘
```

---

### 7.3 Galerie Média

```
┌──────────────────────────────────────────────────────────────┐
│ GALERIE                                                      │
│                                                              │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│ │ [IMG 1]│ │ [IMG 2]│ │ [IMG 3]│ │ [VID 1]│ │ [IMG 4]│     │
│ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │
│                                                              │
│ (lightbox au clic : image plein écran, flèches nav, close)  │
└──────────────────────────────────────────────────────────────┘
```

- **Lightbox** : fond noir 95% opacité, image centrée, flèches gauche/droite, croix fermeture, swipe mobile.
- **Vidéo** : icône play overlay, ouverture dans lightbox avec lecteur HTML5.

**Responsive :**
- **Mobile** : grille 2 colonnes.
- **Tablette** : grille 3 colonnes.
- **Desktop** : grille 4–5 colonnes.

---

### 7.4 CTAs Projet

```
┌──────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────┐ ┌────────────────────────────┐│
│ │ SOUTENIR CE PROJET          │ │ S'ENGAGER SUR CE PROJET    ││
│ │ [Faire un Don ❤]            │ │ [Devenir Bénévole 🙌]      ││
│ └─────────────────────────────┘ └────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

- **Boutons** : lien vers `/faire-un-don?projet=[slug]` et `/devenir-benevole?projet=[slug]` (pré-remplissage).

---

## 8. Page Devenir Bénévole — `/devenir-benevole`

### Layout
```
Header
├── Hero secondaire
├── Section Informations (mission, rôles, témoignages)
├── Section Formulaire Candidature
Footer
```

---

### 8.1 Section Informations

```
┌──────────────────────────────────────────────────────────────┐
│ DEVENEZ BÉNÉVOLE                                           │
│                                                              │
│ Texte de présentation : missions, valeurs, impact.          │
│                                                              │
│ NOS MISSIONS TYPES :                                         │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│ │ [🎤]     │ │ [📢]     │ │ [🎨]     │ │ [💻]     │       │
│ │ Événement│ │ Communic.│ │ Création │ │ Digital  │       │
│ │          │ │          │ │          │ │          │       │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                              │
│ TÉMOIGNAGE (optionnel) :                                     │
│ "Citer un bénévole..." — Prénom, rôle                       │
└──────────────────────────────────────────────────────────────┘
```

---

### 8.2 Formulaire Candidature

```
┌──────────────────────────────────────────────────────────────┐
│ FORMULAIRE DE CANDIDATURE                                    │
│                                                              │
│ IDENTITÉ                                                     │
│ Prénom *          [_______________]                          │
│ Nom *             [_______________]                          │
│ Email *           [_______________]                          │
│ Téléphone         [_______________]                          │
│ Ville             [_______________]                          │
│ Pays              [Bénin ▼]                                  │
│                                                              │
│ COMPÉTENCES                                                  │
│ ☑ Événementiel  ☑ Communication  ☑ Graphisme                │
│ ☑ Son / Lumière  ☑ Traduction  ☑ Développement web         │
│ ☑ Autre : [_______________]                                  │
│                                                              │
│ DISPONIBILITÉS                                               │
│ Jours préférés : ☑ Lundi ☑ Mardi … ☑ Week-end               │
│ Fréquence : [Occasionnel ▼]                                 │
│                                                              │
│ MOTIVATIONS *                                                │
│ [                                                          ] │
│ [                                                          ] │
│ [                                                          ] │
│                                                              │
│ CV / LETTRE (PDF, DOC, DOCX, max 5Mo)                        │
│ [📎 Parcourir...]  fichier.pdf                              │
│                                                              │
│ [Envoyer ma candidature →]                                   │
│                                                              │
│ * Champs obligatoires                                        │
└──────────────────────────────────────────────────────────────┘
```

- **Upload** : drag & drop zone + bouton Parcourir, preview nom fichier, barre progression, validation format/taille.
- **Validation** : champs obligatoires, email valide, téléphone format international, fichier ≤ 5Mo.
- **Soumission** : POST API Next.js → Strapi (`benevole` collection). Email de confirmation au candidat.
- **États** : "Envoi en cours…", "Candidature envoyée ✅", "Erreur ❌".

**Responsive :**
- **Mobile** : champs empilés full-width, checkboxes en 2 colonnes.
- **Tablette/Desktop** : 2 colonnes pour les champs courts (Prénom/Nom, Ville/Pays).

---

## 9. Page Faire un Don — `/faire-un-don`

### Layout
```
Header
├── Hero secondaire
├── Section Impact (texte + illustration)
├── Section Choix Montant (prédéfinis + libre)
├── Section Paiement (passerelles)
├── Section Récapitulatif + Confirmation
Footer
```

---

### 9.1 Choix Montants

```
┌──────────────────────────────────────────────────────────────┐
│ CHOISISSEZ VOTRE MONTANT                                     │
│                                                              │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│ │  5 €    │ │  20 €   │ │  50 €   │ │  100 €  │             │
│ │ ☕ Café  │ │ 📚 Kit  │ │ 🎤 Mic  │ │ 🎸 Guit.│             │
│ │ culture │ │ pédago. │ │ studio  │ │ pro     │             │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘             │
│                                                              │
│ Montant libre : [_______________] € [Valider]               │
│                                                              │
│ [Continuer →]                                                │
└──────────────────────────────────────────────────────────────┘
```

- **Boutons montants** : style card, sélection unique (radio visuel), bordure jaune 3px quand actif.
- **Impact** : petit texte descriptif sous chaque montant.
- **Montant libre** : input number, min 1€, validation numérique.
- **Bouton continuer** : désactivé tant qu'aucun montant n'est choisi.

**Responsive :**
- **Mobile** : 2 colonnes pour les montants.
- **Tablette/Desktop** : 4 colonnes.

---

### 9.2 Passerelles de Paiement

```
┌──────────────────────────────────────────────────────────────┐
│ MOYEN DE PAIEMENT                                            │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │  [💳]  Carte Bancaire (Stripe)                           │ │
│ │  [P]   PayPal                                            │ │
│ │  [📱]  FedaPay (Mobile Money)                            │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ (Zone dynamique : formulaire Stripe / redirection PayPal    │
│  / QR FedaPay selon le choix)                               │
│                                                              │
│ [Procéder au paiement sécurisé →]                            │
└──────────────────────────────────────────────────────────────┘
```

- **Sélection** : radio cards avec logo intégré.
- **Stripe** : formulaire carte intégré (Stripe Elements), numéro, date, CVC.
- **PayPal** : bouton PayPal Checkout SDK, popup ou redirection.
- **FedaPay** : sélection opérateur (MTN, Moov), numéro mobile, validation USSD/push.
- **Sécurité** : HTTPS obligatoire, pas de données cartes sur nos serveurs (token Stripe).

**Responsive :** formulaires adaptés en largeur, inputs full-width mobile.

---

### 9.3 Confirmation

```
┌──────────────────────────────────────────────────────────────┐
│ ✅ MERCI POUR VOTRE DON !                                    │
│                                                              │
│ Montant : 50 €                                               │
│ Date : 30/05/2024                                            │
│ Transaction : pi_3O...                                       │
│                                                              │
│ Un email de confirmation vous a été envoyé.                  │
│                                                              │
│ [Retour à l'accueil →]  [Faire un autre don]                │
└──────────────────────────────────────────────────────────────┘
```

---

## 10. Page Boutique (Liste) — `/boutique`

### Layout
```
Header
├── Hero secondaire
├── Section Filtres (catégorie : Tous / Tickets / Albums)
├── Section Grille Produits
Footer
```

### 10.1 Grille Produits

```
┌──────────────────────────────────────────────────────────────┐
│ BOUTIQUE                                                     │
│ [Tous] [Tickets de Spectacle] [Albums Numériques]           │
│                                                              │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│ │ [Pochette │ │ [Pochette │ │ [Affiche  │ │ [Pochette │     │
│ │  album]   │ │  album]   │ │  event]   │ │  album]   │     │
│ │           │ │           │ │           │ │           │     │
│ │ Titre     │ │ Titre     │ │ Titre     │ │ Titre     │     │
│ │ Artiste   │ │ Artiste   │ │ Date/Lieu │ │ Artiste   │     │
│ │ 10 000 FCFA│ │ 5 000 FCFA│ │ 15 000 FCFA│ │ 7 500 FCFA│   │
│ │ [🛒 Ajouter]│ │ [🛒 Ajouter]│ │ [🛒 Ajouter]│ │ [🛒 Ajouter]│
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘     │
└──────────────────────────────────────────────────────────────┘
```

- **Filtres** : tabs visuels (segmented control), actif = fond jaune.
- **Carte produit** : image carrée (1:1), titre, sous-titre (artiste ou événement), prix en FCFA, bouton ajouter au panier.
- **Hover** : image zoom, overlay avec icône play (si album avec extrait audio), bouton devient "Voir le produit".
- **Ajout panier** : toast notification "Ajouté au panier ✅", badge panier header incrémenté.

**Responsive :**
- **Mobile** : 2 colonnes.
- **Tablette** : 3 colonnes.
- **Desktop** : 4 colonnes.

---

## 11. Page Fiche Produit — `/boutique/[slug]`

### Layout
```
Header
├── Section Produit (image + infos)
├── Section Description / Tracklist
├── Section Lecteur Extrait (si album)
├── Section Produits similaires
Footer
```

### 11.1 Section Produit

```
┌──────────────────────────────────────────────────────────────┐
│ ┌────────────────────────────┐  ┌──────────────────────────┐ │
│ │                            │  │ Titre du Produit         │ │
│ │      [Image / Pochette     │  │ Artiste / Événement      │ │
│ │       1:1 grande]          │  │ ⭐⭐⭐⭐⭐ (avis)          │ │
│ │                            │  │                          │ │
│ │                            │  │ PRIX : 10 000 FCFA       │ │
│ │                            │  │                          │ │
│ │                            │  │ Quantité : [1 ▼]         │ │
│ │                            │  │                          │ │
│ │                            │  │ [🛒 Ajouter au Panier]   │ │
│ │                            │  │ [❤ Ajouter aux favoris]  │ │
│ └────────────────────────────┘  └──────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

- **Image** : galerie miniatures en dessous (si plusieurs visuels), clic pour zoom.
- **Prix** : FCFA, gras, couleur rouge piment.
- **Quantité** : stepper - / +, min 1, max 10.
- **Boutons** : panier = fond jaune, favoris = outline avec cœur.
- **Album** : affichage "Album Numérique — Téléchargement immédiat".
- **Ticket** : affichage date, lieu, heure, conditions d'accès.

**Responsive :**
- **Mobile** : empilé, image full-width, infos dessous.
- **Tablette/Desktop** : 2 colonnes 50/50.

---

### 11.2 Lecteur Extrait (Albums uniquement)

```
┌──────────────────────────────────────────────────────────────┐
│ ÉCOUTER UN EXTRAIT                                           │
│                                                              │
│ 1. Titre de la piste  03:45  [▶ Play]                       │
│ 2. Titre de la piste  04:12  [▶ Play]                       │
│ 3. Titre de la piste  03:20  [▶ Play]                       │
│                                                              │
│ (lecteur audio sticky bottom si lecture en cours)           │
└──────────────────────────────────────────────────────────────┘
```

- **Pistes** : liste avec numéro, titre, durée, bouton play/pause.
- **Lecteur sticky** : apparaît en bas d'écran quand une piste joue (titre, artiste, barre progression, controls).

---

## 12. Page Panier — `/panier`

### Layout
```
Header
├── Section Articles Panier
├── Section Récapitulatif + Checkout
Footer
```

### 12.1 Articles Panier

```
┌──────────────────────────────────────────────────────────────┐
│ VOTRE PANIER (3 articles)                                    │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ [IMG]  Titre Produit               10 000 FCFA           │ │
│ │        Artiste / Détail            [🗑]                 │ │
│ │        Qté : [ - │ 1 │ + ]                               │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ [IMG]  Titre Produit               5 000 FCFA            │ │
│ │        Artiste / Détail            [🗑]                  │ │
│ │        Qté : [ - │ 2 │ + ]                               │ │
│ ├──────────────────────────────────────────────────────────┤ │
│ │ [IMG]  Titre Projet / Don          50 €                  │ │
│ │        Don libre                   [🗑]                  │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ [Continuer les achats ←]      [🛒 Passer la commande →]     │
└──────────────────────────────────────────────────────────────┘
```

- **Ligne article** : image miniature (64×64), titre, détail, prix unitaire, quantité (stepper), poubelle supprimer.
- **Mise à jour** : modification quantité en temps réel, recalcul total.
- **Panier vide** : message "Votre panier est vide 🛒" + lien boutique + suggestion produits.
- **Persistence** : localStorage + sync serveur si connecté.

**Responsive :**
- **Mobile** : image + titre sur une ligne, prix/quantité sur ligne suivante.
- **Tablette/Desktop** : tableau avec colonnes alignées.

---

### 12.2 Checkout / Paiement

```
┌──────────────────────────────────────────────────────────────┐
│ RÉCAPITULATIF                                                │
│                                                              │
│ Sous-total : 25 000 FCFA                                     │
│ Frais : 0 FCFA (produits numériques)                        │
│ TOTAL : 25 000 FCFA                                          │
│                                                              │
│ EMAIL * : [_______________]  (pour recevoir les liens)     │
│                                                              │
│ MOYEN DE PAIEMENT                                            │
│ [💳 Stripe]  [P PayPal]  [📱 FedaPay]                        │
│                                                              │
│ (formulaire dynamique selon méthode, cf. §9.2)              │
│                                                              │
│ ☑ J'accepte les CGV *                                        │
│                                                              │
│ [💳 Payer 25 000 FCFA →]                                     │
└──────────────────────────────────────────────────────────────┘
```

- **Email** : obligatoire, utilisé pour envoyer les liens de téléchargement.
- **CGV** : checkbox obligatoire, lien vers `/conditions-generales-vente` (target blank).
- **Bouton paiement** : texte dynamique avec montant total.

---

### 12.3 Confirmation Commande

```
┌──────────────────────────────────────────────────────────────┐
│ ✅ COMMANDE CONFIRMÉE — #TK-240530-001                       │
│                                                              │
│ Merci ! Votre commande a été validée.                        │
│                                                              │
│ ALBUM NUMÉRIQUE X                                            │
│ [📥 Télécharger]  (lien sécurisé, valable 7 jours)          │
│                                                              │
│ TICKET SPECTACLE Y                                           │
│ [📥 Télécharger le billet PDF]  [📧 Recevoir par email]     │
│                                                              │
│ Un email récapitulatif a été envoyé à client@email.com.     │
│                                                              │
│ [Retour à l'accueil →]  [Continuer les achats →]            │
└──────────────────────────────────────────────────────────────┘
```

- **Lien sécurisé** : token unique, usage unique ou limité dans le temps (7 jours), vérification backend.
- **Billet PDF** : génération côté serveur (Next.js API) avec QR code.

---

## 13. Page Label Musical (Présentation) — `/label-musical`

### Layout
```
Header
├── Hero secondaire (ambiance musicale)
├── Section Philosophie / Histoire du label
├── Section Chiffres (artistes signés, albums sortis)
├── Section Nos Artistes (grille)
├── Section CTA (Boutique, MIB RADIO)
Footer
```

### 13.1 Section Philosophie

```
┌──────────────────────────────────────────────────────────────┐
│ TAKA INSIDE LABEL                                            │
│                                                              │
│ ┌──────────────────────────────┐  ┌──────────────────────────┐ │
│ │ Texte riche présentant la   │  │ [Image studio /         │ │
│ │ philosophie du label :      │  │  session d'enregistrement]│ │
│ │ brassage culturel,          │  │                          │ │
│ │ promotion du Bénin,         │  │                          │ │
│ │ accompagnement artistes.    │  │                          │ │
│ └──────────────────────────────┘  └──────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

### 13.2 Section Nos Artistes

```
┌──────────────────────────────────────────────────────────────┐
│ NOS ARTISTES                                                 │
│                                                              │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│ │ [Photo    │ │ [Photo    │ │ [Photo    │ │ [Photo    │     │
│ │  artiste] │ │  artiste] │ │  artiste] │ │  artiste] │     │
│ │           │ │           │ │           │ │           │     │
│ │ NOM       │ │ NOM       │ │ NOM       │ │ NOM       │     │
│ │ Genre     │ │ Genre     │ │ Genre     │ │ Genre     │     │
│ │ [Découvrir│ │ [Découvrir│ │ [Découvrir│ │ [Découvrir│     │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘     │
└──────────────────────────────────────────────────────────────┘
```

- **Carte artiste** : photo (1:1), nom H3, genre musical, lien vers page détail.
- **Hover** : overlay avec icône play (si extrait audio disponible), photo zoom.

**Responsive :**
- **Mobile** : 2 colonnes.
- **Tablette** : 3 colonnes.
- **Desktop** : 4 colonnes.

---

## 14. Page Détail Artiste — `/label-musical/nos-artistes/[slug]`

### Layout
```
Header
├── Hero Artiste (photo + nom overlay)
├── Section Biographie
├── Section Discographie
├── Section Galerie Photos/Vidéos
├── Section Concerts & Événements
├── Section CTA (Boutique album, Réseaux sociaux)
Footer
```

### 14.1 Hero Artiste

```
┌──────────────────────────────────────────────────────────────┐
│ [Image pleine largeur, hauteur 60vh, overlay dégradé bas]     │
│                                                              │
│                        Nom de l'Artiste                       │
│                        Genre Musical · Bénin                  │
│                                                              │
│              [▶ Écouter un extrait]  [🎵 Spotify] [🎵 Deezer] │
└──────────────────────────────────────────────────────────────┘
```

- **Boutons streaming** : liens externes Spotify, Deezer, Bandcamp, Apple Music (icônes).
- **Bouton extrait** : déclenche le lecteur audio intégré (si extraits hébergés).

---

### 14.2 Discographie

```
┌──────────────────────────────────────────────────────────────┐
│ DISCOGRAPHIE                                                 │
│                                                              │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐                   │
│ │ [Pochette │ │ [Pochette │ │ [Pochette │                   │
│ │  album]   │ │  album]   │ │  single]  │                   │
│ │ Titre     │ │ Titre     │ │ Titre     │                   │
│ │ 2023 · EP │ │ 2021 · Album│ │ 2024 · Single│              │
│ │ [🛒 Acheter]│ │ [🛒 Acheter]│ │ [🛒 Acheter]│              │
│ └───────────┘ └───────────┘ └───────────┘                   │
└──────────────────────────────────────────────────────────────┘
```

- **Acheter** : lien vers fiche produit boutique ou plateforme externe.

---

### 14.3 Concerts & Événements

```
┌──────────────────────────────────────────────────────────────┐
│ CONCERTS À VENIR                                             │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ 📅 15 Juin 2024    Cotonou, Bénin    [🎫 Réserver]      │ │
│ │ 📅 22 Juillet 2024 Paris, France     [🎫 Réserver]      │ │
│ │ 📅 05 Août 2024    Abidjan, CIV      [🎫 Réserver]      │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

- **Réserver** : lien vers fiche produit ticket si disponible en boutique, sinon lien externe.

---

## 15. Page Made In Bénin Radio — `/made-in-benin-radio`

### Layout
```
Header
├── Hero secondaire (ambiance radio)
├── Section Lecteur Principal
├── Section À Propos de MIB RADIO
├── Section Liens (site web + app Android)
├── Section Podcasts / Émissions (optionnel)
Footer
```

### 15.1 Lecteur Principal

```
┌──────────────────────────────────────────────────────────────┐
│ 🎙 MADE IN BÉNIN RADIO                                       │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │              [  ▶ PLAY  ]  (bouton principal, 80px)    │ │
│ │                                                         │ │
│ │         En direct — 24h/24, 7j/7                        │ │
│ │                                                         │ │
│ │  [⏮]  [⏯ Pause]  [⏭]  [🔊 Volume ─────●────]        │ │
│ │                                                         │ │
│ │  [Visiter madeinbeninradio.bj →]                       │ │
│ │  [Télécharger sur Google Play →]                       │ │
│ │                                                         │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

- **Lecteur** : HTML5 audio, streaming Icecast/Shoutcast (URL fournie par Taka Inside).
- **Controls** : Play/Pause, Volume slider, Mute.
- **Visualisation optionnelle** : barres animées quand le stream joue.
- **Fond** : dégradé animé subtil vert/noir/jaune.

**Responsive :**
- **Mobile** : lecteur centré, boutons empilés, volume vertical ou slider compact.
- **Tablette/Desktop** : lecteur large, controls horizontaux.

---

### 15.2 À Propos

```
┌──────────────────────────────────────────────────────────────┐
│ À PROPOS DE MIB RADIO                                        │
│                                                              │
│ Texte riche (projet phare de Taka Inside, missions,         │
│ équipe radio, programs types).                              │
│                                                              │
│ [Découvrir les programmes →]  [Devenir animateur bénévole →]│
└──────────────────────────────────────────────────────────────┘
```

---

## 16. Mentions Légales — `/mentions-legales`

### Layout
```
Header
├── Section Texte légal (simple, lisible)
Footer
```

```
┌──────────────────────────────────────────────────────────────┐
│ MENTIONS LÉGALES                                             │
│                                                              │
│ 1. Éditeur du site                                           │
│    Association Taka Inside                                   │
│    Siège social : Cotonou, Bénin                             │
│    Email : contact@takainside.bj                             │
│                                                              │
│ 2. Hébergement                                               │
│    [Nom hébergeur]                                          │
│    [Adresse hébergeur]                                      │
│                                                              │
│ 3. Propriété intellectuelle                                  │
│    ...                                                      │
│                                                              │
│ 4. Limitation de responsabilité                              │
│    ...                                                      │
└──────────────────────────────────────────────────────────────┘
```

- **Style** : texte simple, pas d'images, lisibilité maximale. Titres H2, paragraphes body.
- **Navigation** : table des matières sticky sur desktop (ancres vers sections).

**Responsive :**
- **Mobile** : texte pleine largeur, pas de TOC sticky.
- **Tablette/Desktop** : TOC sticky gauche (20%) + contenu droite (80%).

---

## 17. Politique de Confidentialité — `/politique-confidentialite`

### Layout
```
Header
├── Section Texte juridique RGPD / loi béninoise
Footer
```

```
┌──────────────────────────────────────────────────────────────┐
│ POLITIQUE DE CONFIDENTIALITÉ                                 │
│                                                              │
│ 1. Responsable du traitement                                 │
│    Association Taka Inside — contact@takainside.bj          │
│                                                              │
│ 2. Données collectées                                        │
│    Formulaires (nom, email, téléphone), cookies, analytics. │
│                                                              │
│ 3. Finalités                                                 │
│    Communication, gestion dons/commandes, statistiques.       │
│                                                              │
│ 4. Droits des utilisateurs                                   │
│    Accès, rectification, suppression — email ou formulaire. │
│                                                              │
│ 5. Cookies                                                   │
│    [Bouton Gérer les cookies]  (bannière/panneau de gestion)│
│                                                              │
│ 6. Durée de conservation                                     │
│    ...                                                      │
└──────────────────────────────────────────────────────────────┘
```

- **Gestion cookies** : bouton ouvrant un panneau de préférences (Catégories : Nécessaires, Analytics, Marketing).
- **Bannière cookies** : bandeau bottom sur première visite, boutons "Tout accepter" / "Personnaliser" / "Refuser".

**Responsive :** identique à Mentions Légales.

---

## 18. Conditions Générales de Vente — `/conditions-generales-vente`

### Layout
```
Header
├── Section Texte juridique e-commerce
Footer
```

```
┌──────────────────────────────────────────────────────────────┐
│ CONDITIONS GÉNÉRALES DE VENTE                                │
│                                                              │
│ 1. Préambule                                                │
│    Produits numériques (tickets, albums) vendus par Taka.   │
│                                                              │
│ 2. Prix et paiement                                          │
│    FCFA et EUR acceptés. Passerelles : Stripe, PayPal,     │
│    FedaPay.                                                  │
│                                                              │
│ 3. Livraison                                                 │
│    Immédiate par téléchargement ou email. Liens sécurisés. │
│                                                              │
│ 4. Droit de rétractation                                     │
│    Produits numériques : pas de rétractation post-télécharg.│
│                                                              │
│ 5. Service client                                            │
│    contact@takainside.bj  |  +229 07 56 98 74 73            │
│                                                              │
│ 6. Litiges                                                   │
│    ...                                                      │
└──────────────────────────────────────────────────────────────┘
```

- **Style** : identique aux pages légales précédentes. TOC sticky desktop.

---

## 19. Composants Réutilisables Transversaux

### 19.1 Carte Projet

```
┌─────────────────────────────┐
│ [Image 16:9, object-fit]    │
│ [Badge statut, top-left]      │
│                             │
│ Titre du Projet             │
│ Cotonou, Bénin · 2024       │
│ Description courte...       │
│ [Voir le projet →]          │
└─────────────────────────────┘
```

- **Props** : image, titre, statut, localisation, dates, extrait, slug.
- **Hover** : overlay noir léger, titre jaune, flèche translateX +5px.

---

### 19.2 Carte Artiste

```
┌─────────────────────────────┐
│ [Photo 1:1, border-radius 8]│
│ [Overlay play icon on hover]  │
│                             │
│ Nom Artiste                 │
│ Genre musical               │
│ [Découvrir →]               │
└─────────────────────────────┘
```

---

### 19.3 Carte Produit

```
┌─────────────────────────────┐
│ [Image 1:1]                 │
│                             │
│ Titre Produit               │
│ Sous-titre / Artiste        │
│ 10 000 FCFA                 │
│ [🛒 Ajouter au panier]      │
└─────────────────────────────┘
```

---

### 19.4 Toast Notification

```
┌─────────────────────────────┐
│ ✅ Article ajouté au panier │
│    Nom du produit             │
│                    [Voir →] [×]│
└─────────────────────────────┘
```

- **Position** : top-right desktop, top-center mobile.
- **Durée** : 4 secondes, auto-dismiss, swipe sur mobile.

---

### 19.5 Breadcrumb

```
Accueil  >  L'Association  >  Qui Sommes-Nous ?
```

- **Style** : texte petit, gris, séparateur `>`.
- **Responsive** : caché sur mobile (prend trop de place), visible tablette/desktop.

---

### 19.6 Loading States

- **Skeleton** : rectangles animés (shimmer jaune/vert/rouge dégradé) pour les grilles de chargement.
- **Spinner** : cercle tournant (couleur jaune) pour les boutons et formulaires.
- **Page loader** : overlay minimaliste avec logo Taka Inside pulsant.

---

## 20. Tableau Récapitulatif Responsive

| Page | Mobile (<640px) | Tablette (640–1024px) | Desktop (>1024px) |
|------|-----------------|-----------------------|-------------------|
| **Accueil** | Hero 60vh, texte centré, boutons empilés, projets carrousel 1 carte | Hero 65vh, boutons côte à côte, projets grille 2 cols | Hero 70vh, texte gauche, projets grille 4 cols, artistes 2 cols |
| **Qui Sommes-Nous** | 1 colonne, valeurs 2 cols, chiffres 2×2 | 2 colonnes texte/image, valeurs 3 cols | 2 colonnes, valeurs 5 cols, chiffres ligne |
| **Notre Équipe** | 1 colonne centrée | 2–3 colonnes | 4–5 colonnes |
| **Contact** | Empilé formulaire/coordonnées | 2 colonnes 60/40 | 2 colonnes 60/40 |
| **Nos Projets** | Filtres accordéon, grille 1 col | Filtres horizontaux, grille 2 cols | Filtres + recherche ligne, grille 3–4 cols |
| **Détail Projet** | Empilé, galerie 2 cols, CTAs empilés | 2 cols infos, galerie 3 cols | 2 cols infos, galerie 4–5 cols, CTAs côte à côte |
| **Devenir Bénévole** | Formulaire empilé, checkboxes 2 cols | Formulaire 2 cols champs courts | Formulaire 2 cols, infos 1 col |
| **Faire un Don** | Montants 2 cols, paiement empilé | Montants 4 cols, paiement 1 col | Montants 4 cols, paiement centrée max-width 600px |
| **Boutique** | Grille 2 cols, filtres tabs scrollable | Grille 3 cols | Grille 4 cols |
| **Fiche Produit** | Empilé image/infos, lecteur liste | 2 cols 50/50 | 2 cols 50/50, image plus grande |
| **Panier** | Liste compacte, checkout empilé | Tableau + récapitulatif côte à côte | Tableau + récapitulatif côte à côte |
| **Label Musical** | 1 colonne, artistes 2 cols | 2 cols présentation, artistes 3 cols | 2 cols présentation, artistes 4 cols |
| **Détail Artiste** | Empilé, discographie 2 cols, concerts liste | 2 cols bio/image, discographie 3 cols | 2 cols, discographie 3 cols, concerts tableau |
| **MIB RADIO** | Lecteur centré, boutons empilés | Lecteur large 80% | Lecteur 60% centré, boutons côte à côte |
| **Mentions / CGV / Confidentialité** | Texte pleine largeur, pas de TOC | Texte pleine largeur | TOC sticky gauche 20%, contenu 80% |

---

## 21. Notes d'Accessibilité (WCAG 2.1 AA)

- **Contrastes** : texte blanc sur fond noir = OK. Jaune `#FFD700` sur blanc = échec → utiliser jaune sur noir ou vert/rouge foncé.
- **Navigation clavier** : tous les boutons/filtres accessibles via Tab, focus visible (outline jaune 2px).
- **ARIA** : rôles `navigation`, `main`, `complementary`, `contentinfo`. Labels pour icônes seules (`aria-label`).
- **Formulaires** : `label` explicites liés aux inputs via `for`/`id`. Messages d'erreur liés via `aria-describedby`.
- **Images** : `alt` descriptif sur toutes les images (sauf décoratives `alt=""`).
- **Lecteur audio** : contrôles accessibles, transcription texte alternative.
- **Skip link** : lien "Aller au contenu principal" en haut de page (visuellement caché, focus visible).

---

*Fin des wireframes — BMAD Phase 1.2*
