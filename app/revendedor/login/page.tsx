import { redirect } from "next/navigation";
import { currentReseller } from "@/lib/reseller-auth";
import { resellerLoginAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function RevendedorLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  if (await currentReseller()) redirect("/revendedor");
  const { erro } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-center font-serif text-3xl font-semibold">
        Área do revendedor
      </h1>
      <p className="mt-2 text-center text-sm text-stone-warm">
        Acompanhe suas vendas e pegue seu link de divulgação.
      </p>

      <form
        action={resellerLoginAction}
        className="mt-8 space-y-4 rounded-2xl border border-line bg-white p-6"
      >
        <label className="block text-sm font-medium">
          E-mail
          <input
            type="email"
            name="email"
            required
            autoFocus
            className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>
        <label className="block text-sm font-medium">
          Senha
          <input
            type="password"
            name="password"
            required
            className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>

        {erro && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            E-mail ou senha incorretos (ou conta desativada).
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-white transition hover:bg-gold"
        >
          Entrar
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-stone-warm">
        Não tem acesso? Fale com o responsável pela loja.
      </p>
    </div>
  );
}
