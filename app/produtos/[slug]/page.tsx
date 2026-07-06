import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, products } from "@/lib/products";
import { formatPrice } from "@/lib/config";
import BottleArt from "@/components/BottleArt";
import ProductCard from "@/components/ProductCard";
import AddToCart from "@/components/AddToCart";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product?.name ?? "Produto" };
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
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

          <AddToCart slug={product.slug} />

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
