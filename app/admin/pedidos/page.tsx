import { requireAdmin } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/config";
import { orderStatusLabel } from "@/lib/types";

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

export default async function AdminPedidos() {
  await requireAdmin();
  const orders = await listOrders();

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Pedidos</h1>
      <p className="mt-1 text-sm text-stone-warm">
        Atualizados automaticamente pelo webhook do Mercado Pago. Pedidos
        “abertos” são carrinhos que iniciaram o pagamento mas não concluíram.
      </p>

      {orders.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-line bg-white p-8 text-center text-stone-warm">
          Nenhum pedido ainda. Assim que alguém clicar em “Pagar com Mercado
          Pago”, ele aparece aqui.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-stone-warm">
                <th className="p-4">Pedido</th>
                <th className="p-4">Data</th>
                <th className="p-4">Itens</th>
                <th className="p-4">Total</th>
                <th className="p-4">Comprador</th>
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
                  <td className="p-4">{o.payerEmail ?? "—"}</td>
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
