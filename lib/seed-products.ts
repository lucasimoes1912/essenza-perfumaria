import type { BottleArt, Category } from "./types";

/**
 * Catálogo real: estoque recebido por e-mail em 09/07/2026 (pedido de
 * revendedor O Boticário). Preços = CUSTO da lista, em centavos — o
 * cliente define os preços de venda no painel admin (/admin).
 * ml = 0 significa "não exibir tamanho em ml" (batom, sabonete, combo).
 */
export interface SeedProduct {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  compareAt?: number;
  ml: number;
  concentration: string;
  short: string;
  description: string;
  notes: { topo: string[]; coracao: string[]; fundo: string[] };
  featured?: boolean;
  stock: number;
  art: BottleArt;
}

export const seedProducts: SeedProduct[] = [
  {
    // cód. Boticário 47.339
    slug: "liz-sublime",
    name: "Liz Sublime",
    brand: "O Boticário",
    category: "feminino",
    price: 12741,
    ml: 100,
    concentration: "Desodorante Colônia",
    short: "A face mais intensa e radiante de Liz.",
    description:
      "Liz Sublime eleva o floral frutado clássico de Liz a um novo patamar: mais cremoso, mais envolvente e com rastro marcante. Elegância que entra no ambiente antes de você.",
    notes: {
      topo: ["Pêssego", "Bergamota"],
      coracao: ["Jasmim", "Rosa"],
      fundo: ["Âmbar", "Almíscar"],
    },
    featured: true,
    stock: 1,
    art: { from: "#f2c19b", to: "#c96f45", shape: "tall", bg: "#fbf0e8" },
  },
  {
    // cód. 84.387
    slug: "malbec-desodorante-colonia",
    name: "Malbec",
    brand: "O Boticário",
    category: "masculino",
    price: 10494,
    ml: 100,
    concentration: "Desodorante Colônia",
    short: "O clássico amadeirado inspirado no vinho Malbec.",
    description:
      "O perfume masculino mais icônico do Brasil: acorde exclusivo de uva Malbec fermentada em barris de carvalho, com fundo amadeirado marcante. Presença e elegância para qualquer ocasião.",
    notes: {
      topo: ["Folhas de videira", "Bergamota"],
      coracao: ["Acorde Malbec", "Especiarias"],
      fundo: ["Madeiras nobres", "Âmbar"],
    },
    featured: true,
    stock: 1,
    art: { from: "#a63446", to: "#42101c", shape: "classic", bg: "#f8ecee" },
  },
  {
    // cód. 88.688
    slug: "cuide-se-bem-nuvem-locao-400ml",
    name: "Cuide-se Bem Nuvem — Loção Hidratante",
    brand: "O Boticário",
    category: "unissex",
    price: 6706,
    ml: 400,
    concentration: "Loção Desodorante Hidratante Corporal",
    short: "Hidratação com cheirinho de nuvem: leve e aconchegante.",
    description:
      "A queridinha da linha Cuide-se Bem: hidratação prolongada com a fragrância Nuvem, um acorde macio de algodão com baunilha que abraça a pele. Frasco família de 400ml.",
    notes: {
      topo: ["Notas de algodão"],
      coracao: ["Flor de baunilha"],
      fundo: ["Almíscar"],
    },
    featured: true,
    stock: 1,
    art: { from: "#cfe4f5", to: "#8fb8dd", shape: "round", bg: "#eef5fb" },
  },
  {
    // cód. 97.991
    slug: "combo-siage-nutri-diamond",
    name: "Combo Siàge Nutri Diamond",
    brand: "Siàge (Eudora)",
    category: "feminino",
    price: 6590,
    ml: 0,
    concentration: "Combo capilar (2 itens)",
    short: "Dupla de tratamento para brilho de diamante.",
    description:
      "Combo da linha Siàge Nutri Diamond com 2 itens para nutrição profunda e brilho intenso dos fios. Tecnologia de reparação que trata enquanto lava.",
    notes: { topo: [], coracao: [], fundo: [] },
    featured: true,
    stock: 1,
    art: { from: "#e8d49b", to: "#b8963f", shape: "tall", bg: "#f8f3e6" },
  },
  {
    // cód. 85.483
    slug: "floratta-red-body-spray",
    name: "Floratta Red Body Spray",
    brand: "O Boticário",
    category: "feminino",
    price: 2645,
    ml: 100,
    concentration: "Desodorante Body Spray",
    short: "O floral frutado de Floratta Red em versão spray leve.",
    description:
      "Para perfumar o corpo ao longo do dia: a fragrância romântica de Floratta Red — flores com toque de frutas vermelhas — em body spray prático para retocar quando quiser.",
    notes: {
      topo: ["Frutas vermelhas"],
      coracao: ["Rosa", "Flores brancas"],
      fundo: ["Almíscar"],
    },
    stock: 1,
    art: { from: "#e05a6a", to: "#8f1f2c", shape: "tall", bg: "#fbecee" },
  },
  {
    // cód. 86.132
    slug: "qdb-batom-cremoso-pop-rosa-malva",
    name: "Batom Cremoso Pop — Rosa Malva",
    brand: "Quem Disse, Berenice?",
    category: "feminino",
    price: 1606,
    ml: 0,
    concentration: "Batom Cremoso 3,6g",
    short: "Cor intensa e conforto num rosa malva versátil.",
    description:
      "Batom cremoso de cobertura uniforme e sensação confortável nos lábios. O tom Rosa Malva é aquele coringa que funciona do trabalho à festa.",
    notes: { topo: [], coracao: [], fundo: [] },
    stock: 1,
    art: { from: "#e88fb0", to: "#b03060", shape: "square", bg: "#fbecf2" },
  },
  {
    // cód. 52.378
    slug: "instance-sabonete-frutas-vermelhas",
    name: "Instance Sabonete em Barra — Frutas Vermelhas",
    brand: "Eudora",
    category: "unissex",
    price: 2639,
    ml: 0,
    concentration: "Sabonete em Barra 4x80g",
    short: "Kit com 4 sabonetes de fragrância frutada e vibrante.",
    description:
      "Limpeza suave com o perfume envolvente de frutas vermelhas da linha Instance. Kit com 4 barras de 80g — espuma cremosa e cheiro que fica na pele.",
    notes: { topo: ["Frutas vermelhas"], coracao: [], fundo: [] },
    stock: 1,
    art: { from: "#e06a7a", to: "#a02a3c", shape: "square", bg: "#fbeced" },
  },
  {
    // cód. 85.395
    slug: "instance-sabonete-ameixa-praline",
    name: "Instance Sabonete em Barra — Ameixa e Praliné",
    brand: "Eudora",
    category: "unissex",
    price: 2639,
    ml: 0,
    concentration: "Sabonete em Barra 4x80g",
    short: "Kit com 4 sabonetes doces e aveludados.",
    description:
      "A combinação adocicada de ameixa com praliné da linha Instance em 4 barras de 80g. Banho perfumado com sensação de spa.",
    notes: { topo: ["Ameixa", "Praliné"], coracao: [], fundo: [] },
    stock: 1,
    art: { from: "#b07ac2", to: "#5e2a70", shape: "square", bg: "#f4ecf7" },
  },
];
