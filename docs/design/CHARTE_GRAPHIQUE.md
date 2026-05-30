# Charte Graphique — Taka Inside (v2.0 Sobre & Élégant)

> **Projet :** Taka Inside — Association culturelle & label musical (Bénin)  
> **Stack :** Next.js 14 + Tailwind CSS + shadcn/ui  
> **Direction :** Sobre, élégant, premium — l'énergie rasta en accents, jamais en excès  
> **Langue :** Français (i18n-ready)

---

## 1. Philosophie Visuelle

Le logo Taka Inside est audacieux : piment rouge, dreadlocks colorées, lunettes rasta. Mais le **site doit être le contraire du logo** — un cadre sobre qui met en valeur le contenu. Comme une galerie d'art blanche qui expose des œuvres colorées.

**Principes directeurs :**
- **Noir profond comme base** — élégance, contraste, lecture confortable
- **Blanc cassé comme toile** — chaleureux, moins agressif que le blanc pur
- **Couleurs rasta en touches** — jaune, rouge, vert uniquement sur les CTA, badges, et éléments actifs
- **Beaucoup d'espace** — aération généreuse, hierachie claire
- **Typographie géométrique** — moderne, africaine dans l'esprit, européenne dans la forme

**Moodboard textuel**
- *Énergie* : soirée jazz à Cotonou, chic et décontracté
- *Texture* : béton ciré, bois brut, lin naturel, vinyl mat
- *Forme* : rectangles nets, cercles parfaits, lignes fines
- *Contraste* : noir & blanc avec une surprise de couleur
- *Références* : site d'Abloh (Virgil), Sonos, Beats by Dre, Fenty, design africain contemporain

---

## 2. Palette de Couleurs

### 2.1 Couleurs Primaires (90% de l'interface)

| Nom | Hex | Usage |
|-----|-----|-------|
| **Noir Taka** | `#0A0A0A` | Fonds sombres, header, footer, texte principal |
| **Blanc Cassé** | `#F5F3EF` | Fond principal, cartes, sections claires |
| **Gris Souris** | `#8A8A8A` | Texte secondaire, placeholders, bordures |
| **Gris Clair** | `#E8E6E2` | Arrière-plans de cartes, séparations |

### 2.2 Couleurs d'Accent Rasta (10% de l'interface — uniquement)

Ces couleurs sortent **exclusivement** du logo. Elles ne s'utilisent que pour :
- Boutons d'action primaires
- Badges de statut
- Indicateurs actifs (lecteur radio, "en direct")
- Hover states subtils
- La bande rasta décorative (1-2px max)

| Nom | Hex | Usage |
|-----|-----|-------|
| **Jaune Piment** | `#E5B800` | CTA principal, accents or, badges premium |
| **Rouge Piment** | `#C41E3A` | Urgence, alertes, badges "sold out", hover destructif |
| **Vert Piment** | `#1B8A3A` | Succès, validation, boutons "ajouter", badges "en cours" |

### 2.3 Gradients (utilisation parcimonieuse)

```css
/* Gradient hero — subtil, sombre */
hero-gradient: linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%);

/* Gradient rasta décoratif — 2px max */
rasta-line: linear-gradient(90deg, #1B8A3A 33%, #E5B800 33%, #E5B800 66%, #C41E3A 66%);
```

### 2.4 Table de Contrastes WCAG 2.1

| Combinaison | Ratio | Niveau |
|-------------|-------|--------|
| Blanc Cassé `#F5F3EF` sur Noir `#0A0A0A` | 16.4:1 | AAA |
| Noir `#0A0A0A` sur Blanc Cassé `#F5F3EF` | 16.4:1 | AAA |
| Gris Souris `#8A8A8A` sur Noir `#0A0A0A` | 5.2:1 | AA |
| Jaune `#E5B800` sur Noir `#0A0A0A` | 9.1:1 | AAA |
| Rouge `#C41E3A` sur Blanc Cassé `#F5F3EF` | 6.8:1 | AA |
| Vert `#1B8A3A` sur Blanc Cassé `#F5F3EF` | 5.4:1 | AA |

---

## 3. Typographie

### 3.1 Police de titres : **Space Grotesk**
- **Pourquoi :** Géométrique, moderne, légèrement excentrique — comme le Bénin d'aujourd'hui
- **Usage :** Tous les titres H1-H6, boutons, navigation, chiffres en gras
- **Fallback :** system-ui, -apple-system, sans-serif

| Élément | Taille mobile | Taille desktop | Graisse | Interligne |
|---------|--------------|----------------|---------|------------|
| H1 (Hero) | 40px | 72px | 700 | 1.05 |
| H2 (Section) | 32px | 48px | 600 | 1.1 |
| H3 (Carte) | 24px | 32px | 600 | 1.2 |
| H4 (Sous-titre) | 18px | 20px | 500 | 1.3 |
| Body | 16px | 16px | 400 | 1.6 |
| Petit | 12px | 14px | 400 | 1.5 |
| Bouton | 14px | 14px | 500 | 1 |

### 3.2 Police de corps : **Inter**
- **Pourquoi :** Ultra lisible, conçue pour les écrans, excellente en français
- **Usage :** Paragraphes, descriptions, formulaires, labels

