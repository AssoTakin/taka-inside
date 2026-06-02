import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// R2 Client
const s3Client = new S3Client({
  endpoint: process.env.R2_ENDPOINT || "https://9c330323a1895c9f923862371ec9acfe.r2.cloudflarestorage.com",
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const strapiToken = process.env.STRAPI_API_TOKEN;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // 1. Vérifier le token dans Strapi
    const res = await fetch(
      `${strapiUrl}/api/commandes?filters[token_telechargement][$eq]=${token}&populate=*`,
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

    // 2. Vérifier statut payé
    if (attrs.statut !== "paye") {
      return NextResponse.json(
        { error: "Paiement non confirmé" },
        { status: 403 }
      );
    }

    // 3. Vérifier expiration
    if (attrs.date_expiration_telechargement) {
      const exp = new Date(attrs.date_expiration_telechargement);
      if (exp < new Date()) {
        return NextResponse.json(
          { error: "Lien de téléchargement expiré" },
          { status: 401 }
        );
      }
    }

    // 4. Vérifier nombre de téléchargements (max 3)
    const nbDownloads = attrs.nombre_telechargements || 0;
    if (nbDownloads >= 3) {
      return NextResponse.json(
        { error: "Nombre maximum de téléchargements atteint (3/3)" },
        { status: 401 }
      );
    }

    // 5. Identifier le produit digital
    const produits = attrs.produits || [];
    const digitalProduct = produits.find(
      (p: any) =>
        p.type === "digital" ||
        p.type_produit === "album" ||
        p.categorie === "album"
    );

    const slug = digitalProduct?.slug || "kikoko";
    const bucket = "taka-inside-digital";
    const key = `albums/${slug}.zip`;

    // 6. Générer URL signée R2 (valide 1 heure)
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 heure
    });

    // 7. Incrémenter le compteur de téléchargements
    try {
      await fetch(`${strapiUrl}/api/commandes/${commande.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}),
        },
        body: JSON.stringify({
          data: {
            nombre_telechargements: nbDownloads + 1,
          },
        }),
      });
    } catch (err) {
      console.error("[Download] Erreur update compteur:", err);
      // Non bloquant
    }

    // 8. Rediriger vers l'URL signée R2
    return NextResponse.redirect(signedUrl, 302);

  } catch (err) {
    console.error("[Download] Erreur:", err);
    return NextResponse.json(
      { error: "Lien de téléchargement invalide ou expiré" },
      { status: 401 }
    );
  }
}
