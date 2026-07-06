import type { Reseller } from "@/lib/resellers";
import {
  saveResellerAction,
  deleteResellerAction,
} from "@/app/admin/revendedores/actions";

const field =
  "mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-gold";
const label = "block text-sm font-medium";

const erroMsg: Record<string, string> = {
  campos: "Preencha nome, e-mail e código.",
  senha: "A senha precisa ter pelo menos 6 caracteres.",
  duplicado: "Já existe um revendedor com este e-mail ou código de link.",
};

export default function ResellerForm({
  reseller,
  erro,
}: {
  reseller?: Reseller;
  erro?: string;
}) {
  return (
    <div className="max-w-xl">
      {erro && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {erroMsg[erro] ?? "Não foi possível salvar. Verifique os campos."}
        </p>
      )}

      <form
        action={saveResellerAction}
        className="space-y-4 rounded-2xl border border-line bg-white p-6"
      >
        {reseller && <input type="hidden" name="id" value={reseller.id} />}

        <label className={label}>
          Nome completo *
          <input name="name" defaultValue={reseller?.name} required className={field} />
        </label>
        <label className={label}>
          E-mail (login) *
          <input
            name="email"
            type="email"
            defaultValue={reseller?.email}
            required
            className={field}
          />
        </label>
        <label className={label}>
          Código do link de divulgação — vazio gera do nome
          <input
            name="code"
            defaultValue={reseller?.code}
            placeholder="maria-silva"
            className={field}
          />
        </label>
        <label className={label}>
          {reseller
            ? "Nova senha (deixe vazio para manter a atual)"
            : "Senha * (mínimo 6 caracteres)"}
          <input
            name="password"
            type="password"
            minLength={reseller ? undefined : 6}
            required={!reseller}
            className={field}
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="active"
            defaultChecked={reseller?.active ?? true}
            className="h-4 w-4 accent-gold"
          />
          Conta ativa (pode entrar e receber atribuições)
        </label>

        <button
          type="submit"
          className="w-full rounded-full bg-ink py-3 text-sm font-semibold text-white transition hover:bg-gold"
        >
          {reseller ? "Salvar alterações" : "Cadastrar revendedor"}
        </button>
      </form>

      {reseller && (
        <form action={deleteResellerAction} className="mt-4">
          <input type="hidden" name="id" value={reseller.id} />
          <button
            type="submit"
            className="text-sm font-medium text-red-500 hover:underline"
          >
            Excluir este revendedor (as vendas dele ficam sem atribuição)
          </button>
        </form>
      )}
    </div>
  );
}
