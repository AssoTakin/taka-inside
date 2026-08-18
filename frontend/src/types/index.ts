export interface Projet {
  id: number;
  documentId: string;
  titre: string;
  slug: string;
  resume: string;
  description?: string;
  statut: 'en_cours' | 'a_venir' | 'termine' | 'urgent';
  dateDebut: string;
  dateFin?: string;
  images?: { url: string; alt?: string }[];
  type?: 'culturel' | 'musical' | 'social' | 'educatif';
  localisation?: string;
  budget?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Artiste {
  id: number;
  documentId: string;
  nom: string;
  slug: string;
  biographie?: string;
  citation?: string;
  genre?: string;
  genre_musical?: string;
  genreMusical?: string;
  photo?: { url: string; alt?: string };
  photo_cover?: { url: string; alt?: string };
  photoCover?: { url: string; alt?: string };
  albums?: Album[];
  concerts?: Concert[];
  actualites?: Actualite[];
  liensSociaux?: LiensSociaux;
  liens?: LiensSociaux | LiensSociaux[];
  liens_streaming?: StreamingLink[];
  liensStreaming?: StreamingLink[];
  produitsLies?: Produit[];
  produits_lies?: Produit[];
  estSigne?: boolean;
  est_signe?: boolean;
  discographie?: Record<string, unknown>[];
  createdAt: string;
  updatedAt: string;
}

export interface StreamingLink {
  platform: 'spotify' | 'apple_music' | 'youtube_music' | 'deezer' | 'tidal' | 'soundcloud' | 'bandcamp' | 'youtube' | 'website';
  url: string;
}

export interface Actualite {
  id: number;
  titre: string;
  contenu?: string;
  date?: string;
  image?: { url: string; alt?: string };
  lien?: string;
}

export interface Album {
  id: number;
  titre: string;
  annee?: number;
  dateSortie?: string;
  type?: 'album' | 'ep' | 'single' | 'compilation' | 'live';
  description?: string;
  pochette?: { url: string; alt?: string };
  extraitAudio?: { url: string };
  liensStreaming?: StreamingLink[];
  lienSpotify?: string;
  lienApple?: string;
  lienYoutube?: string;
  lienDeezer?: string;
  lienTidal?: string;
  lienSoundcloud?: string;
  lienBandcamp?: string;
}

export interface Concert {
  id: number;
  ville: string;
  date: string;
  salle?: string;
  lienTicket?: string;
}

export interface LiensSociaux {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  spotify?: string;
}

export interface CategorieProduit {
  id: number;
  documentId: string;
  nom: string;
  slug: string;
  description?: string;
  image?: { url: string; alt?: string };
  createdAt: string;
  updatedAt: string;
}

export interface Produit {
  id: number;
  documentId: string;
  nom: string;
  slug: string;
  description: string;
  prix: number;
  typePrix: 'fixe' | 'persiannalisable';
  stock: number;
  images?: { url: string; alt?: string }[];
  categorie?: CategorieProduit;
  createdAt: string;
  updatedAt: string;
}

export interface Benevole {
  id: number;
  documentId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  ville: string;
  competences: string[];
  disponibilite: string;
  motivation: string;
  createdAt: string;
  updatedAt: string;
}

export type StatutProjet = 'en_cours' | 'a_venir' | 'termine' | 'urgent';
export type TypeProjet = 'culturel' | 'musical' | 'social' | 'educatif';
export type PrixType = 'fixe' | 'personnalisable';
export type CompetenceBenevole =
  | 'communication'
  | 'evenementiel'
  | 'technique'
  | 'musique'
  | 'design'
  | 'traduction'
  | 'autre';

export interface CtaButton {
  label: string;
  link: string;
  style?: 'primary' | 'secondary' | 'outline';
  icon?: string;
  isExternal?: boolean;
}

export interface SeoMeta {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: { url: string; alt?: string };
}

export interface LabelMusicalHero {
  badgeText: string;
  title: string;
  highlightedWord?: string;
  description: string;
  primaryCta?: CtaButton;
  secondaryCta?: CtaButton;
  backgroundImage?: { url: string; alt?: string };
}

export interface LabelMusicalStat {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface LabelMusicalCallout {
  title: string;
  description?: string;
  primaryCta?: CtaButton;
  secondaryCta?: CtaButton;
}

export interface LabelMusicalPage {
  documentId: string;
  seo?: SeoMeta;
  hero: LabelMusicalHero;
  stats: LabelMusicalStat[];
  artistsSectionTitle: string;
  artistsSectionDescription?: string;
  artistsSectionCta?: CtaButton;
  callout?: LabelMusicalCallout;
  artistFallbackLabel?: string;
}

