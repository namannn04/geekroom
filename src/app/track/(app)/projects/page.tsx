import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/track/PageHeader";
import Avatar from "@/components/track/Avatar";
import Progress from "@/components/track/Progress";
import ProjectButton from "@/components/track/ProjectDialog";
import { requireUser } from "@/lib/track/session";
import { listPeople, listProjects, projectProgress } from "@/lib/track/queries";
import { canManageProjects } from "@/lib/track/permissions";
import { PROJECT_STATUSES } from "@/lib/track/constants";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const me = await requireUser();
  const [projects, people, progress] = await Promise.all([listProjects(), listPeople(), projectProgress()]);

  return (
    <>
      <PageHeader title="Projects">{canManageProjects(me) && <ProjectButton />}</PageHeader>
      {projects.length === 0 ? (
        <div className="px-6 py-20 text-center">
          <p className="display text-4xl">
            No projects <em>yet</em>
          </p>
          <p className="mt-3 text-sm text-muted">Group work by event or initiative: Code Cubicle 7.0, HackBLR, sponsor outreach.</p>
        </div>
      ) : (
        <ul>
          <li className="hidden grid-cols-[minmax(0,2fr)_120px_minmax(0,1.4fr)_110px_100px] gap-4 border-b border-line px-6 py-2 font-mono text-[10px] tracking-[0.08em] text-subtle uppercase md:grid">
            <span>Name</span>
            <span>Owner</span>
            <span>Progress</span>
            <span>Target</span>
            <span>Status</span>
          </li>
          {projects.map((p) => {
            const lead = people.find((x) => x.id === p.leadId);
            const prog = progress.get(p.id) ?? { done: 0, total: 0 };
            return (
              <li key={p.id} className="border-b border-line">
                <Link
                  href={`/projects/${p.key}`}
                  className="grid gap-2 px-4 py-3 text-[13px] transition-colors hover:bg-ink-2 sm:px-6 md:grid-cols-[minmax(0,2fr)_120px_minmax(0,1.4fr)_110px_100px] md:items-center md:gap-4"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">{p.key}</span>
                    <span className="truncate font-medium">{p.name}</span>
                  </span>
                  <span className="flex items-center gap-2 text-muted">
                    <Avatar person={lead} size={18} />
                    <span className="truncate">{lead?.name.split(" ")[0] ?? "—"}</span>
                  </span>
                  <Progress done={prog.done} total={prog.total} />
                  <span className="text-muted">
                    {p.targetDate ? new Date(`${p.targetDate}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </span>
                  <span className="text-muted">{PROJECT_STATUSES.find((s) => s.value === p.status)?.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
