"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { BarChart3, CircleUserRound, Clock3, FolderKanban, LayoutList, LogOut, Menu, Network, Plus, X } from "lucide-react";
import GeekMark from "@/components/ui/GeekMark";
import Avatar from "./Avatar";
import { TierBadge } from "./icons";
import CreateTaskDialog from "./CreateTaskDialog";
import LogWorkDialog from "./LogWorkDialog";
import { TrackContext, type CreateDefaults } from "./TrackContext";
import type { PersonLite, ProjectLite, Viewer } from "./types";
import { logout } from "@/app/track/actions";

const NAV = [
  { href: "/", label: "My work", Icon: CircleUserRound },
  { href: "/tasks", label: "All tasks", Icon: LayoutList },
  { href: "/projects", label: "Projects", Icon: FolderKanban },
  { href: "/team", label: "Team", Icon: Network },
  { href: "/insights", label: "Insights", Icon: BarChart3 },
];

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`));

export default function TrackShell({
  people,
  projects,
  viewer,
  children,
}: {
  people: PersonLite[];
  projects: ProjectLite[];
  viewer: Viewer;
  children: ReactNode;
}) {
  const path = usePathname();
  const [create, setCreate] = useState<CreateDefaults | null>(null);
  const [logTask, setLogTask] = useState<number | undefined | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const me = people.find((p) => p.id === viewer.id)!;

  const openCreate = useCallback((d: CreateDefaults = {}) => setCreate(d), []);
  const openLogWork = useCallback((taskId?: number) => setLogTask(taskId), []);
  const closeCreate = useCallback(() => setCreate(null), []);
  const closeLog = useCallback(() => setLogTask(null), []);

  useEffect(() => setNavOpen(false), [path]);

  // "C" opens a new task, like Linear, unless you're typing somewhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey || document.querySelector("dialog[open]")) return;
      if (e.key === "c") {
        e.preventDefault();
        setCreate({});
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-5">
        <GeekMark className="h-5 w-auto" />
        <span className="font-display text-[14px] font-bold tracking-tight uppercase">Geek Room</span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-orange uppercase">Track</span>
      </div>

      <div className="flex gap-1.5 px-3">
        <button
          onClick={() => setCreate({})}
          className="flex h-8 flex-1 items-center gap-2 rounded-md border border-line-strong px-2.5 text-[13px] transition-colors hover:border-paper/50 hover:bg-ink-3"
        >
          <Plus className="size-3.5" /> New task
          <kbd className="ml-auto rounded border border-line px-1 font-mono text-[10px] text-subtle">C</kbd>
        </button>
        <button
          onClick={() => setLogTask(undefined)}
          title="Log effort"
          aria-label="Log effort"
          className="grid size-8 place-items-center rounded-md border border-line-strong transition-colors hover:border-paper/50 hover:bg-ink-3"
        >
          <Clock3 className="size-3.5" />
        </button>
      </div>

      <nav className="mt-5 space-y-px px-2">
        {NAV.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
              isActive(path, href) ? "bg-ink-3 text-paper" : "text-muted hover:bg-ink-3/60 hover:text-paper"
            }`}
          >
            <Icon className="size-4" strokeWidth={1.75} /> {label}
          </Link>
        ))}
      </nav>

      {projects.length > 0 && (
        <div className="mt-6 min-h-0 flex-1 overflow-y-auto px-2">
          <p className="px-2.5 pb-1.5 font-mono text-[10px] tracking-[0.1em] text-subtle uppercase">Projects</p>
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.key}`}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors ${
                path === `/projects/${p.key}` ? "bg-ink-3 text-paper" : "text-muted hover:bg-ink-3/60 hover:text-paper"
              }`}
            >
              <span className="w-9 shrink-0 font-mono text-[10px] text-subtle">{p.key}</span>
              <span className="truncate">{p.name}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-auto border-t border-line p-3">
        <div className="flex items-center gap-2.5">
          <Link href={`/people/${me.id}`} className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md p-1 hover:bg-ink-3">
            <Avatar person={me} size={26} />
            <span className="min-w-0">
              <span className="block truncate text-[13px]">{me.name}</span>
              <TierBadge tier={me.tier} />
            </span>
          </Link>
          <button
            onClick={async () => {
              await logout();
              window.location.assign("/login");
            }}
            aria-label="Sign out"
            title="Sign out"
            className="rounded-md p-2 text-subtle hover:bg-ink-3 hover:text-paper"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <TrackContext.Provider value={{ people, projects, viewer, openCreate, openLogWork }}>
      <div className="flex min-h-[100svh] bg-ink text-paper">
        <aside className="sticky top-0 hidden h-[100svh] w-60 shrink-0 border-r border-line bg-ink-2 lg:block">{sidebar}</aside>

        {/* Phone/tablet: the sidebar slides in over the page */}
        <div className={`fixed inset-0 z-40 lg:hidden ${navOpen ? "" : "pointer-events-none"}`}>
          <div
            className={`absolute inset-0 bg-black/60 transition-opacity ${navOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setNavOpen(false)}
          />
          <aside
            className={`absolute inset-y-0 left-0 w-64 border-r border-line bg-ink-2 transition-transform duration-300 ${
              navOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <button onClick={() => setNavOpen(false)} aria-label="Close menu" className="absolute top-3.5 right-3 p-1 text-subtle">
              <X className="size-4" />
            </button>
            {sidebar}
          </aside>
        </div>

        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-line bg-ink/90 px-4 backdrop-blur lg:hidden">
            <button onClick={() => setNavOpen(true)} aria-label="Open menu" className="-ml-1 p-1">
              <Menu className="size-5" />
            </button>
            <GeekMark className="h-4 w-auto" />
            <span className="font-mono text-[10px] tracking-[0.12em] text-orange uppercase">Track</span>
            <button onClick={() => setCreate({})} aria-label="New task" className="ml-auto rounded-md border border-line-strong p-1.5">
              <Plus className="size-4" />
            </button>
          </div>
          {children}
        </div>
      </div>

      <CreateTaskDialog open={create !== null} defaults={create ?? {}} onClose={closeCreate} />
      <LogWorkDialog open={logTask !== null} taskId={logTask ?? undefined} onClose={closeLog} />
    </TrackContext.Provider>
  );
}
