import type { Tier, User } from "./schema";

type Person = Pick<User, "id" | "tier" | "managerId">;

/** Everyone `actor` sits above: direct reports, and their reports in turn. */
export function descendantIds(actor: Person, people: Person[]): Set<number> {
  const out = new Set<number>();
  const queue = [actor.id];
  while (queue.length) {
    const id = queue.shift()!;
    for (const p of people) {
      if (p.managerId === id && !out.has(p.id)) {
        out.add(p.id);
        queue.push(p.id);
      }
    }
  }
  return out;
}

/**
 * Work flows down the tree: core can hand work to anyone, a lead to themself and their crew,
 * a member only picks up work themself.
 */
export function canAssignTo(actor: Person, target: Person, people: Person[]) {
  if (actor.id === target.id) return true;
  if (actor.tier === "core") return true;
  return descendantIds(actor, people).has(target.id);
}

export function canEditTask(
  actor: Person,
  task: { creatorId: number | null; assigneeId: number | null },
  people: Person[],
) {
  if (actor.tier === "core") return true;
  if (task.creatorId === actor.id || task.assigneeId === actor.id) return true;
  return task.assigneeId != null && descendantIds(actor, people).has(task.assigneeId);
}

/** Which tiers `actor` may invite. Leads grow their own crew; core can add anyone. */
export function invitableTiers(actor: Pick<User, "tier">): Tier[] {
  if (actor.tier === "core") return ["core", "lead", "member"];
  if (actor.tier === "lead") return ["member"];
  return [];
}

/** The tier a person of `tier` reports to. Core members report to no one. */
export function managerTierFor(tier: Tier): Tier | null {
  return tier === "lead" ? "core" : tier === "member" ? "lead" : null;
}

export const canManageProjects = (actor: Person) => actor.tier === "core" || actor.tier === "lead";
export const canManagePeople = (actor: Person) => actor.tier === "core";
