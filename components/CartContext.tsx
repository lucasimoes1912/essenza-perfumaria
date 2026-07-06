"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProduct, type Product } from "@/lib/products";

export interface CartItem {
  slug: string;
  qty: number;
}

interface CartApi {
  items: CartItem[];
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
  /** total em centavos */
  total: number;
  /** itens resolvidos com dados do produto */
  detailed: { product: Product; qty: number }[];
}

const CartContext = createContext<CartApi | null>(null);
const STORAGE_KEY = "essenza-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* carrinho corrompido: começa vazio */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const api = useMemo<CartApi>(() => {
    const detailed = items
      .map((i) => ({ product: getProduct(i.slug), qty: i.qty }))
      .filter((i): i is { product: Product; qty: number } => !!i.product);

    return {
      items,
      add: (slug, qty = 1) =>
        setItems((prev) => {
          const found = prev.find((i) => i.slug === slug);
          if (found)
            return prev.map((i) =>
              i.slug === slug ? { ...i, qty: i.qty + qty } : i
            );
          return [...prev, { slug, qty }];
        }),
      remove: (slug) => setItems((prev) => prev.filter((i) => i.slug !== slug)),
      setQty: (slug, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.slug !== slug)
            : prev.map((i) => (i.slug === slug ? { ...i, qty } : i))
        ),
      clear: () => setItems([]),
      count: detailed.reduce((n, i) => n + i.qty, 0),
      total: detailed.reduce((n, i) => n + i.product.price * i.qty, 0),
      detailed,
    };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
