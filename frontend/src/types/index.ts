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
  biographie: string;
  genreMusical: string;
  photo?: { url: string; alt?: string };
  albums?: Album[];
  concerts?: Concert[];
  liensSociaux?: LiensSociaux;
  estSigne: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Album {
  id: number;
  titre: string;
  annee: number;
  pochette?: { url: string; alt?: string };
  liensStreaming: string;
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
