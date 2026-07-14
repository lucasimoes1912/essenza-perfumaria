// ===== Configuração da loja =====
// Troque o nome da marca e os dados de contato aqui — o site inteiro usa este arquivo.

export const store = {
  name: "Essenza",
  tagline: "Perfumaria",
  slogan: "Sua assinatura olfativa começa aqui",
  description:
    "Revendedor independente de produtos O Boticário. Perfumes e cosméticos 100% originais, com entrega para todo o Brasil.",
  resellerNotice: "Revendedor independente de produtos O Boticário",
  email: "contato@essenza.com.br",
  instagram: "@essenzaperfumaria",
  freeShippingMin: 29900, // frete grátis acima de R$ 299 (em centavos)
  // Fallback caso alguma UF não esteja na tabela shipping_rates
  // (a tabela por estado é editada em /admin/frete)
  flatShippingFee: 1990,
};

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
