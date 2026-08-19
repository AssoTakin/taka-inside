import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

const DESTINATION_EMAIL = process.env.CONTACT_DESTINATION_EMAIL || "kwabo@takainside.org";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Taka Inside <contact@takainside.org>";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nom, name, email, sujet, subject, message } = body;

    const finalNom = String(nom || name || "").trim();
    const finalEmail = String(email || "").trim();
    const finalSujet = String(sujet || subject || "").trim();
    const finalMessage = String(message || "").trim();

    if (!finalNom || !finalEmail || !finalSujet || !finalMessage) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(finalEmail)) {
      return NextResponse.json(
        { error: "Adresse email invalide" },
        { status: 400 }
      );
    }

    let emailSent = false;
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: DESTINATION_EMAIL,
          replyTo: finalEmail,
          subject: "[Contact Taka Inside] " + finalSujet + " - " + finalNom,
          html: buildEmailHtml(finalNom, finalEmail, finalSujet, finalMessage),
        });
        emailSent = true;
      } catch (emailErr) {
        console.error("[Contact] Resend error:", emailErr);
      }
    }

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
    try {
      const token = process.env.STRAPI_API_TOKEN || "";
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers.Authorization = "Bearer " + token;

      const res = await fetch(strapiUrl + "/api/message-contacts", {
        method: "POST",
        headers,
        body: JSON.stringify({
          data: {
            nom: finalNom,
            email: finalEmail,
            sujet: finalSujet,
            message: finalMessage,
            statut: "recu",
          },
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.warn("[Contact] Strapi archive warning:", err);
      }
    } catch (strapiErr) {
      console.warn("[Contact] Strapi unreachable:", strapiErr);
    }

    if (!emailSent) {
      return NextResponse.json(
        { error: "L'envoi de l'email a echoue. Veuillez reessayer plus tard." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "Message envoye !" });
  } catch (error) {
    console.error("[Contact] Error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

function buildEmailHtml(nom: string, email: string, sujet: string, message: string): string {
  return [
    "<h2>Nouveau message via le formulaire de contact</h2>",
    "<p><strong>Nom :</strong> " + escapeHtml(nom) + "</p>",
    '<p><strong>Email :</strong> <a href="mailto:' + escapeHtml(email) + '">' + escapeHtml(email) + "</a></p>",
    "<p><strong>Sujet :</strong> " + escapeHtml(sujet) + "</p>",
    "<hr />",
    '<pre style="white-space:pre-wrap;font-family:sans-serif">' + escapeHtml(message) + "</pre>",
  ].join("");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
