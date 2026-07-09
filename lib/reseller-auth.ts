import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getReseller, type Reseller } from "./resellers";

export const RESELLER_COOKIE = "essenza_revendedor";
/** Sessão de revendedor expira em 7 dias — depois disso, novo login. */
export const RESELLER_SESSION_SECONDS = 60 * 60 * 24 * 7;
/** Cookie de atribuição de venda (?rev=codigo), lido no checkout. */
export const REF_COOKIE = "essenza_ref";

function secret(): string {
  const s = process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD não configurada");
  return s;
}

function sign(id: number, expiresAtMs: number): string {
  return createHmac("sha256", secret())
    .update(`essenza-reseller-v2:${id}:${expiresAtMs}`)
    .digest("hex");
}

/** Token: "<id>.<expiraEmMs>.<hmac>", com expiração assinada. */
export function sessionValue(id: number): string {
  const expiresAtMs = Date.now() + RESELLER_SESSION_SECONDS * 1000;
  return `${id}.${expiresAtMs}.${sign(id, expiresAtMs)}`;
}

function parseSession(value: string | undefined): number | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null; // formato antigo é rejeitado
  const id = Number(parts[0]);
  const expiresAtMs = Number(parts[1]);
  const mac = parts[2];
  if (!Number.isInteger(id) || id <= 0) return null;
  if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) return null;
  let expected: string;
  try {
    expected = sign(id, expiresAtMs);
  } catch {
    return null;
  }
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
