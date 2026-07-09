"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatPrice, store } from "@/lib/config";
import BottleArt from "@/components/BottleArt";

export default function CarrinhoPage() {
  const { items, setQty, remove, total, count } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao iniciar o pagamento");
      window.location.href = data.initPoint;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
      setLoading(false);
    }
  }

  if (count === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="text-5xl">🛍️</p>
        <h1 className="mt-4 font-serif text-3xl font-semibold">Sua sacola está vazia</h1>
        <p className="mt-2 text-stone-warm">
          Explore o catálogo e encontre sua próxima fragrância favorita.
        </p>
        <Link
          href="/produtos"
          className="mt-8 inline-block rounded-full bg-ink px-8 py-3 text-sm font-semibold text-white transition hover:bg-gold"
        >
          Ver perfumes
        </Link>
      </div>
    );
  }

  const missingForFreeShipping = store.freeShippingMin - total;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Sua sacola</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.slug}
              className="flex gap-4 rounded-2xl border border-line bg-white p-4"
            >
              <Link
                href={`/produtos/${item.slug}`}
                className="flex h-28 w-24 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: item.art.bg }}
              >
                <BottleArt art={item.art} className="h-20" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/produtos/${item.slug}`}
                      className="font-serif text-lg font-semibold hover:text-gold"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-stone-warm">
                      {item.concentration}
                      {item.ml > 0 && <> · {item.ml} ml</>}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.slug)}
                    className="text-sm text-stone-warm hover:text-red-500"
                    aria-label={`Remover ${item.name}`}
                  >
                    Remover
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      onClick={() => setQty(item.slug, item.qty - 1)}
                      className="px-3 py-1.5 text-stone-warm hover:text-ink"
                      aria-label="Diminuir"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-sm font-semibold">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.slug, item.qty + 1)}
                      className="px-3 py-1.5 text-stone-warm hover:text-ink"
                      aria-label="Aumentar"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-semibold">{formatPrice(item.price * item.qty)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-line bg-white p-6">
          <h2 className="font-serif text-xl font-semibold">Resumo</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-warm">Subtotal ({count} itens)</dt>
              <dd className="font-semibold">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-warm">Frete</dt>
              <dd className="font-semibold">
                {missingForFreeShipping <= 0 ? (
                  <span className="text-green-600">Grátis 🎉</span>
                ) : (
                  "calculado na entrega"
                )}
              </dd>
            </div>
          </dl>

          {missingForFreeShipping > 0 && (
            <p className="mt-3 rounded-lg bg-sand p-3 text-xs text-stone-warm">
              Faltam <strong>{formatPrice(missingForFreeShipping)}</strong> para
              ganhar frete grátis!
            </p>
          )}

          <div className="mt-4 flex justify-between border-t border-line pt-4">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold">{formatPrice(total)}</span>
          </div>

          <button
            type="button"
            onClick={checkout}
            disabled={loading}
            className="mt-6 w-full rounded-full bg-ink py-3.5 text-sm font-semibold text-white transition hover:bg-gold disabled:opacity-60"
          >
            {loading ? "Redirecionando…" : "Pagar com Mercado Pago"}
          </button>
          <p className="mt-3 text-center text-xs text-stone-warm">
            Pix, cartão de crédito ou boleto · ambiente seguro
          </p>

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
