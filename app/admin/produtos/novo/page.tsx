import { requireAdmin } from "@/lib/admin-auth";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NovoProduto({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  await requireAdmin();
  const { erro } = await searchParams;

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold">Novo produto</h1>
      <ProductForm erro={!!erro} />
    </div>
  );
}
