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
                  icon: "📧",
                  label: "Email",
                  text: "contact@takainside.org",
                  href: "mailto:contact@takainside.org",
                },
                {
                  icon: "📱",
                  label: "WhatsApp",
                  text: "+229 07 56 98 74 73",
                  href: "https://wa.me/2290756987473",
                },
                {
                  icon: "📞",
                  label: "Téléphone",
                  text: "+229 07 56 98 74 73",
                  href: "tel:+2290756987473",
                },
                {
                  icon: "📍",
                  label: "Adresse",
                  text: "Cotonou, République du Bénin",
                  href: null,
                },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl p-6 border border-taka-gray-light">
                  <p className="text-taka-gray text-sm font-medium mb-1">{item.icon} {item.label}</p>
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
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Facebook", href: "https://facebook.com/takainside" },
                    { label: "Instagram", href: "https://instagram.com/takainside_asso" },
                    { label: "X / Twitter", href: "https://x.com/takainsideasso" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg border border-taka-gray-light text-sm font-medium hover:border-taka-yellow hover:text-taka-yellow transition-all"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
