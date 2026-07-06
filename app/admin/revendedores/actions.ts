"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import {
  createReseller,
  deleteReseller,
  updateReseller,
} from "@/lib/resellers";

function slugifyCode(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveResellerAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("id")) || null;
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const code = slugifyCode(String(formData.get("code") ?? "").trim() || name);
  const password = String(formData.get("password") ?? "");
  const active = formData.get("active") === "on";

  const back = id ? `/admin/revendedores/${id}` : "/admin/revendedores/novo";
  if (!name || !email || !code) redirect(`${back}?erro=campos`);
  if (!id && password.length < 6) redirect(`${back}?erro=senha`);

  try {
    if (id) {
      await updateReseller(id, {
        name,
        email,
        code,
        active,
        newPassword: password.length >= 6 ? password : undefined,
      });
    } else {
      await createReseller({ name, email, code, password });
    }
  } catch (e) {
    // e-mail ou código duplicado
    console.error("Erro ao salvar revendedor:", e);
    redirect(`${back}?erro=duplicado`);
  }
  redirect("/admin/revendedores");
}

export async function deleteResellerAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) await deleteReseller(id);
  redirect("/admin/revendedores");
}
