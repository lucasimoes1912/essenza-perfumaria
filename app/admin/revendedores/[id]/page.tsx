import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getReseller } from "@/lib/resellers";
import ResellerForm from "@/components/admin/ResellerForm";

export const dynamic = "force-dynamic";

export default async function EditarRevendedor({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { erro } = await searchParams;

  const reseller = await getReseller(Number(id));
  if (!reseller) notFound();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold">
        Editar: {reseller.name}
      </h1>
      <ResellerForm reseller={reseller} erro={erro} />
    </div>
  );
}
