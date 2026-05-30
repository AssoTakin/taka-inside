import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <SiteLayout>
      <div className="min-h-[60vh] flex items-center justify-center bg-taka-cream py-16">
        <div className="text-center max-w-lg mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-taka-green/15 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-taka-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">Paiement confirmé !</h1>
          <p className="text-taka-gray mb-8">
            Merci pour votre soutien à Taka Inside. Vous recevrez un email de confirmation sous peu avec les détails de votre commande.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/boutique"
              className="bg-taka-yellow text-taka-black px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
            >
              Retourner à la boutique
            </Link>
            <Link
              href="/"
              className="border border-taka-black px-8 py-3 rounded-xl font-semibold hover:bg-taka-black hover:text-white transition-all"
            >
              Accueil
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
