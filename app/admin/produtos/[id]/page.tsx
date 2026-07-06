import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getProductById } from "@/lib/catalog";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditarProduto({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { erro } = await searchParams;

  const product = await getProductById(Number(id));
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold">
        Editar: {product.name}
      </h1>
      <ProductForm product={product} erro={!!erro} />
    </div>
  );
}
