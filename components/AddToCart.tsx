"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function AddToCart({ slug }: { slug: string }) {
  const { add } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-full border border-line bg-white">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-4 py-2.5 text-lg text-stone-warm hover:text-ink"
          aria-label="Diminuir quantidade"
        >
          −
        </button>
        <span className="w-8 text-center font-semibold">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="px-4 py-2.5 text-lg text-stone-warm hover:text-ink"
          aria-label="Aumentar quantidade"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          add(slug, qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        }}
        className="rounded-full bg-ink px-8 py-3 text-sm font-semibold text-white transition hover:bg-gold"
      >
        {added ? "✓ Adicionado!" : "Adicionar à sacola"}
      </button>

      <button
        type="button"
        onClick={() => {
          add(slug, qty);
          router.push("/carrinho");
        }}
        className="rounded-full border border-gold px-8 py-3 text-sm font-semibold text-gold transition hover:bg-gold hover:text-white"
      >
        Comprar agora
      </button>
    </div>
  );
}
