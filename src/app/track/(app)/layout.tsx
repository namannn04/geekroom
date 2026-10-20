import { redirect } from "next/navigation";
import TrackShell from "@/components/track/TrackShell";
import { getCurrentUser } from "@/lib/track/session";
import { listPeople, listProjects, userCount } from "@/lib/track/queries";
import { canAssignTo } from "@/lib/track/permissions";

export default async function TrackAppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect((await userCount()) === 0 ? "/setup" : "/login");

  const [people, projects] = await Promise.all([listPeople(), listProjects()]);
  const viewer = {
    id: user.id,
    tier: user.tier,
    assignableIds: people.filter((p) => p.active && canAssignTo(user, p, people)).map((p) => p.id),
  };

  return (
    <TrackShell
      viewer={viewer}
      people={people.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        tier: p.tier,
        title: p.title,
        managerId: p.managerId,
        active: p.active,
        joined: p.passwordHash != null,
      }))}
      projects={projects.map((p) => ({ id: p.id, key: p.key, name: p.name }))}
    >
      {children}
    </TrackShell>
  );
}
