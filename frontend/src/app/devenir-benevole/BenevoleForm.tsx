"use client";

import { useState, useMemo } from "react";
import SiteLayout from "@/components/layout/SiteLayout";

function blocksToText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b: any) => b.type === "paragraph")
    .map((b: any) => b.children?.map((c: any) => c.text).join(""))
    .filter(Boolean)
    .join("\n");
}

interface BenevoleFormProps {
  content: Record<string, unknown> | null;
}

export default function BenevoleForm({ content }: BenevoleFormProps) {
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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isRequired = (name: string) => requiredFields.includes(name);

  const hasOther = useMemo(() => form.skills.includes("Autre"), [form.skills]);

  const toggleSkill = (skill: string) => {
    setForm((prev) => {
      const exists = prev.skills.includes(skill);
      const next = exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill];
      return { ...prev, skills: next };
    });
    setFieldErrors((prev) => ({ ...prev, skills: "" }));
  };

  const toggleAvailability = (a: string) => {
    setForm((prev) => {
      const exists = prev.availabilities.includes(a);
      const next = exists ? prev.availabilities.filter((x) => x !== a) : [...prev.availabilities, a];
      return { ...prev, availabilities: next };
    });
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (isRequired("lastName") && !form.lastName.trim()) errors.lastName = "Le nom est requis.";
    if (isRequired("firstName") && !form.firstName.trim()) errors.firstName = "Le prénom est requis.";
    if (isRequired("email") && !form.email.trim()) errors.email = "L'email est requis.";
    else if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Email invalide.";
    if (isRequired("city") && !form.city.trim()) errors.city = "La ville est requise.";
    if (isRequired("skills")) {
      if (form.skills.length === 0) errors.skills = "Sélectionnez au moins une compétence.";
      else if (hasOther && !form.otherSkill.trim()) errors.otherSkill = "Précisez votre compétence.";
    }
    if (isRequired("motivation") && !form.motivation.trim()) errors.motivation = "La motivation est requise.";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/benevole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setForm({
          lastName: "",
          firstName: "",
          email: "",
          phone: "",
          city: "",
          country: "",
          skills: [],
          otherSkill: "",
          availabilities: [],
          motivation: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputClass = (error?: string) =>
    `w-full px-4 py-3 rounded-xl border outline-none transition-all ${
      error
        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
        : "border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20"
    }`;

  const skillBtnClass = (selected: boolean) =>
    `px-4 py-2 rounded-lg border text-sm transition-all ${
      selected
        ? "bg-taka-green text-white border-taka-green"
        : "border-taka-gray-light hover:border-taka-green hover:text-taka-green"
    }`;

  const availBtnClass = (selected: boolean) =>
    `px-4 py-2 rounded-lg border text-sm transition-all ${
      selected
        ? "bg-taka-yellow text-taka-black border-taka-yellow"
        : "border-taka-gray-light hover:border-taka-yellow hover:text-taka-yellow"
    }`;

  return (
    <SiteLayout>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              <p>{successMessage}</p>
            </div>
          )}
          {status === "error" && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 border border-taka-gray-light space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {labels.lastName || "Nom"} {isRequired("lastName") && "*"}
                </label>
                <input
                  type="text"
                  required={isRequired("lastName")}
                  value={form.lastName}
                  onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                  className={inputClass(fieldErrors.lastName)}
                  placeholder={placeholders.lastName || "Votre nom"}
                />
                {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {labels.firstName || "Prénom"} {isRequired("firstName") && "*"}
                </label>
                <input
                  type="text"
                  required={isRequired("firstName")}
                  value={form.firstName}
                  onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                  className={inputClass(fieldErrors.firstName)}
                  placeholder={placeholders.firstName || "Votre prénom"}
                />
                {fieldErrors.firstName && <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                {labels.email || "Email"} {isRequired("email") && "*"}
              </label>
              <input
                type="email"
                required={isRequired("email")}
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className={inputClass(fieldErrors.email)}
                placeholder={placeholders.email || "votre@email.com"}
              />
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {labels.phone || "Téléphone"}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  className={inputClass()}
                  placeholder={placeholders.phone || "+229 ..."}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {labels.city || "Ville"} {isRequired("city") && "*"}
                </label>
                <input
                  type="text"
                  required={isRequired("city")}
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                  className={inputClass(fieldErrors.city)}
                  placeholder={placeholders.city || "Cotonou, Porto-Novo..."}
                />
                {fieldErrors.city && <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                {labels.country || "Pays"}
              </label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                className={inputClass()}
                placeholder={placeholders.country || "Bénin, France..."}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {labels.skills || "Compétences"} {isRequired("skills") && "*"}
              </label>
              <div className="flex flex-wrap gap-2">
                {skills.map((comp) => (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => toggleSkill(comp)}
                    className={skillBtnClass(form.skills.includes(comp))}
                  >
                    {comp}
                  </button>
                ))}
              </div>
              {fieldErrors.skills && <p className="text-red-500 text-xs mt-2">{fieldErrors.skills}</p>}

              {hasOther && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold mb-1">{otherSkillLabel}</label>
                  <input
                    type="text"
                    required
                    value={form.otherSkill}
                    onChange={(e) => setForm((p) => ({ ...p, otherSkill: e.target.value }))}
                    className={inputClass(fieldErrors.otherSkill)}
                    placeholder={otherSkillPlaceholder}
                  />
                  {fieldErrors.otherSkill && <p className="text-red-500 text-xs mt-1">{fieldErrors.otherSkill}</p>}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {labels.availabilities || "Disponibilité"} {isRequired("availabilities") && "*"}
              </label>
              <div className="flex flex-wrap gap-2">
                {availabilities.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAvailability(a)}
                    className={availBtnClass(form.availabilities.includes(a))}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                {labels.motivation || "Motivation"} {isRequired("motivation") && "*"}
              </label>
              <textarea
                required={isRequired("motivation")}
                rows={4}
                value={form.motivation}
                onChange={(e) => setForm((p) => ({ ...p, motivation: e.target.value }))}
                className={`${inputClass(fieldErrors.motivation)} resize-none`}
                placeholder={placeholders.motivation || "Pourquoi souhaitez-vous rejoindre Taka Inside ?"}
              />
              {fieldErrors.motivation && <p className="text-red-500 text-xs mt-1">{fieldErrors.motivation}</p>}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-taka-green text-white font-semibold py-4 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {status === "loading" ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  {submitButton}
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
