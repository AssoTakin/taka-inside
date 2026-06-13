import { NextRequest, NextResponse } from "next/server";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const strapiToken = process.env.STRAPI_API_TOKEN;

// Taux de conversion FCFA → EUR
const XOF_TO_EUR = 1 / 655.957;

export async function GET(req: NextRequest) {
  return handleLivraison(req);
}

export async function POST(req: NextRequest) {
  return handleLivraison(req);
}

async function handleLivraison(req: NextRequest) {
  try {
    let pays, type, poidsKg, currency;
    
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      pays = body.pays || body.codePostal || 'FR';
      type = body.type_livraison || 'standard';
      poidsKg = Number(body.poids) || 1;
      currency = (body.currency || 'EUR').toUpperCase();
    } else {
      const searchParams = req.nextUrl.searchParams;
      pays = searchParams.get('pays') || 'FR';
      type = searchParams.get('type_livraison') || 'standard';
      poidsKg = Number(searchParams.get('poids')) || 1;
      currency = (searchParams.get('currency') || 'EUR').toUpperCase();
    }

    if (!pays || !type) {
      return NextResponse.json(
        { error: 'Manque pays ou type_livraison' },
        { status: 400 }
      );
    }

    // Équivalents code pays ↔ nom
    const codesPays: Record<string, string[]> = {
      'FR': ['FR', 'France'],
      'BE': ['BE', 'Belgique'],
      'CH': ['CH', 'Suisse'],
      'CA': ['CA', 'Canada'],
      'BJ': ['BJ', 'Benin'],
      'Benin': ['BJ', 'Benin'],
      'NG': ['NG', 'Nigeria'],
      'Nigeria': ['NG', 'Nigeria'],
      'TG': ['TG', 'Togo'],
      'Togo': ['TG', 'Togo'],
      'GH': ['GH', 'Ghana'],
      'Ghana': ['GH', 'Ghana'],
      'CI': ['CI', "Cote d'Ivoire"],
      "Cote d'Ivoire": ['CI', "Cote d'Ivoire"],
      'OTHER': ['OTHER', 'Autre'],
    };

    const codes = codesPays[pays] || [pays];

    // Requête Strapi: zone actifs pour le pays ET type livraison spécifié
    const filters = codes.map((c, i) =>
      `filters[$or][${i}][code_pays][$eqi]=${encodeURIComponent(c)}`
    ).join('&');

    const url = `${strapiUrl}/api/zone-livraisons?${filters}&filters[type_livraison][$eq]=${encodeURIComponent(type)}&filters[actif][$eq]=true&pagination[pageSize]=1`;

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(strapiToken ? { "Authorization": `Bearer ${strapiToken}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error('[Livraison] Strapi error:', res.status);
      return getFallbackCost(pays, type, poidsKg, currency);
    }

    const data = await res.json();
    const zones = data.data || [];

    if (zones.length === 0) {
      return getFallbackCost(pays, type, poidsKg, currency);
    }

    const zone = zones[0].attributes || zones[0]; // compat strapi v4/v5
    const coutBaseXOF = Number(zone.cout_base || 0);
    const coutParKgXOF = Number(zone.cout_par_kg || 0);
    const coutXOF = coutBaseXOF + (coutParKgXOF * poidsKg) || 500;

    // Conversion en EUR pour le checkout
    const coutEUR = Math.round(coutXOF * XOF_TO_EUR * 100) / 100;

    return NextResponse.json({
      pays,
      type_livraison: type,
      poids_kg: poidsKg,
      cout_base_xof: coutBaseXOF,
      cout_par_kg_xof: coutParKgXOF,
      frais_livraison: coutEUR,
      frais_livraison_xof: Math.round(coutXOF),
      delai_estime_jours: zone.delai_estime_jours || 7,
      currency: 'EUR',
      source: 'strapi',
    });

  } catch (err: unknown) {
    console.error('[Livraison] Error:', err);
    return getFallbackCost('FR', 'standard', 1, 'EUR');
  }
}

function getFallbackCost(pays: string, type: string, poidsKg: number, currency: string = 'EUR') {
  // Tarifs par défaut en EUR
  const fallback: Record<string, Record<string, { base: number; kg: number; jours: number }>> = {
    'FR': {
      'standard': { base: 8, kg: 3, jours: 5 },
      'express': { base: 15, kg: 5, jours: 2 },
      'economique': { base: 5, kg: 2, jours: 8 },
    },
    'BE': {
      'standard': { base: 9, kg: 3.5, jours: 6 },
      'express': { base: 16, kg: 5.5, jours: 2 },
    },
    'CH': {
      'standard': { base: 12, kg: 4, jours: 6 },
      'express': { base: 20, kg: 6, jours: 3 },
    },
    'CA': {
      'standard': { base: 15, kg: 5, jours: 10 },
      'express': { base: 28, kg: 8, jours: 5 },
    },
    'BJ': {
      'standard': { base: 1.5, kg: 0.8, jours: 5 },
      'express': { base: 3, kg: 1.5, jours: 2 },
    },
    'Benin': {
      'standard': { base: 1.5, kg: 0.8, jours: 5 },
      'express': { base: 3, kg: 1.5, jours: 2 },
    },
    'NG': {
      'standard': { base: 5, kg: 1.5, jours: 7 },
      'express': { base: 9, kg: 3, jours: 3 },
    },
    'TG': {
      'standard': { base: 2.5, kg: 1.2, jours: 5 },
      'express': { base: 5, kg: 2.5, jours: 2 },
    },
    'GH': {
      'standard': { base: 3, kg: 1.3, jours: 6 },
      'express': { base: 6, kg: 2.6, jours: 3 },
    },
    'CI': {
      'standard': { base: 4, kg: 1.4, jours: 7 },
      'express': { base: 8, kg: 2.8, jours: 3 },
    },
    'OTHER': {
      'standard': { base: 15, kg: 5, jours: 14 },
      'express': { base: 28, kg: 8, jours: 7 },
    },
  };

  const zone = fallback[pays] || fallback['OTHER'];
  const tarif = zone[type] || zone['standard'];
  const cout = tarif.base + tarif.kg * poidsKg;

  return NextResponse.json({
    pays,
    type_livraison: type,
    poids_kg: poidsKg,
    cout_base: tarif.base,
    cout_par_kg: tarif.kg,
    frais_livraison: Math.round(cout * 100) / 100,
    delai_estime_jours: tarif.jours,
    currency,
    source: 'fallback',
    note: 'Strapi non accessible ou zone non configurée — tarifs par défaut appliqués',
  });
}
