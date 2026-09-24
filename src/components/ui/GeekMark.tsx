import { EYES, LEFT, MARK_COLORS, RIGHT, SLASH, STROKE_W, toPath, VIEWBOX } from "@/lib/geekmark";

/**
 * The Geek Room </> mark, traced from the logo and split into addressable parts
 * (data-part="left|right|slash|eye") so scroll timelines can pull it apart.
 */
export default function GeekMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
      className={`overflow-visible ${className}`}
      aria-hidden
      fill="none"
    >
      <g stroke={MARK_COLORS.teal} strokeWidth={STROKE_W} strokeLinecap="round" strokeLinejoin="round">
        <path data-part="left" d={toPath(LEFT)} />
        <path data-part="right" d={toPath(RIGHT)} />
      </g>
      <path data-part="slash" d={toPath(SLASH, true)} fill={MARK_COLORS.orange} />
      {EYES.map(({ c, r }) => (
        <circle key={c[0]} data-part="eye" cx={c[0]} cy={c[1]} r={r} fill={MARK_COLORS.white} />
      ))}
    </svg>
  );
}
