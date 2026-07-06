import type { BottleArt as Art } from "@/lib/types";

/**
 * Ilustração SVG de frasco de perfume gerada a partir da configuração do
 * produto (cores + formato). Substituível por fotos reais no futuro.
 */
export default function BottleArt({
  art,
  className,
}: {
  art: Art;
  className?: string;
}) {
  const gid = `g-${art.from.slice(1)}-${art.to.slice(1)}-${art.shape}`;
  return (
    <svg
      viewBox="0 0 200 260"
      className={className}
      role="img"
      aria-label="Frasco de perfume"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={art.from} />
          <stop offset="100%" stopColor={art.to} />
        </linearGradient>
        <linearGradient id={`${gid}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* sombra */}
      <ellipse cx="100" cy="244" rx="52" ry="8" fill="#000" opacity="0.08" />

      {Body(art, gid)}

      {/* tampa */}
      <rect x="86" y="28" width="28" height="26" rx="4" fill="#2b2620" />
      <rect x="86" y="28" width="10" height="26" rx="4" fill="#4a423a" />
      {/* gargalo */}
      <rect x="91" y="54" width="18" height="14" fill="#cfc7ba" />
    </svg>
  );
}

function Body(art: Art, gid: string) {
  const liquid = `url(#${gid})`;
  const glass = `url(#${gid}-glass)`;
  switch (art.shape) {
    case "tall":
      return (
        <g>
          <rect x="70" y="68" width="60" height="172" rx="10" fill={liquid} />
          <rect x="70" y="68" width="60" height="172" rx="10" fill={glass} />
          <rect x="70" y="68" width="60" height="34" rx="10" fill="#fff" opacity="0.35" />
        </g>
      );
    case "round":
      return (
        <g>
          <circle cx="100" cy="164" r="76" fill={liquid} />
          <circle cx="100" cy="164" r="76" fill={glass} />
          <ellipse cx="74" cy="132" rx="20" ry="30" fill="#fff" opacity="0.3" />
        </g>
      );
    case "square":
      return (
        <g>
          <rect x="48" y="86" width="104" height="154" rx="8" fill={liquid} />
          <rect x="48" y="86" width="104" height="154" rx="8" fill={glass} />
          <rect x="48" y="86" width="104" height="28" rx="8" fill="#fff" opacity="0.3" />
        </g>
      );
    default: // classic (ombros arredondados)
      return (
        <g>
          <path
            d="M100 70 C 60 96, 52 118, 52 158 L 52 224 Q 52 240 68 240 L 132 240 Q 148 240 148 224 L 148 158 C 148 118, 140 96, 100 70 Z"
            fill={liquid}
          />
          <path
            d="M100 70 C 60 96, 52 118, 52 158 L 52 224 Q 52 240 68 240 L 132 240 Q 148 240 148 224 L 148 158 C 148 118, 140 96, 100 70 Z"
            fill={glass}
          />
          <ellipse cx="76" cy="140" rx="14" ry="26" fill="#fff" opacity="0.3" />
        </g>
      );
  }
}
