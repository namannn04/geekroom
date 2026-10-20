import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/track/PageHeader";
import Avatar from "@/components/track/Avatar";
import StatTile from "@/components/track/StatTile";
import Progress from "@/components/track/Progress";
import { TierBadge } from "@/components/track/icons";
import { DailyBars } from "@/components/track/charts";
import ActivityFeed, { fmtMinutes } from "@/components/track/ActivityFeed";
import { activityByDay, effortSince, listPeople, listProjects, listTasks, projectProgress, recentActivity } from "@/lib/track/queries";
import { descendantIds } from "@/lib/track/permissions";
import { OPEN_STATUSES, TIERS } from "@/lib/track/constants";

export const metadata: Metadata = { title: "Insights" };

const RANGES = [
  { key: "7", label: "7 days", days: 7 },
  { key: "30", label: "30 days", days: 30 },
  { key: "90", label: "90 days", days: 90 },
  { key: "all", label: "All time", days: null },
];

export default async function InsightsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range = "30" } = await searchParams;
  const r = RANGES.find((x) => x.key === range) ?? RANGES[1];
  const since = r.days ? new Date(Date.now() - r.days * 86_400_000) : null;

  const [people, tasks, effort, daily, feed, projects, progress] = await Promise.all([
    listPeople(),
    listTasks(),
    effortSince(since),
    activityByDay(60),
    recentActivity({ limit: 20 }),
    listProjects(),
    projectProgress(),
  ]);
  const active = people.filter((p) => p.active);
  const board = active
    .map((p) => ({ p, e: effort.get(p.id) ?? { points: 0, completed: 0, minutes: 0, actions: 0 } }))
    .sort((a, b) => b.e.points - a.e.points || b.e.actions - a.e.actions);
  const totals = board.reduce(
    (acc, { e }) => ({ points: acc.points + e.points, completed: acc.completed + e.completed, minutes: acc.minutes + e.minutes }),
    { points: 0, completed: 0, minutes: 0 },
  );
  const contributors = board.filter(({ e }) => e.actions > 0 || e.points > 0).length;
  const open = tasks.filter((t) => OPEN_STATUSES.includes(t.status)).length;
  const maxPts = Math.max(1, ...board.map((b) => b.e.points));

  // Each core member's whole crew, so the tree's combined output is visible
  const crews = active
    .filter((p) => p.tier === "core")
    .map((c) => {
      const ids = [c.id, ...descendantIds(c, active)];
      const pts = ids.reduce((s, id) => s + (effort.get(id)?.points ?? 0), 0);
      return { c, size: ids.length, pts };
    })
    .sort((a, b) => b.pts - a.pts);

  return (
    <>
      <PageHeader title="Insights">
        <div className="flex rounded-md border border-line p-0.5">
          {RANGES.map((x) => (
            <Link
              key={x.key}
              href={`/insights?range=${x.key}`}
              className={`rounded px-2 py-1 text-xs ${x.key === r.key ? "bg-ink-3 text-paper" : "text-subtle hover:text-paper"}`}
            >
              {x.label}
            </Link>
          ))}
        </div>
      </PageHeader>

      <section className="border-b border-line px-4 py-6 sm:px-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile label="Effort pts" value={totals.points.toLocaleString("en-IN")} sub={r.label} />
          <StatTile label="Tasks shipped" value={totals.completed} sub={r.label} />
          <StatTile label="Hours logged" value={fmtMinutes(totals.minutes)} sub={r.label} />
          <StatTile label="Contributors" value={`${contributors}/${active.length}`} sub={`${open} tasks open now`} />
        </div>
        <div className="mt-8">
          <h2 className="label mb-3">Team activity · last 60 days</h2>
          <DailyBars counts={Object.fromEntries(daily)} />
        </div>
      </section>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0 xl:border-r xl:border-line">
          <div className="flex items-baseline justify-between border-b border-line px-4 py-2.5 sm:px-6">
            <h2 className="text-[13px] font-medium">Effort board</h2>
            <p className="text-[11px] text-subtle">1 pt per estimate point shipped + 1 pt per hour logged</p>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-line text-left font-mono text-[10px] tracking-[0.08em] text-subtle uppercase">
                <th className="w-10 py-2 pl-4 font-normal sm:pl-6">#</th>
                <th className="py-2 font-normal">Person</th>
                <th className="hidden py-2 font-normal md:table-cell">Points</th>
                <th className="py-2 text-right font-normal">Pts</th>
                <th className="hidden py-2 text-right font-normal sm:table-cell">Shipped</th>
                <th className="hidden py-2 text-right font-normal sm:table-cell">Logged</th>
                <th className="py-2 pr-4 text-right font-normal sm:pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {board.map(({ p, e }, i) => (
                <tr key={p.id} className="border-b border-line/60 hover:bg-ink-2">
                  <td className="py-2 pl-4 font-mono text-[11px] text-subtle sm:pl-6">{i + 1}</td>
                  <td className="py-2">
                    <Link href={`/people/${p.id}`} className="flex items-center gap-2.5">
                      <Avatar person={p} size={22} />
                      <span className="truncate">{p.name}</span>
                      <TierBadge tier={p.tier} />
                    </Link>
                  </td>
                  <td className="hidden w-[28%] py-2 pr-4 md:table-cell">
                    <div className="h-1.5 overflow-hidden rounded-full bg-ink-3">
                      <div className="h-full rounded-full bg-orange" style={{ width: `${(e.points / maxPts) * 100}%` }} />
                    </div>
                  </td>
                  <td className="py-2 text-right font-mono">{e.points}</td>
                  <td className="hidden py-2 text-right font-mono text-muted sm:table-cell">{e.completed}</td>
                  <td className="hidden py-2 text-right font-mono text-muted sm:table-cell">{fmtMinutes(e.minutes)}</td>
                  <td className="py-2 pr-4 text-right font-mono text-muted sm:pr-6">{e.actions}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="grid gap-px border-y border-line bg-line md:grid-cols-2">
            <div className="bg-ink px-4 py-5 sm:px-6">
              <h2 className="label mb-3">By tier</h2>
              <table className="w-full text-[13px]">
                <tbody>
                  {TIERS.map((t) => {
                    const ids = active.filter((p) => p.tier === t.value).map((p) => p.id);
                    const pts = ids.reduce((s, id) => s + (effort.get(id)?.points ?? 0), 0);
                    const done = ids.reduce((s, id) => s + (effort.get(id)?.completed ?? 0), 0);
                    return (
                      <tr key={t.value} className="border-b border-line/60 last:border-0">
                        <td className="py-2">{t.plural}</td>
                        <td className="py-2 text-right font-mono text-subtle">{ids.length} people</td>
                        <td className="py-2 text-right font-mono text-muted">{done} shipped</td>
                        <td className="py-2 text-right font-mono">{pts} pts</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="bg-ink px-4 py-5 sm:px-6">
              <h2 className="label mb-3">By crew</h2>
              {crews.length ? (
                <ul className="space-y-2 text-[13px]">
                  {crews.map(({ c, size, pts }) => (
                    <li key={c.id} className="flex items-center gap-2.5">
                      <Avatar person={c} size={20} />
                      <span className="flex-1 truncate">{c.name}&apos;s crew</span>
                      <span className="font-mono text-[11px] text-subtle">{size} people</span>
                      <span className="w-16 text-right font-mono">{pts} pts</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] text-subtle">No core members yet.</p>
              )}
            </div>
          </div>

          {projects.length > 0 && (
            <div className="px-4 py-5 sm:px-6">
              <h2 className="label mb-3">Projects</h2>
              <ul className="space-y-3 text-[13px]">
                {projects
                  .filter((p) => p.status !== "completed")
                  .map((p) => {
                    const pr = progress.get(p.id) ?? { done: 0, total: 0 };
                    return (
                      <li key={p.id} className="grid grid-cols-[minmax(0,180px)_1fr] items-center gap-4">
                        <Link href={`/projects/${p.key}`} className="truncate hover:underline">
                          {p.name}
                        </Link>
                        <Progress done={pr.done} total={pr.total} />
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </section>

        <aside className="border-t border-line px-4 py-6 sm:px-6 xl:border-t-0">
          <h2 className="label mb-4">Latest across the team</h2>
          <ActivityFeed
            items={feed}
            people={people}
            taskTitles={new Map(tasks.map((t) => [t.id, t.title]))}
            projectNames={new Map(projects.map((p) => [p.id, p.name]))}
          />
        </aside>
      </div>
    </>
  );
}
