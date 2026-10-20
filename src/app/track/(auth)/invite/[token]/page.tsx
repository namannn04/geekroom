import { createHash } from "node:crypto";
import Link from "next/link";
import { and, eq, gt } from "drizzle-orm";
import { AuthFrame, InviteForm } from "@/components/track/AuthForms";
import { db } from "@/lib/track/db";
import { users } from "@/lib/track/schema";
import { tierLabel } from "@/lib/track/constants";

export const metadata = { title: "Join the team" };

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const hash = createHash("sha256").update(token).digest("hex");
  const person = await db.query.users.findFirst({
    where: and(eq(users.inviteTokenHash, hash), gt(users.inviteExpiresAt, new Date()), eq(users.active, true)),
  });

  if (!person) {
    return (
      <AuthFrame heading={<>Link <em>expired</em></>} sub="This invite was already used or is more than 7 days old. Ask whoever invited you to send a fresh link.">
        <Link href="/login" className="btn-primary">
          Go to sign in
        </Link>
      </AuthFrame>
    );
  }
  const manager = person.managerId ? await db.query.users.findFirst({ where: eq(users.id, person.managerId) }) : null;

  return (
    <AuthFrame
      heading={<>Welcome, <em>{person.name.split(" ")[0]}</em></>}
      sub={`You're joining Geek Room as a ${tierLabel(person.tier).toLowerCase()}${manager ? `, working with ${manager.name}` : ""}. Set a password to get started.`}
    >
      <InviteForm token={token} email={person.email} />
    </AuthFrame>
  );
}
