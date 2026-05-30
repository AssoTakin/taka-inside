const API_BASE = process.env.STRAPI_URL || 'http://localhost:1337';
const TOKEN = process.env.STRAPI_API_TOKEN || '';

async function api(endpoint, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  const res = await fetch(`${API_BASE}/api/${endpoint}`, opts);
  if (!res.ok) {
    const text = await res.text();
    console.error(`[${method}] ${endpoint} → ${res.status}: ${text.substring(0,200)}`);
    return null;
  }
  return res.json();
}

async function createOrFind(endpoint, data, field, value) {
  // find existing
  const existing = await api(`${endpoint}?filters[${field}][$eq]=${encodeURIComponent(value)}`);
  if (existing?.data?.length) return existing.data[0];
  // create
  const created = await api(endpoint, 'POST', { data });
  return created?.data;
}

async function seed() {
  console.log('🌱 Seeding Taka Inside data...\n');

  // === CATEGORIES ===
  const catMerch = await createOrFind('categorie-produits', { nom: 'Merchandising', slug: 'merchandising' }, 'slug', 'merchandising');
  const catAlbum = await createOrFind('categorie-produits', { nom: 'Albums', slug: 'albums' }, 'slug', 'albums');
  const catTicket = await createOrFind('categorie-produits', { nom: 'Tickets', slug: 'tickets' }, 'slug', 'tickets');
  console.log('✅ Catégories');

  // === PROJETS ===
  const projets = [
    {
      titre: 'Made In Bénin Radio',
      slug: 'made-in-benin-radio',
      description: 'Web radio dédiée à la promotion de la musique béninoise et africaine. Programmes variés, interviews artistes, playlist 24h/24.',
      statut: 'en_cours',
      localisation: 'Cotonou, Bénin',
      tags: 'radio, musique, media',
      cta_don: true,
      cta_benevole: true,
    },
    {
      titre: 'Taka Culture Festival',
      slug: 'taka-culture-festival',
      description: 'Grand festival culturel annuel réunissant artistes, artisans, danseurs et musiciens du Bénin et de la diaspora.',
      statut: 'a_venir',
      localisation: 'Cotonou, Bénin',
      tags: 'festival, evenement, culture',
      cta_don: true,
      cta_benevole: true,
    },
    {
      titre: 'Ateliers Jeunes Talents',
      slug: 'ateliers-jeunes-talents',
      description: 'Programme d\'accompagnement des jeunes artistes béninois : formation, studio, mentorat, mise en scène.',
      statut: 'urgent',
      localisation: 'Cotonou / Abomey-Calavi',
      tags: 'education, social, jeunes',
      cta_don: true,
      cta_benevole: true,
    },
    {
      titre: 'Brassage Culturel',
      slug: 'brassage-culturel',
      description: 'Échanges artistiques entre le Bénin et d\'autres pays du monde. Résidences, collaborations, tournées internationales.',
      statut: 'en_cours',
      localisation: 'International',
      tags: 'international, echange, residence',
      cta_don: true,
    },
    {
      titre: 'Taka Inside Village',
      slug: 'taka-inside-village',
      description: 'Création d\'un espace culturel communautaire avec bibliothèque, studio d\'enregistrement et salle de répétition.',
      statut: 'a_venir',
      localisation: 'Cotonou, Bénin',
      tags: 'social, espace, communaute',
      cta_don: true,
      cta_benevole: true,
    },
  ];
  for (const p of projets) {
    await createOrFind('projets', p, 'slug', p.slug);
  }
  console.log('✅ Projets');

  // === ARTISTES ===
  const artistes = [
    {
      nom: 'Tomiwa Kéfil',
      slug: 'tomiwa-kefil',
      biographie: 'Chanteur et auteur-compositeur béninois, fusionne les rythmes traditionnels du Bénin avec l\'afrobeat contemporain. Voix puissante et message engagé.',
      genre_musical: 'Afrobeat · World',
      albums: [
        { titre: 'Roots of Benin', annee: '2023', lien_spotify: 'https://open.spotify.com' },
        { titre: 'Cotonou Nights', annee: '2024', lien_spotify: 'https://open.spotify.com' },
      ],
      concerts: [
        { ville: 'Cotonou', date: '2025-06-15T20:00:00Z', salle: 'Institut Français' },
        { ville: 'Porto-Novo', date: '2025-07-20T19:00:00Z', salle: 'Palais des Congrès' },
      ],
      liens_externes: {
        facebook: 'https://facebook.com/tomiwa',
        instagram: 'https://instagram.com/tomiwa',
        spotify: 'https://open.spotify.com',
      },
    },
    {
      nom: 'Ami Sêdjro',
      slug: 'ami-sedjro',
      biographie: 'Vocaliste et percussionniste, porte-voix des traditions vodun et des mélodies ancestrales du Sud-Bénin. Artiste engagée pour la préservation du patrimoine.',
      genre_musical: 'Traditionnel · Jazz',
      albums: [
        { titre: 'Vodun Voices', annee: '2022', lien_spotify: 'https://open.spotify.com' },
        { titre: 'Légendes du Sud', annee: '2024', lien_spotify: 'https://open.spotify.com' },
      ],
      concerts: [
        { ville: 'Abomey', date: '2025-08-10T18:00:00Z', salle: 'Place publique' },
      ],
      liens_externes: {
        facebook: 'https://facebook.com/ami',
        instagram: 'https://instagram.com/ami',
      },
    },
    {
      nom: 'Koffi Agbossou',
      slug: 'koffi-agbossou',
      biographie: 'Rappeur engagé, mêle français, fon et anglais pour raconter le quotidien des jeunes Béninois. Figure montante de la scène hip-hop béninoise.',
      genre_musical: 'Hip-Hop · Afrotrap',
      albums: [
        { titre: 'Benin Flow', annee: '2024', lien_spotify: 'https://open.spotify.com' },
      ],
      concerts: [
        { ville: 'Cotonou', date: '2025-09-05T21:00:00Z', salle: 'Fondation Zinsou' },
      ],
      liens_externes: {
        youtube: 'https://youtube.com',
        instagram: 'https://instagram.com/koffi',
      },
    },
  ];
  for (const a of artistes) {
    await createOrFind('artistes', a, 'slug', a.slug);
  }
  console.log('✅ Artistes');

  // === PRODUITS ===
  const produits = [
    { titre: 'CD - Taka Volume 1', slug: 'cd-taka-v1', prix: 5000, type: 'album', description: 'Compilation des meilleurs morceaux de nos artistes.', quantite_disponible: 100, categorie: catAlbum?.documentId || null },
    { titre: 'T-shirt Taka Inside', slug: 'tshirt-taka', prix: 7500, type: 'merch', description: 'T-shirt 100% coton bio avec le logo Taka Inside.', quantite_disponible: 50, categorie: catMerch?.documentId || null },
    { titre: 'Album Digital - Tomiwa Kéfil', slug: 'album-tomiwa', prix: 2500, type: 'album', description: 'Téléchargement numérique de l\'album Roots of Benin.', quantite_disponible: -1, categorie: catAlbum?.documentId || null },
    { titre: 'CD - Ami Sêdjro', slug: 'cd-ami', prix: 4500, type: 'album', description: 'Album Vodun Voices en format physique.', quantite_disponible: 80, categorie: catAlbum?.documentId || null },
    { titre: 'Sac en wax Taka', slug: 'sac-wax', prix: 12000, type: 'merch', description: 'Sac en wax authentique, confection artisanale au Bénin.', quantite_disponible: 30, categorie: catMerch?.documentId || null },
    { titre: 'Bracelet artisanal', slug: 'bracelet', prix: 2000, type: 'merch', description: 'Bracelet fait main par des artisans béninois.', quantite_disponible: 100, categorie: catMerch?.documentId || null },
    { titre: 'Poster A3 artiste', slug: 'poster', prix: 3500, type: 'merch', description: 'Poster format A3 d\'un artiste Taka Inside au choix.', quantite_disponible: 60, categorie: catMerch?.documentId || null },
    { titre: 'Ticket - Taka Culture Festival', slug: 'ticket-festival', prix: 15000, type: 'ticket', description: 'Pass pour le Taka Culture Festival 2025.', date_evenement: '2025-12-15T18:00:00Z', lieu_evenement: 'Cotonou', quantite_disponible: 500, categorie: catTicket?.documentId || null },
  ];
  for (const p of produits) {
    await createOrFind('produits', p, 'slug', p.slug);
  }
  console.log('✅ Produits');

  console.log('\n🎉 Seed terminé !');
}

seed().catch(console.error);
