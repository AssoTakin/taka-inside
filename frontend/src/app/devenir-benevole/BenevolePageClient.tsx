"use client";

import { useState, useEffect, useRef } from "react";

function blocksToText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b: any) => b.type === "paragraph")
    .map((b: any) => b.children?.map((c: any) => c.text).join(""))
    .filter(Boolean)
    .join("\n");
}

export default function BenevolePageClient({ content }: { content: Record<string, unknown> | null }) {
  const title = String(content?.title || "Devenir Bénévole");
  const subtitle = String(content?.subtitle || "Rejoignez l'équipe Taka Inside et participez à nos projets culturels et musicaux au Bénin.");
  const body = blocksToText(content?.content);
  const formConfig = (content?.formConfig as Record<string, unknown>) || {};

  const labels = (formConfig?.labels as Record<string, string>) || {};
  const placeholders = (formConfig?.placeholders as Record<string, string>) || {};
  const requiredFields = Array.isArray(formConfig?.requiredFields)
    ? (formConfig.requiredFields as string[])
    : ["lastName", "firstName", "email", "city", "skills", "motivation"];

  const skills = Array.isArray(formConfig?.skills)
    ? (formConfig.skills as string[])
    : ["Communication", "Événementiel", "Technique", "Musique", "Design", "Traduction", "Autre"];
  const availabilities = Array.isArray(formConfig?.availabilities)
    ? (formConfig.availabilities as string[])
    : ["Week-ends", "Soirs en semaine", "Temps plein", "Selon les projets"];

  const submitButton = String(formConfig?.submitButton || "Envoyer ma candidature");
  const otherSkillLabel = String(formConfig?.otherSkillLabel || "Précisez votre compétence *");
  const otherSkillPlaceholder = String(formConfig?.otherSkillPlaceholder || "Décrivez votre compétence...");
  const successMessage = String(
    formConfig?.successMessage ||
      "Votre candidature a bien été envoyée. Un email de confirmation vous a été envoyé."
  );
  const errorMessage = String(
    formConfig?.errorMessage || "Une erreur est survenue. Veuillez réessayer."
  );

  const isRequired = (name: string) => requiredFields.includes(name);
  const req = (name: string) => (isRequired(name) ? " *" : "");

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-taka-gray-light bg-taka-light text-taka-black placeholder-taka-gray focus:outline-none focus:border-taka-green focus:ring-1 focus:ring-taka-green";

  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    skills: [] as string[],
    availabilities: [] as string[],
    motivation: "",
    otherSkill: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorDetail, setErrorDetail] = useState<string>("");
  const statusRef = useRef<HTMLDivElement>(null);

  const toggleArray = (
    key: "skills" | "availabilities",
    value: string
  ) => {
    setForm((prev) => {
      const list = prev[key];
      if (list.includes(value)) {
        return { ...prev, [key]: list.filter((v) => v !== value) };
      }
      return { ...prev, [key]: [...list, value] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorDetail("");
    try {
      const payload = {
        ...form,
        skills: form.skills.includes("Autre")
          ? [...form.skills.filter((s) => s !== "Autre"), form.otherSkill].filter(Boolean)
          : form.skills,
      };
      const response = await fetch("/api/benevole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus("error");
        setErrorDetail(data?.error || `${response.status} ${response.statusText}`);
        return;
      }
      if (data.emailErrors && data.emailErrors.length > 0) {
        // La candidature est enregistrée mais au moins un email n'a pas pu partir
        setForm({
          lastName: "",
          firstName: "",
          email: "",
          phone: "",
          city: "",
          country: "",
          skills: [],
          availabilities: [],
          motivation: "",
          otherSkill: "",
        });
        setStatus("success");
        setErrorDetail(`Notification partielle : ${data.emailErrors.join(" ; ")}`);
        return;
      }
      setForm({
        lastName: "",
        firstName: "",
        email: "",
        phone: "",
        city: "",
        country: "",
        skills: [],
        availabilities: [],
        motivation: "",
        otherSkill: "",
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorDetail(err instanceof Error ? err.message : String(err));
    }
  };

  const showOther = form.skills.includes("Autre");

  useEffect(() => {
    if ((status === "success" || status === "error") && statusRef.current) {
      const y = statusRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
  }, [status]);

  return (
    <>
      <section className="bg-taka-green text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">{subtitle}</p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-taka-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {body && (
            <div className="prose prose-lg text-taka-gray mb-8">
              {body.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}

          {status === "success" && (
            <div ref={statusRef} className="bg-taka-green/10 border border-taka-green text-taka-green px-6 py-4 rounded-xl mb-6">
              {successMessage}
              {errorDetail && (
                <p className="text-sm mt-2 opacity-80">{errorDetail}</p>
              )}
            </div>
          )}

          {status === "error" && (
            <div ref={statusRef} className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
              {errorMessage}
              {errorDetail && (
                <p className="text-sm mt-2 opacity-80">Détail : {errorDetail}</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 border border-taka-gray-light space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold mb-1">{labels.lastName || "Nom"}{req("lastName")}</label>
                <input id="lastName" name="lastName" type="text" required={isRequired("lastName")} value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} className={inputClass} placeholder={placeholders.lastName || "Votre nom"} />
              </div>
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold mb-1">{labels.firstName || "Prénom"}{req("firstName")}</label>
                <input id="firstName" name="firstName" type="text" required={isRequired("firstName")} value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} className={inputClass} placeholder={placeholders.firstName || "Votre prénom"} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-semibold mb-1">{labels.email || "Email"}{req("email")}</label>
                <input id="email" name="email" type="email" required={isRequired("email")} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className={inputClass} placeholder={placeholders.email || "votre@email.com"} />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold mb-1">{labels.phone || "Téléphone"}{req("phone")}</label>
                <input id="phone" name="phone" type="tel" required={isRequired("phone")} value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className={inputClass} placeholder={placeholders.phone || "+229 ..."} />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-semibold mb-1">{labels.city || "Ville"}{req("city")}</label>
                <input id="city" name="city" type="text" required={isRequired("city")} value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} className={inputClass} placeholder={placeholders.city || "Cotonou, Porto-Novo..."} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="country" className="block text-sm font-semibold mb-1">{labels.country || "Pays"}{req("country")}</label>
                <input id="country" name="country" type="text" required={isRequired("country")} value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} className={inputClass} placeholder={placeholders.country || "Bénin, France..."} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">{labels.skills || "Compétences"}{req("skills")}</label>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    aria-pressed={form.skills.includes(skill)}
                    onClick={() => toggleArray("skills", skill)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                      form.skills.includes(skill)
                        ? "bg-taka-green text-white border-taka-green"
                        : "border-taka-gray-light hover:border-taka-green hover:text-taka-green"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {showOther && (
              <div>
                <label htmlFor="otherSkill" className="block text-sm font-semibold mb-1">{otherSkillLabel}</label>
                <input id="otherSkill" name="otherSkill" type="text" required={showOther} value={form.otherSkill} onChange={(e) => setForm((p) => ({ ...p, otherSkill: e.target.value }))} className={inputClass} placeholder={otherSkillPlaceholder} />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">{labels.availabilities || "Disponibilité"}{req("availabilities")}</label>
              <div className="flex flex-wrap gap-2">
                {availabilities.map((a) => (
                  <button
                    key={a}
                    type="button"
                    aria-pressed={form.availabilities.includes(a)}
                    onClick={() => toggleArray("availabilities", a)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                      form.availabilities.includes(a)
                        ? "bg-taka-green text-white border-taka-green"
                        : "border-taka-gray-light hover:border-taka-green hover:text-taka-green"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="motivation" className="block text-sm font-semibold mb-1">{labels.motivation || "Motivation"}{req("motivation")}</label>
              <textarea id="motivation" name="motivation" rows={4} required={isRequired("motivation")} value={form.motivation} onChange={(e) => setForm((p) => ({ ...p, motivation: e.target.value }))} className={`${inputClass} resize-none`} placeholder={placeholders.motivation || "Pourquoi souhaitez-vous rejoindre Taka Inside ?"} />
            </div>

            <button type="submit" disabled={status === "submitting"} className="w-full bg-taka-green text-white font-semibold py-4 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-60">
              {status === "submitting" ? "Envoi en cours…" : submitButton}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
