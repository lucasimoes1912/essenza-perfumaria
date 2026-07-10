"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatPrice, store } from "@/lib/config";
import BottleArt from "@/components/BottleArt";
import type { Address } from "@/lib/types";

const EMPTY_ADDRESS: Address = {
  name: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

const REQUIRED_FIELDS: (keyof Address)[] = [
  "name",
  "phone",
  "cep",
  "street",
  "number",
  "neighborhood",
  "city",
  "state",
];

export default function CarrinhoPage() {
  const { items, setQty, remove, total, count } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [cepLoading, setCepLoading] = useState(false);

  function updateAddress<K extends keyof Address>(field: K, value: Address[K]) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCepBlur() {
    const cep = address.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddress((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      }
    } catch {
      /* autofill é só conveniência — cliente pode preencher na mão */
    } finally {
      setCepLoading(false);
    }
  }

  const addressComplete = REQUIRED_FIELDS.every((f) => address[f].trim() !== "");

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
          address,
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
  const shipping = missingForFreeShipping <= 0 ? 0 : store.flatShippingFee;
  const grandTotal = total + shipping;
  const inputClass =
    "mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-gold";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">Sua sacola</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
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

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="font-serif text-xl font-semibold">Endereço de entrega</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-medium sm:col-span-2">
              Nome completo
              <input
                value={address.name}
                onChange={(e) => updateAddress("name", e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium">
              Telefone / WhatsApp
              <input
                value={address.phone}
                onChange={(e) => updateAddress("phone", e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium">
              CEP
              <input
                value={address.cep}
                onChange={(e) => updateAddress("cep", e.target.value)}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium sm:col-span-2">
              Rua
              <input
                value={address.street}
                onChange={(e) => updateAddress("street", e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium">
              Número
              <input
                value={address.number}
                onChange={(e) => updateAddress("number", e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium">
              Complemento
              <input
                value={address.complement}
                onChange={(e) => updateAddress("complement", e.target.value)}
                placeholder="opcional"
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium">
              Bairro
              <input
                value={address.neighborhood}
                onChange={(e) => updateAddress("neighborhood", e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium">
              Cidade
              <input
                value={address.city}
                onChange={(e) => updateAddress("city", e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-sm font-medium">
              UF
              <input
                value={address.state}
                onChange={(e) => updateAddress("state", e.target.value.toUpperCase())}
                maxLength={2}
                className={inputClass}
              />
            </label>
          </div>
          {cepLoading && (
            <p className="mt-3 text-xs text-stone-warm">Buscando endereço pelo CEP…</p>
          )}
        </div>
        </div>

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
                {shipping === 0 ? (
                  <span className="text-green-600">Grátis 🎉</span>
                ) : (
                  formatPrice(shipping)
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
            <span className="text-xl font-bold">{formatPrice(grandTotal)}</span>
          </div>

          <button
            type="button"
            onClick={checkout}
            disabled={loading || !addressComplete}
            className="mt-6 w-full rounded-full bg-ink py-3.5 text-sm font-semibold text-white transition hover:bg-gold disabled:opacity-60"
          >
            {loading ? "Redirecionando…" : "Pagar com Mercado Pago"}
          </button>
          {!addressComplete && (
            <p className="mt-3 text-center text-xs text-stone-warm">
              Preencha o endereço de entrega para continuar.
            </p>
          )}
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
