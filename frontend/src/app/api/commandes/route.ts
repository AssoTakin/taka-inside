import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nomClient,
      email,
      telephone,
      adresse,
      ville,
      code_postal,
      pays,
      type_livraison,
      cout_livraison,
      produits,
      total,
      montant_paye,
      methode_paiement,
      transaction_id,
      statut,
    } = body;

    // Validation minimale
    if (!nomClient || !email || !produits || !total) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Générer token téléchargement si commande numérique
    let token_telechargement = null;
    let date_expiration_telechargement = null;
    const hasDigital = produits.some((p: { productType?: string }) => p.productType === 'digital' || p.productType === 'album' || p.productType === 'single');
    
    if (hasDigital) {
      token_telechargement = crypto.randomUUID();
      const exp = new Date();
      exp.setDate(exp.getDate() + 7); // 7 jours
      date_expiration_telechargement = exp.toISOString();
    }

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const strapiToken = process.env.STRAPI_API_TOKEN;

    const payload = {
      data: {
        nomClient,
        email,
        telephone: telephone || '',
        adresse: adresse || '',
        ville: ville || '',
        code_postal: code_postal || '',
        pays: pays || 'Benin',
        type_livraison: type_livraison || 'physique',
        cout_livraison: Number(cout_livraison) || 0,
        produits,
        total: Number(total),
        montant_paye: Number(montant_paye) || Number(total),
        methode_paiement: methode_paiement || 'stripe',
        transaction_id: transaction_id || '',
        statut: statut || 'en_attente',
        token_telechargement,
        date_expiration_telechargement,
        nombre_telechargements: 0,
      }
    };

    const res = await fetch(`${strapiUrl}/api/commandes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(strapiToken ? { 'Authorization': `Bearer ${strapiToken}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[Commande] Strapi error:', err);
      return NextResponse.json(
        { error: err.error?.message || 'Erreur création commande' },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ 
      success: true, 
      commande: data.data,
      token_telechargement,
      date_expiration_telechargement,
    });

  } catch (err: unknown) {
    console.error('[Commande] Error:', err);
    return NextResponse.json(
      { error: (err instanceof Error ? err.message : 'Erreur serveur') },
      { status: 500 }
    );
  }
}
