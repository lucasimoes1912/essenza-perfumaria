import type { Product } from "@/lib/types";
import { categories } from "@/lib/types";
import { saveProductAction, deleteProductAction } from "@/app/admin/actions";

function centsToInput(cents: number | null): string {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toFixed(2).replace(".", ",");
}

const field =
  "mt-1 w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-gold";
const label = "block text-sm font-medium";

export default function ProductForm({
  product,
  erro,
}: {
  product?: Product;
  erro?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      {erro && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Verifique os campos: nome e preço válido são obrigatórios.
        </p>
      )}

      <form action={saveProductAction} className="space-y-6">
        {product && <input type="hidden" name="id" value={product.id} />}

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold">Informações</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Nome *
              <input name="name" defaultValue={product?.name} required className={field} />
            </label>
            <label className={label}>
              Slug (URL) — vazio gera automático
              <input name="slug" defaultValue={product?.slug} className={field} />
            </label>
            <label className={label}>
              Marca
              <input
                name="brand"
                defaultValue={product?.brand ?? "O Boticário"}
                className={field}
              />
            </label>
            <label className={label}>
              Categoria
              <select
                name="category"
                defaultValue={product?.category ?? "feminino"}
                className={field}
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={label}>
              Concentração / tipo
              <input
                name="concentration"
                defaultValue={product?.concentration}
                placeholder="Desodorante Colônia, Eau de Parfum…"
                className={field}
              />
            </label>
            <label className={label}>
              Tamanho (ml)
              <input
                name="ml"
                type="number"
                min={0}
                defaultValue={product?.ml ?? 100}
                className={field}
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold">Preço</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Preço de venda (R$) *
              <input
                name="price"
                defaultValue={centsToInput(product?.price ?? null)}
                placeholder="189,90"
                required
                className={field}
              />
            </label>
            <label className={label}>
              Preço “de” riscado (R$) — opcional
              <input
                name="compareAt"
                defaultValue={centsToInput(product?.compareAt ?? null)}
                placeholder="219,90"
                className={field}
              />
            </label>
            <label className={label}>
              Estoque (unidades) — 0 mostra “esgotado” na loja
              <input
                name="stock"
                type="number"
                min={0}
                defaultValue={product?.stock ?? 0}
                className={field}
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-4 font-serif text-lg font-semibold">Descrição</h2>
          <label className={label}>
            Frase curta (aparece no card)
            <input name="short" defaultValue={product?.short} className={field} />
          </label>
          <label className={`${label} mt-4`}>
            Descrição completa
            <textarea
              name="description"
              defaultValue={product?.description}
              rows={4}
              className={field}
            />
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className={label}>
              Notas de topo (vírgula)
              <input
                name="notesTopo"
                defaultValue={product?.notes.topo.join(", ")}
                className={field}
              />
            </label>
            <label className={label}>
              Notas de coração
              <input
                name="notesCoracao"
                defaultValue={product?.notes.coracao.join(", ")}
                className={field}
              />
            </label>
            <label className={label}>
              Notas de fundo
              <input
                name="notesFundo"
                defaultValue={product?.notes.fundo.join(", ")}
                className={field}
              />
            </label>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-1 font-serif text-lg font-semibold">Visual do frasco</h2>
          <p className="mb-4 text-xs text-stone-warm">
            Enquanto não houver fotos reais, o site desenha um frasco ilustrado
            com estas cores.
          </p>
          <div className="grid gap-4 sm:grid-cols-4">
            <label className={label}>
              Cor principal
              <input
                name="artFrom"
                type="color"
                defaultValue={product?.art.from ?? "#c2a25a"}
                className="mt-1 h-11 w-full cursor-pointer rounded-lg border border-line"
              />
            </label>
            <label className={label}>
              Cor secundária
              <input
                name="artTo"
                type="color"
                defaultValue={product?.art.to ?? "#7a5a20"}
                className="mt-1 h-11 w-full cursor-pointer rounded-lg border border-line"
              />
            </label>
            <label className={label}>
              Fundo do card
              <input
                name="artBg"
                type="color"
                defaultValue={product?.art.bg ?? "#f8f2e4"}
                className="mt-1 h-11 w-full cursor-pointer rounded-lg border border-line"
              />
            </label>
            <label className={label}>
              Formato
              <select
                name="artShape"
                defaultValue={product?.art.shape ?? "classic"}
                className={field}
              >
                <option value="classic">Clássico</option>
                <option value="tall">Alto</option>
                <option value="round">Redondo</option>
                <option value="square">Quadrado</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-line bg-white p-6">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured ?? false}
              className="h-4 w-4 accent-gold"
            />
            Destaque na home
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="active"
              defaultChecked={product?.active ?? true}
              className="h-4 w-4 accent-gold"
            />
            Ativo (visível na loja)
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-ink px-8 py-3 text-sm font-semibold text-white transition hover:bg-gold"
          >
            {product ? "Salvar alterações" : "Cadastrar produto"}
          </button>
        </div>
      </form>

      {product && (
        <form
          action={deleteProductAction}
          className="mt-4 border-t border-line pt-4"
        >
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="text-sm font-medium text-red-500 hover:underline"
          >
            Excluir este produto
          </button>
        </form>
      )}
    </div>
  );
}
