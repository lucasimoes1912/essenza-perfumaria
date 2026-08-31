"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatPrice, store } from "@/lib/config";
import BottleField from "@/components/BottleField";
import type { Address, DeliveryMethod } from "@/lib/types";

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
  const [method, setMethod] = useState<DeliveryMethod>("entrega");
  /** frete cotado para a UF informada (centavos); null = ainda não sabemos */
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    const uf = address.state.trim().toUpperCase();
    if (method !== "entrega" || uf.length !== 2) {
      setRate(null);
      return;
    }
    let cancelled = false;
    fetch(`/api/frete?uf=${uf}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled) setRate(d ? d.price : null);
      })
      .catch(() => {
        if (!cancelled) setRate(null);
      });
    return () => {
      cancelled = true;
    };
  }, [address.state, method]);

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

  const addressComplete =
    method === "retirada"
      ? address.name.trim() !== "" && address.phone.trim() !== ""
      : REQUIRED_FIELDS.every((f) => address[f].trim() !== "");

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
          method,
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
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8">
        <p className="label text-muted">Sacola</p>
        <h1 className="display mt-4 max-w-lg text-[clamp(2.25rem,5vw,3.5rem)]">
          Sua sacola está vazia.
        </h1>
        <p className="mt-5 max-w-sm leading-relaxed text-muted">
          Comece pelo catálogo: perfumes, corpo e maquiagem, com entrega para
          todo o Brasil ou retirada em mãos.
        </p>
        <Link href="/produtos" className="btn mt-10">
          Ver o catálogo
        </Link>
      </div>
    );
  }

  const missingForFreeShipping = store.freeShippingMin - total;
  const freeShipping = missingForFreeShipping <= 0;
  /** null = frete ainda desconhecido (falta a UF) */
  const shipping: number | null =
    method === "retirada" || freeShipping ? 0 : rate;
  const grandTotal = total + (shipping ?? 0);
  const canPay =
    addressComplete && (method === "retirada" || freeShipping || shipping !== null);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
      <header className="border-b border-rule pb-8">
        <p className="label text-muted">Sacola</p>
        <h1 className="display mt-4 text-[clamp(2.25rem,5vw,3.5rem)]">
          {count} {count === 1 ? "item" : "itens"}
        </h1>
      </header>

      <div className="grid gap-14 pt-10 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div>
          {/* ===== Itens ===== */}
          <ul>
            {items.map((item) => (
              <li
                key={item.slug}
                className="grid grid-cols-[72px_1fr] items-start gap-5 border-b border-rule py-6 first:pt-0 sm:grid-cols-[88px_1fr_auto] sm:gap-6"
              >
                <Link href={`/produtos/${item.slug}`} className="block">
                  <BottleField
                    art={item.art}
                    className="aspect-square"
                    bottleClassName="h-[78%]"
                  />
                </Link>

                <div>
                  <Link
                    href={`/produtos/${item.slug}`}
                    className="display text-[19px] decoration-1 underline-offset-4 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="label mt-1.5 text-muted">
                    {item.concentration}
                    {item.ml > 0 && <> · {item.ml} ml</>}
                  </p>

                  <div className="mt-4 flex items-center gap-5">
                    <div className="flex items-center border border-rule">
                      <button
                        type="button"
                        onClick={() => setQty(item.slug, item.qty - 1)}
                        className="flex h-8 w-8 items-center justify-center transition-colors hover:text-iris"
                        aria-label={`Diminuir quantidade de ${item.name}`}
                      >
                        −
                      </button>
                      <span className="label w-7 text-center text-ink">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.slug, item.qty + 1)}
                        className="flex h-8 w-8 items-center justify-center transition-colors hover:text-iris"
                        aria-label={`Aumentar quantidade de ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.slug)}
                      className="label text-muted transition-colors hover:text-rust"
                    >
                      Remover
                    </button>
                  </div>

                  <p className="mt-4 text-[15px] font-medium sm:hidden">
                    {formatPrice(item.price * item.qty)}
                  </p>
                </div>

                <p className="hidden text-[15px] font-medium sm:block">
                  {formatPrice(item.price * item.qty)}
                </p>
              </li>
            ))}
          </ul>

          {/* ===== Entrega ===== */}
          <section className="mt-14">
            <h2 className="label border-b border-rule pb-3 text-muted">
              Como você quer receber
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {(
                [
                  {
                    value: "entrega" as const,
                    title: "Receber em casa",
                    body: `Frete calculado pelo seu estado, grátis acima de ${formatPrice(store.freeShippingMin)}.`,
                  },
                  {
                    value: "retirada" as const,
                    title: "Retirar em mãos",
                    body: "Sem frete. Combinamos local e horário pelo WhatsApp.",
                  },
                ]
              ).map((opt) => {
                const selected = method === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setMethod(opt.value)}
                    aria-pressed={selected}
                    className={`border p-5 text-left transition-colors ${
                      selected
                        ? "border-ink bg-surface"
                        : "border-rule hover:border-muted"
                    }`}
                  >
                    <p className="text-[15px] font-medium">{opt.title}</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                      {opt.body}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="label text-muted">Nome completo</span>
                <input
                  value={address.name}
                  onChange={(e) => updateAddress("name", e.target.value)}
                  autoComplete="name"
                  className="field"
                />
              </label>

              <label className="block">
                <span className="label text-muted">Telefone / WhatsApp</span>
                <input
                  value={address.phone}
                  onChange={(e) => updateAddress("phone", e.target.value)}
                  autoComplete="tel"
                  className="field"
                />
              </label>

              {method === "entrega" && (
                <>
                  <label className="block">
                    <span className="label text-muted">CEP</span>
                    <input
                      value={address.cep}
                      onChange={(e) => updateAddress("cep", e.target.value)}
                      onBlur={handleCepBlur}
                      placeholder="00000-000"
                      autoComplete="postal-code"
                      className="field"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="label text-muted">Rua</span>
                    <input
                      value={address.street}
                      onChange={(e) => updateAddress("street", e.target.value)}
                      autoComplete="address-line1"
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="label text-muted">Número</span>
                    <input
                      value={address.number}
                      onChange={(e) => updateAddress("number", e.target.value)}
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="label text-muted">Complemento</span>
                    <input
                      value={address.complement}
                      onChange={(e) =>
                        updateAddress("complement", e.target.value)
                      }
                      placeholder="opcional"
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="label text-muted">Bairro</span>
                    <input
                      value={address.neighborhood}
                      onChange={(e) =>
                        updateAddress("neighborhood", e.target.value)
                      }
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="label text-muted">Cidade</span>
                    <input
                      value={address.city}
                      onChange={(e) => updateAddress("city", e.target.value)}
                      className="field"
                    />
                  </label>
                  <label className="block">
                    <span className="label text-muted">UF</span>
                    <input
                      value={address.state}
                      onChange={(e) =>
                        updateAddress("state", e.target.value.toUpperCase())
                      }
                      maxLength={2}
                      className="field"
                    />
                  </label>
                </>
              )}
            </div>

            {method === "entrega" && cepLoading && (
              <p className="label mt-5 text-muted" role="status">
                Buscando endereço pelo CEP…
              </p>
            )}
            {method === "retirada" && (
              <p className="mt-6 border-l border-rule pl-4 text-[13px] leading-relaxed text-muted">
                Depois do pagamento, entramos em contato pelo telefone informado
                para combinar o local e o horário da retirada.
              </p>
            )}
          </section>
        </div>

        {/* ===== Resumo ===== */}
        <aside className="h-fit border-t border-ink pt-6 lg:sticky lg:top-[150px]">
          <h2 className="label text-muted">Resumo do pedido</h2>

          <dl className="mt-6 space-y-3 text-[14px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">
                Subtotal ({count} {count === 1 ? "item" : "itens"})
              </dt>
              <dd>{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">
                Frete
                {method === "entrega" &&
                  address.state.trim().length === 2 && (
                    <> · {address.state.trim().toUpperCase()}</>
                  )}
              </dt>
              <dd>
                {method === "retirada" ? (
                  <span className="text-moss">Retirada, sem frete</span>
                ) : shipping === 0 ? (
                  <span className="text-moss">Grátis</span>
                ) : shipping === null ? (
                  <span className="text-muted">informe o CEP</span>
                ) : (
                  formatPrice(shipping)
                )}
              </dd>
            </div>
          </dl>

          {method === "entrega" && missingForFreeShipping > 0 && (
            <p className="mt-5 border-l border-iris pl-4 text-[13px] leading-relaxed text-muted">
              Faltam{" "}
              <strong className="font-medium text-ink">
                {formatPrice(missingForFreeShipping)}
              </strong>{" "}
              para o frete sair de graça.
            </p>
          )}

          <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-rule pt-5">
            <span className="label text-muted">Total</span>
            <span className="display text-[28px]">
              {formatPrice(grandTotal)}
            </span>
          </div>

          <button
            type="button"
            onClick={checkout}
            disabled={loading || !canPay}
            className="btn mt-7 w-full"
          >
            {loading ? "Redirecionando…" : "Pagar com Mercado Pago"}
          </button>

          <p className="mt-4 text-[12px] leading-relaxed text-muted">
            {!canPay
              ? method === "retirada"
                ? "Informe seu nome e telefone para continuar."
                : "Preencha o endereço de entrega para continuar."
              : "Você será levado ao Mercado Pago para pagar com Pix, cartão ou boleto."}
          </p>

          {error && (
            <p
              className="mt-4 border-l border-rust pl-4 text-[13px] leading-relaxed text-rust"
              role="alert"
            >
              {error}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
