'use client';

import { useState } from "react";
import Image from "next/image";

interface ComingSoonPageProps {
  content: Record<string, unknown> | null;
}

function blocksToText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b: any) => b.type === "paragraph")
    .map((b: any) => b.children?.map((c: any) => c.text).join(""))
    .filter(Boolean)
    .join("\n");
}

export default function ComingSoonPage({ content }: ComingSoonPageProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const title = (content?.title as string) || "Taka Inside";
  const tagline = (content?.subtitle as string) || "L'Art au Service de l'Humain";
  const body = blocksToText(content?.content);
  const config = (content?.formConfig as Record<string, unknown>) || {};
  const contactEmail = (config?.contactEmail as string) || "kwabo@takainside.org";
  const badges = Array.isArray(config?.badges) ? (config.badges as string[]) : ["Art", "Musique", "Humanitaire"];
  const emoji = (config?.emoji as string) || "🔒";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      setError("Mot de passe incorrect");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-taka-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/logo-taka-inside.jpg"
            alt={title}
            width={96}
            height={96}
            className="h-24 w-24 rounded-full mx-auto mb-4 object-cover"
          />
          <h1 className="font-display text-3xl font-bold text-taka-black">{title}</h1>
          <p className="text-taka-gray mt-2">{tagline}</p>
        </div>

        {/* Compte à rebours ou message */}
        <div className="bg-white rounded-2xl p-8 border-2 border-taka-gray-light mb-8">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="font-display text-2xl font-bold mb-4">Site en construction</h2>
          <p className="text-taka-gray mb-6">{body || "Notre nouveau site arrive bientôt. Restez connectés pour découvrir Taka Inside."}</p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-taka-gray">
            {badges.map((badge, i) => (
              <span key={i}>{i > 0 && <span className="mx-1">•</span>}{badge}</span>
            ))}
          </div>
        </div>

        {/* Accès privé */}
        <div className="bg-taka-yellow/10 rounded-2xl p-6 border border-taka-yellow/30">
          <p className="text-sm font-semibold mb-4">🔐 Accès privé pour l'équipe</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe..."
              className="w-full px-4 py-3 rounded-xl border border-taka-gray-light text-center focus:outline-none focus:border-taka-green"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 bg-taka-black text-white rounded-xl font-semibold hover:bg-taka-yellow hover:text-taka-black transition-all disabled:opacity-50"
            >
              {loading ? "Vérification..." : "Accéder au site"}
            </button>
            
            {error && (
              <p className="text-taka-red text-sm">{error}</p>
            )}
          </form>
        </div>

        {/* Contact */}
        <p className="text-sm text-taka-gray mt-6">
          Questions ? Contactez l'équipe :{" "}
          <a href={`mailto:${contactEmail}`} className="text-taka-green hover:underline">
            {contactEmail}
          </a>
        </p>
      </div>
    </div>
  );
}
