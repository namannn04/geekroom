import Link from "next/link";
import Avatar from "./Avatar";
import { priorityLabel, statusLabel, taskKey, tierLabel } from "@/lib/track/constants";
import type { TaskStatus, Tier, User } from "@/lib/track/schema";

type Act = {
  id: number;
  actorId: number;
  kind: string;
  taskId: number | null;
  projectId: number | null;
  subjectId: number | null;
  data: Record<string, string | number | null>;
  createdAt: Date;
};

export function timeAgo(d: Date) {
  const s = Math.round((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.round(h / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export const fmtMinutes = (m: number) => {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h && r ? `${h}h ${r}m` : h ? `${h}h` : `${r}m`;
};

export default function ActivityFeed({
  items,
  people,
  taskTitles,
  projectNames,
  compact,
}: {
  items: Act[];
  people: Pick<User, "id" | "name" | "image">[];
  taskTitles: Map<number, string>;
  projectNames: Map<number, string>;
  /** Inside a task page, where naming the task again is noise */
  compact?: boolean;
}) {
  const person = (id: number | null) => people.find((p) => p.id === id);
  const P = ({ id }: { id: number | null }) => {
    const p = person(id);
    return p ? (
      <Link href={`/people/${p.id}`} className="text-paper hover:underline">
        {p.name}
      </Link>
    ) : (
      <span>someone</span>
    );
  };
  const T = ({ id }: { id: number | null }) =>
    compact || id == null ? null : (
      <Link href={`/tasks/${id}`} className="text-paper hover:underline">
        <span className="font-mono text-[11px] text-subtle">{taskKey(id)}</span> {taskTitles.get(id) ?? "a deleted task"}
      </Link>
    );

  const describe = (a: Act) => {
    switch (a.kind) {
      case "created":
        return compact ? <>created the task</> : <>created <T id={a.taskId} /></>;
      case "completed":
        return compact ? <>marked it done</> : <>completed <T id={a.taskId} /></>;
      case "status":
        return <>moved {compact ? "it" : <T id={a.taskId} />} to {statusLabel(a.data.to as TaskStatus)}</>;
      case "assigned":
        return <>assigned {compact ? "it" : <T id={a.taskId} />} to <P id={a.subjectId} /></>;
      case "unassigned":
        return <>unassigned {compact ? "it" : <T id={a.taskId} />}</>;
      case "priority":
        return <>set priority to {priorityLabel(Number(a.data.to))} {compact ? "" : <>on <T id={a.taskId} /></>}</>;
      case "estimate":
        return <>estimated {compact ? "it" : <T id={a.taskId} />} at {a.data.to} pts</>;
      case "due":
        return a.data.to ? <>set due date to {String(a.data.to)}</> : <>cleared the due date</>;
      case "project":
        return a.data.to ? <>moved {compact ? "it" : <T id={a.taskId} />} to {projectNames.get(Number(a.data.to)) ?? "a project"}</> : <>removed it from its project</>;
      case "commented":
        return a.taskId && !compact ? <>commented on <T id={a.taskId} /></> : <>left a comment</>;
      case "logged":
        return (
          <>
            logged {fmtMinutes(Number(a.data.minutes))}
            {a.taskId && !compact ? <> on <T id={a.taskId} /></> : null}
            {a.data.note ? <span className="text-subtle"> · {String(a.data.note)}</span> : null}
          </>
        );
      case "invited":
        return <>invited <P id={a.subjectId} /> as {tierLabel(a.data.tier as Tier).toLowerCase()}</>;
      case "joined":
        return <>joined Geek Room Track</>;
      case "tier":
        return <>moved <P id={a.subjectId} /> to {tierLabel(a.data.to as Tier).toLowerCase()}</>;
      case "project_created":
        return <>started the project {String(a.data.name)}</>;
      default:
        return <>{a.kind}</>;
    }
  };

  if (!items.length) return <p className="py-6 text-[13px] text-subtle">No activity yet.</p>;
  return (
    <ol className="space-y-3">
      {items.map((a) => (
        <li key={a.id} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
          <Avatar person={person(a.actorId)} size={18} className="mt-0.5" />
          <p className="min-w-0 flex-1">
            <P id={a.actorId} /> {describe(a)} <span className="text-subtle">· {timeAgo(a.createdAt)}</span>
          </p>
        </li>
      ))}
    </ol>
  );
}
