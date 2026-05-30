import SiteLayout from "@/components/layout/SiteLayout";
import Link from "next/link";

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="min-h-[60vh] flex items-center justify-center bg-taka-cream">
        <div className="text-center">
          <h1 className="font-display text-8xl font-bold text-taka-black mb-4">404</h1>
          <p className="text-taka-gray text-lg mb-8">Cette page n'existe pas ou a été déplacée.</p>
          <Link
            href="/"
            className="bg-taka-yellow text-taka-black px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
