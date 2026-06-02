import { NextRequest, NextResponse } from "next/server";

// URL R2 des albums digitaux
const DIGITAL_URLS: Record<string, string> = {
  kikoko: "https://9c330323a1895c9f923862371ec9acfe.r2.cloudflarestorage.com/taka-inside-digital/albums/kikoko.zip",
};

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const strapiToken = process.env.STRAPI_API_TOKEN;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Vérifier le token dans Strapi
    const res = await fetch(
      `${strapiUrl}/api/commandes?filters[token_telechargement][$eq]=${token}&populate=produits`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}),
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    const data = await res.json();
    const commande = data.data?.[0];

    if (!commande) {
      return NextResponse.json(
        { error: "Lien de téléchargement invalide ou expiré" },
        { status: 401 }
      );
    }

    const attrs = commande.attributes || commande;

    // Vérifier expiration
    if (attrs.date_expiration_telechargement) {
      const exp = new Date(attrs.date_expiration_telechargement);
      if (exp < new Date()) {
        return NextResponse.json(
          { error: "Lien de téléchargement expiré" },
          { status: 401 }
        );
      }
    }

    // Vérifier nombre de téléchargements (max 3)
    if (attrs.nombre_telechargements >= 3) {
      return NextResponse.json(
        { error: "Nombre maximum de téléchargements atteint" },
        { status: 401 }
      );
    }

    // Déterminer le produit digital
    const produits = attrs.produits || [];
    const digitalProduct = produits.find(
      (p: any) =>
        p.type === "digital" ||
        p.type_produit === "album" ||
        p.categorie === "album"
    );

    const slug = digitalProduct?.slug || "kikoko";
    const url = DIGITAL_URLS[slug];

    if (!url) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    // Incrémenter le compteur de téléchargements
    await fetch(`${strapiUrl}/api/commandes/${commande.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}),
      },
      body: JSON.stringify({
        data: {
          nombre_telechargements: (attrs.nombre_telechargements || 0) + 1,
        },
      }),
    });

    // Rediriger vers l'URL R2
    return NextResponse.redirect(url, 302);

  } catch (err) {
    console.error("[Download] Erreur:", err);
    return NextResponse.json(
      { error: "Lien de téléchargement invalide ou expiré" },
      { status: 401 }
    );
  }
}
