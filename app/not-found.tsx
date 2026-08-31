import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <div className="max-w-xl">
        <p className="label border-b border-rule pb-3 text-muted">Erro 404</p>
        <h1 className="display mt-8 text-[clamp(2.25rem,5vw,3.5rem)]">
          Esta página evaporou.
        </h1>
        <p className="mt-6 leading-relaxed text-muted">
          O endereço não existe mais, ou o produto saiu do catálogo. O caminho
          mais curto de volta é pelo catálogo.
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/produtos" className="btn">
            Ver o catálogo
          </Link>
          <Link href="/" className="btn-ghost">
            Início
          </Link>
        </div>
      </div>
    </div>
  );
}
