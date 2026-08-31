import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/config";
import BottleField from "./BottleField";
import { noteSummary } from "./NoteLadder";

/** Uma entrada do catálogo, montada como verbete de revista. */
export default function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock === 0;
  const notes = noteSummary(product.notes);

  const flag = soldOut
    ? { text: "Esgotado", tone: "text-muted" }
    : product.compareAt
      ? { text: "Oferta", tone: "text-iris" }
      : product.stock <= 3
        ? { text: `Últimas ${product.stock}`, tone: "text-rust" }
        : null;

  return (
    <Link href={`/produtos/${product.slug}`} className="group block">
      <BottleField
        art={product.art}
        dimmed={soldOut}
        className="aspect-[4/5]"
        bottleClassName="h-[74%] transition-transform duration-500 ease-out group-hover:-translate-y-2"
      >
        <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/[0.05]" />
        {flag && (
          <span
            className={`label absolute left-4 top-4 bg-surface px-2 py-1 ${flag.tone}`}
          >
            {flag.text}
          </span>
        )}
      </BottleField>

      <div className="mt-4 border-t border-rule pt-3">
        <p className="label text-muted">
          {product.category}
          {product.concentration && <> · {product.concentration}</>}
          {product.ml > 0 && <> · {product.ml} ml</>}
        </p>

        <h3 className="display mt-2 text-[21px] leading-tight decoration-1 underline-offset-4 group-hover:underline">
          {product.name}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {notes || product.short}
        </p>

        <p className="mt-3 flex items-baseline gap-2.5">
          <span className="text-[16px] font-medium">
            {formatPrice(product.price)}
          </span>
          {product.compareAt && (
            <span className="text-[13px] text-muted line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
