import { useId } from "react";
import type { BottleArt as Art } from "@/lib/types";

/**
 * Ilustração SVG do frasco, gerada a partir da configuração do produto
 * (cores + formato). Substituível por fotos reais no futuro.
 *
 * O corpo é desenhado uma vez e reaproveitado como máscara, então o reflexo
 * do vidro acompanha qualquer formato sem precisar ser redesenhado.
 */
export default function BottleArt({
  art,
  className,
}: {
  art: Art;
  className?: string;
}) {
  // useId evita colisão de id quando o mesmo produto aparece duas vezes
  // na página (ex.: capa + grade de seleção).
  const uid = useId().replace(/:/g, "");
  const liquid = `liq${uid}`;
  const clip = `clip${uid}`;

  return (
    <svg
      viewBox="0 0 200 280"
      className={className}
      role="img"
      aria-label="Frasco de perfume"
    >
      <defs>
        <linearGradient id={liquid} x1="0.1" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor={art.from} />
          <stop offset="100%" stopColor={art.to} />
        </linearGradient>
        <clipPath id={clip}>{shape(art.shape, {})}</clipPath>
      </defs>

      {/* sombra projetada */}
      <ellipse cx="100" cy="262" rx="46" ry="6" fill="#181a14" opacity="0.09" />

      {/* gargalo, atrás do corpo */}
      <rect x="91" y="52" width="18" height="26" fill="#c8cdc2" />
      <rect x="91" y="52" width="5" height="26" fill="#e2e6dd" />

      {/* corpo */}
      {shape(art.shape, { fill: `url(#${liquid})` })}

      {/* vidro: reflexo à esquerda, brilho superior e aresta à direita */}
      <g clipPath={`url(#${clip})`}>
        <rect x="0" y="0" width="200" height="52" fill="#ffffff" opacity="0.26" />
        <rect x="52" y="0" width="9" height="280" fill="#ffffff" opacity="0.42" />
        <rect x="66" y="0" width="3" height="280" fill="#ffffff" opacity="0.2" />
        <rect x="140" y="0" width="6" height="280" fill="#ffffff" opacity="0.16" />
        <rect x="0" y="248" width="200" height="40" fill="#181a14" opacity="0.07" />
      </g>

      {/* tampa */}
      <rect x="86" y="16" width="28" height="34" fill="#181a14" />
      <rect x="86" y="16" width="8" height="34" fill="#3a3d35" />
      {/* colar metálico */}
      <rect x="83" y="50" width="34" height="5" fill="#b3b8ac" />
      <rect x="83" y="50" width="34" height="2" fill="#dfe3da" />
    </svg>
  );
}

/** Desenha o corpo do frasco; sem `fill` serve como máscara. */
function shape(kind: Art["shape"], props: { fill?: string }) {
  switch (kind) {
    case "tall":
      return <rect x="74" y="78" width="52" height="178" {...props} />;
    case "round":
      return <circle cx="100" cy="180" r="72" {...props} />;
    case "square":
      return <rect x="50" y="96" width="100" height="160" {...props} />;
    default:
      // clássico: ombros caídos, base reta
      return (
        <path
          d="M100 78 C 62 104, 54 128, 54 168 L 54 256 L 146 256 L 146 168 C 146 128, 138 104, 100 78 Z"
          {...props}
        />
      );
  }
}
