/**
 * Abstract take on the Geek Room </> mark: two chevrons, a slash and two "eyes",
 * drawn as geometric primitives so they can be animated and recoloured.
 */
export default function GeekMark({ className = "", animated = true }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 200 160" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="gm-slash" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#ff5a1f" />
          <stop offset="1" stopColor="#ffb07a" />
        </linearGradient>
      </defs>
      <g stroke="#19b3bf" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
        <path d="M58 22 L16 80 L58 138" className={animated ? "origin-center [animation:gm-left_6s_ease-in-out_infinite]" : ""} />
        <path d="M142 22 L184 80 L142 138" className={animated ? "origin-center [animation:gm-right_6s_ease-in-out_infinite]" : ""} />
      </g>
      <path d="M116 18 L84 142" stroke="url(#gm-slash)" strokeWidth="14" strokeLinecap="round" />
      <circle cx="66" cy="80" r="11" fill="#f4f1ea" />
      <circle cx="134" cy="80" r="11" fill="#f4f1ea" />
      <style>{`
        @keyframes gm-left { 0%,100% { transform: translateX(0) } 50% { transform: translateX(-6px) } }
        @keyframes gm-right { 0%,100% { transform: translateX(0) } 50% { transform: translateX(6px) } }
        @media (prefers-reduced-motion: reduce) { path { animation: none !important } }
      `}</style>
    </svg>
  );
}
