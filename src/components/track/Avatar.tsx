/* eslint-disable @next/next/no-img-element */

// Muted tints so a wall of initials doesn't fight the orange accent
const TINTS = ["#3b3f36", "#40362f", "#2f3b3c", "#3a3443", "#433a2c", "#2e3a31"];

export default function Avatar({
  person,
  size = 20,
  className = "",
}: {
  person: { id?: number; name: string; image?: string | null } | null | undefined;
  size?: number;
  className?: string;
}) {
  const style = { width: size, height: size, fontSize: Math.max(8, size * 0.42) };
  if (!person) {
    return (
      <span
        style={style}
        className={`inline-grid shrink-0 place-items-center rounded-full border border-dashed border-line-strong ${className}`}
        aria-label="Unassigned"
      />
    );
  }
  if (person.image) {
    return <img src={person.image} alt="" style={style} className={`shrink-0 rounded-full object-cover ${className}`} />;
  }
  const initials = person.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span
      style={{ ...style, background: TINTS[(person.id ?? person.name.length) % TINTS.length] }}
      className={`inline-grid shrink-0 place-items-center rounded-full font-mono font-medium text-paper ${className}`}
      aria-hidden
    >
      {initials}
    </span>
  );
}
