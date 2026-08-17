import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.BENEVOLE_ADMIN_EMAIL || "benevole@takainside.org";
const REPLY_TO_EMAIL = process.env.BENEVOLE_REPLY_TO_EMAIL || "kwabo@takainside.org";
const SITE_NAME = "Taka Inside";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY manquante");
  return new Resend(key);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      lastName,
      firstName,
      email,
      phone,
      city,
      country,
      skills,
      otherSkill,
      availabilities,
      motivation,
    } = body;

    // Validation basique
    if (!lastName || !firstName || !email || !city || !motivation) {
      return NextResponse.json(
        { success: false, error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { success: false, error: "Veuillez sélectionner au moins une compétence." },
        { status: 400 }
      );
    }

    const hasOther = skills.includes("Autre");
    if (hasOther && (!otherSkill || typeof otherSkill !== "string" || otherSkill.trim().length < 3)) {
      return NextResponse.json(
        { success: false, error: "Veuillez préciser votre compétence dans le champ Autre." },
        { status: 400 }
      );
    }

    // Enregistrer dans Strapi
    const strapiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/benevoles`;
    const strapiToken = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    const cleanToken = strapiToken?.replace(/^"+|"+$/g, "").trim();

    const strapiPayload = {
      data: {
        nom: lastName,
        prenom: firstName,
        email,
        telephone: phone || null,
        ville: city,
        pays: country || null,
        competences: skills,
        autreCompetence: hasOther ? otherSkill.trim() : null,
        disponibilites: Array.isArray(availabilities) ? availabilities : [availabilities].filter(Boolean),
        motivations: motivation,
        statut: "recue",
      },
    };

    const strapiRes = await fetch(strapiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
      },
      body: JSON.stringify(strapiPayload),
    });

    if (!strapiRes.ok) {
      const errText = await strapiRes.text();
      console.error("[Benevole API] Strapi error:", strapiRes.status, errText);
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'enregistrement de votre candidature." },
        { status: 502 }
      );
    }

    const candidateName = `${firstName} ${lastName}`;
    const skillsLabel = skills.join(", ");
    const availabilitiesLabel = Array.isArray(availabilities) ? availabilities.join(", ") : String(availabilities || "");

    // Email au candidat
    await getResend().emails.send({
      from: `${SITE_NAME} <${ADMIN_EMAIL}>`,
      to: email,
      replyTo: REPLY_TO_EMAIL,
      subject: `${SITE_NAME} — Confirmation de votre candidature bénévole`,
      html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1a1a1a; background: #f8f8f8; padding: 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <tr><td style="background: #1a1a1a; padding: 32px; text-align: center;">
      <h1 style="color: #F4C430; margin: 0; font-size: 24px;">${SITE_NAME}</h1>
      <p style="color: #ffffff; margin: 8px 0 0; font-size: 14px;">L'Art au Service de l'Humain</p>
    </td></tr>
    <tr><td style="padding: 32px;">
      <p>Bonjour <strong>${candidateName}</strong>,</p>
      <p>Nous avons bien reçu votre candidature pour devenir bénévole chez ${SITE_NAME}. Merci pour votre engagement !</p>
      <p>Notre équipe étudie votre profil et vous recontactera dans les meilleurs délais à l'adresse <strong>${email}</strong>.</p>
      <p style="margin-top: 24px; font-size: 14px; color: #666;">Si vous avez des questions, vous pouvez répondre directement à cet email.</p>
    </td></tr>
    <tr><td style="padding: 24px 32px; background: #f8f8f8; font-size: 12px; color: #888; text-align: center;">
      © ${new Date().getFullYear()} ${SITE_NAME}. Tous droits réservés.
    </td></tr>
  </table>
</body>
</html>`,
    });

    // Email à l'admin
    await getResend().emails.send({
      from: `${SITE_NAME} <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `[Bénévole] Nouvelle candidature de ${candidateName}`,
      html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1a1a1a; background: #f8f8f8; padding: 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <tr><td style="padding: 32px;">
      <h2 style="margin-top: 0; color: #1a1a1a;">Nouvelle candidature bénévole</h2>
      <ul style="padding-left: 20px;">
        <li><strong>Nom :</strong> ${lastName}</li>
        <li><strong>Prénom :</strong> ${firstName}</li>
        <li><strong>Email :</strong> <a href="mailto:${email}">${email}</a></li>
        <li><strong>Téléphone :</strong> ${phone || "Non renseigné"}</li>
        <li><strong>Ville :</strong> ${city}</li>
        <li><strong>Pays :</strong> ${country || "Non renseigné"}</li>
        <li><strong>Compétences :</strong> ${skillsLabel}${hasOther ? ` — Autre : ${otherSkill.trim()}` : ""}</li>
        <li><strong>Disponibilités :</strong> ${availabilitiesLabel || "Non renseigné"}</li>
      </ul>
      <p style="margin-top: 16px;"><strong>Motivation :</strong></p>
      <p style="white-space: pre-wrap; background: #f8f8f8; padding: 16px; border-radius: 8px;">${motivation.replace(/</g, "&lt;")}</p>
    </td></tr>
  </table>
</body>
</html>`,
    });

    return NextResponse.json({ success: true, message: "Candidature envoyée avec succès." });
  } catch (error) {
    console.error("[Benevole API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'envoi de votre candidature." },
      { status: 500 }
    );
  }
}
