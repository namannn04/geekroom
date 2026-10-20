import type { TaskStatus } from "@/lib/track/schema";

/** Linear-style status glyphs: shape carries the meaning, colour only reinforces it. */
export function StatusIcon({ status, size = 14 }: { status: TaskStatus; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 14 14", fill: "none", "aria-hidden": true } as const;
  switch (status) {
    case "backlog":
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="5.5" stroke="var(--subtle)" strokeWidth="1.5" strokeDasharray="1.6 1.9" />
        </svg>
      );
    case "todo":
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="5.5" stroke="var(--muted)" strokeWidth="1.5" />
        </svg>
      );
    case "in_progress":
    case "in_review": {
      const frac = status === "in_progress" ? 0.5 : 0.75;
      const a = frac * 2 * Math.PI;
      const x = 7 + 3 * Math.sin(a);
      const y = 7 - 3 * Math.cos(a);
      const color = status === "in_progress" ? "var(--orange)" : "var(--teal)";
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.5" />
          <path d={`M7 7 V4 A3 3 0 ${frac > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`} fill={color} />
        </svg>
      );
    }
    case "done":
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="6.25" fill="var(--teal)" />
          <path d="M4.3 7.2 6.2 9l3.5-3.8" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "canceled":
      return (
        <svg {...common}>
          <circle cx="7" cy="7" r="6.25" fill="var(--subtle)" />
          <path d="m5 5 4 4M9 5 5 9" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

export function PriorityIcon({ priority, size = 14 }: { priority: number; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 14 14", "aria-hidden": true } as const;
  if (priority === 1) {
    return (
      <svg {...common}>
        <rect x="1" y="1" width="12" height="12" rx="3" fill="var(--orange)" />
        <path d="M7 3.8v4" stroke="var(--ink)" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="7" cy="10.2" r="0.95" fill="var(--ink)" />
      </svg>
    );
  }
  if (priority === 0) {
    return (
      <svg {...common}>
        {[2, 6, 10].map((x) => (
          <rect key={x} x={x} y="6.3" width="2.4" height="1.4" rx="0.7" fill="var(--subtle)" />
        ))}
      </svg>
    );
  }
  // High lights all three bars, medium two, low one
  const lit = 5 - priority;
  return (
    <svg {...common}>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={1.5 + i * 4}
          y={9 - i * 3}
          width="3"
          height={3 + i * 3}
          rx="0.8"
          fill={i < lit ? "var(--paper)" : "var(--line-strong)"}
        />
      ))}
    </svg>
  );
}

export function TierBadge({ tier }: { tier: "core" | "lead" | "member" }) {
  const styles = {
    core: "border-orange/50 text-orange",
    lead: "border-teal/50 text-teal",
    member: "border-line-strong text-muted",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full border px-1.5 py-px font-mono text-[10px] tracking-[0.08em] uppercase ${styles[tier]}`}>
      {tier}
    </span>
  );
}
