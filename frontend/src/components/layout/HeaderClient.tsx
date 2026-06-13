'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export function CartButton() {
  const { itemCount, setIsOpen } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Afficher un contenu identique entre serveur et client pour éviter hydration mismatch
  const displayCount = mounted ? itemCount : 0;

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
      aria-label={`Panier (${displayCount} articles)`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <span
        className={`absolute -top-1 -right-1 bg-taka-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transition-opacity ${
          displayCount > 0 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {displayCount > 99 ? '99+' : displayCount}
      </span>
    </button>
  );
}

export function MobileMenu({ menuItems, siteName }: { menuItems: Record<string, unknown>[]; siteName: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Menu"
        aria-expanded={mobileOpen}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {mobileOpen && (
        <div className="lg:hidden bg-taka-black border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id as string}
                href={(item.link as string) || '/'}
                target={item.isExternal ? '_blank' : undefined}
                rel={item.isExternal ? 'noopener noreferrer' : undefined}
                className="block text-sm font-medium text-taka-gray hover:text-white py-2"
                onClick={() => setMobileOpen(false)}
              >
                {(item.label as string) || 'Lien'}
              </Link>
            ))}
            <Link
              href="/faire-un-don"
              className="block text-sm font-medium bg-taka-yellow text-taka-black px-4 py-2 rounded-lg text-center"
              onClick={() => setMobileOpen(false)}
            >
              Faire un Don
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
