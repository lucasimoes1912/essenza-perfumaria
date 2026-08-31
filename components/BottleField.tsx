import type { BottleArt as Art } from "@/lib/types";
import BottleArt from "./BottleArt";

/**
 * O campo de cor atrás do frasco. A cor vem do produto (art.bg), mas é
 * lavada contra a superfície do site para nunca brigar com a paleta —
 * se o valor do banco for inválido, o `bg-surface` da classe assume.
 */
export default function BottleField({
  art,
  className = "",
  bottleClassName = "",
  dimmed = false,
  children,
}: {
  art: Art;
  className?: string;
  bottleClassName?: string;
  dimmed?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-surface ${className}`}
      style={{ backgroundColor: `color-mix(in oklab, ${art.bg} 42%, #fafbf7)` }}
    >
      <BottleArt
        art={art}
        className={`${dimmed ? "opacity-35 grayscale" : ""} ${bottleClassName}`}
      />
      {children}
    </div>
  );
}
