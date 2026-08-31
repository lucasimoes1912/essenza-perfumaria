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
    <div className="mt-8">
      <div className="flex flex-wrap items-stretch gap-3">
        <div className="flex items-center border border-rule">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="flex h-[52px] w-11 items-center justify-center text-lg transition-colors hover:text-iris disabled:text-muted/40"
            aria-label="Diminuir quantidade"
          >
            −
          </button>
          <span
            className="label w-8 text-center text-[13px] text-ink"
            aria-live="polite"
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            disabled={qty >= maxQty}
            className="flex h-[52px] w-11 items-center justify-center text-lg transition-colors hover:text-iris disabled:text-muted/40"
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
            setTimeout(() => setAdded(false), 2400);
          }}
          className="btn flex-1"
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
        className="btn-ghost mt-3 w-full"
      >
        Comprar agora
      </button>

      <p className="label mt-3 h-4 text-iris" role="status">
        {added && "Adicionado à sacola"}
      </p>
    </div>
  );
}
