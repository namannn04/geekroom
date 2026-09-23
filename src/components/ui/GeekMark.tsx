/**
 * Abstract take on the Geek Room </> mark, split into addressable parts
 * (data-part="left|right|slash|eye") so scroll timelines can pull it apart.
 */
export default function GeekMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" className={`overflow-visible ${className}`} aria-hidden fill="none">
      <g stroke="#19b3bf" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
        <path data-part="left" d="M58 22 L16 80 L58 138" />
        <path data-part="right" d="M142 22 L184 80 L142 138" />
      </g>
      <path data-part="slash" d="M116 18 L84 142" stroke="#ff5a1f" strokeWidth="14" strokeLinecap="round" />
      <circle data-part="eye" cx="66" cy="80" r="11" fill="#eeece6" />
      <circle data-part="eye" cx="134" cy="80" r="11" fill="#eeece6" />
    </svg>
  );
}
