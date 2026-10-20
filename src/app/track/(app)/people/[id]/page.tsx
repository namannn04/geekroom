import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import PageHeader from "@/components/track/PageHeader";
import Avatar from "@/components/track/Avatar";
import StatTile from "@/components/track/StatTile";
import { TierBadge } from "@/components/track/icons";
import { Heatmap } from "@/components/track/charts";
import ActivityFeed, { fmtMinutes } from "@/components/track/ActivityFeed";
import PersonEdit from "@/components/track/PersonEdit";
import { TaskList } from "@/components/track/TaskViews";
import { requireUser } from "@/lib/track/session";
import { activityByDay, effortSince, listPeople, listProjects, listTasks, recentActivity, recentWorklogs } from "@/lib/track/queries";
import { toRows } from "@/lib/track/rows";
import { OPEN_STATUSES, tierLabel } from "@/lib/track/constants";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ id }, people] = await Promise.all([params, listPeople()]);
  return { title: people.find((p) => String(p.id) === id)?.name ?? "Person" };
}

export default async function PersonPage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const me = await requireUser();
  const people = await listPeople();
  const person = people.find((p) => p.id === id);
  if (!person) notFound();

  const [all, heat, e30, eAll, acts, logs, projects] = await Promise.all([
    listTasks(),
    activityByDay(371, id),
    effortSince(new Date(Date.now() - 30 * 86_400_000)),
    effortSince(null),
    recentActivity({ actorId: id, limit: 25 }),
    recentWorklogs({ userId: id, limit: 8 }),
    listProjects(),
  ]);
  const manager = people.find((p) => p.id === person.managerId);
  const reports = people.filter((p) => p.managerId === id && p.active);
  const assigned = all.filter((t) => t.assigneeId === id);
  const open = assigned.filter((t) => OPEN_STATUSES.includes(t.status));
  const delegatedDone = all.filter((t) => t.creatorId === id && t.assigneeId && t.assigneeId !== id && t.status === "done").length;
  const m = e30.get(id);
  const life = eAll.get(id);

  return (
    <>
      <PageHeader
        crumb={
          <>
            <Link href="/team" className="text-muted hover:text-paper">
              Team
            </Link>
            <ChevronRight className="size-3.5 text-subtle" />
          </>
        }
        title={person.name}
      >
        {(me.tier === "core" || me.id === id) && <PersonEdit person={person} full={me.tier === "core"} />}
      </PageHeader>

      <section className="border-b border-line px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar person={person} size={72} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="display text-[clamp(2rem,5vw,3.25rem)]">{person.name}</h2>
              <TierBadge tier={person.tier} />
              {!person.active && <span className="text-[12px] text-subtle">Alumni</span>}
            </div>
            <p className="mt-1 text-[14px] text-muted">
              {person.title || tierLabel(person.tier)}
              {manager && (
                <>
                  {" · reports to "}
                  <Link href={`/people/${manager.id}`} className="text-paper hover:underline">
                    {manager.name}
                  </Link>
                </>
              )}
              {!person.passwordHash && " · invite pending"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatTile label="Effort pts" value={m?.points ?? 0} sub={`${life?.points ?? 0} all time`} />
          <StatTile label="Shipped" value={m?.completed ?? 0} sub={`${life?.completed ?? 0} all time`} />
          <StatTile label="Open" value={open.length} sub="Assigned now" />
          <StatTile label="Logged" value={fmtMinutes(m?.minutes ?? 0)} sub={`${fmtMinutes(life?.minutes ?? 0)} all time`} />
          <StatTile label="Delegated" value={delegatedDone} sub="Handed off & shipped" />
        </div>

        <div className="mt-8">
          <Heatmap counts={Object.fromEntries(heat)} label={`${person.name}'s contribution graph`} />
        </div>
      </section>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 xl:border-r xl:border-line">
          <h3 className="border-b border-line px-4 py-2.5 text-[13px] font-medium sm:px-6">Work assigned</h3>
          <TaskList tasks={toRows(assigned, all)} hideDone emptyText="Nothing assigned." />
        </div>
        <aside className="space-y-8 px-4 py-6 sm:px-6">
          {reports.length > 0 && (
            <div>
              <h3 className="label mb-3">Crew · {reports.length}</h3>
              <ul className="space-y-2">
                {reports.map((r) => (
                  <li key={r.id}>
                    <Link href={`/people/${r.id}`} className="flex items-center gap-2.5 text-[13px] hover:underline">
                      <Avatar person={r} size={22} />
                      <span className="flex-1 truncate">{r.name}</span>
                      <span className="font-mono text-[11px] text-subtle">{e30.get(r.id)?.points ?? 0} pts</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {logs.length > 0 && (
            <div>
              <h3 className="label mb-3">Logged effort</h3>
              <ul className="space-y-2 text-[13px]">
                {logs.map((l) => (
                  <li key={l.id} className="flex gap-3">
                    <span className="w-14 shrink-0 font-mono text-[11px] text-orange">{fmtMinutes(l.minutes)}</span>
                    <span className="min-w-0 flex-1 text-muted">
                      {l.note}
                      <span className="block text-[11px] text-subtle">
                        {new Date(`${l.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h3 className="label mb-3">Recent activity</h3>
            <ActivityFeed
              items={acts}
              people={people}
              taskTitles={new Map(all.map((t) => [t.id, t.title]))}
              projectNames={new Map(projects.map((p) => [p.id, p.name]))}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
