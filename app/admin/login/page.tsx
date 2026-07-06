import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { loginAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { erro } = await searchParams;

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-center font-serif text-3xl font-semibold">
        Painel do lojista
      </h1>
      <p className="mt-2 text-center text-sm text-stone-warm">
        Área restrita — acesso com senha administrativa.
      </p>

      <form
        action={loginAction}
        className="mt-8 space-y-4 rounded-2xl border border-line bg-white p-6"
      >
        <label className="block text-sm font-medium">
          Senha
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="mt-1 w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-gold"
          />
        </label>

        {erro && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            Senha incorreta. Tente novamente.
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-white transition hover:bg-gold"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
