import type { Metadata } from "next";
import PageHeader from "@/components/track/PageHeader";
import FilterBar from "@/components/track/FilterBar";
import { NewTaskButton, TaskBoard, TaskList, ViewToggle } from "@/components/track/TaskViews";
import { listPeople, listTasks } from "@/lib/track/queries";
import { applyFilters } from "@/lib/track/filter";
import { toRows } from "@/lib/track/rows";

export const metadata: Metadata = { title: "All tasks" };

type SP = { view?: string; assignee?: string; project?: string; tier?: string };

export default async function TasksPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const [all, people] = await Promise.all([listTasks(), listPeople()]);
  const shown = applyFilters(all, people, sp);

  return (
    <>
      <PageHeader title="All tasks">
        <ViewToggle />
        <NewTaskButton />
      </PageHeader>
      <FilterBar />
      {sp.view === "board" ? (
        <TaskBoard tasks={toRows(shown, all)} />
      ) : (
        <TaskList tasks={toRows(shown, all)} emptyText="No tasks match. Press C to create one." />
      )}
    </>
  );
}
