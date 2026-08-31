import Link from "next/link";
import { store, formatPrice } from "@/lib/config";
import { getProducts } from "@/lib/catalog";
import { categories } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import BottleField from "@/components/BottleField";

export const dynamic = "force-dynamic";

const CATEGORY_GLOSS: Record<string, string> = {
  feminino: "Perfumes, corpo e maquiagem",
  masculino: "Perfumes e cuidados masculinos",
  unissex: "Fragrâncias e cuidados para todos",
};

const PROMISES = [
  {
    title: "Produtos originais",
    body: "Revenda autorizada, lacre de fábrica e nota em todo pedido.",
  },
  {
    title: "Envio para todo o Brasil",
    body: "Frete calculado por estado, ou retirada em mãos sem custo.",
  },
  {
    title: "Pagamento pelo Mercado Pago",
    body: "Pix com aprovação imediata, cartão em até 3x ou boleto.",
  },
];

export default async function Home() {
  const all = await getProducts();
  const featured = all.filter((p) => p.featured);
  const selection = (featured.length > 0 ? featured : all).slice(0, 4);
  const hero = selection[0];

  const counts = new Map(
    categories.map((c) => [
      c.value,
      all.filter((p) => p.category === c.value).length,
    ])
  );

  return (
    <>
      {/* ===== Capa ===== */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20 pt-14 sm:px-8 sm:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
          <div>
            <p className="rise label text-muted" style={{ animationDelay: "0ms" }}>
              {store.resellerNotice}
            </p>

            <h1
              className="rise display mt-6 text-[clamp(2.75rem,7vw,5.25rem)]"
              style={{ animationDelay: "90ms" }}
            >
              {store.slogan}
            </h1>

            <p
              className="rise mt-7 max-w-md text-[17px] leading-relaxed text-muted"
              style={{ animationDelay: "180ms" }}
            >
              Perfume não é uma nota só: ele abre, se transforma e deixa rastro.
              Nas fichas de perfume daqui você vê as três fases, para comprar
              sabendo o que vai sentir três horas depois.
            </p>

            <div
              className="rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
              style={{ animationDelay: "270ms" }}
            >
              <Link href="/produtos" className="btn">
                Ver o catálogo
              </Link>
              <span className="label text-muted">
                {all.length} {all.length === 1 ? "produto" : "produtos"} no
                catálogo
              </span>
            </div>
          </div>

          {/* O herói é um perfume de verdade, apresentado com a sua ficha. */}
          {hero ? (
            <figure
              className="rise lg:justify-self-end"
              style={{ animationDelay: "360ms" }}
            >
              <Link href={`/produtos/${hero.slug}`} className="group block">
                <BottleField
                  art={hero.art}
                  className="aspect-[4/5] w-full lg:w-[420px]"
                  bottleClassName="h-[76%] transition-transform duration-700 ease-out group-hover:-translate-y-2"
                />
                <figcaption className="mt-4 border-t border-rule pt-3">
                  <p className="label text-muted">
                    Em destaque
                    {hero.concentration && <> · {hero.concentration}</>}
                    {hero.ml > 0 && <> · {hero.ml} ml</>}
                  </p>
                  <div className="mt-2 flex items-baseline justify-between gap-4">
                    <h2 className="display text-2xl decoration-1 underline-offset-4 group-hover:underline">
                      {hero.name}
                    </h2>
                    <span className="text-[16px] font-medium">
                      {formatPrice(hero.price)}
                    </span>
                  </div>

                  <dl className="mt-4 space-y-1.5">
                    {(
                      [
                        ["Topo", hero.notes.topo],
                        ["Coração", hero.notes.coracao],
                        ["Fundo", hero.notes.fundo],
                      ] as const
                    ).map(([phase, list]) => (
                      <div key={phase} className="flex gap-4 text-[13px]">
                        <dt className="label w-20 shrink-0 pt-[3px] text-muted">
                          {phase}
                        </dt>
                        <dd className="text-muted">
                          {list.length > 0 ? list.join(", ") : "—"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </figcaption>
              </Link>
            </figure>
          ) : (
            <p className="border border-rule p-8 text-[15px] leading-relaxed text-muted">
              O catálogo ainda está vazio. Cadastre o primeiro perfume pela área
              do lojista para ele aparecer aqui.
            </p>
          )}
        </div>
      </section>

      {/* ===== Índice por categoria ===== */}
      <section className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <h2 className="label border-b border-rule pb-3 text-muted">Índice</h2>
        <ul>
          {categories.map((c) => (
            <li key={c.value}>
              <Link
                href={`/produtos?categoria=${c.value}`}
                className="group flex items-baseline gap-4 border-b border-rule py-6 transition-colors hover:text-iris sm:gap-8"
              >
                <h3 className="display text-[clamp(1.5rem,3.5vw,2.25rem)]">
                  {c.label}
                </h3>
                <span className="hidden flex-1 text-[14px] text-muted sm:block">
                  {CATEGORY_GLOSS[c.value]}
                </span>
                <span className="label ml-auto text-muted sm:ml-0">
                  {counts.get(c.value) ?? 0}
                </span>
                <span
                  className="label transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== Seleção ===== */}
      {selection.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-8">
          <div className="flex items-baseline justify-between gap-6 border-b border-rule pb-3">
            <h2 className="label text-muted">Seleção da casa</h2>
            <Link href="/produtos" className="label text-muted hover:text-iris">
              Ver todos →
            </Link>
          </div>
          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {selection.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ===== Sobre ===== */}
      <section id="sobre" className="mx-auto max-w-[1200px] px-5 pt-28 sm:px-8">
        <h2 className="label border-b border-rule pb-3 text-muted">
          Sobre a {store.name}
        </h2>
        <div className="grid gap-14 pt-10 md:grid-cols-[1.1fr_1fr] md:gap-20">
          <div>
            <p className="display text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Perfume é identidade. A sua merece atenção.
            </p>
            <p className="mt-6 max-w-lg leading-relaxed text-muted">
              {store.description} Trabalhamos com um catálogo curto e escolhido
              a dedo, embalagem cuidadosa e atendimento direto — dá para
              perguntar sobre uma fragrância antes de comprar, e a resposta vem
              de quem já usou.
            </p>
          </div>

          <dl>
            {PROMISES.map((p) => (
              <div key={p.title} className="border-t border-rule py-5">
                <dt className="text-[15px] font-medium">{p.title}</dt>
                <dd className="mt-1 text-[14px] leading-relaxed text-muted">
                  {p.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
