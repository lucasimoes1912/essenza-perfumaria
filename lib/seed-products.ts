import type { BottleArt, Category } from "./types";

/**
 * Catálogo inicial: linhas clássicas de O Boticário.
 * Preços são ESTIMATIVAS em centavos — ajuste os valores reais de revenda
 * no painel admin (/admin). Notas olfativas são aproximações editáveis.
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
  art: BottleArt;
}

export const seedProducts: SeedProduct[] = [
  {
    slug: "malbec-tradicional",
    name: "Malbec Tradicional",
    brand: "O Boticário",
    category: "masculino",
    price: 18990,
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
    art: { from: "#a63446", to: "#42101c", shape: "classic", bg: "#f8ecee" },
  },
  {
    slug: "zaad-eau-de-parfum",
    name: "Zaad",
    brand: "O Boticário",
    category: "masculino",
    price: 31990,
    ml: 95,
    concentration: "Eau de Parfum",
    short: "Sofisticação amadeirada em alta concentração.",
    description:
      "O Eau de Parfum masculino premium de O Boticário: abertura cítrica especiada, coração de madeiras frescas e fundo envolvente de âmbar e sândalo. Fixação prolongada para quem não passa despercebido.",
    notes: {
      topo: ["Bergamota", "Cardamomo"],
      coracao: ["Cedro", "Vetiver"],
      fundo: ["Âmbar", "Sândalo"],
    },
    featured: true,
    art: { from: "#d9b45a", to: "#6e5120", shape: "square", bg: "#f8f2e4" },
  },
  {
    slug: "arbo",
    name: "Arbo",
    brand: "O Boticário",
    category: "masculino",
    price: 15990,
    ml: 100,
    concentration: "Desodorante Colônia",
    short: "Frescor verde amadeirado, o cheiro da natureza.",
    description:
      "Inspirado na energia das florestas: notas verdes vibrantes com madeiras frescas num perfume leve, jovem e versátil para o dia a dia.",
    notes: {
      topo: ["Notas verdes", "Maçã"],
      coracao: ["Folhas de figueira", "Lavanda"],
      fundo: ["Madeiras claras", "Almíscar"],
    },
    featured: true,
    art: { from: "#7cc08a", to: "#2f5e3a", shape: "square", bg: "#ecf5ee" },
  },
  {
    slug: "quasar-classico",
    name: "Quasar Clássico",
    brand: "O Boticário",
    category: "masculino",
    price: 13990,
    ml: 100,
    concentration: "Desodorante Colônia",
    short: "Frescor esportivo que atravessa gerações.",
    description:
      "O azul clássico das prateleiras brasileiras: cítrico aromático com gengibre e menta, refrescante e despretensioso. Perfeito para treino, trabalho e rotina.",
    notes: {
      topo: ["Limão", "Menta"],
      coracao: ["Lavanda", "Gengibre"],
      fundo: ["Almíscar", "Madeiras"],
    },
    art: { from: "#4aa3e0", to: "#173a6e", shape: "tall", bg: "#e9f2fa" },
  },
  {
    slug: "lily-eau-de-parfum",
    name: "Lily",
    brand: "O Boticário",
    category: "feminino",
    price: 28990,
    ml: 75,
    concentration: "Eau de Parfum",
    short: "O floral chipre mais premiado de O Boticário.",
    description:
      "Feminino, sofisticado e inconfundível: lírio e jasmim sobre um fundo chipre de patchouli e baunilha. O perfume de quem quer ser lembrada.",
    notes: {
      topo: ["Bergamota", "Frésia"],
      coracao: ["Lírio", "Jasmim"],
      fundo: ["Patchouli", "Baunilha"],
    },
    featured: true,
    art: { from: "#f2d9a0", to: "#c2933f", shape: "round", bg: "#fbf5e8" },
  },
  {
    slug: "egeo-dolce",
    name: "Egeo Dolce",
    brand: "O Boticário",
    category: "feminino",
    price: 15490,
    ml: 90,
    concentration: "Desodorante Colônia",
    short: "Doce na medida: marshmallow com frutas vermelhas.",
    description:
      "O gourmand queridinho do Brasil: framboesa suculenta, marshmallow cremoso e baunilha. Divertido, jovem e viciante — impossível não ganhar elogio.",
    notes: {
      topo: ["Framboesa", "Mandarina"],
      coracao: ["Marshmallow", "Flor de laranjeira"],
      fundo: ["Baunilha", "Almíscar"],
    },
    featured: true,
    art: { from: "#f29bbd", to: "#c23a76", shape: "round", bg: "#fdeef4" },
  },
  {
    slug: "floratta-blue",
    name: "Floratta Blue",
    brand: "O Boticário",
    category: "feminino",
    price: 14690,
    ml: 75,
    concentration: "Desodorante Colônia",
    short: "Floral frutado delicado com maçã e rosas.",
    description:
      "Romântica e leve: a doçura da maçã com um buquê floral suave. A cara de um dia bonito — para usar sem ocasião especial.",
    notes: {
      topo: ["Maçã", "Pera"],
      coracao: ["Rosa", "Violeta"],
      fundo: ["Almíscar", "Madeiras claras"],
    },
    art: { from: "#9db8e8", to: "#3f5fb0", shape: "classic", bg: "#edf1fa" },
  },
  {
    slug: "coffee-woman-seduction",
    name: "Coffee Woman Seduction",
    brand: "O Boticário",
    category: "feminino",
    price: 17990,
    ml: 100,
    concentration: "Desodorante Colônia",
    short: "Sedução em forma de café com frutas vermelhas.",
    description:
      "Para a noite: o acorde de café característico da linha Coffee envolvido em frutas vermelhas, flores brancas e baunilha. Rastro marcante e sensual.",
    notes: {
      topo: ["Frutas vermelhas", "Bergamota"],
      coracao: ["Café", "Flores brancas"],
      fundo: ["Baunilha", "Âmbar"],
    },
    art: { from: "#c08a5a", to: "#4e2a16", shape: "square", bg: "#f5ede6" },
  },
  {
    slug: "liz-eau-de-parfum",
    name: "Liz",
    brand: "O Boticário",
    category: "feminino",
    price: 27990,
    ml: 75,
    concentration: "Eau de Parfum",
    short: "Elegância luminosa em um floral frutado.",
    description:
      "Radiante como quem sorri ao entrar: pêssego e cítricos na abertura, jasmim e rosa no coração, almíscar aconchegante no fundo. Um clássico moderno.",
    notes: {
      topo: ["Pêssego", "Cítricos"],
      coracao: ["Jasmim", "Rosa"],
      fundo: ["Almíscar", "Cedro"],
    },
    art: { from: "#f2b8a0", to: "#cc6a48", shape: "tall", bg: "#fbeee8" },
  },
  {
    slug: "glamour-secrets-black",
    name: "Glamour Secrets Black",
    brand: "O Boticário",
    category: "feminino",
    price: 16990,
    ml: 75,
    concentration: "Desodorante Colônia",
    short: "Misteriosa: cereja, rosas e baunilha negra.",
    description:
      "O lado intenso da linha Glamour: frutas vermelhas licorosas, buquê de rosas e um fundo cremoso de baunilha com patchouli. Para noites que pedem presença.",
    notes: {
      topo: ["Cereja", "Framboesa"],
      coracao: ["Rosa", "Peônia"],
      fundo: ["Baunilha", "Patchouli"],
    },
    art: { from: "#c25a8f", to: "#281526", shape: "classic", bg: "#f5ecf2" },
  },
];
