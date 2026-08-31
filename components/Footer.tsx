import Link from "next/link";
import { store } from "@/lib/config";

const COLUMNS = [
  {
    title: "Catálogo",
    links: [
      { href: "/produtos", label: "Todos os perfumes" },
      { href: "/produtos?categoria=feminino", label: "Feminino" },
      { href: "/produtos?categoria=masculino", label: "Masculino" },
      { href: "/produtos?categoria=unissex", label: "Unissex" },
    ],
  },
  {
    title: "Acesso",
    links: [
      { href: "/carrinho", label: "Sua sacola" },
      { href: "/admin", label: "Área do lojista" },
      { href: "/revendedor", label: "Área do revendedor" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-rule">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="display text-[28px] uppercase tracking-[0.18em]">
              {store.name}
            </p>
            <p className="label mt-2 text-muted">{store.tagline}</p>
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-muted">
              {store.description}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="label text-muted">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-[14px]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-iris">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="label text-muted">Contato</p>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              <li>
                <a href={`mailto:${store.email}`} className="hover:text-iris">
                  {store.email}
                </a>
              </li>
              <li className="text-muted">{store.instagram}</li>
              <li className="text-muted">
                Pagamento processado pelo Mercado Pago
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-5 py-6 text-[12px] leading-relaxed text-muted sm:flex-row sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {store.name} {store.tagline}
          </p>
          <p className="sm:text-right">
            {store.resellerNotice}. Este site não é o site oficial de O
            Boticário.
          </p>
        </div>
      </div>
    </footer>
  );
}
