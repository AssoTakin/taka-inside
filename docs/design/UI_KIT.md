# UI Kit — Taka Inside

> **Projet :** Taka Inside — Association culturelle & label musical (Bénin)  
> **Stack :** Next.js 14 + Tailwind CSS + shadcn/ui  
> **Référence charte :** `CHARTE_GRAPHIQUE.md`

---

## Table des matières

1. [Boutons](#1-boutons)
2. [Cartes Projet](#2-cartes-projet)
3. [Cartes Produit](#3-cartes-produit)
4. [Formulaires](#4-formulaires)
5. [Navigation](#5-navigation)
6. [Lecteur Audio](#6-lecteur-audio)
7. [Badges Statut](#7-badges-statut)

---

## 1. Boutons

### Description

Les boutons sont l’élément d’interaction le plus critique. Ils doivent être immédiatement identifiables, accessibles au clavier, et cohérents dans leurs feedbacks visuels. Trois niveaux hiérarchiques : **Primaire**, **Secondaire**, **Tertiaire** (ghost).

### Variantes

| Variante | Couleur | Usage |
|----------|---------|-------|
| **Primaire — Vert** | `cdc-green` | Action positive : achat, envoi, confirmation, lecture. |
| **Primaire — Rouge** | `cdc-red` | Action critique : suppression, annulation, alerte. |
| **Secondaire** | `cdc-yellow` + texte noir | Action alternative : en savoir plus, filtre, toggle. |
| **Tertiaire / Ghost** | transparent + bordure | Action faible : annuler, retour, lien interne. |
| **Dark** | `black-800` + texte blanc | Sur fond clair, action discrète. |

### Structure HTML / Tailwind

```html
<!-- Primaire Vert -->
<button class="
  inline-flex items-center justify-center gap-2
  px-6 py-3 rounded-md
  bg-cdc-green text-cdc-white font-button
  transition-all duration-200 ease-out
  hover:bg-green-700 hover:shadow-md
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
">
  <svg class="w-5 h-5" …></svg>
  <span>Acheter maintenant</span>
</button>

<!-- Primaire Rouge -->
<button class="
  inline-flex items-center justify-center gap-2
  px-6 py-3 rounded-md
  bg-cdc-red text-cdc-white font-button
  transition-all duration-200 ease-out
  hover:bg-red-700 hover:shadow-glow-red
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
">
  <span>Supprimer</span>
</button>

<!-- Secondaire Jaune -->
<button class="
  inline-flex items-center justify-center gap-2
  px-6 py-3 rounded-md
  bg-cdc-yellow text-cdc-black font-button
  transition-all duration-200 ease-out
  hover:bg-yellow-700 hover:text-cdc-white
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
">
  <span>En savoir plus</span>
</button>

<!-- Tertiaire / Ghost -->
<button class="
  inline-flex items-center justify-center gap-2
  px-6 py-3 rounded-md
  border border-current text-cdc-white
  font-button
  transition-all duration-200 ease-out
  hover:bg-white/10
  active:scale-[0.98]
  disabled:opacity-40 disabled:cursor-not-allowed
">
  <span>Retour</span>
</button>
```

### États

| État | Style |
|------|-------|
| **Default** | Couleur de base, ombre none ou `shadow-sm`. |
| **Hover** | Fond assombri d’un niveau (`*-700`), légère élévation (`shadow-md` ou `shadow-glow-*`). |
| **Active / Pressed** | `scale-[0.98]` (léger enfoncement), transition `100ms`. |
| **Focus** | `ring-2 ring-cdc-yellow ring-offset-2 ring-offset-cdc-black` (fond sombre) ou `ring-offset-cdc-white` (fond clair). |
| **Disabled** | `opacity-50`, curseur `not-allowed`, pas d’interaction, pas de scale. |
| **Loading** | Spinner `w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin` à la place de l’icône/texte. |

### Responsive

- **Mobile** : pleine largeur (`w-full`) dans les formulaires et modales. Taille `py-3 px-4`, texte `button` (14px).
- **Desktop** : taille auto, `py-3 px-6`, texte `button` (16px).
- **Touch target** : hauteur minimum `44px` sur mobile (déjà respecté avec `py-3`).

---

## 2. Cartes Projet

### Description

Les cartes projet présentent une initiative culturelle, un événement, ou un artiste du label. Elles doivent évoquer immédiatement l’identité visuelle tout en restant informatives.

### Structure HTML / Tailwind

```html
<article class="
  group relative overflow-hidden
  rounded-xl bg-black-800
  shadow-md hover:shadow-lg
  transition-shadow duration-300
">
  <!-- Image -->
  <div class="relative aspect-[16/10] overflow-hidden">
    <img
      src="/images/projet.jpg"
      alt="Description du projet"
      class="w-full h-full object-cover
             transition-transform duration-500
             group-hover:scale-105"
    />
    <!-- Overlay dégradé -->
    <div class="absolute inset-0 bg-gradient-to-t from-black-900/90 to-transparent" />

    <!-- Badge statut -->
    <span class="absolute top-3 left-3
                   bg-cdc-yellow text-cdc-black
                   text-caption font-medium
                   px-2 py-1 rounded-sm">
      En cours
    </span>
  </div>

  <!-- Contenu -->
  <div class="p-4 md:p-6">
    <h3 class="font-display text-h4 text-cdc-white mb-2">
      Festival Taka 2025
    </h3>
    <p class="font-body text-body-sm text-white/80 line-clamp-2 mb-4">
      Une célébration de la musique béninoise en plein cœur de Cotonou.
    </p>

    <div class="flex items-center justify-between">
      <span class="text-caption text-cdc-green">Cotonou, Bénin</span>
      <button class="text-body-sm font-medium text-cdc-yellow hover:text-white transition-colors">
        Voir le projet →
      </button>
    </div>
  </div>
</article>
```

### États

| État | Style |
|------|-------|
| **Default** | `shadow-md`, image stable. |
| **Hover** | `shadow-lg`, image `scale-105`, titre passe en `cdc-yellow`. |
| **Focus** (carte cliquable) | `ring-2 ring-cdc-yellow ring-offset-2 ring-offset-cdc-black`. |
| **Active** | `scale-[0.99]` sur la card entière. |

### Responsive

- **Mobile** : 1 colonne, pleine largeur. Image `aspect-[4/3]`.
- **Tablet** : 2 colonnes (`grid-cols-2`). Image `aspect-[16/10]`.
- **Desktop** : 3 colonnes (`grid-cols-3`). Padding interne `p-6`.

---

## 3. Cartes Produit

### Description

Les cartes produit servent au shop (vinyles, merch, tickets). Elles combinent un aspect e-commerce fonctionnel avec l’esthétique culturelle Taka Inside.

### Structure HTML / Tailwind

```html
<article class="
  group relative
  rounded-2xl bg-cdc-white
  border border-white-200
  shadow-sm hover:shadow-md
  transition-shadow duration-300
  overflow-hidden
">
  <!-- Image -->
  <div class="relative aspect-square bg-white-100 overflow-hidden">
    <img
      src="/images/vinyle.jpg"
      alt="Nom du vinyle"
      class="w-full h-full object-cover
             transition-transform duration-500
             group-hover:scale-105"
    />

    <!-- Tag promo -->
    <span class="absolute top-3 right-3
                   bg-cdc-red text-cdc-white
                   text-caption font-bold
                   px-2 py-1 rounded-sm">
      -20%
    </span>
  </div>

  <!-- Contenu -->
  <div class="p-4 md:p-5">
    <!-- Catégorie -->
    <span class="text-caption text-black-700 uppercase tracking-wide">Vinyle</span>

    <h3 class="font-display text-h4 text-cdc-black mt-1 mb-1">
      Taka Roots Vol.1
    </h3>

    <!-- Prix -->
    <div class="flex items-baseline gap-2 mb-4">
      <span class="font-display text-h3 text-cdc-green">15 000 FCFA</span>
      <span class="text-body-sm text-black-700 line-through">18 000 FCFA</span>
    </div>

    <!-- CTA -->
    <button class="
      w-full inline-flex items-center justify-center gap-2
      px-4 py-3 rounded-md
      bg-cdc-black text-cdc-white font-button
      transition-all duration-200
      hover:bg-cdc-green
      active:scale-[0.98]
    ">
      <svg class="w-5 h-5" …></svg>
      <span>Ajouter au panier</span>
    </button>
  </div>
</article>
```

### États

| État | Style |
|------|-------|
| **Default** | Fond blanc, bordure légère. |
| **Hover** | `shadow-md`, image zoom, bouton visible/renforcé. |
| **Focus** | `ring-2 ring-cdc-green ring-offset-2`. |
| **Rupture de stock** | Overlay `bg-white/80` sur l’image, badge “Rupture” en `cdc-red`, bouton disabled. |

### Responsive

- **Mobile** : 2 colonnes (`grid-cols-2`), gap `gap-4`.
- **Tablet** : 3 colonnes (`grid-cols-3`), gap `gap-6`.
- **Desktop** : 4 colonnes (`grid-cols-4`), gap `gap-8`.

---

## 4. Formulaires

### Description

Les formulaires (contact, newsletter, commande) doivent rester lisibles sur fond sombre comme sur fond clair. Les labels sont toujours visibles (pas de placeholder-only).

### Structure HTML / Tailwind

```html
<form class="space-y-6 max-w-xl">

  <!-- Champ texte -->
  <div class="space-y-2">
    <label for="email" class="block text-body-sm font-medium text-cdc-white">
      Adresse email
    </label>
    <input
      id="email"
      type="email"
      placeholder="vous@exemple.com"
      class="
        w-full px-4 py-3 rounded-md
        bg-black-800 text-cdc-white
        border border-black-700
        placeholder-white/40
        font-body text-body
        transition-colors duration-200
        focus:outline-none focus:border-cdc-yellow focus:ring-1 focus:ring-cdc-yellow
        disabled:opacity-50 disabled:cursor-not-allowed
        aria-invalid:ring-cdc-red aria-invalid:border-cdc-red
      "
    />
    <!-- Message d’erreur -->
    <p id="email-error" class="text-caption text-cdc-red" role="alert">
      Veuillez entrer une adresse valide.
    </p>
  </div>

  <!-- Champ textarea -->
  <div class="space-y-2">
    <label for="message" class="block text-body-sm font-medium text-cdc-white">
      Message
    </label>
    <textarea
      id="message"
      rows="5"
      placeholder="Votre message…"
      class="
        w-full px-4 py-3 rounded-md
        bg-black-800 text-cdc-white
        border border-black-700
        placeholder-white/40
        font-body text-body
        transition-colors duration-200
        focus:outline-none focus:border-cdc-yellow focus:ring-1 focus:ring-cdc-yellow
      "
    ></textarea>
  </div>

  <!-- Select -->
  <div class="space-y-2">
    <label for="pays" class="block text-body-sm font-medium text-cdc-white">Pays</label>
    <div class="relative">
      <select
        id="pays"
        class="
          w-full px-4 py-3 pr-10 rounded-md
          bg-black-800 text-cdc-white
          border border-black-700
          font-body text-body
          appearance-none
          transition-colors duration-200
          focus:outline-none focus:border-cdc-yellow focus:ring-1 focus:ring-cdc-yellow
        "
      >
        <option>Bénin</option>
        <option>France</option>
        <option>Côte d'Ivoire</option>
      </select>
      <!-- Icôche flèche -->
      <span class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg class="w-5 h-5 text-white/60" …></svg>
      </span>
    </div>
  </div>

  <!-- Checkbox -->
  <div class="flex items-start gap-3">
    <input
      id="newsletter"
      type="checkbox"
      class="
        mt-1 w-5 h-5 rounded-sm
        bg-black-800 border-black-700
        text-cdc-yellow
        focus:ring-cdc-yellow focus:ring-offset-cdc-black
        transition-colors
      "
    />
    <label for="newsletter" class="text-body-sm text-white/80">
      J’accepte de recevoir la newsletter de Taka Inside.
    </label>
  </div>

  <!-- Bouton submit -->
  <button type="submit" class="
    w-full md:w-auto
    inline-flex items-center justify-center gap-2
    px-8 py-3 rounded-md
    bg-cdc-green text-cdc-white font-button
    hover:bg-green-700
    active:scale-[0.98]
  ">
    Envoyer
  </button>

</form>
```

### États des champs

| État | Style |
|------|-------|
| **Default** | Bordure `black-700`, fond `black-800`, placeholder blanc 40%. |
| **Hover** | Bordure `white/40`. |
| **Focus** | Bordure `cdc-yellow`, `ring-1 ring-cdc-yellow`. |
| **Valid** | Bordure `cdc-green` optionnelle, icône check. |
| **Error** | Bordure `cdc-red`, `ring-1 ring-cdc-red`, texte d’erreur visible. |
| **Disabled** | `opacity-50`, curseur `not-allowed`. |

### Responsive

- **Mobile** : champs pleine largeur (`w-full`), labels au-dessus, espacement `space-y-5`.
- **Desktop** : disposition en 2 colonnes possible (`grid grid-cols-2 gap-6`) pour nom/prénom, ville/code postal.

---

## 5. Navigation

### Description

La navigation principale doit fonctionner sur fond sombre (header transparent au scroll) et s’adapter en menu mobile burger. La barre tricolore CDC peut marquer le bas du header.

### Structure HTML / Tailwind (Header desktop)

```html
<header class="
  fixed top-0 left-0 right-0 z-50
  bg-cdc-black/90 backdrop-blur-md
  border-b border-white/10
">
  <!-- Bande tricolore CDC -->
  <div class="h-[3px] w-full flex">
    <div class="flex-1 bg-cdc-yellow" />
    <div class="flex-1 bg-cdc-red" />
    <div class="flex-1 bg-cdc-green" />
  </div>

  <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">

      <!-- Logo -->
      <a href="/" class="font-display text-xl font-bold text-cdc-white tracking-tight">
        Taka Inside
      </a>

      <!-- Nav desktop -->
      <nav class="hidden md:flex items-center gap-8">
        <a href="/projets" class="
          text-nav text-white/80
          hover:text-cdc-yellow
          transition-colors
          relative
          after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-cdc-yellow
          hover:after:w-full after:transition-all
        ">Projets</a>

        <a href="/artists" class="text-nav text-white/80 hover:text-cdc-yellow transition-colors">Artistes</a>

        <a href="/shop" class="text-nav text-white/80 hover:text-cdc-yellow transition-colors">Shop</a>

        <a href="/about" class="text-nav text-white/80 hover:text-cdc-yellow transition-colors">À propos</a>

        <!-- CTA Langue -->
        <button class="
          inline-flex items-center gap-1
          px-3 py-1.5 rounded-full
          border border-white/20 text-body-sm text-white/80
          hover:border-cdc-yellow hover:text-cdc-yellow
          transition-colors
        ">
          <span>FR</span>
          <svg class="w-4 h-4" …></svg>
        </button>
      </nav>

      <!-- Actions -->
      <div class="hidden md:flex items-center gap-4">
        <button aria-label="Rechercher" class="text-white/80 hover:text-cdc-yellow transition-colors">
          <svg class="w-5 h-5" …></svg>
        </button>

        <a href="/cart" class="relative text-white/80 hover:text-cdc-yellow transition-colors">
          <svg class="w-5 h-5" …></svg>
          <span class="absolute -top-1 -right-1 w-4 h-4 bg-cdc-red text-[10px] text-white rounded-full flex items-center justify-center">2</span>
        </a>
      </div>

      <!-- Burger mobile -->
      <button class="md:hidden text-white" aria-label="Ouvrir le menu">
        <svg class="w-6 h-6" …></svg>
      </button>
    </div>
  </div>
</header>
```

### Navigation mobile (menu overlay)

```html
<!-- Overlay menu mobile -->
<div class="fixed inset-0 z-40 bg-cdc-black md:hidden">
  <nav class="flex flex-col items-center justify-center h-full gap-8">
    <a href="/projets" class="text-h2 font-display text-cdc-white hover:text-cdc-yellow transition-colors">Projets</a>
    <a href="/artists" class="text-h2 font-display text-cdc-white hover:text-cdc-yellow transition-colors">Artistes</a>
    <a href="/shop" class="text-h2 font-display text-cdc-white hover:text-cdc-yellow transition-colors">Shop</a>
    <a href="/about" class="text-h2 font-display text-cdc-white hover:text-cdc-yellow transition-colors">À propos</a>
  </nav>
</div>
```

### États

| État | Style |
|------|-------|
| **Default** | Liens `white/80`, icônes `white/80`. |
| **Hover** | Texte `cdc-yellow`, underline animée (desktop). |
| **Active / Current page** | Texte `cdc-yellow`, underline fixe (`after:w-full`). |
| **Focus** | `ring-2 ring-cdc-yellow ring-offset-2 ring-offset-cdc-black`. |
| **Scroll** (page scrollée) : | Header passe de `bg-transparent` à `bg-cdc-black/90 backdrop-blur-md`. |

### Responsive

- **Mobile** : header compact (`h-14`), logo centré ou gauche, burger droite. Menu plein écran overlay avec liens `text-h2`.
- **Tablet** : nav visible, liens `text-nav` (14px).
- **Desktop** : nav + actions (recherche, panier) visibles. Logo + nav alignés.

---

## 6. Lecteur Audio

### Description

Le lecteur audio est un composant signature pour un label musical. Il doit être compact, fonctionnel, et visuellement identifiable comme un outil de musique Taka Inside.

### Structure HTML / Tailwind

```html
<div class="
  flex items-center gap-4
  w-full max-w-2xl
  px-4 py-3 md:px-6 md:py-4
  rounded-2xl
  bg-black-800 border border-black-700
  shadow-md
">

  <!-- Pochette -->
  <img
    src="/images/cover.jpg"
    alt="Pochette"
    class="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover flex-shrink-0"
  />

  <!-- Infos -->
  <div class="flex-1 min-w-0">
    <p class="font-display text-body font-medium text-cdc-white truncate">Titre du morceau</p>
    <p class="text-caption text-white/60 truncate">Artiste — Album</p>

    <!-- Waveform stylisée -->
    <div class="mt-2 flex items-end gap-[2px] h-6">
      <!-- Barres générées dynamiquement -->
      <span class="w-1 bg-cdc-yellow rounded-full" style="height:40%"></span>
      <span class="w-1 bg-cdc-yellow rounded-full" style="height:70%"></span>
      <span class="w-1 bg-cdc-yellow rounded-full" style="height:50%"></span>
      <span class="w-1 bg-cdc-red rounded-full" style="height:90%"></span>
      <span class="w-1 bg-cdc-green rounded-full" style="height:60%"></span>
      <!-- … répéter pour N barres -->
    </div>
  </div>

  <!-- Contrôles -->
  <div class="flex items-center gap-3 md:gap-4">
    <button aria-label="Précédent" class="text-white/60 hover:text-cdc-white transition-colors">
      <svg class="w-5 h-5" …></svg>
    </button>

    <button aria-label="Lecture / Pause" class="
      w-10 h-10 md:w-12 md:h-12
      flex items-center justify-center
      rounded-full bg-cdc-green text-cdc-white
      hover:bg-green-700 hover:shadow-glow-green
      transition-all active:scale-95
    ">
      <svg class="w-5 h-5 md:w-6 md:h-6" …></svg>
    </button>

    <button aria-label="Suivant" class="text-white/60 hover:text-cdc-white transition-colors">
      <svg class="w-5 h-5" …></svg>
    </button>
  </div>

  <!-- Temps -->
  <span class="hidden sm:block text-caption text-white/60 w-16 text-right tabular-nums">
    02:34
  </span>

</div>
```

### États

| État | Style |
|------|-------|
| **Default** | Fond `black-800`, waveform jaune/rouge/vert, bouton play vert. |
| **Hover (sur la barre)** | Cursor pointer, tooltip temps au survol. |
| **Playing** | Bouton play devient pause (icône). Waveform animée (barres en oscillation CSS). |
| **Paused** | Waveform statique. Bouton affiche play. |
| **Loading** | Spinner sur le bouton play, waveform grisée. |
| **Error** | Bordure `cdc-red`, message d’erreur sous le lecteur. |

### Responsive

- **Mobile** : pochette petite (`w-12`), pas de temps affiché, contrôles centrés.
- **Tablet / Desktop** : pochette `w-14`, temps visible (`sm:block`), gap plus large.
- **Sticky player** (option) : `fixed bottom-0 left-0 right-0 bg-cdc-black border-t border-white/10 z-50`.

---

## 7. Badges Statut

### Description

Les badges communiquent rapidement l’état d’un élément : disponibilité d’un produit, statut d’un projet, type d’événement. Ils doivent rester petits, lisibles, et accessibles.

### Variantes

| Variante | Token | Usage |
|----------|-------|-------|
| **Succès / Actif** | `cdc-green` | En stock, confirmé, en cours, live. |
| **Avertissement** | `cdc-yellow` + texte noir | Bientôt disponible, en attente, brouillon. |
| **Danger / Urgence** | `cdc-red` | Rupture, annulé, sold out, erreur. |
| **Info / Neutre** | `black-700` + texte blanc | Tag générique, catégorie, info secondaire. |
| **Nouveauté** | `cdc-white` + texte noir | New, just released. |

### Structure HTML / Tailwind

```html
<!-- Petit badge (tag) -->
<span class="
  inline-flex items-center
  px-2 py-0.5
  rounded-sm
  bg-cdc-green/15 text-cdc-green
  text-caption font-medium
">
  En stock
</span>

<!-- Badge arrondi (pill) -->
<span class="
  inline-flex items-center gap-1.5
  px-3 py-1
  rounded-full
  bg-cdc-yellow text-cdc-black
  text-caption font-semibold
">
  <span class="w-1.5 h-1.5 rounded-full bg-cdc-black animate-pulse"></span>
  En cours
</span>

<!-- Badge avec icône -->
<span class="
  inline-flex items-center gap-1.5
  px-2 py-1
  rounded-md
  bg-cdc-red/15 text-cdc-red
  text-caption font-medium
">
  <svg class="w-3.5 h-3.5" …></svg>
  Rupture
</span>

<!-- Badge outline -->
<span class="
  inline-flex items-center
  px-2 py-0.5
  rounded-sm
  border border-white/30 text-white/80
  text-caption font-medium
">
  Bénin
</span>
```

### États

| État | Style |
|------|-------|
| **Default** | Couleur du variant, texte lisible. |
| **Pulsing** (live / actif) | Petit point `animate-pulse` à gauche du texte. |
| **Hover** (si cliquable) | Légère élévation ou changement de fond (`bg-opacity` augmentée). |

### Responsive

- **Mobile** : badges `text-caption` (12px), padding compact.
- **Desktop** : même taille — les badges ne doivent jamais être imposants.

---

## 8. Utilitaires Communs (snippets)

### Lien animé sous-ligné

```html
<a href="…" class="
  relative inline-block
  text-cdc-white
  after:absolute after:bottom-0 after:left-0
  after:w-0 after:h-[1px] after:bg-cdc-yellow
  hover:after:w-full after:transition-all after:duration-300
">
  Lien</a>
```

### Séparateur section tricolore

```html
<div class="flex items-center gap-4">
  <div class="h-px flex-1 bg-cdc-yellow" />
  <div class="h-px flex-1 bg-cdc-red" />
  <div class="h-px flex-1 bg-cdc-green" />
</div>
```

### Container responsive standard

```html
<div class="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">…</div>
```

---

*UI Kit Taka Inside — v1.0*  
*Dernière mise à jour : 2025*
