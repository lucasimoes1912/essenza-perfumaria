import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getReseller, type Reseller } from "./resellers";

export const RESELLER_COOKIE = "essenza_revendedor";
/** Cookie de atribuição de venda (?rev=codigo), lido no checkout. */
export const REF_COOKIE = "essenza_ref";

function secret(): string {
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD não configurada");
  return s;
}

function sign(id: number): string {
  return createHmac("sha256", secret())
    .update(`essenza-reseller:${id}`)
    .digest("hex");
}

export function sessionValue(id: number): string {
  return `${id}.${sign(id)}`;
}

function parseSession(value: string | undefined): number | null {
  if (!value) return null;
  const dot = value.indexOf(".");
  if (dot <= 0) return null;
  const id = Number(value.slice(0, dot));
  const mac = value.slice(dot + 1);
  if (!Number.isInteger(id) || id <= 0) return null;
  const expected = sign(id);
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return id;
}

/** Revendedor logado (e ativo), ou null. */
export async function currentReseller(): Promise<Reseller | null> {
  let id: number | null = null;
  try {
    const jar = await cookies();
    id = parseSession(jar.get(RESELLER_COOKIE)?.value);
  } catch {
    return null;
  }
  if (!id) return null;
  const reseller = await getReseller(id);
  return reseller && reseller.active ? reseller : null;
}

export async function requireReseller(): Promise<Reseller> {
  const reseller = await currentReseller();
  if (!reseller) redirect("/revendedor/login");
  return reseller;
}
