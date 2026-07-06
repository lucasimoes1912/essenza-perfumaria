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
  slug: string;
  name: string;
  brand: string;
  category: Category;
  /** preço em centavos */
  price: number;
  /** preço "de" riscado, opcional (centavos) */
  compareAt?: number;
  ml: number;
  concentration: "Eau de Parfum" | "Eau de Toilette" | "Parfum";
  short: string;
  description: string;
  notes: { topo: string[]; coracao: string[]; fundo: string[] };
  featured?: boolean;
  art: BottleArt;
}

export const products: Product[] = [
  {
    slug: "aurora-dourada",
    name: "Aurora Dourada",
    brand: "Essenza",
    category: "feminino",
    price: 28900,
    compareAt: 34900,
    ml: 75,
    concentration: "Eau de Parfum",
    short: "Floral frutado radiante, com pera, peônia e âmbar.",
    description:
      "Aurora Dourada abre com a doçura suculenta da pera e do cassis, revela um coração de peônia e rosa búlgara e assenta num fundo quente de âmbar e almíscar branco. Um perfume luminoso para quem entra no ambiente e muda a atmosfera.",
    notes: {
      topo: ["Pera", "Cassis", "Bergamota"],
      coracao: ["Peônia", "Rosa búlgara", "Jasmim"],
      fundo: ["Âmbar", "Almíscar branco", "Cedro"],
    },
    featured: true,
    art: { from: "#f6c76b", to: "#e8935a", shape: "round", bg: "#faf3e7" },
  },
  {
    slug: "noite-de-oud",
    name: "Noite de Oud",
    brand: "Essenza",
    category: "masculino",
    price: 31900,
    ml: 100,
    concentration: "Eau de Parfum",
    short: "Amadeirado intenso com oud, couro e especiarias.",
    description:
      "Noite de Oud é presença pura: cardamomo e pimenta rosa na abertura, um coração de couro e íris, e uma base profunda de oud, sândalo e baunilha negra. Projeção alta e fixação de mais de 10 horas.",
    notes: {
      topo: ["Cardamomo", "Pimenta rosa"],
      coracao: ["Couro", "Íris", "Canela"],
      fundo: ["Oud", "Sândalo", "Baunilha negra"],
    },
    featured: true,
    art: { from: "#6b4a8f", to: "#2e2140", shape: "square", bg: "#f0ecf5" },
  },
  {
    slug: "brisa-de-verao",
    name: "Brisa de Verão",
    brand: "Essenza",
    category: "unissex",
    price: 21900,
    ml: 100,
    concentration: "Eau de Toilette",
    short: "Cítrico aquático leve, perfeito para o dia a dia.",
    description:
      "Limão siciliano, notas marinhas e um toque de hortelã fazem de Brisa de Verão o companheiro ideal para dias quentes. Fresco, limpo e impossível de enjoar.",
    notes: {
      topo: ["Limão siciliano", "Bergamota", "Hortelã"],
      coracao: ["Notas marinhas", "Gerânio"],
      fundo: ["Almíscar", "Vetiver"],
    },
    featured: true,
    art: { from: "#7cd0e8", to: "#3a8fc7", shape: "tall", bg: "#e9f5fa" },
  },
  {
    slug: "veludo-vermelho",
    name: "Veludo Vermelho",
    brand: "Essenza",
    category: "feminino",
    price: 26900,
    ml: 50,
    concentration: "Parfum",
    short: "Gourmand sedutor de cereja, baunilha e tonka.",
    description:
      "Cereja negra licorosa, baunilha bourbon e fava tonka num extrato concentrado que dura o dia inteiro. Veludo Vermelho é o perfume das noites memoráveis.",
    notes: {
      topo: ["Cereja negra", "Amêndoa"],
      coracao: ["Baunilha bourbon", "Rosa"],
      fundo: ["Fava tonka", "Patchouli"],
    },
    featured: true,
    art: { from: "#e0526e", to: "#8f1f3c", shape: "classic", bg: "#fbecef" },
  },
  {
    slug: "cedro-imperial",
    name: "Cedro Imperial",
    brand: "Essenza",
    category: "masculino",
    price: 24900,
    compareAt: 27900,
    ml: 100,
    concentration: "Eau de Toilette",
    short: "Amadeirado aromático clássico e versátil.",
    description:
      "Lavanda, cedro e vetiver numa composição elegante que funciona do escritório ao jantar. O coringa amadeirado que todo homem deveria ter na bandeja.",
    notes: {
      topo: ["Lavanda", "Bergamota"],
      coracao: ["Cedro", "Gerânio", "Noz-moscada"],
      fundo: ["Vetiver", "Âmbar cinza"],
    },
    art: { from: "#a8b58a", to: "#5d6b45", shape: "square", bg: "#f1f4ea" },
  },
  {
    slug: "flor-de-neroli",
    name: "Flor de Néroli",
    brand: "Essenza",
    category: "feminino",
    price: 19900,
    ml: 50,
    concentration: "Eau de Toilette",
    short: "Floral branco delicado com néroli e almíscar.",
    description:
      "A flor de laranjeira em seu estado mais puro: néroli, jasmim sambac e almíscar limpo. Um abraço de cheiro bom, discreto e sofisticado.",
    notes: {
      topo: ["Néroli", "Tangerina"],
      coracao: ["Jasmim sambac", "Flor de laranjeira"],
      fundo: ["Almíscar", "Madeiras claras"],
    },
    art: { from: "#f7dfa8", to: "#e8b34b", shape: "tall", bg: "#fdf7e8" },
  },
  {
    slug: "ambar-noturno",
    name: "Âmbar Noturno",
    brand: "Essenza",
    category: "unissex",
    price: 29900,
    ml: 75,
    concentration: "Eau de Parfum",
    short: "Oriental âmbar quente com incenso e baunilha.",
    description:
      "Incenso, lábdano e âmbar num perfume envolvente que não escolhe gênero — escolhe atitude. Rastro marcante para noites frias.",
    notes: {
      topo: ["Incenso", "Pimenta preta"],
      coracao: ["Lábdano", "Rosa negra"],
      fundo: ["Âmbar", "Baunilha", "Olíbano"],
    },
    art: { from: "#d98e4a", to: "#7a4520", shape: "round", bg: "#f8efe4" },
  },
  {
    slug: "jardim-secreto",
    name: "Jardim Secreto",
    brand: "Essenza",
    category: "feminino",
    price: 23900,
    ml: 75,
    concentration: "Eau de Parfum",
    short: "Chipre floral verde com figo e vetiver.",
    description:
      "Folha de figueira, lírio do vale e um fundo chipre de musgo de carvalho e vetiver. Para quem gosta de perfume com personalidade e um quê de mistério.",
    notes: {
      topo: ["Folha de figueira", "Galbano"],
      coracao: ["Lírio do vale", "Figo"],
      fundo: ["Musgo de carvalho", "Vetiver"],
    },
    art: { from: "#8fce9b", to: "#3f7a4e", shape: "classic", bg: "#ecf6ee" },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeatured(): Product[] {
  return products.filter((p) => p.featured);
}

export const categories: { value: Category; label: string }[] = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
  { value: "unissex", label: "Unissex" },
];
