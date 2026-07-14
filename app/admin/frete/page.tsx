import { requireAdmin } from "@/lib/admin-auth";
import { getShippingRates } from "@/lib/shipping";
import { REGIONS } from "@/lib/shipping-regions";
import { formatPrice, store } from "@/lib/config";
import { saveShippingRatesAction } from "./actions";

export const dynamic = "force-dynamic";

function centsToInput(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export default async function AdminFrete({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string }>;
}) {
  await requireAdmin();
  const { ok, erro } = await searchParams;
  const rates = await getShippingRates();

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold">Frete por estado</h1>
      <p className="mt-1 max-w-2xl text-sm text-stone-warm">
        Valor cobrado do cliente conforme a UF do endereço de entrega. Compras
        acima de <strong>{formatPrice(store.freeShippingMin)}</strong> têm
        frete grátis, e a opção “retirar em mãos” não cobra frete.
      </p>

      {ok && (
        <p className="mt-4 max-w-2xl rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Tabela de frete salva com sucesso!
        </p>
      )}
      {erro && (
        <p className="mt-4 max-w-2xl rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Há valores inválidos — confira e salve de novo (use números como
          24,90).
        </p>
      )}

      <form action={saveShippingRatesAction} className="mt-6 max-w-3xl space-y-6">
        {REGIONS.map((region) => (
          <div key={region.name} className="rounded-2xl border border-line bg-white p-6">
            <h2 className="mb-4 font-serif text-lg font-semibold">{region.name}</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {region.ufs.map((uf) => (
                <label key={uf} className="block text-sm font-medium">
                  {uf}
                  <div className="mt-1 flex items-center rounded-lg border border-line focus-within:border-gold">
                    <span className="pl-2.5 text-xs text-stone-warm">R$</span>
                    <input
                      name={`uf-${uf}`}
                      defaultValue={centsToInput(rates[uf] ?? store.flatShippingFee)}
                      className="w-full rounded-lg px-2 py-2 text-sm outline-none"
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="rounded-full bg-ink px-8 py-3 text-sm font-semibold text-white transition hover:bg-gold"
        >
          Salvar tabela de frete
        </button>
      </form>
    </div>
  );
}
