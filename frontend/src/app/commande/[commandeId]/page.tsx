import { notFound } from 'next/navigation';
import SiteLayout from '@/components/layout/SiteLayout';
import { formatPrice } from '@/lib/price';

interface OrderPageProps {
  params: Promise<{ commandeId: string }>;
}

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const strapiToken = process.env.STRAPI_API_TOKEN;

async function fetchCommande(commandeId: string) {
  try {
    const res = await fetch(
      `${strapiUrl}/api/commandes?filters[documentId][$eq]=${commandeId}&populate=*`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(strapiToken ? { 'Authorization': `Bearer ${strapiToken}` } : {}),
        },
        next: { revalidate: 30 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0] || null;
  } catch {
    return null;
  }
}

const statusLabels: Record<string, { label: string; color: string; description: string }> = {
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', description: 'Votre commande est enregistrée et en attente de paiement.' },
  paye: { label: 'Payée', color: 'bg-blue-100 text-blue-800', description: 'Paiement confirmé. Préparation en cours.' },
  expedie: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800', description: 'Votre colis est en route !' },
  livre: { label: 'Livrée', color: 'bg-green-100 text-green-800', description: 'Commande livrée. Merci !' },
  annule: { label: 'Annulée', color: 'bg-red-100 text-red-800', description: 'Cette commande a été annulée.' },
  rembourse: { label: 'Remboursée', color: 'bg-gray-100 text-gray-800', description: 'Remboursement effectué.' },
};

export default async function OrderPage({ params }: OrderPageProps) {
  const { commandeId } = await params;
  const commande = await fetchCommande(commandeId);

  if (!commande) {
    notFound();
  }

  const attrs = commande.attributes || commande;
  const status = statusLabels[attrs.statut] || statusLabels.en_attente;

  return (
    <SiteLayout>
      <section className="py-16 md:py-24 bg-taka-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 border border-taka-gray-light">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl font-bold">Commande #{String(commandeId).slice(-6).toUpperCase()}</h1>
                <p className="text-sm text-taka-gray mt-1">
                  Passée le {attrs.createdAt ? new Date(attrs.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date inconnue'}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>{status.label}</span>
            </div>

            <div className="p-4 rounded-xl bg-taka-cream mb-8">
              <p className="text-sm">{status.description}</p>
            </div>

            {/* Timeline */}
            <div className="space-y-4 mb-8">
              {[
                { id: 'en_attente', label: 'Commande reçue', icon: '📥' },
                { id: 'paye', label: 'Paiement confirmé', icon: '✅' },
                { id: 'expedie', label: 'Expédition', icon: '🚚' },
                { id: 'livre', label: 'Livraison', icon: '📦' },
              ].map((step, index) => {
                const isActive = attrs.statut === step.id;
                const isPast = ['en_attente', 'paye', 'expedie', 'livre'].indexOf(attrs.statut) >= index;
                return (
                  <div key={step.id} className={`flex items-center gap-4 ${isPast ? '' : 'opacity-40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isActive ? 'bg-taka-black text-white' : isPast ? 'bg-taka-green/20 text-taka-green' : 'bg-taka-gray-light'}`}>
                      {isPast && !isActive ? '✓' : step.icon}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}>{step.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Récapitulatif commande */}
            <div className="border-t border-taka-gray-light pt-6">
              <h2 className="font-display text-lg font-bold mb-4">Détails de la commande</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-taka-gray">Client</span><span>{attrs.nomClient}</span></div>
                <div className="flex justify-between"><span className="text-taka-gray">Email</span><span>{attrs.email}</span></div>
                {attrs.telephone && <div className="flex justify-between"><span className="text-taka-gray">Téléphone</span><span>{attrs.telephone}</span></div>}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(Number(attrs.total || 0))}</span>
                </div>
                {attrs.cout_livraison > 0 && (
                  <div className="flex justify-between text-sm text-taka-gray">
                    <span>Dont livraison</span>
                    <span>{formatPrice(Number(attrs.cout_livraison))}</span>
                  </div>
                )}
              </div>
            </div>

            {attrs.token_telechargement && attrs.statut === 'paye' && (
              <div className="mt-8 p-4 bg-taka-green/10 rounded-xl border border-taka-green/30">
                <p className="text-sm font-medium mb-2">🎵 Votre contenu digital est prêt</p>
                <a
                  href={`/telecharger/${attrs.token_telechargement}`}
                  className="inline-block bg-taka-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
                >
                  Télécharger maintenant →
                </a>
                <p className="text-xs text-taka-gray mt-2">Lien valable 7 jours, 3 téléchargements max.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
