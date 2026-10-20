export default function StatTile({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-lg border border-line bg-ink-2 px-4 py-3">
      <p className="font-mono text-[10px] tracking-[0.08em] text-subtle uppercase">{label}</p>
      <p className="mt-1 font-display text-3xl font-extrabold [font-stretch:80%]">{value}</p>
      {sub && <p className="text-[11px] text-subtle">{sub}</p>}
    </div>
  );
}
