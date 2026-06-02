import { NextRequest, NextResponse } from "next/server";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const strapiToken = process.env.STRAPI_API_TOKEN;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const pays = searchParams.get('pays') || 'Benin';
    const type = searchParams.get('type_livraison') || 'standard';
    const poidsKg = Number(searchParams.get('poids')) || 1;

    if (!pays || !type) {
      return NextResponse.json(
        { error: 'Manque pays ou type_livraison' },
        { status: 400 }
      );
    }

    // Équivalents code pays ↔ nom
    const codesPays: Record<string, string[]> = {
      'Benin': ['BJ', 'Benin'],
      'Nigeria': ['NG', 'Nigeria'],
      'Togo': ['TG', 'Togo'],
      'Ghana': ['GH', 'Ghana'],
      'Cote d\'Ivoire': ['CI', 'Cote d\'Ivoire'],
      'France': ['FR', 'France'],
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
      // Fallback: tarifs par défaut
      return getFallbackCost(pays, type, poidsKg);
    }

    const data = await res.json();
    const zones = data.data || [];

    if (zones.length === 0) {
      // Aucune zone configurée → fallback
      return getFallbackCost(pays, type, poidsKg);
    }

    const zone = zones[0].attributes || zones[0]; // compat strapi v4/v5
    const cout = (Number(zone.cout_base || 0) + (Number(zone.cout_par_kg || 0) * poidsKg)) || 500;

    return NextResponse.json({
      pays,
      type_livraison: type,
      poids_kg: poidsKg,
      cout_base: Number(zone.cout_base || 0),
      cout_par_kg: Number(zone.cout_par_kg || 0),
      frais_livraison: Math.round(cout),
      delai_estime_jours: zone.delai_estime_jours || 7,
      source: 'strapi',
    });

  } catch (err: any) {
    console.error('[Livraison] Error:', err);
    return getFallbackCost('Benin', 'standard', 1);
  }
}

function getFallbackCost(pays: string, type: string, poidsKg: number) {
  // Tarifs par défaut si Strapi inaccessible ou non configuré
  const fallback: Record<string, Record<string, { base: number; kg: number; jours: number }>> = {
    'Benin': {
      'standard': { base: 1000, kg: 500, jours: 5 },
      'express': { base: 2000, kg: 1000, jours: 2 },
      'economique': { base: 500, kg: 300, jours: 14 },
    },
    'Nigeria': {
      'standard': { base: 3000, kg: 1000, jours: 7 },
      'express': { base: 6000, kg: 2000, jours: 3 },
      'economique': { base: 1500, kg: 500, jours: 21 },
    },
    'Togo': {
      'standard': { base: 1500, kg: 700, jours: 5 },
      'express': { base: 3000, kg: 1400, jours: 2 },
      'economique': { base: 800, kg: 400, jours: 10 },
    },
    'Ghana': {
      'standard': { base: 2000, kg: 800, jours: 6 },
      'express': { base: 4000, kg: 1600, jours: 3 },
      'economique': { base: 1000, kg: 500, jours: 14 },
    },
    'Cote d\'Ivoire': {
      'standard': { base: 2500, kg: 900, jours: 7 },
      'express': { base: 5000, kg: 1800, jours: 3 },
      'economique': { base: 1200, kg: 600, jours: 14 },
    },
    'France': {
      'standard': { base: 8000, kg: 3000, jours: 14 },
      'express': { base: 15000, kg: 5000, jours: 5 },
      'economique': { base: 5000, kg: 2000, jours: 21 },
    },
    'Autre': {
      'standard': { base: 10000, kg: 4000, jours: 21 },
      'express': { base: 20000, kg: 8000, jours: 7 },
      'economique': { base: 7000, kg: 3000, jours: 28 },
    },
  };

  const zone = fallback[pays] || fallback['Autre'];
  const tarif = zone[type] || zone['standard'];
  const cout = tarif.base + tarif.kg * poidsKg;

  return NextResponse.json({
    pays,
    type_livraison: type,
    poids_kg: poidsKg,
    cout_base: tarif.base,
    cout_par_kg: tarif.kg,
    frais_livraison: Math.round(cout),
    delai_estime_jours: tarif.jours,
    source: 'fallback',
    note: 'Strapi non accessible ou zone non configurée — tarifs par défaut appliqués',
  });
}
