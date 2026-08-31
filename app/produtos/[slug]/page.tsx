import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProducts } from "@/lib/catalog";
import { categories } from "@/lib/types";
import { formatPrice } from "@/lib/config";
import BottleField from "@/components/BottleField";
import ProductCard from "@/components/ProductCard";
import AddToCart from "@/components/AddToCart";
import NoteLadder, { hasNotes } from "@/components/NoteLadder";

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
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/produtos" className="label text-muted hover:text-ink">
        ← Catálogo
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[0.9fr_1fr] lg:gap-20">
        <BottleField
          art={product.art}
          dimmed={product.stock === 0}
          className="aspect-[4/5] h-fit lg:sticky lg:top-[140px]"
          bottleClassName="h-[78%]"
        />

        <div>
          <p className="label text-muted">{product.brand}</p>
          <h1 className="display mt-3 text-[clamp(2.25rem,5vw,3.5rem)]">
            {product.name}
          </h1>
          <p className="label mt-4 text-muted">
            {product.category}
            {product.concentration && <> · {product.concentration}</>}
            {product.ml > 0 && <> · {product.ml} ml</>}
          </p>

          <div className="mt-8 flex items-baseline gap-4 border-t border-rule pt-6">
            <span className="display text-[34px]">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && (
              <span className="text-[16px] text-muted line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>
          <p className="mt-2 text-[13px] text-muted">
            Em até 3x sem juros no cartão, ou Pix com aprovação imediata.
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
                <p className="label mt-4 text-rust">
                  Restam {product.stock}{" "}
                  {product.stock === 1 ? "unidade" : "unidades"}
                </p>
              )}
            </>
          ) : (
            <div className="mt-8 border-t border-rule pt-6">
              <p className="display text-xl">Esgotado no momento</p>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted">
                Este item voltou para a fila de reposição. Veja abaixo o que
                há de parecido no catálogo.
              </p>
            </div>
          )}

          {product.description && (
            <p className="mt-10 max-w-lg leading-relaxed text-muted">
              {product.description}
            </p>
          )}

          {hasNotes(product.notes) && (
            <div className="mt-12 border-t border-rule pt-8">
              <NoteLadder notes={product.notes} />
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <h2 className="label border-b border-rule pb-3 text-muted">
            Mais em{" "}
            {categories.find((c) => c.value === product.category)?.label ??
              product.category}
          </h2>
          <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
