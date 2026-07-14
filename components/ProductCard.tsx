import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/config";
import BottleArt from "./BottleArt";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produtos/${product.slug}`}
      className="group overflow-hidden rounded-[18px] border border-line bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
    >
      <div
        className="relative flex aspect-square items-center justify-center"
        style={{ backgroundColor: product.art.bg }}
      >
        <BottleArt
          art={product.art}
          className={`h-[70%] transition duration-300 group-hover:scale-105 ${product.stock === 0 ? "opacity-40 grayscale" : ""}`}
        />
        {product.stock === 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Esgotado
          </span>
        ) : product.compareAt ? (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Oferta
          </span>
        ) : product.stock <= 3 ? (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Últimas unidades
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-gold">
          {product.category} · {product.concentration}
        </p>
        <h3 className="mt-1 font-serif text-base font-semibold leading-snug">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-stone-warm">{product.short}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-[17px] font-bold">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-sm text-stone-warm line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
          {product.ml > 0 && (
            <span className="ml-auto text-xs text-stone-warm">{product.ml} ml</span>
          )}
        </div>
      </div>
    </Link>
  );
}
