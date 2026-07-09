"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticateReseller } from "@/lib/resellers";
import {
  RESELLER_COOKIE,
  RESELLER_SESSION_SECONDS,
  sessionValue,
} from "@/lib/reseller-auth";

export async function resellerLoginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const reseller = await authenticateReseller(email, password);
  if (!reseller) redirect("/revendedor/login?erro=1");

  const jar = await cookies();
  jar.set(RESELLER_COOKIE, sessionValue(reseller.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: RESELLER_SESSION_SECONDS, // 7 dias
    path: "/",
  });
  redirect("/revendedor");
}

export async function resellerLogoutAction(): Promise<void> {
  (await cookies()).delete(RESELLER_COOKIE);
  redirect("/revendedor/login");
}
