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
      <h1 className="font-serif text-[34px] font-extrabold tracking-tight">Carrinho</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li
              key={item.slug}
              className="grid grid-cols-[80px_1fr_auto] items-center gap-4 rounded-2xl border border-line bg-white p-3.5"
            >
              <Link
                href={`/produtos/${item.slug}`}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[10px]"
                style={{ backgroundColor: item.art.bg }}
              >
                <BottleArt art={item.art} className="h-14" />
              </Link>
              <div>
                <Link
                  href={`/produtos/${item.slug}`}
                  className="font-serif text-[15px] font-semibold hover:text-gold"
                >
                  {item.name}
                </Link>
                <p className="mb-2 text-[13px] text-stone-warm">
                  {item.concentration}
                  {item.ml > 0 && <> · {item.ml} ml</>}
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      onClick={() => setQty(item.slug, item.qty - 1)}
                      className="flex h-[30px] w-[30px] items-center justify-center font-semibold text-ink"
                      aria-label="Diminuir"
                    >
                      −
                    </button>
                    <span className="w-[26px] text-center text-[13px] font-bold">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(item.slug, item.qty + 1)}
                      className="flex h-[30px] w-[30px] items-center justify-center font-semibold text-ink"
                      aria-label="Aumentar"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.slug)}
                    className="text-[13px] font-semibold text-gold hover:text-gold-dark"
                    aria-label={`Remover ${item.name}`}
                  >
                    Remover
                  </button>
                </div>
              </div>
              <p className="font-bold">{formatPrice(item.price * item.qty)}</p>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-[20px] bg-sand p-7 lg:sticky lg:top-[100px]">
          <h2 className="mb-5 font-serif text-lg font-bold">Resumo do pedido</h2>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-warm">Subtotal ({count} itens)</dt>
              <dd className="font-semibold">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-warm">Frete</dt>
              <dd className="font-semibold">
                {missingForFreeShipping <= 0 ? "Grátis" : "calculado na entrega"}
              </dd>
            </div>
          </dl>

          {missingForFreeShipping > 0 && (
            <p className="mt-3 rounded-lg bg-white p-3 text-xs text-stone-warm">
              Faltam <strong>{formatPrice(missingForFreeShipping)}</strong> para
              ganhar frete grátis!
            </p>
          )}

          <div className="mt-4 flex justify-between border-t border-line pt-4 text-lg">
            <span className="font-bold">Total</span>
            <span className="font-extrabold">{formatPrice(total)}</span>
          </div>

          <button
            type="button"
            onClick={checkout}
            disabled={loading}
            className="mt-6 w-full rounded-full bg-ink py-4 font-serif text-[15px] font-bold text-white transition hover:bg-gold disabled:opacity-60"
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
