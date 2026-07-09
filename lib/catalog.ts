import { q } from "./db";
import type { Category, Product } from "./types";

interface ProductRow {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  compare_at: number | null;
  ml: number;
  concentration: string;
  short: string;
  description: string;
  notes: Product["notes"];
  featured: boolean;
  active: boolean;
  stock: number;
  art: Product["art"];
}

function toProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    category: r.category,
    price: r.price,
    compareAt: r.compare_at,
    ml: r.ml,
    concentration: r.concentration,
    short: r.short,
    description: r.description,
    notes: r.notes,
    featured: r.featured,
    active: r.active,
    stock: r.stock,
    art: r.art,
  };
}

const COLS = `id, slug, name, brand, category, price, compare_at, ml,
  concentration, short, description, notes, featured, active, stock, art`;

export async function getProducts(opts?: {
  category?: Category;
  includeInactive?: boolean;
}): Promise<Product[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  if (!opts?.includeInactive) where.push("active = true");
  if (opts?.category) {
    params.push(opts.category);
    where.push(`category = $${params.length}`);
  }
  const rows = await q<ProductRow>(
    `SELECT ${COLS} FROM products
     ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY featured DESC, name ASC`,
    params
  );
  return rows.map(toProduct);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const rows = await q<ProductRow>(
    `SELECT ${COLS} FROM products WHERE slug = $1 AND active = true`,
    [slug]
  );
  return rows[0] ? toProduct(rows[0]) : undefined;
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const rows = await q<ProductRow>(
    `SELECT ${COLS} FROM products WHERE id = $1`,
    [id]
  );
  return rows[0] ? toProduct(rows[0]) : undefined;
}

export async function getFeatured(): Promise<Product[]> {
  const rows = await q<ProductRow>(
    `SELECT ${COLS} FROM products WHERE active = true AND featured = true
     ORDER BY name ASC LIMIT 8`
  );
  return rows.map(toProduct);
}

/** Busca vários produtos ativos pelos slugs (validação de carrinho). */
export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  if (slugs.length === 0) return [];
  const rows = await q<ProductRow>(
    `SELECT ${COLS} FROM products WHERE slug = ANY($1) AND active = true`,
    [slugs]
  );
  return rows.map(toProduct);
}

export interface ProductInput {
  slug: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  compareAt: number | null;
  ml: number;
  concentration: string;
  short: string;
  description: string;
  notes: Product["notes"];
  featured: boolean;
  active: boolean;
  stock: number;
  art: Product["art"];
}

export async function createProduct(p: ProductInput): Promise<void> {
  await q(
    `INSERT INTO products
       (slug, name, brand, category, price, compare_at, ml, concentration,
        short, description, notes, featured, active, stock, art)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
    [
      p.slug, p.name, p.brand, p.category, p.price, p.compareAt, p.ml,
      p.concentration, p.short, p.description, JSON.stringify(p.notes),
      p.featured, p.active, p.stock, JSON.stringify(p.art),
    ]
  );
}

export async function updateProduct(id: number, p: ProductInput): Promise<void> {
  await q(
    `UPDATE products SET
       slug=$2, name=$3, brand=$4, category=$5, price=$6, compare_at=$7,
       ml=$8, concentration=$9, short=$10, description=$11, notes=$12,
       featured=$13, active=$14, stock=$15, art=$16, updated_at=now()
     WHERE id=$1`,
    [
      id, p.slug, p.name, p.brand, p.category, p.price, p.compareAt, p.ml,
      p.concentration, p.short, p.description, JSON.stringify(p.notes),
      p.featured, p.active, p.stock, JSON.stringify(p.art),
    ]
  );
}

/** Desconta estoque dos itens vendidos (nunca abaixo de zero). */
export async function decrementStock(
  items: { slug: string; qty: number }[]
): Promise<void> {
  for (const { slug, qty } of items) {
    await q(
      `UPDATE products SET stock = GREATEST(0, stock - $2), updated_at=now()
       WHERE slug=$1`,
      [slug, qty]
    );
  }
}

export async function deleteProduct(id: number): Promise<void> {
  await q(`DELETE FROM products WHERE id=$1`, [id]);
}
