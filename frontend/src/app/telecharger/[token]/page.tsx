export const dynamic = 'force-dynamic';

import SiteLayout from '@/components/layout/SiteLayout';

interface DownloadPageProps {
  params: Promise<{ token: string }>;
}

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const strapiToken = process.env.STRAPI_API_TOKEN;

async function fetchCommande(token: string) {
  try {
    const res = await fetch(
      `${strapiUrl}/api/commandes?filters[token_telechargement][$eq]=${encodeURIComponent(token)}&populate=*`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(strapiToken ? { 'Authorization': `Bearer ${strapiToken}` } : {}),
        },
        cache: 'no-store',
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0] || null;
  } catch {
    return null;
  }
}

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { token } = await params;
  const commande = await fetchCommande(token);

  if (!commande) {
    return (
      <SiteLayout>
        <section className="min-h-[60vh] flex items-center justify-center bg-taka-cream py-16">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold mb-4">Lien invalide ou expiré</h1>
            <p className="text-taka-gray mb-8">
              Ce lien de téléchargement n'est plus valide. Veuillez contacter notre support.
            </p>
            <a href="/" className="inline-block bg-taka-black text-white px-8 py-3 rounded-xl font-semibold">
              Retour à l'accueil
            </a>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const attrs = commande.attributes || commande;

  if (attrs.statut !== 'paye') {
    return (
      <SiteLayout>
        <section className="min-h-[60vh] flex items-center justify-center bg-taka-cream py-16">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="font-display text-2xl font-bold mb-4">Paiement non confirmé</h1>
            <p className="text-taka-gray">Votre paiement n'a pas encore été confirmé. Le téléchargement sera disponible prochainement.</p>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const expired = attrs.date_expiration_telechargement && new Date(attrs.date_expiration_telechargement) < new Date();
  const maxReached = (attrs.nombre_telechargements || 0) >= 3;

  return (
    <SiteLayout>
      <section className="min-h-[60vh] flex items-center justify-center bg-taka-cream py-16">
        <div className="max-w-lg mx-auto px-4 w-full">
          <div className="bg-white rounded-2xl p-8 border border-taka-gray-light text-center">
            <div className="w-20 h-20 rounded-full bg-taka-green/15 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-taka-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>

            <h1 className="font-display text-2xl font-bold mb-2">Téléchargement prêt</h1>
            <p className="text-taka-gray mb-6">
              Commande #{String(attrs.id || 'N/A').slice(-6).toUpperCase()}
            </p>

            {expired ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-700 font-medium">⏰ Lien expiré</p>
                <p className="text-sm text-red-600 mt-1">Ce lien a expiré. Contactez-nous pour le renouveler.</p>
              </div>
            ) : maxReached ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-700 font-medium">📥 Limite atteinte</p>
                <p className="text-sm text-red-600 mt-1">Vous avez déjà effectué 3 téléchargements.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <a
                  href={`/api/telecharger/${token}`}
                  className="inline-block bg-taka-green text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  Télécharger l'album →
                </a>
                <p className="text-sm text-taka-gray">
                  Téléchargement {attrs.nombre_telechargements || 0}/3 — valable jusqu'au
                  {' '}
                  {attrs.date_expiration_telechargement
                    ? new Date(attrs.date_expiration_telechargement).toLocaleDateString('fr-FR')
                    : '7 jours'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
