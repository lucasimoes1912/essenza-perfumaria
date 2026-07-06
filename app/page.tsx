import Link from "next/link";
import { store, formatPrice } from "@/lib/config";
import { getFeatured, categories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const featured = getFeatured();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-sand">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Perfumaria selecionada
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              {store.slogan}
            </h1>
            <p className="mt-4 max-w-md text-stone-warm">
              Fragrâncias marcantes para cada ocasião — curadoria própria,
              envio rápido e pagamento seguro via Pix ou cartão.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/produtos"
                className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-gold"
              >
                Ver catálogo
              </Link>
              <Link
                href="/produtos?categoria=feminino"
                className="rounded-full border border-ink/20 px-7 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold"
              >
                Novidades femininas
              </Link>
            </div>
            <p className="mt-6 text-sm text-stone-warm">
              🚚 Frete grátis em compras acima de{" "}
              <strong className="text-ink">{formatPrice(store.freeShippingMin)}</strong>
            </p>
          </div>

          <div className="hidden justify-center md:flex">
            <div className="grid grid-cols-2 gap-4">
              {featured.slice(0, 4).map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/produtos/${p.slug}`}
                  className={`flex h-40 w-40 items-center justify-center rounded-2xl border border-line transition hover:scale-105 ${i % 2 ? "translate-y-6" : ""}`}
                  style={{ backgroundColor: p.art.bg }}
                  aria-label={p.name}
                >
                  <span
                    className="block h-28 w-24 rounded-b-xl rounded-t-md opacity-90"
                    style={{
                      background: `linear-gradient(160deg, ${p.art.from}, ${p.art.to})`,
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Mais vendidos
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">Destaques da semana</h2>
          </div>
          <Link href="/produtos" className="text-sm font-medium text-gold hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.value}
              href={`/produtos?categoria=${c.value}`}
              className="group rounded-2xl border border-line bg-white p-8 text-center transition hover:border-gold"
            >
              <p className="font-serif text-2xl font-semibold group-hover:text-gold">
                {c.label}
              </p>
              <p className="mt-1 text-sm text-stone-warm">Explorar fragrâncias →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Confiança */}
      <section className="border-t border-line bg-sand">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-center sm:grid-cols-3 sm:px-6">
          <div>
            <p className="text-2xl">🔒</p>
            <p className="mt-2 font-semibold">Pagamento seguro</p>
            <p className="text-sm text-stone-warm">Pix e cartão via Mercado Pago</p>
          </div>
          <div>
            <p className="text-2xl">✈️</p>
            <p className="mt-2 font-semibold">Envio para todo o Brasil</p>
            <p className="text-sm text-stone-warm">Postagem em até 24h úteis</p>
          </div>
          <div>
            <p className="text-2xl">💎</p>
            <p className="mt-2 font-semibold">100% originais</p>
            <p className="text-sm text-stone-warm">Garantia de procedência</p>
          </div>
        </div>
      </section>
    </>
  );
}
