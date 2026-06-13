'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  productType?: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  shippingCost: number;
  setShippingCost: (cost: number) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Charger depuis localStorage APRES hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem('taka-cart');
      if (stored) setItems(JSON.parse(stored));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  // Persister
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('taka-cart', JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i));
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, itemCount, total, isOpen, setIsOpen, addItem, removeItem, updateQuantity, clearCart, shippingCost, setShippingCost }}
    >
      {children}
      {hydrated && <CartDrawer />}
    </CartContext.Provider>
  );
}

function CartDrawer() {
  const { isOpen, setIsOpen, items, itemCount, total, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Panier ({itemCount})</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Votre panier est vide</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />}
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  {item.size && <p className="text-xs text-gray-500">Taille: {item.size}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded bg-gray-200 text-xs font-bold">−</button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded bg-gray-200 text-xs font-bold">+</button>
                    <button onClick={() => removeItem(item.id)} className="ml-auto text-xs text-red-500 hover:text-red-700">Supprimer</button>
                  </div>
                  <p className="text-sm font-semibold mt-1">{(item.price * item.quantity).toFixed(2)} €</p>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <button
              onClick={() => { setIsOpen(false); window.location.href = '/checkout'; }}
              className="w-full bg-taka-black text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
            >
              Procéder au paiement →
            </button>
            <button onClick={() => setIsOpen(false)} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700">
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
