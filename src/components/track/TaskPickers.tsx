"use client";

import { CalendarDays, Folder, Gauge } from "lucide-react";
import Picker from "./Picker";
import Avatar from "./Avatar";
import { PriorityIcon, StatusIcon } from "./icons";
import { useTrack } from "./TrackContext";
import { ESTIMATES, PRIORITIES, STATUSES, priorityLabel, statusLabel, tierLabel } from "@/lib/track/constants";
import type { TaskStatus } from "@/lib/track/schema";

type Common = { disabled?: boolean; compact?: boolean; align?: "left" | "right" };

export function StatusPicker({ value, onChange, ...p }: Common & { value: TaskStatus; onChange: (v: TaskStatus) => void }) {
  return (
    <Picker
      label="Change status"
      value={value}
      onChange={onChange}
      disabled={p.disabled}
      align={p.align}
      options={STATUSES.map((s) => ({ value: s.value, label: s.label, icon: <StatusIcon status={s.value} /> }))}
    >
      <StatusIcon status={value} />
      {!p.compact && <span>{statusLabel(value)}</span>}
    </Picker>
  );
}

export function PriorityPicker({ value, onChange, ...p }: Common & { value: number; onChange: (v: number) => void }) {
  return (
    <Picker
      label="Set priority"
      value={value}
      onChange={onChange}
      disabled={p.disabled}
      align={p.align}
      options={PRIORITIES.map((s) => ({ value: s.value, label: s.label, icon: <PriorityIcon priority={s.value} /> }))}
    >
      <PriorityIcon priority={value} />
      {!p.compact && <span className={value === 0 ? "text-subtle" : ""}>{priorityLabel(value)}</span>}
    </Picker>
  );
}

/** Only lists people the viewer is allowed to hand work to. */
export function AssigneePicker({
  value,
  onChange,
  ...p
}: Common & { value: number | null; onChange: (v: number | null) => void }) {
  const { people, viewer } = useTrack();
  const current = people.find((x) => x.id === value);
  const options = [
    { value: null as number | null, label: "Unassigned", icon: <Avatar person={null} size={18} /> },
    ...people
      .filter((x) => x.active && viewer.assignableIds.includes(x.id))
      .map((x) => ({
        value: x.id as number | null,
        label: x.id === viewer.id ? `${x.name} (you)` : x.name,
        hint: tierLabel(x.tier),
        icon: <Avatar person={x} size={18} />,
      })),
  ];
  return (
    <Picker label="Assign to" value={value} onChange={onChange} disabled={p.disabled} align={p.align} options={options}>
      <Avatar person={current} size={p.compact ? 20 : 18} />
      {!p.compact && <span className={current ? "truncate" : "text-subtle"}>{current?.name ?? "Unassigned"}</span>}
    </Picker>
  );
}

export function ProjectPicker({ value, onChange, ...p }: Common & { value: number | null; onChange: (v: number | null) => void }) {
  const { projects } = useTrack();
  const current = projects.find((x) => x.id === value);
  return (
    <Picker
      label="Move to project"
      value={value}
      onChange={onChange}
      disabled={p.disabled}
      align={p.align}
      options={[
        { value: null as number | null, label: "No project", icon: <Folder className="size-3.5 text-subtle" /> },
        ...projects.map((x) => ({
          value: x.id as number | null,
          label: x.name,
          hint: x.key,
          icon: <Folder className="size-3.5 text-muted" />,
        })),
      ]}
    >
      <Folder className={`size-3.5 ${current ? "text-muted" : "text-subtle"}`} />
      <span className={current ? "truncate" : "text-subtle"}>{current?.name ?? "No project"}</span>
    </Picker>
  );
}

export function EstimatePicker({ value, onChange, ...p }: Common & { value: number; onChange: (v: number) => void }) {
  return (
    <Picker
      label="Effort points"
      value={value}
      onChange={onChange}
      disabled={p.disabled}
      align={p.align}
      options={ESTIMATES.map((n) => ({ value: n, label: `${n} point${n > 1 ? "s" : ""}`, icon: <Gauge className="size-3.5 text-muted" /> }))}
    >
      <Gauge className="size-3.5 text-muted" />
      <span>
        {value} pt{value > 1 ? "s" : ""}
      </span>
    </Picker>
  );
}

export function DueDateInput({
  value,
  onChange,
  disabled,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 rounded-md px-1.5 py-1 text-[13px] hover:bg-ink-3">
      <CalendarDays className="size-3.5 text-muted" />
      <input
        type="date"
        disabled={disabled}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className={`min-w-0 flex-1 bg-transparent outline-none [color-scheme:dark] ${value ? "" : "text-subtle"}`}
        aria-label="Due date"
      />
    </label>
  );
}
