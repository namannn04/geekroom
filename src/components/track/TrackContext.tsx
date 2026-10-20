"use client";

import { createContext, useContext } from "react";
import type { PersonLite, ProjectLite, Viewer } from "./types";

export type CreateDefaults = {
  parentId?: number;
  parentTitle?: string;
  projectId?: number | null;
  assigneeId?: number | null;
  status?: string;
};

type Ctx = {
  people: PersonLite[];
  projects: ProjectLite[];
  viewer: Viewer;
  openCreate: (d?: CreateDefaults) => void;
  openLogWork: (taskId?: number) => void;
};

export const TrackContext = createContext<Ctx | null>(null);

export function useTrack() {
  const c = useContext(TrackContext);
  if (!c) throw new Error("useTrack outside TrackShell");
  return c;
}
