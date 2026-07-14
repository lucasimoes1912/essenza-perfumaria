import { NextResponse } from "next/server";
import { getShippingRate } from "@/lib/shipping";
import { ALL_UFS } from "@/lib/shipping-regions";

/** Cotação de frete por UF, usada pelo carrinho. */
export async function GET(req: Request) {
  const uf = (new URL(req.url).searchParams.get("uf") ?? "").toUpperCase();
  if (!ALL_UFS.includes(uf)) {
    return NextResponse.json({ error: "UF inválida" }, { status: 400 });
  }
  const price = await getShippingRate(uf);
  return NextResponse.json({ uf, price });
}
