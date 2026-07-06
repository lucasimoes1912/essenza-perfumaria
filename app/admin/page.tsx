import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { q } from "@/lib/db";
import { formatPrice } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await requireAdmin();

  const [stats] = await q<{
    produtos: number;
    ativos: number;
    pedidos: number;
    pagos: number;
    faturamento: number;
  }>(`
    SELECT
      (SELECT count(*)::int FROM products)                              AS produtos,
      (SELECT count(*)::int FROM products WHERE active)                 AS ativos,
      (SELECT count(*)::int FROM orders)                                AS pedidos,
      (SELECT count(*)::int FROM orders WHERE status = 'approved')      AS pagos,
      (SELECT COALESCE(sum(total),0)::int FROM orders WHERE status = 'approved') AS faturamento
  `);

  const cards = [
    { label: "Produtos no catálogo", value: `${stats.ativos} ativos / ${stats.produtos}` },
    { label: "Pedidos registrados", value: String(stats.pedidos) },
    { label: "Pedidos pagos", value: String(stats.pagos) },
    { label: "Faturamento (pagos)", value: formatPrice(stats.faturamento) },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Visão geral</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-white p-5">
            <p className="text-sm text-stone-warm">{c.label}</p>
            <p className="mt-1 text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href="/admin/produtos/novo"
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold"
        >
          + Cadastrar produto
        </Link>
        <Link
          href="/admin/pedidos"
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold transition hover:border-gold hover:text-gold"
        >
          Ver pedidos
        </Link>
      </div>
    </div>
  );
}
