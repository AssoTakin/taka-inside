import { Metadata } from "next";
import { fetchPageContent, extractData } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Devenir Bénévole | Taka Inside",
    description: "Rejoignez l'équipe Taka Inside et participez à nos projets culturels et musicaux au Bénin.",
  };
}

export default async function BenevolePage() {
  const content = await fetchPageContent("devenir-benevole");
  const page = extractData(content);
  const cfg = (page?.formConfig as Record<string, any>) || {};

  const labels = cfg.labels || {};
  const placeholders = cfg.placeholders || {};
  const requiredFields = Array.isArray(cfg.requiredFields) ? cfg.requiredFields : ["lastName", "firstName", "email", "city", "skills", "motivation"];
  const skills = Array.isArray(cfg.skills) ? cfg.skills : ["Communication", "Événementiel", "Technique", "Musique", "Design", "Traduction", "Autre"];
  const availabilities = Array.isArray(cfg.availabilities) ? cfg.availabilities : ["Week-ends", "Soirs en semaine", "Temps plein", "Selon les projets"];
  const submitButton = String(cfg.submitButton || "Envoyer ma candidature");
  const otherSkillLabel = String(cfg.otherSkillLabel || "Précisez votre compétence *");
  const otherSkillPlaceholder = String(cfg.otherSkillPlaceholder || "Décrivez votre compétence...");
  const successMessage = String(cfg.successMessage || "Votre candidature a bien été envoyée. Un email de confirmation vous a été envoyé.");
  const errorMessage = String(cfg.errorMessage || "Une erreur est survenue. Veuillez réessayer.");
  const title = String(page?.title || "Devenir Bénévole");
  const subtitle = String(page?.subtitle || "Rejoignez l'équipe Taka Inside et participez à nos projets culturels et musicaux au Bénin.");
  const bodyText = blocksToText(page?.content);

  const req = (name: string) => (requiredFields.includes(name) ? " *" : "");

  const menuItems = [
    { label: "Accueil", link: "/" },
    { label: "Projets", link: "/projets" },
    { label: "Label Musical", link: "/label-musical" },
    { label: "Boutique", link: "/boutique" },
    { label: "Association", link: "/association" },
  ];

  const scriptHtml = buildInlineScript({ requiredFields, successMessage, errorMessage, submitButton });

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Devenir Bénévole | Taka Inside</title>
        <meta name="description" content={subtitle} />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: tailwindConfig }} />
      </head>
      <body className="font-body bg-taka-cream text-taka-black antialiased">
        <header className="sticky top-0 z-50 bg-taka-black text-white">
          <div className="h-1 bg-gradient-to-r from-taka-green via-taka-yellow to-taka-red" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <a href="/" className="flex items-center gap-2">
                <img src="https://taka-inside-production.up.railway.app/uploads/logo_taka_inside_6e02afd598.jpg" alt="Taka Inside" className="h-12 w-auto object-contain" />
                <span className="font-display font-bold text-xl tracking-tight">Taka Inside</span>
              </a>
              <nav className="hidden lg:flex items-center gap-8">
                {menuItems.map((item) => (
                  <a key={item.link} href={item.link} className="text-sm font-medium text-taka-gray hover:text-white transition-colors">{item.label}</a>
                ))}
                <a href="/faire-un-don" className="text-sm font-medium bg-taka-yellow text-taka-black px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all">Faire un Don</a>
              </nav>
            </div>
          </div>
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
              {bodyText && <p className="text-taka-gray text-lg mb-8">{bodyText}</p>}

              <div id="benevole-status" className="mb-8 hidden rounded-xl p-4 flex items-start gap-3">
                <svg id="benevole-status-icon" className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p id="benevole-status-text" className="font-medium"></p>
              </div>

              <form id="benevole-form" className="bg-white rounded-2xl p-6 md:p-8 border border-taka-gray-light space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold mb-1">{labels.lastName || "Nom"}{req("lastName")}</label>
                    <input id="lastName" name="lastName" type="text" required={requiredFields.includes("lastName")} className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={placeholders.lastName || "Votre nom"} />
                  </div>
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold mb-1">{labels.firstName || "Prénom"}{req("firstName")}</label>
                    <input id="firstName" name="firstName" type="text" required={requiredFields.includes("firstName")} className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={placeholders.firstName || "Votre prénom"} />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-1">{labels.email || "Email"}{req("email")}</label>
                  <input id="email" name="email" type="email" required={requiredFields.includes("email")} className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={placeholders.email || "votre@email.com"} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold mb-1">{labels.phone || "Téléphone"}</label>
                    <input id="phone" name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={placeholders.phone || "+229 ..."} />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold mb-1">{labels.city || "Ville"}{req("city")}</label>
                    <input id="city" name="city" type="text" required={requiredFields.includes("city")} className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={placeholders.city || "Cotonou, Porto-Novo..."} />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-semibold mb-1">{labels.country || "Pays"}</label>
                  <input id="country" name="country" type="text" className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={placeholders.country || "Bénin, France..."} />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">{labels.skills || "Compétences"}{req("skills")}</label>
                  <div className="flex flex-wrap gap-2" id="skills-group">
                    {skills.map((comp: string) => (
                      <button key={comp} type="button" data-value={comp} data-group="skills" className="skill-btn px-4 py-2 rounded-lg border text-sm transition-all border-taka-gray-light hover:border-taka-green hover:text-taka-green">
                        {comp}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="skills" id="skills-input" />
                  <div id="other-skill-container" className="mt-3 hidden">
                    <label htmlFor="otherSkill" className="block text-sm font-semibold mb-1">{otherSkillLabel}</label>
                    <input id="otherSkill" name="otherSkill" type="text" className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all" placeholder={otherSkillPlaceholder} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">{labels.availabilities || "Disponibilité"}{req("availabilities")}</label>
                  <div className="flex flex-wrap gap-2" id="avail-group">
                    {availabilities.map((a: string) => (
                      <button key={a} type="button" data-value={a} data-group="availabilities" className="avail-btn px-4 py-2 rounded-lg border text-sm transition-all border-taka-gray-light hover:border-taka-yellow hover:text-taka-yellow">
                        {a}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="availabilities" id="avail-input" />
                </div>

                <div>
                  <label htmlFor="motivation" className="block text-sm font-semibold mb-1">{labels.motivation || "Motivation"}{req("motivation")}</label>
                  <textarea id="motivation" name="motivation" rows={4} required={requiredFields.includes("motivation")} className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-green focus:ring-2 focus:ring-taka-green/20 outline-none transition-all resize-none" placeholder={placeholders.motivation || "Pourquoi souhaitez-vous rejoindre Taka Inside ?"} />
                </div>

                <button type="submit" id="submit-btn" className="w-full bg-taka-green text-white font-semibold py-4 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-60">
                  {submitButton}
                </button>
              </form>
            </div>
          </section>
        </main>

        <footer className="bg-taka-black text-white">
          <div className="h-1 bg-gradient-to-r from-taka-green via-taka-yellow to-taka-red" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <img src="https://taka-inside-production.up.railway.app/uploads/logo_taka_inside_6e02afd598.jpg" alt="Taka Inside" className="h-12 w-auto object-contain" />
                  <span className="font-display font-bold text-xl">Taka Inside</span>
                </div>
                <p className="text-taka-gray text-sm">LArt au Service de lHumain</p>
              </div>
              <div>
                <h4 className="font-display font-semibold mb-4 text-sm">Navigation</h4>
                <ul className="space-y-2 text-sm text-taka-gray">
                  {menuItems.map((item) => <li key={item.link}><a href={item.link} className="hover:text-taka-yellow transition-colors">{item.label}</a></li>)}
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

        <script dangerouslySetInnerHTML={{ __html: scriptHtml }} />
      </body>
    </html>
  );
}

function blocksToText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b: any) => b.type === "paragraph")
    .map((b: any) => b.children?.map((c: any) => c.text).join(""))
    .filter(Boolean)
    .join("\n");
}

const tailwindConfig = `
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'taka-green': '#228B22',
        'taka-yellow': '#F4C430',
        'taka-red': '#DC143C',
        'taka-black': '#1A1A1A',
        'taka-cream': '#F8F5F0',
        'taka-gray': '#A0A0A0',
        'taka-gray-light': '#E5E5E5',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
}`;

function buildInlineScript(opts: { requiredFields: string[]; successMessage: string; errorMessage: string; submitButton: string }): string {
  return `
(function() {
  const requiredFields = ${JSON.stringify(opts.requiredFields)};
  const successMessage = ${JSON.stringify(opts.successMessage)};
  const errorMessage = ${JSON.stringify(opts.errorMessage)};
  const submitLabel = ${JSON.stringify(opts.submitButton)};

  const selected = { skills: new Set(), availabilities: new Set() };

  function updateHiddenInput(group) {
    const input = document.getElementById(group === 'skills' ? 'skills-input' : 'avail-input');
    if (input) input.value = Array.from(selected[group]).join(',');
  }

  function updateButtonStyle(btn, group) {
    const value = btn.dataset.value;
    const isSelected = selected[group].has(value);
    if (group === 'skills') {
      btn.className = isSelected
        ? 'skill-btn px-4 py-2 rounded-lg border text-sm transition-all bg-taka-green text-white border-taka-green'
        : 'skill-btn px-4 py-2 rounded-lg border text-sm transition-all border-taka-gray-light hover:border-taka-green hover:text-taka-green';
    } else {
      btn.className = isSelected
        ? 'avail-btn px-4 py-2 rounded-lg border text-sm transition-all bg-taka-yellow text-taka-black border-taka-yellow'
        : 'avail-btn px-4 py-2 rounded-lg border text-sm transition-all border-taka-gray-light hover:border-taka-yellow hover:text-taka-yellow';
    }
  }

  function toggle(group, value, btn) {
    if (selected[group].has(value)) selected[group].delete(value);
    else selected[group].add(value);
    updateButtonStyle(btn, group);
    updateHiddenInput(group);
    if (group === 'skills') {
      const otherContainer = document.getElementById('other-skill-container');
      const otherInput = document.getElementById('otherSkill');
      if (selected.skills.has('Autre')) {
        otherContainer.classList.remove('hidden');
        otherInput.setAttribute('required', 'required');
      } else {
        otherContainer.classList.add('hidden');
        otherInput.removeAttribute('required');
        otherInput.value = '';
      }
    }
  }

  function init() {
    document.querySelectorAll('[data-group="skills"]').forEach(function(btn) {
      btn.addEventListener('click', function() { toggle('skills', btn.dataset.value, btn); });
    });

    document.querySelectorAll('[data-group="availabilities"]').forEach(function(btn) {
      btn.addEventListener('click', function() { toggle('availabilities', btn.dataset.value, btn); });
    });

    const form = document.getElementById('benevole-form');
    if (form) {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = document.getElementById('submit-btn');
        btn.disabled = true;
        btn.textContent = 'Envoi en cours…';

        function getValue(id) {
          const el = document.getElementById(id);
          return el ? el.value.trim() : '';
        }

        function showStatus(type, text) {
          const box = document.getElementById('benevole-status');
          const txt = document.getElementById('benevole-status-text');
          const icon = document.getElementById('benevole-status-icon');
          box.classList.remove('hidden', 'bg-taka-green/10', 'border-taka-green/30', 'text-taka-green-dark', 'bg-red-50', 'border-red-200', 'text-red-700');
          if (type === 'success') {
            box.classList.add('bg-taka-green/10', 'border-taka-green/30', 'text-taka-green-dark');
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />';
          } else {
            box.classList.add('bg-red-50', 'border-red-200', 'text-red-700');
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
          }
          txt.textContent = text;
        }

        const data = {
          lastName: getValue('lastName'),
          firstName: getValue('firstName'),
          email: getValue('email'),
          phone: getValue('phone'),
          city: getValue('city'),
          country: getValue('country'),
          skills: Array.from(selected.skills),
          otherSkill: getValue('otherSkill'),
          availabilities: Array.from(selected.availabilities),
          motivation: getValue('motivation'),
        };

        const errors = [];
        if (requiredFields.includes('lastName') && !data.lastName) errors.push('Le nom est requis.');
        if (requiredFields.includes('firstName') && !data.firstName) errors.push('Le prénom est requis.');
        if (requiredFields.includes('email') && !data.email) errors.push("L'email est requis.");
        else if (data.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email)) errors.push('Email invalide.');
        if (requiredFields.includes('city') && !data.city) errors.push('La ville est requise.');
        if (requiredFields.includes('skills') && data.skills.length === 0) errors.push('Sélectionnez au moins une compétence.');
        if (data.skills.includes('Autre') && !data.otherSkill) errors.push('Précisez votre compétence.');
        if (requiredFields.includes('motivation') && !data.motivation) errors.push('La motivation est requise.');

        if (errors.length > 0) {
          showStatus('error', errors.join(' '));
          btn.disabled = false;
          btn.textContent = submitLabel;
          return;
        }

        try {
          const res = await fetch('/api/benevole', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
          const json = await res.json();
          if (res.ok && json.success) {
            showStatus('success', successMessage);
            form.reset();
            selected.skills.clear();
            selected.availabilities.clear();
            document.querySelectorAll('[data-group]').forEach(function(b) { updateButtonStyle(b, b.dataset.group); });
            document.getElementById('other-skill-container').classList.add('hidden');
            document.getElementById('otherSkill').removeAttribute('required');
          } else {
            showStatus('error', json.error || errorMessage);
          }
        } catch (err) {
          showStatus('error', errorMessage);
        } finally {
          btn.disabled = false;
          btn.textContent = submitLabel;
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`.trim();
}
