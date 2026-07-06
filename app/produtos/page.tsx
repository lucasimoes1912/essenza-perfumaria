import Link from "next/link";
import type { Metadata } from "next";
import { products, categories, type Category } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = { title: "Catálogo" };

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const active = categories.find((c) => c.value === categoria)?.value as
    | Category
    | undefined;

  const list = active
    ? products.filter((p) => p.category === active)
    : products;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
        Catálogo
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
        {active ? categories.find((c) => c.value === active)!.label : "Todos os perfumes"}
      </h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/produtos"
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
            !active
              ? "border-ink bg-ink text-white"
              : "border-line bg-white text-stone-warm hover:border-gold"
          }`}
        >
          Todos
        </Link>
        {categories.map((c) => (
          <Link
            key={c.value}
            href={`/produtos?categoria=${c.value}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              active === c.value
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-stone-warm hover:border-gold"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {list.length === 0 && (
        <p className="mt-12 text-center text-stone-warm">
          Nenhum produto nesta categoria ainda.
        </p>
      )}
    </div>
  );
}
