'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { toEUR } from '@/lib/price';

export interface CartItem {
  id: number;
  documentId: string;
  name: string;
  price: number;       // montant brut tel que dans Strapi
  currency: "EUR" | "FCFA";  // devise du produit
  quantity: number;
  image?: string;
  slug: string;
  type: 'fixe' | 'personnalisable' | 'digital' | 'album' | 'single' | 'merch' | 'ticket';
  productType?: 'ticket' | 'album' | 'single' | 'merch' | 'digital';
  customization?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: number;        // montant brut (FCFA ou EUR selon produits)
  subtotal: number;     // montant brut
  totalEUR: number;      // total converti en EUR pour affichage
  subtotalEUR: number;   // sous-total en EUR
  shippingCost: number;
  shippingEUR: number;
  setShippingCost: (cost: number) => void;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('taka-cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch { /* ignore */ }
  }, []);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('taka-cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setShippingCost(0);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + shippingCost;
  // Totaux en EUR pour affichage (conversion FCFA → EUR si nécessaire)
  const subtotalEUR = items.reduce((sum, item) => {
    const unitEUR = item.currency === 'FCFA' ? toEUR(item.price) : item.price;
    return sum + unitEUR * item.quantity;
  }, 0);
  const shippingEUR = shippingCost > 0 ? toEUR(shippingCost) : 0;
  const totalEUR = subtotalEUR + shippingEUR;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        subtotal,
        totalEUR,
        subtotalEUR,
        shippingCost,
        shippingEUR,
        setShippingCost,
        itemCount,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
