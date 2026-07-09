"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  passwordMatches,
  requireAdmin,
  sessionToken,
} from "@/lib/admin-auth";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  type ProductInput,
} from "@/lib/catalog";
import type { Category } from "@/lib/types";

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) redirect("/admin/login?erro=1");

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_SECONDS, // 12 horas
    path: "/",
  });
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/** "189,90" ou "189.90" → 18990 centavos; vazio → null */
function parsePrice(raw: FormDataEntryValue | null): number | null {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  const n = Number(s.replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

function slugify(s: string): string {
  return s
    .normalize("NFD")
    // remove acentos (marcas combinantes U+0300–U+036F)
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseNotes(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveProductAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("id")) || null;
  const name = String(formData.get("name") ?? "").trim();
  const price = parsePrice(formData.get("price"));
  if (!name || price === null || price <= 0) {
    redirect(id ? `/admin/produtos/${id}?erro=1` : "/admin/produtos/novo?erro=1");
  }

  const input: ProductInput = {
    slug: slugify(String(formData.get("slug") ?? "").trim() || name),
    name,
    brand: String(formData.get("brand") ?? "O Boticário").trim() || "O Boticário",
    category: (String(formData.get("category")) as Category) || "unissex",
    price,
    compareAt: parsePrice(formData.get("compareAt")),
    ml: Number(formData.get("ml")) || 0,
    concentration: String(formData.get("concentration") ?? "").trim(),
    short: String(formData.get("short") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    notes: {
      topo: parseNotes(formData.get("notesTopo")),
      coracao: parseNotes(formData.get("notesCoracao")),
      fundo: parseNotes(formData.get("notesFundo")),
    },
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    art: {
      from: String(formData.get("artFrom") ?? "#c2a25a"),
      to: String(formData.get("artTo") ?? "#7a5a20"),
      bg: String(formData.get("artBg") ?? "#f8f2e4"),
      shape:
        (String(formData.get("artShape")) as ProductInput["art"]["shape"]) ||
        "classic",
    },
  };

  if (id) {
    await updateProduct(id, input);
  } else {
    await createProduct(input);
  }
  redirect("/admin/produtos");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) await deleteProduct(id);
  redirect("/admin/produtos");
}
