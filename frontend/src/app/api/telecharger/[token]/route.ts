import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// R2 Client
const s3Client = new S3Client({
  endpoint: process.env.R2_ENDPOINT || "https://9c330323a1895c9f923862371ec9acfe.r2.cloudflarestorage.com",
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
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
      (p: Record<string, unknown>) =>
        p.type === "digital" ||
        p.type_produit === "album" ||
        p.categorie === "album"
    );

    const slug = digitalProduct?.slug || "kikoko";
    const bucket = "taka-inside-digital";
    const key = `albums/${slug}.zip`;

    // 6. Télécharger le fichier depuis R2
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const s3Response = await s3Client.send(command);

    if (!s3Response.Body) {
      return NextResponse.json(
        { error: "Fichier non trouvé" },
        { status: 404 }
      );
    }

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

    // 8. Streamer le fichier au client
    const contentType = s3Response.ContentType || "application/zip";
    const contentLength = s3Response.ContentLength;
    const fileName = `${slug.toUpperCase()}_Album.zip`;

    // Convertir le stream en Response
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `attachment; filename="${fileName}"`);
    if (contentLength) {
      headers.set("Content-Length", contentLength.toString());
    }

    return new Response(s3Response.Body as ReadableStream, {
      status: 200,
      headers,
    });

  } catch (err) {
    console.error("[Download] Erreur:", err);
    return NextResponse.json(
      { error: "Lien de téléchargement invalide ou expiré" },
      { status: 401 }
    );
  }
}
