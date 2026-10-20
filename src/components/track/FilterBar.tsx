"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Folder, Layers, UserRound, X } from "lucide-react";
import Picker from "./Picker";
import Avatar from "./Avatar";
import { useTrack } from "./TrackContext";
import { TIERS, tierLabel } from "@/lib/track/constants";

export default function FilterBar({ showProject = true }: { showProject?: boolean }) {
  const { people, projects } = useTrack();
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const set = (k: string, v: string | number | null) => {
    const p = new URLSearchParams(params);
    if (v == null || v === "") p.delete(k);
    else p.set(k, String(v));
    const q = p.toString();
    router.push(q ? `${path}?${q}` : path);
  };

  const assignee = params.get("assignee");
  const project = params.get("project");
  const tier = params.get("tier");
  const assigneeName = assignee === "none" ? "Unassigned" : people.find((p) => String(p.id) === assignee)?.name;
  const projectName = projects.find((p) => String(p.id) === project)?.name;
  const chip = "rounded-md border border-line [&>button]:py-0.5";
  const any = assignee || project || tier;

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-line px-4 py-2 sm:px-6">
      <div className={chip}>
        <Picker
          label="Filter by assignee"
          value={assignee}
          onChange={(v) => set("assignee", v)}
          options={[
            { value: null, label: "Anyone" },
            { value: "none", label: "Unassigned", icon: <Avatar person={null} size={16} /> },
            ...people
              .filter((p) => p.active)
              .map((p) => ({ value: String(p.id), label: p.name, hint: tierLabel(p.tier), icon: <Avatar person={p} size={16} /> })),
          ]}
        >
          <UserRound className="size-3.5 text-subtle" />
          <span className={assigneeName ? "" : "text-muted"}>{assigneeName ?? "Assignee"}</span>
        </Picker>
      </div>
      <div className={chip}>
        <Picker
          label="Filter by tier"
          value={tier}
          onChange={(v) => set("tier", v)}
          options={[{ value: null, label: "All tiers" }, ...TIERS.map((t) => ({ value: t.value as string | null, label: t.plural }))]}
        >
          <Layers className="size-3.5 text-subtle" />
          <span className={tier ? "" : "text-muted"}>{tier ? TIERS.find((t) => t.value === tier)?.plural : "Tier"}</span>
        </Picker>
      </div>
      {showProject && (
        <div className={chip}>
          <Picker
            label="Filter by project"
            value={project}
            onChange={(v) => set("project", v)}
            options={[{ value: null, label: "All projects" }, ...projects.map((p) => ({ value: String(p.id) as string | null, label: p.name, hint: p.key }))]}
          >
            <Folder className="size-3.5 text-subtle" />
            <span className={projectName ? "" : "text-muted"}>{projectName ?? "Project"}</span>
          </Picker>
        </div>
      )}
      {any && (
        <button
          onClick={() => {
            const p = new URLSearchParams(params);
            ["assignee", "project", "tier"].forEach((k) => p.delete(k));
            const q = p.toString();
            router.push(q ? `${path}?${q}` : path);
          }}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-subtle hover:text-paper"
        >
          <X className="size-3" /> Clear
        </button>
      )}
    </div>
  );
}
