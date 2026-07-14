import Link from "next/link";
import { store, formatPrice } from "@/lib/config";
import { getFeatured } from "@/lib/catalog";
import { categories } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import BottleArt from "@/components/BottleArt";

export const dynamic = "force-dynamic";

const categoryStyle: Record<string, { bg: string; block: string; desc: string }> = {
  masculino: {
    bg: "bg-[oklch(94%_0.03_230)]",
    block: "bg-accent-blue",
    desc: "Fragrâncias marcantes",
  },
  feminino: {
    bg: "bg-[oklch(94%_0.03_350)]",
    block: "bg-gold",
    desc: "Notas florais e doces",
  },
  unissex: {
    bg: "bg-[oklch(94%_0.025_290)]",
    block: "bg-gradient-to-br from-accent-blue to-gold",
    desc: "Para todos os estilos",
  },
};

export default async function Home() {
  const featured = await getFeatured();

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <div className="grid min-h-[420px] items-center overflow-hidden rounded-[28px] bg-gradient-to-br from-gold to-accent-blue md:grid-cols-[1.1fr_1fr]">
          <div className="px-8 py-12 text-white sm:px-14 sm:py-14">
            <span className="inline-block rounded-full bg-white/20 px-3.5 py-1.5 text-[13px] font-semibold">
              Frete grátis acima de {formatPrice(store.freeShippingMin)}
            </span>
            <h1 className="mt-5 font-serif text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              {store.slogan}
            </h1>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed opacity-95">
              {store.resellerNotice}. Os clássicos que você ama, com produtos
              originais, envio rápido e pagamento seguro via Pix ou cartão.
            </p>
            <Link
              href="/produtos"
              className="mt-7 inline-block rounded-full bg-white px-8 py-4 font-serif text-[16px] font-bold text-gold-dark transition hover:scale-105"
            >
              Ver catálogo
            </Link>
          </div>

          <div className="hidden h-full items-center justify-center gap-4 p-6 md:flex">
            {featured.slice(0, 4).map((p, i) => (
              <Link
                key={p.slug}
                href={`/produtos/${p.slug}`}
                className={`flex h-32 w-28 items-center justify-center rounded-2xl bg-white/15 backdrop-blur transition hover:scale-105 ${i % 2 ? "translate-y-6" : ""}`}
                aria-label={p.name}
              >
                <BottleArt art={p.art} className="h-24" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <h2 className="mb-7 font-serif text-2xl font-bold tracking-tight sm:text-3xl">
          Compre por categoria
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.value}
              href={`/produtos?categoria=${c.value}`}
              className={`flex min-h-[140px] flex-col justify-end gap-2 rounded-[20px] p-8 transition hover:-translate-y-1 ${categoryStyle[c.value].bg}`}
            >
              <span className={`mb-2 block h-11 w-11 rounded-xl ${categoryStyle[c.value].block}`} />
              <p className="font-serif text-xl font-bold">{c.label}</p>
              <p className="text-sm text-stone-warm">{categoryStyle[c.value].desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Destaques */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="mb-7 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">
            Mais vendidos
          </h2>
          <Link href="/produtos" className="text-sm font-semibold text-gold hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre-section" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-10 rounded-[28px] bg-sand p-8 sm:gap-14 sm:p-14 md:grid-cols-2">
          <div>
            <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-gold">
              Sobre a {store.name}
            </p>
            <h2 className="font-serif text-2xl font-extrabold tracking-tight sm:text-[32px]">
              Revenda autorizada, paixão por perfumaria
            </h2>
            <p className="mt-4 leading-relaxed text-stone-warm">
              {store.description}
            </p>
            <p className="mt-4 leading-relaxed text-stone-warm">
              Entrega rápida, embalagem cuidadosa e atendimento próximo —
              porque perfume é sobre identidade, e a sua merece atenção.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl">🔒</p>
              <p className="mt-2 text-sm font-semibold">Pagamento seguro</p>
            </div>
            <div className="text-center">
              <p className="text-2xl">✈️</p>
              <p className="mt-2 text-sm font-semibold">Envio nacional</p>
            </div>
            <div className="text-center">
              <p className="text-2xl">💎</p>
              <p className="mt-2 text-sm font-semibold">100% originais</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
