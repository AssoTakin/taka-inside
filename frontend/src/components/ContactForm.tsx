"use client";

import { useState, FormEvent } from "react";

interface ContactFormProps {
  subjects: string[];
  submitButton: string;
  destinationEmail: string;
  successMessage: string;
}

export default function ContactForm({ subjects, submitButton, destinationEmail, successMessage }: ContactFormProps) {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isValid =
    form.nom.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    form.sujet.trim() !== "" &&
    form.message.trim().length >= 10;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Erreur ${res.status}`);
      }

      setStatus("success");
      setForm({ nom: "", email: "", sujet: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-nom" className="block text-sm font-semibold mb-1">Nom *</label>
          <input
            id="contact-nom"
            name="nom"
            type="text"
            required
            minLength={2}
            value={form.nom}
            onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-yellow focus:ring-2 focus:ring-taka-yellow/20 outline-none transition-all"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-semibold mb-1">Email *</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-yellow focus:ring-2 focus:ring-taka-yellow/20 outline-none transition-all"
            placeholder="votre@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-sujet" className="block text-sm font-semibold mb-1">Sujet *</label>
        <select
          id="contact-sujet"
          name="sujet"
          required
          value={form.sujet}
          onChange={(e) => setForm((f) => ({ ...f, sujet: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-yellow focus:ring-2 focus:ring-taka-yellow/20 outline-none transition-all bg-white"
        >
          <option value="">Sélectionnez...</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold mb-1">Message *</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          minLength={10}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border border-taka-gray-light focus:border-taka-yellow focus:ring-2 focus:ring-taka-yellow/20 outline-none transition-all resize-none"
          placeholder="Votre message..."
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={!isValid || status === "loading"}
        className="w-full bg-taka-black text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Envoi en cours..." : submitButton}
      </button>

      {status === "success" && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-green-800 text-sm">
          ✅ {successMessage || "Message envoye ! Nous vous repondrons sous 48h."}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm">
          ❌ {errorMessage || "L’envoi a échoué. Veuillez réessayer ou nous contacter directement à"}{" "}
          <a href={`mailto:${destinationEmail}`} className="underline">{destinationEmail}</a>.
        </div>
      )}
    </form>
  );
}
