import { Pool } from "pg";
import { seedProducts } from "./seed-products";

// Pool e bootstrap são guardados em globalThis para sobreviver ao
// hot-reload do Next em desenvolvimento sem abrir conexões novas.
const globalForDb = globalThis as unknown as {
  __pool?: Pool;
  __ready?: Promise<void>;
};

function getPool(): Pool {
  if (!globalForDb.__pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL não configurada");
    }
    globalForDb.__pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30_000,
    });
  }
  return globalForDb.__pool;
}

async function bootstrap(): Promise<void> {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id          SERIAL PRIMARY KEY,
      slug        TEXT UNIQUE NOT NULL,
      name        TEXT NOT NULL,
      brand       TEXT NOT NULL DEFAULT 'O Boticário',
      category    TEXT NOT NULL,
      price       INTEGER NOT NULL,
      compare_at  INTEGER,
      ml          INTEGER NOT NULL,
      concentration TEXT NOT NULL,
      short       TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      notes       JSONB NOT NULL DEFAULT '{"topo":[],"coracao":[],"fundo":[]}',
      featured    BOOLEAN NOT NULL DEFAULT false,
      active      BOOLEAN NOT NULL DEFAULT true,
      art         JSONB NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id               SERIAL PRIMARY KEY,
      status           TEXT NOT NULL DEFAULT 'aberto',
      total            INTEGER NOT NULL,
      items            JSONB NOT NULL,
      mp_preference_id TEXT,
      mp_payment_id    TEXT,
      payer_email      TEXT,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS resellers (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT UNIQUE NOT NULL,
      code          TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      active        BOOLEAN NOT NULL DEFAULT true,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE orders ADD COLUMN IF NOT EXISTS
      reseller_id INTEGER REFERENCES resellers(id) ON DELETE SET NULL;
  `);

  const { rows } = await pool.query("SELECT count(*)::int AS n FROM products");
  if (rows[0].n === 0) {
    for (const p of seedProducts) {
      await pool.query(
        `INSERT INTO products
           (slug, name, brand, category, price, compare_at, ml, concentration,
            short, description, notes, featured, art)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (slug) DO NOTHING`,
        [
          p.slug, p.name, p.brand, p.category, p.price, p.compareAt ?? null,
          p.ml, p.concentration, p.short, p.description,
          JSON.stringify(p.notes), p.featured ?? false, JSON.stringify(p.art),
        ]
      );
    }
    console.log(`[db] catálogo inicial criado com ${seedProducts.length} produtos`);
  }
}

/** Executa uma query garantindo que o schema/seed já rodou. */
export async function q<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  if (!globalForDb.__ready) {
    globalForDb.__ready = bootstrap().catch((e) => {
      globalForDb.__ready = undefined; // permite nova tentativa
      throw e;
    });
  }
  await globalForDb.__ready;
  const res = await getPool().query(text, params as never[]);
  return res.rows as T[];
}
