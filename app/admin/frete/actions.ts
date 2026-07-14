"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { updateShippingRates } from "@/lib/shipping";
import { ALL_UFS } from "@/lib/shipping-regions";

/** "24,90" ou "24.90" → 2490 centavos; inválido → null */
function parsePrice(raw: FormDataEntryValue | null): number | null {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  const n = Number(s.replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

export async function saveShippingRatesAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const rates: { uf: string; price: number }[] = [];
  for (const uf of ALL_UFS) {
    const price = parsePrice(formData.get(`uf-${uf}`));
    if (price === null) redirect("/admin/frete?erro=1");
    rates.push({ uf, price });
  }

  await updateShippingRates(rates);
  redirect("/admin/frete?ok=1");
}
