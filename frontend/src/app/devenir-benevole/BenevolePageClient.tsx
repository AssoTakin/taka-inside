"use client";

import { useState } from "react";

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
  const successMessage = String(formConfig?.successMessage || "Votre candidature a bien été envoyée. Un email de confirmation vous a été envoyé.");
  const errorMessage = String(formConfig?.errorMessage || "Une erreur est survenue. Veuillez réessayer.");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusText, setStatusText] = useState(errorMessage);
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    skills: [] as string[],
    otherSkill: "",
    availabilities: [] as string[],
    motivation: "",
  });

  const isRequired = (name: string) => requiredFields.includes(name);
  const req = (name: string) => (isRequired(name) ? " *" : "");
  const hasOther = form.skills.includes("Autre");

  const toggleSkill = (skill: string) => {
    setForm((prev) => {
      const exists = prev.skills.includes(skill);
      const next = exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill];
      return { ...prev, skills: next, otherSkill: skill === "Autre" && exists ? "" : prev.otherSkill };
    });
  };

  const toggleAvailability = (a: string) => {
    setForm((prev) => {
      const exists = prev.availabilities.includes(a);
      const next = exists ? prev.availabilities.filter((x) => x !== a) : [...prev.availabilities, a];
      return { ...prev, availabilities: next };
    });
  };

  const validate = () => {
    const errors: string[] = [];
    if (isRequired("lastName") && !form.lastName.trim()) errors.push("Le nom est requis.");
    if (isRequired("firstName") && !form.firstName.trim()) errors.push("Le prénom est requis.");
    if (isRequired("email") && !form.email.trim()) errors.push("L'email est requis.");
    else if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.push("Email invalide.");
    if (isRequired("city") && !form.city.trim()) errors.push("La ville est requise.");
    if (isRequired("skills") && form.skills.length === 0) errors.push("Sélectionnez au moins une compétence.");
    if (hasOther && !form.otherSkill.trim()) errors.push("Précisez votre compétence.");
    if (isRequired("motivation") && !form.motivation.trim()) errors.push("La motivation est requise.");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (errors.length > 0) {
      setStatusText(errors.join(" "));
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/benevole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus("success");
        setForm({ lastName: "", firstName: "", email: "", phone: "", city: "", country: "", skills: [], otherSkill: "", availabilities: [], motivation: "" });
      } else {
        setStatusText(json.error || errorMessage);
        setStatus("error");
      }
    } catch {
      setStatusText(errorMessage);
      setStatus("error");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all";

  return (
    <>
      <section className="bg-taka-green text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-5xl font-bold">{title}</h1>
          <p className="mt-4 max-w-xl opacity-90">{subtitle}</p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {body && <p className="text-taka-gray text-lg mb-8">{body}</p>}

          {status === "success" && (
            <div className="mb-8 bg-taka-green/10 border border-taka-green/30 text-taka-green-dark rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-medium">{successMessage}</p>
            </div>
          )}
          {status === "error" && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="font-medium">{statusText || errorMessage}</p>
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
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1">{labels.email || "Email"}{req("email")}</label>
              <input id="email" name="email" type="email" required={isRequired("email")} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className={inputClass} placeholder={placeholders.email || "votre@email.com"} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold mb-1">{labels.phone || "Téléphone"}</label>
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className={inputClass} placeholder={placeholders.phone || "+229 ..."} />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-semibold mb-1">{labels.city || "Ville"}{req("city")}</label>
                <input id="city" name="city" type="text" required={isRequired("city")} value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} className={inputClass} placeholder={placeholders.city || "Cotonou, Porto-Novo..."} />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-semibold mb-1">{labels.country || "Pays"}</label>
              <input id="country" name="country" type="text" value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} className={inputClass} placeholder={placeholders.country || "Bénin, France..."} />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">{labels.skills || "Compétences"}{req("skills")}</label>
              <div className="flex flex-wrap gap-2">
                {skills.map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => toggleSkill(comp)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all ${form.skills.includes(comp) ? "bg-taka-green text-white border-taka-green" : "border-taka-gray-light hover:border-taka-green hover:text-taka-green"}`}
                    aria-pressed={form.skills.includes(comp)}
                  >
                    {comp}
                  </button>
                ))}
              </div>
              {hasOther && (
                <div className="mt-3">
                  <label htmlFor="otherSkill" className="block text-sm font-semibold mb-1">{otherSkillLabel}</label>
                  <input id="otherSkill" name="otherSkill" type="text" required value={form.otherSkill} onChange={(e) => setForm((p) => ({ ...p, otherSkill: e.target.value }))} className={inputClass} placeholder={otherSkillPlaceholder} />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">{labels.availabilities || "Disponibilité"}{req("availabilities")}</label>
              <div className="flex flex-wrap gap-2">
                {availabilities.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAvailability(a)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all ${form.availabilities.includes(a) ? "bg-taka-yellow text-taka-black border-taka-yellow" : "border-taka-gray-light hover:border-taka-yellow hover:text-taka-yellow"}`}
                    aria-pressed={form.availabilities.includes(a)}
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

            <button type="submit" disabled={status === "loading"} className="w-full bg-taka-green text-white font-semibold py-4 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-60">
              {status === "loading" ? "Envoi en cours…" : submitButton}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
