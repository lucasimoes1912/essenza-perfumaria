import { NextResponse, type NextRequest } from "next/server";

/**
 * Captura o código de divulgação do revendedor (?rev=codigo) em qualquer
 * página e guarda num cookie por 30 dias. O checkout usa esse cookie para
 * atribuir o pedido ao revendedor.
 */
export function middleware(req: NextRequest) {
  const rev = req.nextUrl.searchParams.get("rev");
  if (!rev) return NextResponse.next();

  const res = NextResponse.next();
  res.cookies.set("essenza_ref", rev.slice(0, 40), {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon).*)"],
};
