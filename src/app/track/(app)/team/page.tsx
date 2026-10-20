import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/track/PageHeader";
import Avatar from "@/components/track/Avatar";
import { TierBadge } from "@/components/track/icons";
import InviteButton, { ResendInvite } from "@/components/track/InviteDialog";
import { requireUser } from "@/lib/track/session";
import { effortSince, listPeople, listTasks } from "@/lib/track/queries";
import { OPEN_STATUSES, TIERS } from "@/lib/track/constants";
import { descendantIds } from "@/lib/track/permissions";
import { team as siteTeam } from "@/data/site";
import type { User } from "@/lib/track/schema";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  const me = await requireUser();
  const [people, tasks, effort] = await Promise.all([listPeople(), listTasks(), effortSince(new Date(Date.now() - 30 * 86_400_000))]);
  const active = people.filter((p) => p.active);
  const openCount = (id: number) => tasks.filter((t) => t.assigneeId === id && OPEN_STATUSES.includes(t.status)).length;
  const reportsOf = (id: number) => active.filter((p) => p.managerId === id);
  const core = active.filter((p) => p.tier === "core");
  // People whose manager is missing (e.g. after a tier change) still need a place in the chart
  const placed = new Set(core.flatMap((c) => [c.id, ...descendantIds(c, active)]));
  const orphans = active.filter((p) => !placed.has(p.id));

  const Row = ({ p, depth }: { p: User; depth: number }) => {
    const e = effort.get(p.id);
    const kids = reportsOf(p.id);
    return (
      <li>
        <div
          className="relative flex items-center gap-3 border-b border-line/60 py-2.5 pr-4 text-[13px] transition-colors hover:bg-ink-2 sm:pr-6"
          style={{ paddingLeft: `calc(${depth * 28}px + 1rem)` }}
        >
          {depth > 0 && (
            <span aria-hidden className="absolute top-0 h-1/2 w-3 rounded-bl-md border-b border-l border-line-strong" style={{ left: `calc(${depth * 28 - 18}px + 1rem)` }} />
          )}
          <Link href={`/people/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar person={p} size={depth === 0 ? 32 : 26} />
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="truncate font-medium">{p.name}</span>
                <TierBadge tier={p.tier} />
                {p.id === me.id && <span className="text-[11px] text-subtle">you</span>}
              </span>
              {p.title && <span className="block truncate text-[12px] text-subtle">{p.title}</span>}
            </span>
          </Link>
          {p.passwordHash ? (
            <span className="hidden shrink-0 items-center gap-5 font-mono text-[11px] text-subtle sm:flex">
              {kids.length > 0 && <span>
                  {kids.length} {kids.length === 1 ? "report" : "reports"}
                </span>}
              <span>{openCount(p.id)} open</span>
              <span className="w-16 text-right text-paper">{e?.points ?? 0} pts</span>
            </span>
          ) : (
            (me.tier === "core" || p.managerId === me.id) && (
              <span className="flex shrink-0 items-center gap-2">
                <span className="hidden text-[11px] text-subtle sm:inline">Invite pending</span>
                <ResendInvite userId={p.id} />
              </span>
            )
          )}
        </div>
        {kids.length > 0 && (
          <ul>
            {kids.map((k) => (
              <Row key={k.id} p={k} depth={depth + 1} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <PageHeader title="Team">
        <InviteButton suggestions={siteTeam.map((t) => ({ name: t.name, image: t.image }))} />
      </PageHeader>

      <section className="grid gap-px border-b border-line bg-line sm:grid-cols-3">
        {TIERS.map((t, i) => (
          <div key={t.value} className="bg-ink px-4 py-5 sm:px-6">
            <p className="label">
              Tier {i + 1} · {t.plural}
            </p>
            <p className="mt-1 font-display text-4xl font-extrabold [font-stretch:80%]">{active.filter((p) => p.tier === t.value).length}</p>
            <p className="text-[12px] text-subtle">{t.blurb}</p>
          </div>
        ))}
      </section>

      <div className="flex items-center gap-4 border-b border-line px-4 py-2 font-mono text-[10px] tracking-[0.08em] text-subtle uppercase sm:px-6">
        <span className="flex-1">Hierarchy</span>
        <span className="hidden sm:inline">Effort, last 30 days</span>
      </div>
      <ul>
        {core.map((p) => (
          <Row key={p.id} p={p} depth={0} />
        ))}
      </ul>
      {orphans.length > 0 && (
        <>
          <p className="border-b border-line bg-ink-2 px-4 py-2 text-[12px] text-subtle sm:px-6">
            Not reporting to anyone yet. A core member can place them from their profile.
          </p>
          <ul>
            {orphans
              .filter((o) => !orphans.some((m) => m.id === o.managerId))
              .map((p) => (
                <Row key={p.id} p={p} depth={0} />
              ))}
          </ul>
        </>
      )}
      {people.some((p) => !p.active) && (
        <p className="px-4 py-4 text-[12px] text-subtle sm:px-6">
          Alumni:{" "}
          {people
            .filter((p) => !p.active)
            .map((p, i) => (
              <span key={p.id}>
                {i > 0 && ", "}
                <Link href={`/people/${p.id}`} className="hover:text-paper">
                  {p.name}
                </Link>
              </span>
            ))}
        </p>
      )}
    </>
  );
}
