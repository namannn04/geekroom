import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import PageHeader from "@/components/track/PageHeader";
import Avatar from "@/components/track/Avatar";
import ActivityFeed, { timeAgo } from "@/components/track/ActivityFeed";
import { CommentComposer, Subtasks, TaskEditor, TaskProperties } from "@/components/track/TaskDetail";
import { requireUser } from "@/lib/track/session";
import { getTask, listComments, listPeople, listProjects, listSubtasks, listTaskActivity } from "@/lib/track/queries";
import { canEditTask } from "@/lib/track/permissions";
import { taskKey } from "@/lib/track/constants";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).id);
  const task = Number.isInteger(id) ? await getTask(id) : null;
  return { title: task ? `${taskKey(task.id)} ${task.title}` : "Task" };
}

export default async function TaskPage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const me = await requireUser();
  const task = await getTask(id);
  if (!task) notFound();

  const [subs, comments, acts, people, projects, parent] = await Promise.all([
    listSubtasks(id),
    listComments(id),
    listTaskActivity(id),
    listPeople(),
    listProjects(),
    task.parentId ? getTask(task.parentId) : null,
  ]);
  const editable = canEditTask(me, task, people);
  const project = projects.find((p) => p.id === task.projectId);
  const creator = people.find((p) => p.id === task.creatorId);

  // Comments and the activity trail share one timeline, oldest first
  const timeline = [
    ...acts.filter((a) => a.kind !== "commented").map((a) => ({ type: "act" as const, at: a.createdAt, a })),
    ...comments.map((c) => ({ type: "comment" as const, at: c.createdAt, c })),
  ].sort((x, y) => x.at.getTime() - y.at.getTime());

  return (
    <>
      <PageHeader
        crumb={
          <>
            {project ? (
              <Link href={`/projects/${project.key}`} className="text-muted hover:text-paper">
                {project.name}
              </Link>
            ) : (
              <Link href="/tasks" className="text-muted hover:text-paper">
                Tasks
              </Link>
            )}
            {parent && (
              <>
                <ChevronRight className="size-3.5 text-subtle" />
                <Link href={`/tasks/${parent.id}`} className="max-w-48 truncate text-muted hover:text-paper">
                  {taskKey(parent.id)} {parent.title}
                </Link>
              </>
            )}
            <ChevronRight className="size-3.5 text-subtle" />
          </>
        }
        title={<span className="font-mono text-xs">{taskKey(task.id)}</span>}
      />
      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0 px-4 py-8 sm:px-10 lg:border-r lg:border-line">
          <div className="mx-auto max-w-[760px]">
            <TaskEditor task={task} editable={editable} />
            <Subtasks parent={task} subs={subs} />

            <section className="mt-10 border-t border-line pt-6">
              <h2 className="mb-4 text-[13px] font-medium">Activity</h2>
              <div className="space-y-4">
                {timeline.map((item) =>
                  item.type === "act" ? (
                    <ActivityFeed key={`a${item.a.id}`} items={[item.a]} people={people} taskTitles={new Map()} projectNames={new Map(projects.map((p) => [p.id, p.name]))} compact />
                  ) : (
                    <div key={`c${item.c.id}`} className="flex gap-2.5">
                      <Avatar person={people.find((p) => p.id === item.c.authorId)} size={22} className="mt-1" />
                      <div className="min-w-0 flex-1 rounded-lg border border-line bg-ink-2 px-3 py-2">
                        <p className="text-[12px] text-subtle">
                          <span className="text-paper">{people.find((p) => p.id === item.c.authorId)?.name ?? "Someone"}</span> · {timeAgo(item.c.createdAt)}
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed whitespace-pre-wrap">{item.c.body}</p>
                      </div>
                    </div>
                  ),
                )}
              </div>
              <div className="mt-6">
                <CommentComposer taskId={task.id} />
              </div>
            </section>
          </div>
        </article>
        <aside className="border-t border-line px-4 py-6 sm:px-6 lg:border-t-0">
          <TaskProperties task={task} editable={editable} canDelete={me.tier === "core" || task.creatorId === me.id} />
          <p className="mt-6 text-[12px] leading-relaxed text-subtle">
            Created by {creator?.name ?? "someone"} {timeAgo(task.createdAt)}
            {task.completedAt && <> · done {timeAgo(task.completedAt)}</>}
          </p>
          {!editable && <p className="mt-2 text-[12px] text-subtle">Only the creator, assignee, their managers and core can edit this task.</p>}
        </aside>
      </div>
    </>
  );
}
