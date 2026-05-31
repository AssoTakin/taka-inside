import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, email, sujet, message } = body;

    if (!nom || !email || !sujet || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Envoyer vers Strapi (Contact / Formulaire)
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

    const res = await fetch(`${strapiUrl}/api/benevoles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN || ""}`,
      },
      body: JSON.stringify({
        data: {
          nom,
          prenom: "Contact",
          email,
          ville: "Inconnue",
          competences: sujet,
          motivations: message,
          statut: "recue",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("[Contact] Strapi fallback:", err);
    }

    // Ici tu peux ajouter Resend/SendGrid plus tard
    // const emailRes = await resend.emails.send({...})

    return NextResponse.json({ success: true, message: "Message envoyé !" });
  } catch (error) {
    console.error("[Contact] Error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
