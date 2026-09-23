type Blob = { color: string; className: string };

/** Absolutely-positioned blurred colour fields used behind sections. */
export default function Blobs({ blobs, className = "" }: { blobs: Blob[]; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {blobs.map((b, i) => (
        <span key={i} className={`blob ${b.className}`} style={{ background: b.color }} />
      ))}
    </div>
  );
}
