import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getProductsBySlugs } from "@/lib/catalog";
import { createOrder, setOrderPreference } from "@/lib/orders";
import { getActiveResellerByCode } from "@/lib/resellers";
import { REF_COOKIE } from "@/lib/reseller-auth";
import { store } from "@/lib/config";
import type { Address } from "@/lib/types";

interface CheckoutBody {
  items: { slug: string; qty: number }[];
  address: Address;
}

const REQUIRED_ADDRESS_FIELDS: (keyof Address)[] = [
  "name",
  "phone",
  "cep",
  "street",
  "number",
  "neighborhood",
  "city",
  "state",
];

function parseAddress(raw: unknown): Address | null {
  if (!raw || typeof raw !== "object") return null;
  const a = raw as Record<string, unknown>;
  const address = {
    name: String(a.name ?? "").trim(),
    phone: String(a.phone ?? "").trim(),
    cep: String(a.cep ?? "").replace(/\D/g, ""),
    street: String(a.street ?? "").trim(),
    number: String(a.number ?? "").trim(),
    complement: String(a.complement ?? "").trim(),
    neighborhood: String(a.neighborhood ?? "").trim(),
    city: String(a.city ?? "").trim(),
    state: String(a.state ?? "").trim().toUpperCase(),
  };
  if (address.cep.length !== 8) return null;
  if (REQUIRED_ADDRESS_FIELDS.some((f) => !address[f])) return null;
  return address;
}

export async function POST(req: Request) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Pagamento ainda não configurado. Defina a variável MP_ACCESS_TOKEN no Railway (Painel do Mercado Pago > Suas integrações > Credenciais).",
      },
      { status: 503 }
    );
  }

  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  const address = parseAddress(body.address);
  if (!address) {
    return NextResponse.json(
      { error: "Preencha o endereço de entrega completo antes de pagar." },
      { status: 400 }
    );
  }

  // Preços SEMPRE resolvidos no servidor a partir do banco — nunca
  // confiar em valores vindos do cliente.
  const products = await getProductsBySlugs(body.items.map((i) => i.slug));
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const orderItems: { slug: string; name: string; qty: number; unitPrice: number }[] = [];
  for (const { slug, qty } of body.items) {
    const product = bySlug.get(slug);
    const quantity = Math.floor(Number(qty));
    if (!product || !Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      return NextResponse.json(
        { error: `Item inválido ou indisponível no carrinho: ${slug}` },
        { status: 400 }
      );
    }
    if (product.stock < quantity) {
      return NextResponse.json(
        {
          error:
            product.stock === 0
              ? `"${product.name}" esgotou. Remova-o da sacola para continuar.`
              : `"${product.name}" tem só ${product.stock} unidade(s) em estoque. Ajuste a quantidade.`,
        },
        { status: 409 }
      );
    }
    orderItems.push({
      slug: product.slug,
      name: product.name,
      qty: quantity,
      unitPrice: product.price,
    });
  }

  const subtotal = orderItems.reduce((n, i) => n + i.unitPrice * i.qty, 0);
  const shipping = subtotal >= store.freeShippingMin ? 0 : store.flatShippingFee;
  const total = subtotal + shipping;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Atribuição de venda: se o cliente chegou por link de revendedor
  // (?rev=codigo → cookie), o pedido fica vinculado a ele.
  let resellerId: number | null = null;
  const refCode = (await cookies()).get(REF_COOKIE)?.value;
  if (refCode) {
    const reseller = await getActiveResellerByCode(refCode);
    if (reseller) resellerId = reseller.id;
  }

  try {
    // Registra o pedido antes de ir ao Mercado Pago; o webhook atualiza o
    // status usando o external_reference.
    const orderId = await createOrder(orderItems, total, shipping, address, resellerId);

    const mp = new MercadoPagoConfig({ accessToken: token });
    const preference = await new Preference(mp).create({
      body: {
        items: [
          ...orderItems.map((i) => {
            const p = bySlug.get(i.slug)!;
            return {
              id: i.slug,
              title: `${i.name} — ${p.concentration}${p.ml > 0 ? ` ${p.ml}ml` : ""}`,
              quantity: i.qty,
              currency_id: "BRL",
              unit_price: i.unitPrice / 100,
            };
          }),
          ...(shipping > 0
            ? [
                {
                  id: "frete",
                  title: "Frete",
                  quantity: 1,
                  currency_id: "BRL",
                  unit_price: shipping / 100,
                },
              ]
            : []),
        ],
        external_reference: String(orderId),
        statement_descriptor: store.name.toUpperCase(),
        back_urls: {
          success: `${siteUrl}/checkout/sucesso`,
          failure: `${siteUrl}/checkout/erro`,
          pending: `${siteUrl}/checkout/pendente`,
        },
        auto_return: "approved",
        notification_url: `${siteUrl}/api/webhook`,
      },
    });

    if (preference.id) await setOrderPreference(orderId, preference.id);

    return NextResponse.json({ initPoint: preference.init_point });
  } catch (e) {
    console.error("Erro ao criar checkout:", e);
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento. Tente novamente." },
      { status: 502 }
    );
  }
}
