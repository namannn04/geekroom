import Link from "next/link";

export default function Tabs({ tabs, active }: { tabs: { key: string; label: string; href: string; count?: number }[]; active: string }) {
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-line px-4 sm:px-6">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-2 py-2.5 text-[13px] transition-colors ${
            active === t.key ? "border-orange text-paper" : "border-transparent text-muted hover:text-paper"
          }`}
        >
          {t.label}
          {t.count != null && <span className="font-mono text-[11px] text-subtle">{t.count}</span>}
        </Link>
      ))}
    </nav>
  );
}