### 3.3 Police d'accent (occasionnelle) : **DM Serif Display**
- **Pourquoi :** Touche d'élégance, contraste avec le sans-serif
- **Usage :** Uniquement pour un mot clé par section (ex: "L'Art" dans le hero), jamais pour des phrases entières

---

## 4. Système d'Espacement

**Grille :** 12 colonnes, gouttière 24px (16px mobile)
**Max-width :** 1280px (80rem)
**Padding horizontal :** 16px mobile / 24px tablette / 48px desktop

**Échelle de spacing (Tailwind) :**
- `space-1` : 4px (micro)
- `space-2` : 8px (tight)
- `space-4` : 16px (standard)
- `space-6` : 24px (relaxed)
- `space-8` : 32px (section gap)
- `space-16` : 64px (section padding)
- `space-24` : 96px (hero padding)

---

## 5. Composants UI (Sobres)

### 5.1 Boutons

**Primaire (CTA)**
```
Background : #E5B800 (Jaune Piment)
Text : #0A0A0A (Noir Taka)
Border-radius : 8px
Padding : 12px 24px
Hover : darken 10%, translateY(-1px)
Shadow : none (flat design élégant)
```

**Secondaire**
```
Background : transparent
Border : 1px solid #0A0A0A
Text : #0A0A0A
Hover : background #0A0A0A, text #F5F3EF
```

**Ghost (sur fond sombre)**
```
Background : transparent
Border : 1px solid rgba(245,243,239,0.3)
Text : #F5F3EF
Hover : border full opacity, background rgba(245,243,239,0.05)
```

### 5.2 Cartes

```
Background : #FFFFFF
Border : 1px solid #E8E6E2
Border-radius : 12px
Shadow : 0 1px 3px rgba(0,0,0,0.04)
Hover : shadow 0 4px 12px rgba(0,0,0,0.08), translateY(-2px)
Padding : 24px
```

### 5.3 Formulaires

```
Input background : #FFFFFF
Border : 1px solid #E8E6E2
Border-radius : 8px
Focus : border #E5B800, ring #E5B800/20
Placeholder : #8A8A8A
Error : border #C41E3A, text #C41E3A
```

### 5.4 Badge de statut (seul endroit où les 3 couleurs apparaissent)

| Statut | Style |
|--------|-------|
| En cours | `bg-verte text-blanc-casse` |
| À venir | `bg-jaune text-noir` |
| Terminé | `bg-gris-souris text-blanc-casse` |
| Urgent | `bg-rouge text-blanc-casse` |

---

## 6. Éléments de Layout

### 6.1 Header
```
Background : #0A0A0A
Height : 64px
Logo : blanc
Navigation : Gris Souris, hover Blanc Cassé
CTA : Jaune Piment
Bande rasta : 2px en bas (seul gradient autorisé)
```

### 6.2 Footer
```
Background : #0A0A0A
Text : Gris Souris
Liens : Blanc Cassé, hover Jaune Piment
Bande rasta : 2px en haut
```

### 6.3 Hero Section
```
Background : #0A0A0A (jamais d'image de fond à moins qu'elle soit très sombre)
Titre : Blanc Cassé
Accent mot clé : Jaune Piment ou Rouge Piment (un seul par page)
Sous-titre : Gris Souris
```

### 6.4 Lecteur Audio (MIBRADIO)
```
Background : #1A1A1A
Bouton play : Vert Piment
Waveform : Jaune Piment (fine, 2px)
Texte : Gris Souris
```

---

## 7. Animations & Transitions

**Principe :** Discrètes, jamais tape-à-l'œil

```css
/* Transition standard */
transition : all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Hover cards */
transform : translateY(-2px);
box-shadow : 0 8px 24px rgba(0,0,0,0.12);

/* Page transitions (Next.js) */
/* App Router — pas de page transition globale, 
   uniquement micro-interactions */
```

---

## 8. Breakpoints Responsive

| Nom | Valeur | Usage |
|-----|--------|-------|
| Mobile | < 640px | Navigation burger, colonne unique |
| Tablette | 640px – 1024px | 2 colonnes, nav simplifiée |
| Desktop | > 1024px | Layout final, nav complète |
| Large | > 1280px | Max-width atteinte, centré |

---

## 9. Tailwind Config (extrait)

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        taka: {
          black: '#0A0A0A',
          cream: '#F5F3EF',
          gray: '#8A8A8A',
          'gray-light': '#E8E6E2',
          yellow: '#E5B800',
          red: '#C41E3A',
          green: '#1B8A3A',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['DM Serif Display', 'serif'],
      },
    }
  }
}
```

---

## 10. Règles d'or (à respecter)

1. **Jamais plus d'une couleur d'accent par section**
2. **Jamais de texte en jaune/rouge/vert sur fond clair** — uniquement sur noir
3. **Le gradient rasta est une ligne de 2px max** — jamais un fond entier
4. **Les images sont en noir & blanc ou très désaturées** — sauf projets/artistes
5. **Beaucoup d'espace = luxe** — ne pas remplir chaque pixel

---

*Charte v2.0 — Direction sobre & élégante*
