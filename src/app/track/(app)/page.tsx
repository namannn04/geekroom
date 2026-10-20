import type { Metadata } from "next";
import PageHeader from "@/components/track/PageHeader";
import StatTile from "@/components/track/StatTile";
import Tabs from "@/components/track/Tabs";
import { Heatmap } from "@/components/track/charts";
import { NewTaskButton, TaskBoard, TaskList, ViewToggle } from "@/components/track/TaskViews";
import { requireUser } from "@/lib/track/session";
import { activityByDay, effortSince, listTasks } from "@/lib/track/queries";
import { toRows } from "@/lib/track/rows";
import { OPEN_STATUSES } from "@/lib/track/constants";
import { fmtMinutes } from "@/components/track/ActivityFeed";

export const metadata: Metadata = { title: "My work" };

export default async function MyWorkPage({ searchParams }: { searchParams: Promise<{ tab?: string; view?: string }> }) {
  const { tab = "assigned", view } = await searchParams;
  const me = await requireUser();
  const [all, heat, effort30] = await Promise.all([
    listTasks(),
    activityByDay(371, me.id),
    effortSince(new Date(Date.now() - 30 * 86_400_000)),
  ]);

  const assigned = all.filter((t) => t.assigneeId === me.id);
  const created = all.filter((t) => t.creatorId === me.id);
  const delegated = all.filter((t) => t.creatorId === me.id && t.assigneeId != null && t.assigneeId !== me.id);
  const lists = { assigned, created, delegated };
  const current = lists[tab as keyof typeof lists] ?? assigned;
  const mine = effort30.get(me.id);
  const open = assigned.filter((t) => OPEN_STATUSES.includes(t.status)).length;
  const q = (t: string) => `/?tab=${t}${view ? `&view=${view}` : ""}`;

  return (
    <>
      <PageHeader title="My work">
        <ViewToggle />
        <NewTaskButton assigneeId={me.id} />
      </PageHeader>

      <section className="grid gap-6 border-b border-line px-4 py-6 sm:px-6 2xl:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="label">Hey {me.name.split(" ")[0]}</p>
          <h2 className="display mt-2 text-[clamp(2rem,4vw,3rem)]">
            Your effort, <em>counted</em>
          </h2>
          <div className="mt-5 grid max-w-[760px] grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Effort pts" value={mine?.points ?? 0} sub="Last 30 days" />
            <StatTile label="Shipped" value={mine?.completed ?? 0} sub="Tasks done, 30 days" />
            <StatTile label="Open" value={open} sub="Assigned to you" />
            <StatTile label="Logged" value={fmtMinutes(mine?.minutes ?? 0)} sub="Last 30 days" />
          </div>
        </div>
        <div className="min-w-0 2xl:max-w-[780px]">
          <Heatmap counts={Object.fromEntries(heat)} />
        </div>
      </section>

      <Tabs
        active={tab}
        tabs={[
          { key: "assigned", label: "Assigned to me", href: q("assigned"), count: assigned.length },
          { key: "created", label: "Created by me", href: q("created"), count: created.length },
          { key: "delegated", label: "Delegated", href: q("delegated"), count: delegated.length },
        ]}
      />
      {view === "board" ? (
        <TaskBoard tasks={toRows(current, all)} />
      ) : (
        <TaskList
          tasks={toRows(current, all)}
          hideDone
          emptyText={tab === "delegated" ? "Work you hand to your crew shows up here." : "Nothing assigned to you yet. Press C to create a task."}
        />
      )}
    </>
  );
}
