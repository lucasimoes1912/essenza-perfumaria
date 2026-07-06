import Link from "next/link";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin-auth";
import { logoutAction } from "./actions";

export const metadata: Metadata = { title: "Painel do lojista" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logged = await isAdmin();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {logged && (
        <nav className="mb-8 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white p-3 text-sm">
          <span className="px-2 font-serif text-lg font-semibold">Painel</span>
          <Link
            href="/admin/produtos"
            className="rounded-full px-4 py-1.5 font-medium text-stone-warm transition hover:bg-sand hover:text-ink"
          >
            Produtos
          </Link>
          <Link
            href="/admin/pedidos"
            className="rounded-full px-4 py-1.5 font-medium text-stone-warm transition hover:bg-sand hover:text-ink"
          >
            Pedidos
          </Link>
          <Link
            href="/admin/revendedores"
            className="rounded-full px-4 py-1.5 font-medium text-stone-warm transition hover:bg-sand hover:text-ink"
          >
            Revendedores
          </Link>
          <Link
            href="/"
            className="rounded-full px-4 py-1.5 font-medium text-stone-warm transition hover:bg-sand hover:text-ink"
          >
            Ver loja ↗
          </Link>
          <form action={logoutAction} className="ml-auto">
            <button
              type="submit"
              className="rounded-full border border-line px-4 py-1.5 font-medium text-stone-warm transition hover:border-red-300 hover:text-red-500"
            >
              Sair
            </button>
          </form>
        </nav>
      )}
      {children}
    </div>
  );
}
