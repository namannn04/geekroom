import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ChevronRight } from "lucide-react";
import PageHeader from "@/components/track/PageHeader";
import Avatar from "@/components/track/Avatar";
import Progress from "@/components/track/Progress";
import ProjectButton from "@/components/track/ProjectDialog";
import FilterBar from "@/components/track/FilterBar";
import { NewTaskButton, TaskBoard, TaskList, ViewToggle } from "@/components/track/TaskViews";
import { db } from "@/lib/track/db";
import { projects } from "@/lib/track/schema";
import { requireUser } from "@/lib/track/session";
import { listPeople, listTasks } from "@/lib/track/queries";
import { applyFilters } from "@/lib/track/filter";
import { canManageProjects } from "@/lib/track/permissions";
import { toRows } from "@/lib/track/rows";
import { PROJECT_STATUSES } from "@/lib/track/constants";

type Props = { params: Promise<{ key: string }>; searchParams: Promise<{ view?: string; assignee?: string; tier?: string }> };

const findProject = (key: string) => db.query.projects.findFirst({ where: eq(projects.key, key.toUpperCase()) });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await findProject((await params).key);
  return { title: p?.name ?? "Project" };
}

export default async function ProjectPage({ params, searchParams }: Props) {
  const [{ key }, sp, me] = await Promise.all([params, searchParams, requireUser()]);
  const project = await findProject(key);
  if (!project) notFound();
  const [all, people] = await Promise.all([listTasks({ projectId: project.id }), listPeople()]);
  const shown = applyFilters(all, people, sp);
  const lead = people.find((p) => p.id === project.leadId);
  const counted = all.filter((t) => t.status !== "canceled");

  // Who has shipped what on this project
  const contributors = new Map<number, number>();
  for (const t of all) if (t.status === "done" && t.assigneeId) contributors.set(t.assigneeId, (contributors.get(t.assigneeId) ?? 0) + t.estimate);
  const ranked = [...contributors.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <>
      <PageHeader
        crumb={
          <>
            <Link href="/projects" className="text-muted hover:text-paper">
              Projects
            </Link>
            <ChevronRight className="size-3.5 text-subtle" />
          </>
        }
        title={project.name}
      >
        <ViewToggle />
        {canManageProjects(me) && <ProjectButton project={project} />}
        <NewTaskButton projectId={project.id} />
      </PageHeader>

      <section className="grid gap-6 border-b border-line px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="label">
            {project.key} · {PROJECT_STATUSES.find((s) => s.value === project.status)?.label}
            {project.targetDate && <> · target {new Date(`${project.targetDate}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</>}
          </p>
          <h2 className="display mt-2 text-[clamp(2rem,4vw,3rem)]">{project.name}</h2>
          {project.description && <p className="mt-3 max-w-[640px] text-[15px] leading-relaxed whitespace-pre-wrap text-muted">{project.description}</p>}
          <div className="mt-5 max-w-[480px]">
            <Progress done={counted.filter((t) => t.status === "done").length} total={counted.length} />
          </div>
        </div>
        <div className="space-y-4 text-[13px]">
          <div>
            <p className="label mb-2">Owner</p>
            {lead ? (
              <Link href={`/people/${lead.id}`} className="flex items-center gap-2 hover:underline">
                <Avatar person={lead} size={22} /> {lead.name}
              </Link>
            ) : (
              <span className="text-subtle">No owner</span>
            )}
          </div>
          <div>
            <p className="label mb-2">Shipped by</p>
            {ranked.length ? (
              <ul className="space-y-1.5">
                {ranked.slice(0, 6).map(([id, pts]) => {
                  const p = people.find((x) => x.id === id);
                  return (
                    <li key={id} className="flex items-center gap-2">
                      <Avatar person={p} size={20} />
                      <span className="flex-1 truncate">{p?.name}</span>
                      <span className="font-mono text-[11px] text-subtle">{pts} pts</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span className="text-subtle">Nothing shipped yet</span>
            )}
          </div>
        </div>
      </section>

      <FilterBar showProject={false} />
      {sp.view === "board" ? (
        <TaskBoard tasks={toRows(shown, all)} />
      ) : (
        <TaskList tasks={toRows(shown, all)} showProject={false} emptyText="No tasks in this project yet." />
      )}
    </>
  );
}
