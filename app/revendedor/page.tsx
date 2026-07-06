import { requireReseller } from "@/lib/reseller-auth";
import { getResellerStats } from "@/lib/resellers";
import { listOrdersByReseller } from "@/lib/orders";
import { formatPrice } from "@/lib/config";
import { orderStatusLabel } from "@/lib/types";
import { resellerLogoutAction } from "./actions";
import CopyLink from "@/components/CopyLink";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  approved: "bg-green-50 text-green-700",
  aberto: "bg-sand text-stone-warm",
  pending: "bg-yellow-50 text-yellow-700",
  in_process: "bg-yellow-50 text-yellow-700",
  rejected: "bg-red-50 text-red-600",
  cancelled: "bg-red-50 text-red-600",
  refunded: "bg-red-50 text-red-600",
  charged_back: "bg-red-50 text-red-600",
};

export default async function RevendedorPage() {
  const reseller = await requireReseller();
  const [stats, orders] = await Promise.all([
    getResellerStats(reseller.id),
    listOrdersByReseller(reseller.id),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const link = `${siteUrl}/?rev=${encodeURIComponent(reseller.code)}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold">
            Olá, {reseller.name.split(" ")[0]}! 👋
          </h1>
          <p className="mt-1 text-sm text-stone-warm">
            Suas vendas como revendedor(a) — atualizadas automaticamente.
          </p>
        </div>
        <form action={resellerLogoutAction}>
          <button
            type="submit"
            className="rounded-full border border-line px-5 py-2 text-sm font-medium text-stone-warm transition hover:border-red-300 hover:text-red-500"
          >
            Sair
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-2xl border border-gold/40 bg-white p-5">
        <p className="text-sm font-semibold">Seu link de divulgação</p>
        <p className="mt-1 text-xs text-stone-warm">
          Compartilhe este link no WhatsApp, Instagram e onde quiser. Toda
          compra feita por quem entrar por ele conta como venda sua (válido
          por 30 dias após o clique).
        </p>
        <CopyLink link={link} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-sm text-stone-warm">Pedidos pelo seu link</p>
          <p className="mt-1 text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-sm text-stone-warm">Vendas pagas</p>
          <p className="mt-1 text-2xl font-bold">{stats.paidOrders}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className="text-sm text-stone-warm">Total vendido (pago)</p>
          <p className="mt-1 text-2xl font-bold">{formatPrice(stats.paidTotal)}</p>
        </div>
      </div>

      <h2 className="mt-10 font-serif text-2xl font-semibold">Suas vendas</h2>
      {orders.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-line bg-white p-8 text-center text-stone-warm">
          Nenhuma venda ainda. Compartilhe seu link para começar! 🚀
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-stone-warm">
                <th className="p-4">Pedido</th>
                <th className="p-4">Data</th>
                <th className="p-4">Itens</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-line align-top last:border-0">
                  <td className="p-4 font-semibold">#{o.id}</td>
                  <td className="p-4 whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="p-4">
                    <ul className="space-y-0.5">
                      {o.items.map((i) => (
                        <li key={i.slug}>
                          {i.qty}× {i.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4 font-semibold">{formatPrice(o.total)}</td>
                  <td className="p-4">
                    <span
                      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[o.status] ?? "bg-sand text-stone-warm"}`}
                    >
                      {orderStatusLabel[o.status] ?? o.status}
                    </span>
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
