"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { store, formatPrice } from "@/lib/config";
import { useCart } from "./CartContext";

const NAV = [
  { href: "/produtos", label: "Catálogo" },
  { href: "/produtos?categoria=feminino", label: "Feminino" },
  { href: "/produtos?categoria=masculino", label: "Masculino" },
  { href: "/#sobre", label: "Sobre" },
];

export default function Header() {
  const { count } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur">
      {/* Tarja de cabeçalho: a única promessa que vale ficar sempre à vista. */}
      <p className="label bg-ink py-2 text-center text-[#fafbf7]">
        Frete grátis acima de {formatPrice(store.freeShippingMin)} · Pix, cartão
        ou retirada em mãos
      </p>

      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 border-b border-rule px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="display text-[26px] uppercase tracking-[0.18em] sm:text-[30px]">
            {store.name}
          </span>
          <span className="label hidden text-muted sm:inline">
            {store.tagline}
          </span>
        </Link>

        <nav className="flex items-center gap-6 lg:gap-9">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`label hidden pb-1 transition-colors md:block ${
                  active
                    ? "border-b border-ink text-ink"
                    : "border-b border-transparent text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/carrinho"
            className="label border-b border-ink pb-1 transition-colors hover:text-iris hover:border-iris"
            aria-label={
              count > 0
                ? `Sacola com ${count} ${count === 1 ? "item" : "itens"}`
                : "Sacola vazia"
            }
          >
            Sacola{count > 0 && <span className="text-iris"> ({count})</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
