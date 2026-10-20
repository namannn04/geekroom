import type { Tier } from "@/lib/track/schema";

/** The slices of server data that client components need. */
export type PersonLite = {
  id: number;
  name: string;
  image: string | null;
  tier: Tier;
  title: string;
  managerId: number | null;
  active: boolean;
  joined: boolean;
};
export type ProjectLite = { id: number; key: string; name: string };
export type Viewer = { id: number; tier: Tier; assignableIds: number[] };
