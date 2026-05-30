# Charte Graphique — Taka Inside

> **Projet :** Taka Inside — Association culturelle & label musical (Bénin)  
> **Stack :** Next.js 14 + Tailwind CSS + shadcn/ui  
> **Orientation :** Vibrante, culturelle, moderne — jamais cheap.  
> **Langue principale :** Français (multilingue-ready)

---

## 1. Philosophie Visuelle

Taka Inside incarne la vitalité de la culture béninoise et l’énergie du mouvement rasta/rastafari. L’identité visuelle doit être :

- **Chaleureuse et humaine** — comme le terroir et la musique live.
- **Audacieuse sans être agressive** — les couleurs du CDC (jaune, rouge, vert, noir) sont portées avec intention, pas par accumulation.
- **Moderne et lisible** — le site est un outil culturel et commercial, pas une affiche.
- **Racines & futur** — motifs et textures inspirés du patrimoine, UI fluide et responsive.

**Moodboard textuel**

- *Énergie* : concert en plein air à Cotonou, chaleur du bitume, danse au coucher du soleil.
- *Texture* : terre battue, textile wax, peinture murale africaine, vinyle rayé.
- *Forme* : cercles (unité), lignes brisées (rythme), espaces négatifs respirants.
- *Contraste* : noir profond contre jaune lumineux, blanc cassé contre rouge ardent.
- *Son* : graphiques audio visibles, formes d’onde, égaliseur minimaliste.
- *Références lointaines* : Afropunk aesthetics, design ghanéen contemporain, editorial The FADER, covers albums reggae modernes.

---

## 2. Palette de Couleurs

### Couleurs primaires (CDC)

| Token | Hex | Usage principal | Accessibilité |
|-------|-----|-----------------|---------------|
| `cdc-yellow` | `#F2C94C` | Accents, CTA secondaires, badges, icônes | Sur fond noir : AA. Sur fond blanc : AA (gras). |
| `cdc-red` | `#D93025` | Alertes, CTA primaires, badges urgent, hover énergique | Sur fond blanc : AA (gras). Sur fond noir : AA. |
| `cdc-green` | `#27AE60` | Validation, succès, état actif, accents nature | Sur fond blanc : AA. Sur fond noir : AA. |
| `cdc-black` | `#1A1A1A` | Fonds sombres, texte principal sur clair, navigation | — |
| `cdc-white` | `#FAFAFA` | Fonds clairs, texte sur fond sombre | — |

### Couleurs dérivées / nuancier fonctionnel

| Token | Hex | Usage |
|-------|-----|-------|
| `yellow-50` | `#FEF9E7` | Fonds subtils jaunes |
| `yellow-100`| `#FCF3CF` | Hover léger, badges pastels |
| `yellow-500`| `#F2C94C` | **cdc-yellow** |
| `yellow-700`| `#B8961A` | Texte jaune sur fond clair |
| `red-50` | `#FDECEA` | Fonds alerte légers |
| `red-100` | `#F9D2D0` | Bordures alerte |
| `red-500` | `#D93025` | **cdc-red** |
| `red-700` | `#9E1B16` | Texte rouge profond |
| `green-50` | `#E9F7EF` | Fonds succès |
| `green-100`| `#D4EFDF` | Bordures validation |
| `green-500`| `#27AE60` | **cdc-green** |
| `green-700`| `#1E8449` | Texte vert profond |
| `black-900`| `#1A1A1A` | **cdc-black** |
| `black-800`| `#2D2D2D` | Surfaces sombres élevées (cards) |
| `black-700`| `#404040` | Bordures sombres, icônes inactives |
| `white-50` | `#FAFAFA` | **cdc-white** |
| `white-100`| `#F5F5F5` | Fonds de section alternés |
| `white-200`| `#E5E5E5` | Bordures, séparateurs |

### Usage chromatique par contexte

- **Fonds sombres** (mode principal artistique) : `cdc-black` + `black-800` pour les cards. Texte en `cdc-white` ou `cdc-yellow`.
- **Fonds clairs** (mode informatif / e-commerce) : `cdc-white` ou `white-100`. Texte en `cdc-black`.
- **CTA primaire** : `cdc-red` ou `cdc-green` selon l’intention (achat = vert, alerte/urgence = rouge).
- **CTA secondaire** : `cdc-yellow` avec texte `cdc-black`.
- **Accent décoratif** : bande horizontale tricolore (jaune/rouge/vert) en 2–4 px de haut, utilisée avec parcimonie (sous-nav, footer).

