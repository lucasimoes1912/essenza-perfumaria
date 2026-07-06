import { requireAdmin } from "@/lib/admin-auth";
import ResellerForm from "@/components/admin/ResellerForm";

export const dynamic = "force-dynamic";

export default async function NovoRevendedor({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  await requireAdmin();
  const { erro } = await searchParams;

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-semibold">Novo revendedor</h1>
      <ResellerForm erro={erro} />
    </div>
  );
}
