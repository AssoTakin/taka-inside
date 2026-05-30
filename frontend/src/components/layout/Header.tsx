'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/projets', label: 'Nos Projets' },
  { href: '/label-musical', label: 'Label Musical' },
  { href: '/boutique', label: 'Boutique' },
  { href: '/devenir-benevole', label: 'Devenir Bénévole' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-taka-black text-white">
      <div className="rasta-line h-1"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-taka-yellow via-taka-red to-taka-green flex items-center justify-center font-display font-bold text-taka-black text-sm">TI</div>
            <span className="font-display font-bold text-lg tracking-tight">Taka Inside</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-taka-gray hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/faire-un-don"
              className="text-sm font-medium bg-taka-yellow text-taka-black px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
            >
              Faire un Don
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label={`Panier (${itemCount} articles)`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-taka-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile: cart + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label={`Panier (${itemCount} articles)`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-taka-red text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
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
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-taka-black border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-taka-gray hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/faire-un-don"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium bg-taka-yellow text-taka-black px-4 py-3 rounded-lg text-center mt-4"
            >
              Faire un Don
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