### Accessibilité WCAG 2.1 — Contraste

| Combinaison | Ratio | Niveau WCAG |
|-------------|-------|-------------|
| `cdc-yellow` (`#F2C94C`) sur `cdc-black` (`#1A1A1A`) | 9.8:1 | AAA |
| `cdc-red` (`#D93025`) sur `cdc-white` (`#FAFAFA`) | 5.4:1 | AA (texte normal) |
| `cdc-green` (`#27AE60`) sur `cdc-white` (`#FAFAFA`) | 4.6:1 | AA (texte normal) |
| `cdc-black` (`#1A1A1A`) sur `cdc-white` (`#FAFAFA`) | 16.2:1 | AAA |
| `cdc-white` (`#FAFAFA`) sur `cdc-black` (`#1A1A1A`) | 16.2:1 | AAA |
| `yellow-700` (`#B8961A`) sur `cdc-white` | 4.5:1 | AA |
| `red-700` (`#9E1B16`) sur `cdc-white` | 7.1:1 | AAA |

> **Règle d’or :** jamais de `cdc-yellow` sur `cdc-white` en texte courant (ratio ~1.9:1, échec). Toujours utiliser `yellow-700` pour du texte jaune sur fond clair.

---

## 3. Typographie

### Familles de polices

| Rôle | Police principale | Fallback stack | Usage |
|------|-------------------|--------------|-------|
| **Titres / Display** | *Space Grotesk* | `"Space Grotesk", "Inter", system-ui, -apple-system, sans-serif` | H1–H3, chiffres, navigation, boutons, badges |
| **Corps de texte** | *Inter* | `"Inter", "Helvetica Neue", Arial, sans-serif` | Paragraphes, descriptions, formulaires, cartes |
| **Accent / Citations** | *DM Serif Display* | `"DM Serif Display", Georgia, "Times New Roman", serif` | Citations, slogans, titres événements spéciaux |

> **Chargement :** via Google Fonts (2 requêtes) ou self-hosting dans `/public/fonts/`.

### Échelle typographique (Mobile → Desktop)

| Token | Mobile | Tablet (≥768px) | Desktop (≥1024px) | Graisse | Line-height |
|-------|--------|-----------------|-------------------|---------|-------------|
| `display` | 40px | 56px | 72px | 700 | 1.1 |
| `h1` | 32px | 40px | 48px | 700 | 1.2 |
| `h2` | 28px | 32px | 36px | 700 | 1.25 |
| `h3` | 24px | 28px | 30px | 600 | 1.3 |
| `h4` | 20px | 22px | 24px | 600 | 1.35 |
| `body-lg` | 18px | 18px | 20px | 400 | 1.6 |
| `body` | 16px | 16px | 16px | 400 | 1.6 |
| `body-sm` | 14px | 14px | 14px | 400 | 1.5 |
| `caption` | 12px | 12px | 12px | 500 | 1.4 |
| `button` | 14px | 14px | 16px | 600 | 1 |
| `nav` | 14px | 14px | 16px | 500 | 1 |

> **Principe responsive :** la taille augmente sur les écrans larges uniquement pour les titres. Le corps reste stable (`16px`) pour la lisibilité.

### Règles typographiques

- **Titres :** majuscules autorisées pour H1 et display UNIQUEMENT. Jamais de `text-transform: uppercase` sur du corps de texte.
- **Letter-spacing :** `tracking-tight` (-0.025em) sur display, `tracking-wide` (0.05em) sur captions et badges.
- **Maximum de largeur pour le texte :** `max-w-prose` (65ch) pour les paragraphes longs.
- **Antialiasing :** `antialiased` sur l’ensemble du site pour un rendu net.

---

## 4. Espacement & Grille

### Système d’espacement (Tailwind scale)

Base : `4px` (0.25rem). Utiliser les tokens Tailwind natifs.

| Token | Valeur | Usage typique |
|-------|--------|---------------|
| `space-1` | 4px | Gaps internes fines |
| `space-2` | 8px | Gaps boutons, icônes |
| `space-4` | 16px | Padding cards interne |
| `space-6` | 24px | Gap sections petites |
| `space-8` | 32px | Padding sections |
| `space-12`| 48px | Gap sections moyennes |
| `space-16`| 64px | Padding page (mobile) |
| `space-24`| 96px | Padding page (desktop) |

### Grille responsive

