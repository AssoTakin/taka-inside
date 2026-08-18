import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = process.env.BENEVOLE_ADMIN_EMAIL || "benevole@takainside.org";
const REPLY_TO_EMAIL = process.env.BENEVOLE_REPLY_TO_EMAIL || "kwabo@takainside.org";
const SITE_NAME = "Taka Inside";

interface EmailTemplateConfig {
  fromName?: string;
  fromEmail?: string;
  candidateSubject?: string;
  candidateBody?: string;
  candidateBodyHtml?: string;
  adminSubject?: string;
  adminBody?: string;
  adminBodyHtml?: string;
}

interface FormConfig extends EmailTemplateConfig {
  labels?: Record<string, string>;
  placeholders?: Record<string, string>;
  requiredFields?: string[];
  skills?: string[];
  availabilities?: string[];
  submitButton?: string;
  otherSkillLabel?: string;
  otherSkillPlaceholder?: string;
  successMessage?: string;
  errorMessage?: string;
}

function interpolateTemplate(template: string, values: Record<string, string | undefined>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => (values[key] ?? ""));
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY manquante");
  return new Resend(key);
}

async function fetchPageContent(slug: string): Promise<Record<string, unknown> | null> {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const token = process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
  const cleanToken = token?.replace(/^"+|"+$/g, "").trim();
  if (!apiUrl) return null;

  try {
    const res = await fetch(`${apiUrl}/api/page-contents?filters[slug][$eq]=${encodeURIComponent(slug)}&status=published`, {
      headers: {
        ...(cleanToken ? { Authorization: `Bearer ${cleanToken}` } : {}),
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const data = Array.isArray(json.data) ? json.data[0] : json.data;
    return data || null;
  } catch (e) {
    console.error("[Benevole API] Failed to fetch page content:", e);
    return null;
  }
}

function extractFormConfig(page: Record<string, unknown> | null): FormConfig {
  const raw = page?.formConfig;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return raw as FormConfig;
  }
  return {};
}

function defaultEmailWrapper(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1a1a1a; background: #f8f8f8; padding: 24px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
    <tr><td style="background: #1a1a1a; padding: 32px; text-align: center;">
      <h1 style="color: #F4C430; margin: 0; font-size: 24px;">${SITE_NAME}</h1>
      <p style="color: #ffffff; margin: 8px 0 0; font-size: 14px;">L'Art au Service de l'Humain</p>
    </td></tr>
    <tr><td style="padding: 32px;">
      ${title ? `<h2 style="margin-top: 0; color: #1a1a1a;">${title}</h2>` : ""}
      ${bodyHtml}
    </td></tr>
    <tr><td style="padding: 24px 32px; background: #f8f8f8; font-size: 12px; color: #888; text-align: center;">
      © ${new Date().getFullYear()} ${SITE_NAME}. Tous droits réservés.
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  const emailErrors: string[] = [];

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

    // Récupérer les templates configurables dans Strapi
    const pageContent = await fetchPageContent("devenir-benevole");
    const cfg = extractFormConfig(pageContent);

    const fromName = cfg.fromName || SITE_NAME;
    const fromEmail = cfg.fromEmail || ADMIN_EMAIL;
    const from = `${fromName} <${fromEmail}>`;

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

    const templateValues: Record<string, string | undefined> = {
      candidateName,
      firstName,
      lastName,
      email,
      phone: phone || "Non renseigné",
      city,
      country: country || "Non renseigné",
      skills: skillsLabel,
      availabilities: availabilitiesLabel || "Non renseigné",
      motivation,
      otherSkill: hasOther ? otherSkill.trim() : "",
      siteName: SITE_NAME,
      replyTo: REPLY_TO_EMAIL,
    };

    // Email au candidat
    try {
      const candidateSubject = cfg.candidateSubject || `${SITE_NAME} — Confirmation de votre candidature bénévole`;
      let candidateHtml = cfg.candidateBodyHtml || (cfg.candidateBody
        ? `<p>${interpolateTemplate(cfg.candidateBody, templateValues).replace(/\n/g, "</p><p>")}</p>`
        : "");
      if (!candidateHtml) {
        candidateHtml = `<p>Bonjour <strong>{{candidateName}}</strong>,</p>
<p>Nous avons bien reçu votre candidature pour devenir bénévole chez {{siteName}}. Merci pour votre engagement !</p>
<p>Notre équipe étudie votre profil et vous recontactera dans les meilleurs délais à l'adresse <strong>{{email}}</strong>.</p>
<p style="margin-top: 24px; font-size: 14px; color: #666;">Si vous avez des questions, vous pouvez répondre directement à cet email.</p>`;
      }
      candidateHtml = interpolateTemplate(candidateHtml, templateValues);

      const res = await getResend().emails.send({
        from,
        to: email,
        replyTo: REPLY_TO_EMAIL,
        subject: interpolateTemplate(candidateSubject, templateValues),
        html: defaultEmailWrapper("", candidateHtml),
      });
      console.log("[Benevole API] Candidate email sent:", res.data?.id || res);
    } catch (emailErr: any) {
      console.error("[Benevole API] Candidate email error:", emailErr);
      emailErrors.push(`candidat: ${emailErr.message || String(emailErr)}`);
    }

    // Email à l'admin
    try {
      const adminSubject = cfg.adminSubject || `[Bénévole] Nouvelle candidature de {{candidateName}}`;
      let adminHtml = cfg.adminBodyHtml || (cfg.adminBody
        ? `<p>${interpolateTemplate(cfg.adminBody, templateValues).replace(/\n/g, "</p><p>")}</p>`
        : "");
      if (!adminHtml) {
        adminHtml = `<h2 style="margin-top: 0; color: #1a1a1a;">Nouvelle candidature bénévole</h2>
<ul style="padding-left: 20px;">
  <li><strong>Nom :</strong> {{lastName}}</li>
  <li><strong>Prénom :</strong> {{firstName}}</li>
  <li><strong>Email :</strong> <a href="mailto:{{email}}">{{email}}</a></li>
  <li><strong>Téléphone :</strong> {{phone}}</li>
  <li><strong>Ville :</strong> {{city}}</li>
  <li><strong>Pays :</strong> {{country}}</li>
  <li><strong>Compétences :</strong> {{skills}}${hasOther ? " — Autre : {{otherSkill}}" : ""}</li>
  <li><strong>Disponibilités :</strong> {{availabilities}}</li>
</ul>
<p style="margin-top: 16px;"><strong>Motivation :</strong></p>
<p style="white-space: pre-wrap; background: #f8f8f8; padding: 16px; border-radius: 8px;">{{motivation}}</p>`;
      }
      adminHtml = interpolateTemplate(adminHtml, templateValues);

      const adminSubjectInterpolated = interpolateTemplate(adminSubject, templateValues);
      const adminTitle = `Nouvelle candidature bénévole — ${candidateName}`;

      const res = await getResend().emails.send({
        from,
        to: ADMIN_EMAIL,
        replyTo: email,
        subject: adminSubjectInterpolated,
        html: defaultEmailWrapper(adminTitle, adminHtml),
      });
      console.log("[Benevole API] Admin email sent:", res.data?.id || res);
    } catch (emailErr: any) {
      console.error("[Benevole API] Admin email error:", emailErr);
      emailErrors.push(`admin: ${emailErr.message || String(emailErr)}`);
    }

    return NextResponse.json({
      success: true,
      message: "Candidature envoyée avec succès.",
      emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
    });
  } catch (error: any) {
    console.error("[Benevole API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'envoi de votre candidature.", detail: error.message },
      { status: 500 }
    );
  }
}
