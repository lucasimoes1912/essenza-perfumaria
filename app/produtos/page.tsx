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
  const filters = [{ value: undefined, label: "Todos" }, ...categories];

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
      <header className="border-b border-rule pb-8">
        <p className="label text-muted">Catálogo</p>
        <h1 className="display mt-4 text-[clamp(2.5rem,6vw,4.5rem)]">
          {active
            ? categories.find((c) => c.value === active)?.label
            : "Todo o catálogo"}
        </h1>
      </header>

      <div className="flex flex-wrap items-baseline justify-between gap-6 border-b border-rule py-4">
        <nav className="flex flex-wrap gap-x-7 gap-y-3">
          {filters.map((f) => {
            const selected = active === f.value;
            return (
              <Link
                key={f.label}
                href={f.value ? `/produtos?categoria=${f.value}` : "/produtos"}
                className={`label pb-1 transition-colors ${
                  selected
                    ? "border-b border-ink text-ink"
                    : "border-b border-transparent text-muted hover:text-ink"
                }`}
                aria-current={selected ? "page" : undefined}
              >
                {f.label}
              </Link>
            );
          })}
        </nav>

        <p className="label text-muted">
          {list.length} {list.length === 1 ? "resultado" : "resultados"}
        </p>
      </div>

      {list.length > 0 ? (
        <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-16 max-w-md">
          <p className="display text-2xl">Nada nesta categoria ainda.</p>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Nenhum produto ativo nesta categoria no momento. As outras
            continuam disponíveis.
          </p>
          <Link href="/produtos" className="link-rule mt-8 inline-block">
            Ver todo o catálogo
          </Link>
        </div>
      )}
    </div>
  );
}
