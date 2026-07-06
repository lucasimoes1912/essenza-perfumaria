import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { listResellers, getResellerStats } from "@/lib/resellers";
import { formatPrice } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function AdminRevendedores() {
  await requireAdmin();
  const resellers = await listResellers();
  const stats = await Promise.all(resellers.map((r) => getResellerStats(r.id)));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold">Revendedores</h1>
        <Link
          href="/admin/revendedores/novo"
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gold"
        >
          + Novo revendedor
        </Link>
      </div>
      <p className="mt-1 text-sm text-stone-warm">
        Cada revendedor acessa <code className="rounded bg-sand px-1">/revendedor</code>{" "}
        com e-mail e senha, e divulga a loja com o link exclusivo dele.
      </p>

      {resellers.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-line bg-white p-8 text-center text-stone-warm">
          Nenhum revendedor cadastrado ainda.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-stone-warm">
                <th className="p-4">Nome</th>
                <th className="p-4">E-mail</th>
                <th className="p-4">Código do link</th>
                <th className="p-4">Vendas pagas</th>
                <th className="p-4">Total vendido</th>
                <th className="p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {resellers.map((r, i) => (
                <tr key={r.id} className="border-b border-line last:border-0">
                  <td className="p-4 font-semibold">{r.name}</td>
                  <td className="p-4">{r.email}</td>
                  <td className="p-4">
                    <code className="rounded bg-sand px-2 py-0.5">?rev={r.code}</code>
                  </td>
                  <td className="p-4">{stats[i].paidOrders}</td>
                  <td className="p-4 font-semibold">{formatPrice(stats[i].paidTotal)}</td>
                  <td className="p-4">
                    {r.active ? (
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
                      href={`/admin/revendedores/${r.id}`}
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
      )}
    </div>
  );
}
