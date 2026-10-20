export default function Progress({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-orange" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-20 text-right font-mono text-[11px] text-subtle">
        {done}/{total} · {pct}%
      </span>
    </div>
  );
}
