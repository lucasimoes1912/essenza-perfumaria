import Link from "next/link";
import type { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { categories, type Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";
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

  const list = await getProducts({ category: active });
  const resultLabel =
    list.length + (list.length === 1 ? " produto encontrado" : " produtos encontrados");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-[34px] font-extrabold tracking-tight">Catálogo</h1>
      <p className="mt-1 text-[15px] text-stone-warm">{resultLabel}</p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href="/produtos"
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
            !active
              ? "bg-ink text-white"
              : "border border-line bg-white text-ink hover:border-gold"
          }`}
        >
          Todos
        </Link>
        {categories.map((c) => (
          <Link
            key={c.value}
            href={`/produtos?categoria=${c.value}`}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              active === c.value
                ? "bg-ink text-white"
                : "border border-line bg-white text-ink hover:border-gold"
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
