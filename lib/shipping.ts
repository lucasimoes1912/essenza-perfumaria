import { q } from "./db";
import { store } from "./config";
export { REGIONS, ALL_UFS } from "./shipping-regions";

/** Preço do frete (centavos) para uma UF; usa o fallback da config se faltar. */
export async function getShippingRate(uf: string): Promise<number> {
  const rows = await q<{ price: number }>(
    `SELECT price FROM shipping_rates WHERE uf = $1`,
    [uf.toUpperCase()]
  );
  return rows[0]?.price ?? store.flatShippingFee;
}

export async function getShippingRates(): Promise<Record<string, number>> {
  const rows = await q<{ uf: string; price: number }>(
    `SELECT uf, price FROM shipping_rates`
  );
  return Object.fromEntries(rows.map((r) => [r.uf, r.price]));
}

export async function updateShippingRates(
  rates: { uf: string; price: number }[]
): Promise<void> {
  for (const { uf, price } of rates) {
    await q(
      `INSERT INTO shipping_rates (uf, price) VALUES ($1, $2)
       ON CONFLICT (uf) DO UPDATE SET price = $2`,
      [uf.toUpperCase(), price]
    );
  }
}