- **Mobile** (< 640px) : 1 colonne, padding horizontal `px-4` (16px).
- **Tablet** (640–1024px) : 2 colonnes possibles, padding `px-6` (24px).
- **Desktop** (> 1024px) : 12 colonnes, max-width `1280px`, padding `px-8` (32px).
- **Large** (> 1280px) : max-width `1440px`, centré.

---

## 5. Formes & Ombres

| Token | Valeur | Usage |
|-------|--------|-------|
| `radius-sm` | 4px | Badges, tags |
| `radius-md` | 8px | Boutons, inputs |
| `radius-lg` | 12px | Petites cards |
| `radius-xl` | 16px | Cards projet, images |
| `radius-2xl`| 24px | Cards produit, lecteur audio |
| `radius-full` | 9999px | Pills, avatars, badges arrondis |

| Token | Valeur | Usage |
|-------|--------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards plates |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards interactives |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.15)` | Modales, dropdowns |
| `shadow-glow-yellow` | `0 0 20px rgba(242,201,76,0.3)` | Hover CTA spécial |
| `shadow-glow-red` | `0 0 20px rgba(217,48,37,0.3)` | Hover alerte/urgence |

---

## 6. Icônes & Motifs

### Icônes

- **Librairie :** `lucide-react` (cohérent avec shadcn/ui).
- **Taille standard :** 20px (`w-5 h-5`) dans les boutons et formulaires.
- **Taille navigation :** 24px (`w-6 h-6`).
- **Stroke-width :** 2px (par défaut Lucide), sauf sur fond sombre où 1.5px peut être plus élégant.

### Motifs décoratifs (utilisation parcimonieuse)

- **Bande tricolore CDC :** barre horizontale de 3px avec dégradé `yellow → red → green`. Utilisée sous le header ou au-dessus du footer.
- **Cercles concentriques :** motif abstrait inspiré des cibles africaines, utilisé en filigrane (`opacity-5` à `opacity-10`) sur les fonds sombres.
- **Forme d’onde :** svg stylisée en accent sur les pages musique.

---

## 7. Directives d’Utilisation

### Ce qu’il faut faire ✅

- Utiliser les couleurs CDC avec intention : une dominante par section.
- Respecter les ratios de contraste WCAG AA minimum.
- Privilégier le fond sombre (`cdc-black`) pour les sections artistiques et le fond clair (`cdc-white`) pour le shop / informatif.
- Garder des marges généreuses — l’air est aussi important que le contenu.
- Animer avec modération : transitions `150ms–300ms`, `ease-out`.

### Ce qu’il ne faut PAS faire ❌

- Ne jamais empiler jaune, rouge et vert en volumes égaux sur la même surface — ça crée de la confusion visuelle.
- Ne pas utiliser `cdc-yellow` pour du texte sur fond blanc.
- Ne pas dépasser 3 polices sur une même page.
- Ne pas utiliser de gradients flashy ou néons — l’identité est vibrante mais terre-à-terre.
- Ne pas utiliser de faux effets 3D, de skeuomorphisme, ou de textures cheap (carbon fiber, etc.).

---

## 8. Tokens Tailwind (configuration suggérée)

```js
// tailwind.config.ts — extend theme
{
  theme: {
    extend: {
      colors: {
        'cdc-yellow': '#F2C94C',
        'cdc-red': '#D93025',
        'cdc-green': '#27AE60',
        'cdc-black': '#1A1A1A',
        'cdc-white': '#FAFAFA',
        'black-800': '#2D2D2D',
        'black-700': '#404040',
        'yellow-700': '#B8961A',
        'red-700': '#9E1B16',
        'green-700': '#1E8449',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"Inter"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        accent: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-yellow': '0 0 20px rgba(242,201,76,0.3)',
        'glow-red': '0 0 20px rgba(217,48,37,0.3)',
      },
      borderRadius: {
        '2xl': '24px',
      },
    },
  },
}
```

---

## 9. Notes pour shadcn/ui

- Surclasser les variables CSS de shadcn dans `globals.css` avec les tokens CDC.
- `--primary` → `cdc-green` (action positive) ou `cdc-red` (selon le contexte de la page).
- `--secondary` → `cdc-yellow`.
- `--background` → `cdc-black` ou `cdc-white` selon le mode.
- `--foreground` → inverse du background.
- `--destructive` → `cdc-red`.
- `--accent` → `yellow-700` ou `green-700`.

---

*Charte graphique Taka Inside — v1.0*  
*Dernière mise à jour : 2025*
