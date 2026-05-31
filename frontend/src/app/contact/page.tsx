'use client';

import { useState } from "react";
import SiteLayout from "@/components/layout/SiteLayout";

export default function ContactPage() {
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [status, setStatus] = useState<{ type: "success" | "error" | null; msg: string }>({ type: null, msg: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", msg: "Message envoyé ! Nous vous répondrons sous 48h." });
        setForm({ nom: "", email: "", sujet: "", message: "" });
      } else {
        setStatus({ type: "error", msg: data.error || "Erreur lors de l'envoi." });
      }
    } catch {
      setStatus({ type: "error", msg: "Erreur réseau. Veuillez réessayer." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <section className="bg-taka-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-5xl font-bold">Contact</h1>
          <p className="mt-4 max-w-xl text-taka-gray">
            Une question ? Une proposition de collaboration ? Contactez-nous, nous répondons sous 48h.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulaire */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-taka-gray-light">
              <h2 className="font-display text-2xl font-bold mb-6">Envoyez-nous un message</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Nom *</label>
                    <input type="text" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-yellow focus:ring-2 focus:ring-taka-yellow/20 outline-none transition-all"
                      placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Email *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-yellow focus:ring-2 focus:ring-taka-yellow/20 outline-none transition-all"
                      placeholder="votre@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Sujet *</label>
                  <select required value={form.sujet} onChange={(e) => setForm({ ...form, sujet: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-yellow focus:ring-2 focus:ring-taka-yellow/20 outline-none transition-all bg-white">
                    <option value="">Sélectionnez...</option>
                    <option>Question générale</option>
                    <option>Partenariat</option>
                    <option>Artiste / Label</option>
                    <option>Presse</option>
                    <option>Projet</option>
                    <option>Bénévolat</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Message *</label>
                  <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5} className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-yellow focus:ring-2 focus:ring-taka-yellow/20 outline-none transition-all resize-none"
                    placeholder="Votre message..."></textarea>
                </div>

                {status.type && (
                  <div className={`p-4 rounded-xl ${status.type === "success" ? "bg-taka-green/15 text-taka-green" : "bg-taka-red/15 text-taka-red"}`}>
                    {status.msg}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full bg-taka-black text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50">
                  {loading ? "Envoi en cours..." : "Envoyer le message"}
                </button>
              </form>
            </div>

            {/* Coordonnées */}
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Nos coordonnées</h2>

              {[
                {
                  icon: (
                    <svg className="w-5 h-5 text-taka-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  ),
                  label: "Email",
                  text: "kwabo@takainside.org",
                  href: "mailto:kwabo@takainside.org",
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-taka-gray" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  ),
                  label: "WhatsApp",
                  text: "+33 7 56 98 74 73",
                  href: "https://wa.me/33756987473",
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-taka-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  ),
                  label: "Téléphone",
                  text: "+33 7 56 98 74 73",
                  href: "tel:+33756987473",
                },
                {
                  icon: (
                    <svg className="w-5 h-5 text-taka-red" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.405-4.47 3.405-7.14a8.25 8.25 0 00-16.5 0c0 2.67 1.461 5.15 3.405 7.14a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.145.742zM12 13.5a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                    </svg>
                  ),
                  label: "Adresse",
                  text: "Marseille, France",
                  href: null,
                },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl p-6 border border-taka-gray-light">
                  <div className="flex items-center gap-2 text-taka-gray text-sm font-medium mb-1">{item.icon}<span>{item.label}</span></div>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="font-semibold text-lg hover:text-taka-yellow transition-colors"
                    >{item.text}</a>
                  ) : (
                    <p className="font-semibold text-lg">{item.text}</p>
                  )}
                </div>
              ))}

              <div className="bg-white rounded-2xl p-6 border border-taka-gray-light">
                <p className="text-taka-gray text-sm font-medium mb-3">📱 Réseaux sociaux</p>
                <div className="flex flex-wrap gap-4">
                  <a href="https://facebook.com/takainside" target="_blank" rel="noopener noreferrer" className="text-taka-gray hover:text-taka-yellow transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com/takainside_asso" target="_blank" rel="noopener noreferrer" className="text-taka-gray hover:text-taka-yellow transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                  <a href="https://x.com/takainsideasso" target="_blank" rel="noopener noreferrer" className="text-taka-gray hover:text-taka-yellow transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
