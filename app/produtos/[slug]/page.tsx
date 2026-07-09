import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/config";
import BottleArt from "@/components/BottleArt";
import ProductCard from "@/components/ProductCard";
import AddToCart from "@/components/AddToCart";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product?.name ?? "Produto" };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = (await getProducts({ category: product.category }))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div
          className="flex items-center justify-center rounded-3xl border border-line p-10"
          style={{ backgroundColor: product.art.bg }}
        >
          <BottleArt art={product.art} className="h-80 max-w-full" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {product.category} · {product.concentration} · {product.ml} ml
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold">{product.name}</h1>
          <p className="mt-1 text-sm text-stone-warm">por {product.brand}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-lg text-stone-warm line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-stone-warm">
            em até 3x sem juros no cartão · Pix com aprovação imediata
          </p>

          {product.stock > 0 ? (
            <>
              <AddToCart
                product={{
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  ml: product.ml,
                  concentration: product.concentration,
                  art: product.art,
                }}
                maxQty={product.stock}
              />
              {product.stock <= 3 && (
                <p className="mt-3 text-sm font-semibold text-red-500">
                  ⚡ Últimas {product.stock} unidade(s) em estoque!
                </p>
              )}
            </>
          ) : (
            <div className="mt-6 rounded-2xl bg-sand p-5">
              <p className="font-semibold">😔 Produto esgotado</p>
              <p className="mt-1 text-sm text-stone-warm">
                Este perfume acabou, mas volta logo! Enquanto isso, veja as
                sugestões abaixo.
              </p>
            </div>
          )}

          <p className="mt-8 leading-relaxed text-stone-warm">{product.description}</p>

          <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl border border-line bg-white p-5 text-sm">
            <div>
              <p className="font-semibold text-gold">Topo</p>
              <ul className="mt-1 space-y-0.5 text-stone-warm">
                {product.notes.topo.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gold">Coração</p>
              <ul className="mt-1 space-y-0.5 text-stone-warm">
                {product.notes.coracao.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gold">Fundo</p>
              <ul className="mt-1 space-y-0.5 text-stone-warm">
                {product.notes.fundo.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-2xl font-semibold">Você também pode gostar</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
