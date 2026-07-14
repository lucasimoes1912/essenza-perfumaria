"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/lib/types";
import { useCart } from "./CartContext";

export default function AddToCart({
  product,
  maxQty,
}: {
  product: Omit<CartItem, "qty">;
  maxQty: number;
}) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center overflow-hidden rounded-full border border-line">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-ink"
            aria-label="Diminuir quantidade"
          >
            −
          </button>
          <span className="w-9 text-center font-bold">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-ink"
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            add(product, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1800);
          }}
          className="flex-1 rounded-full bg-ink px-8 py-4 font-serif text-[15px] font-bold text-white transition hover:bg-gold"
        >
          Adicionar à sacola
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          add(product, qty);
          router.push("/carrinho");
        }}
        className="mt-3 w-full rounded-full border border-gold px-8 py-3 text-sm font-semibold text-gold transition hover:bg-gold hover:text-white"
      >
        Comprar agora
      </button>

      {added && (
        <p className="mt-3 text-sm font-semibold text-[oklch(50%_0.15_150)]">
          ✓ Adicionado ao carrinho
        </p>
      )}
    </div>
  );
}
