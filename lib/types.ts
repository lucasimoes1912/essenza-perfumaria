export type Category = "masculino" | "feminino" | "unissex";

export interface BottleArt {
  /** cor principal do líquido */
  from: string;
  /** cor secundária do líquido (gradiente) */
  to: string;
  /** formato do frasco */
  shape: "classic" | "tall" | "round" | "square";
  /** cor de fundo do card */
  bg: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  /** preço em centavos */
  price: number;
  /** preço "de" riscado, opcional (centavos) */
  compareAt: number | null;
  ml: number;
  concentration: string;
  short: string;
  description: string;
  notes: { topo: string[]; coracao: string[]; fundo: string[] };
  featured: boolean;
  active: boolean;
  /** unidades em estoque; 0 = esgotado */
  stock: number;
  art: BottleArt;
}

/** Dados mínimos que o carrinho guarda no navegador (snapshot do produto). */
export interface CartItem {
  slug: string;
  name: string;
  price: number;
  ml: number;
  concentration: string;
  art: BottleArt;
  qty: number;
}

export interface Order {
  id: number;
  status: string;
  total: number;
  items: { slug: string; name: string; qty: number; unitPrice: number }[];
  mpPaymentId: string | null;
  mpPreferenceId: string | null;
  payerEmail: string | null;
  resellerId: number | null;
  resellerName: string | null;
  createdAt: string;
  updatedAt: string;
}

export const categories: { value: Category; label: string }[] = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
  { value: "unissex", label: "Unissex" },
];

/** Tradução dos status do Mercado Pago para exibição. */
export const orderStatusLabel: Record<string, string> = {
  aberto: "Aberto (aguardando pagamento)",
  approved: "Pago ✅",
  pending: "Pendente",
  in_process: "Em análise",
  rejected: "Recusado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
  charged_back: "Estornado (chargeback)",
};
