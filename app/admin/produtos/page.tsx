import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/config";
import BottleArt from "@/components/BottleArt";

export const dynamic = "force-dynamic";

export default async function AdminProdutos() {
  await requireAdmin();
  const products = await getProducts({ includeInactive: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gold"
        >
          + Novo produto
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-stone-warm">
              <th className="p-4">Produto</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Estoque</th>
              <th className="p-4">Destaque</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-12 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: p.art.bg }}
                    >
                      <BottleArt art={p.art} className="h-9" />
                    </span>
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-stone-warm">
                        {p.concentration} · {p.ml} ml
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 capitalize">{p.category}</td>
                <td className="p-4 font-semibold">{formatPrice(p.price)}</td>
                <td className="p-4">
                  {p.stock === 0 ? (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                      Esgotado
                    </span>
                  ) : p.stock <= 3 ? (
                    <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                      {p.stock} un.
                    </span>
                  ) : (
                    <span className="font-semibold">{p.stock} un.</span>
                  )}
                </td>
                <td className="p-4">{p.featured ? "⭐" : "—"}</td>
                <td className="p-4">
                  {p.active ? (
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                      Ativo
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                      Inativo
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <Link
                    href={`/admin/produtos/${p.id}`}
                    className="font-medium text-gold hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
