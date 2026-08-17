"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";

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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusText, setStatusText] = useState(errorMessage);
  const [showOther, setShowOther] = useState(false);
  const { itemCount, setIsOpen } = useCart();
  const formRef = useRef<HTMLFormElement>(null);

  const menuItems = [
    { label: "Accueil", link: "/" },
    { label: "Projets", link: "/projets" },
    { label: "Label Musical", link: "/label-musical" },
    { label: "Boutique", link: "/boutique" },
    { label: "Association", link: "/association" },
  ];

  const isRequired = (name: string) => requiredFields.includes(name);
  const req = (name: string) => (isRequired(name) ? " *" : "");

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const otherInput = document.getElementById("otherSkill") as HTMLInputElement | null;

    const handleSkillChange = () => {
      const isOther = !!form.querySelector('input[name="skills"][value="Autre"]:checked');
      setShowOther(isOther);
      if (otherInput) {
        if (isOther) otherInput.setAttribute("required", "required");
        else {
          otherInput.removeAttribute("required");
          otherInput.value = "";
        }
      }
    };

    const skillBoxes = form.querySelectorAll('input[name="skills"]');
    skillBoxes.forEach((cb) => cb.addEventListener("change", handleSkillChange));

    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      setStatus("loading");

      const getValue = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.value?.trim() || "";
      const data = {
        lastName: getValue("lastName"),
        firstName: getValue("firstName"),
        email: getValue("email"),
        phone: getValue("phone"),
        city: getValue("city"),
        country: getValue("country"),
        skills: Array.from(form.querySelectorAll('input[name="skills"]:checked')).map((cb) => (cb as HTMLInputElement).value),
        otherSkill: getValue("otherSkill"),
        availabilities: Array.from(form.querySelectorAll('input[name="availabilities"]:checked')).map((cb) => (cb as HTMLInputElement).value),
        motivation: getValue("motivation"),
      };

      const errors: string[] = [];
      if (isRequired("lastName") && !data.lastName) errors.push("Le nom est requis.");
      if (isRequired("firstName") && !data.firstName) errors.push("Le prénom est requis.");
      if (isRequired("email") && !data.email) errors.push("L'email est requis.");
      else if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push("Email invalide.");
      if (isRequired("city") && !data.city) errors.push("La ville est requise.");
      if (isRequired("skills") && data.skills.length === 0) errors.push("Sélectionnez au moins une compétence.");
      if (data.skills.includes("Autre") && !data.otherSkill) errors.push("Précisez votre compétence.");
      if (isRequired("motivation") && !data.motivation) errors.push("La motivation est requise.");

      if (errors.length > 0) {
        setStatusText(errors.join(" "));
        setStatus("error");
        return;
      }

      try {
        const res = await fetch("/api/benevole", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          setStatus("success");
          form.reset();
          setShowOther(false);
          if (otherInput) {
            otherInput.removeAttribute("required");
            otherInput.value = "";
          }
        } else {
          setStatusText(errorMessage);
          setStatus("error");
        }
      } catch {
        setStatusText(errorMessage);
        setStatus("error");
      }
    };

    form.addEventListener("submit", handleSubmit);

    return () => {
      form.removeEventListener("submit", handleSubmit);
      skillBoxes.forEach((cb) => cb.removeEventListener("change", handleSkillChange));
    };
  }, [errorMessage]);

  return (
    <div className="font-body bg-taka-cream text-taka-black antialiased">
      <header className="sticky top-0 z-50 bg-taka-black text-white">
        <div className="rasta-line h-1" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image src="https://taka-inside-production.up.railway.app/uploads/logo_taka_inside_6e02afd598.jpg" alt="Taka Inside" width={48} height={48} className="h-12 w-auto object-contain" unoptimized priority loading="eager" />
              <span className="font-display font-bold text-xl tracking-tight">Taka Inside</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-8">
              {menuItems.map((item) => (
                <Link key={item.link} href={item.link} className="text-sm font-medium text-taka-gray hover:text-white transition-colors">{item.label}</Link>
              ))}
              <Link href="/faire-un-don" className="text-sm font-medium bg-taka-yellow text-taka-black px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all">Faire un Don</Link>
              <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label={`Panier (${itemCount} articles)`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className={`absolute -top-1 -right-1 bg-taka-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transition-opacity ${itemCount > 0 ? 'opacity-100' : 'opacity-0'}`}>{itemCount > 99 ? '99+' : itemCount}</span>
              </button>
            </nav>
            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label={`Panier (${itemCount} articles)`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Menu" aria-expanded={mobileOpen}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden bg-taka-black border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <Link key={item.link} href={item.link} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-taka-gray hover:text-white py-2">{item.label}</Link>
              ))}
              <Link href="/faire-un-don" onClick={() => setMobileOpen(false)} className="block text-sm font-medium bg-taka-yellow text-taka-black px-4 py-2 rounded-lg text-center">Faire un Don</Link>
            </div>
          </div>
        )}
      </header>

      <main className="min-h-screen">
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

            <form ref={formRef} id="benevole-form" className="bg-white rounded-2xl p-6 md:p-8 border border-taka-gray-light space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold mb-1">{labels.lastName || "Nom"}{req("lastName")}</label>
                  <input id="lastName" name="lastName" type="text" required={isRequired("lastName")} className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={placeholders.lastName || "Votre nom"} />
                </div>
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold mb-1">{labels.firstName || "Prénom"}{req("firstName")}</label>
                  <input id="firstName" name="firstName" type="text" required={isRequired("firstName")} className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={placeholders.firstName || "Votre prénom"} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-1">{labels.email || "Email"}{req("email")}</label>
                <input id="email" name="email" type="email" required={isRequired("email")} className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={placeholders.email || "votre@email.com"} />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-1">{labels.phone || "Téléphone"}</label>
                  <input id="phone" name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={placeholders.phone || "+229 ..."} />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold mb-1">{labels.city || "Ville"}{req("city")}</label>
                  <input id="city" name="city" type="text" required={isRequired("city")} className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={placeholders.city || "Cotonou, Porto-Novo..."} />
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-semibold mb-1">{labels.country || "Pays"}</label>
                <input id="country" name="country" type="text" className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={placeholders.country || "Bénin, France..."} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">{labels.skills || "Compétences"}{req("skills")}</label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((comp) => (
                    <label key={comp} className="cursor-pointer">
                      <input type="checkbox" name="skills" value={comp} className="peer sr-only" />
                      <span className="px-4 py-2 rounded-lg border text-sm transition-all border-taka-gray-light hover:border-taka-green hover:text-taka-green peer-checked:bg-taka-green peer-checked:text-white peer-checked:border-taka-green inline-block">{comp}</span>
                    </label>
                  ))}
                </div>
                {showOther && (
                  <div className="mt-3">
                    <label htmlFor="otherSkill" className="block text-sm font-semibold mb-1">{otherSkillLabel}</label>
                    <input id="otherSkill" name="otherSkill" type="text" required className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={otherSkillPlaceholder} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">{labels.availabilities || "Disponibilité"}{req("availabilities")}</label>
                <div className="flex flex-wrap gap-2">
                  {availabilities.map((a) => (
                    <label key={a} className="cursor-pointer">
                      <input type="checkbox" name="availabilities" value={a} className="peer sr-only" />
                      <span className="px-4 py-2 rounded-lg border text-sm transition-all border-taka-gray-light hover:border-taka-yellow hover:text-taka-yellow peer-checked:bg-taka-yellow peer-checked:text-taka-black peer-checked:border-taka-yellow inline-block">{a}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="motivation" className="block text-sm font-semibold mb-1">{labels.motivation || "Motivation"}{req("motivation")}</label>
                <textarea id="motivation" name="motivation" rows={4} required={isRequired("motivation")} className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all resize-none" placeholder={placeholders.motivation || "Pourquoi souhaitez-vous rejoindre Taka Inside ?"} />
              </div>

              <button type="submit" disabled={status === "loading"} className="w-full bg-taka-green text-white font-semibold py-4 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-60">
                {status === "loading" ? "Envoi en cours…" : submitButton}
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-taka-black text-white">
        <div className="rasta-line h-1" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Image src="https://taka-inside-production.up.railway.app/uploads/logo_taka_inside_6e02afd598.jpg" alt="Taka Inside" width={48} height={48} className="h-12 w-auto object-contain" unoptimized priority loading="eager" />
                <span className="font-display font-bold text-xl">Taka Inside</span>
              </div>
              <p className="text-taka-gray text-sm">LArt au Service de lHumain</p>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4 text-sm">Navigation</h4>
              <ul className="space-y-2 text-sm text-taka-gray">
                {menuItems.map((item) => <li key={item.link}><Link href={item.link} className="hover:text-taka-yellow transition-colors">{item.label}</Link></li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-4 text-sm">Contact</h4>
              <ul className="space-y-2 text-sm text-taka-gray">
                <li><a href="mailto:kwabo@takainside.org" className="hover:text-taka-yellow transition-colors">kwabo@takainside.org</a></li>
                <li><a href="tel:+33 7 56 98 74 73" className="hover:text-taka-yellow transition-colors">+33 7 56 98 74 73</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-taka-gray">© 2026 Taka Inside. Tous droits reserves.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
