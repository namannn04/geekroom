// Fills an EMPTY local database with a demo team so you can click around Geek Room Track.
// Usage: npm run track:seed   (refuses to run against a database that already has users)
import postgres from "postgres";
import bcrypt from "bcryptjs";

try {
  process.loadEnvFile(".env.local");
} catch {}
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const sql = postgres(url, { max: 1 });

const [{ n }] = await sql`select count(*)::int as n from users`;
if (n > 0) {
  console.error("Database already has users; not seeding.");
  process.exit(1);
}

const pw = await bcrypt.hash("geekroom123", 10);
const person = async (name, email, tier, title, managerId, image = null) =>
  (await sql`insert into users ${sql({ name, email, tier, title, manager_id: managerId, image, password_hash: pw })} returning id`)[0].id;

const manas = await person("Manas Chopra", "manas@geekroom.co.in", "core", "Founder", null, "/images/team/manas.jpg");
const akshay = await person("Akshay Kumar Sharma", "akshay@geekroom.co.in", "core", "Tech", null, "/images/team/akshay.jpg");
const naman = await person("Naman Dadhich", "naman@geekroom.co.in", "core", "Events", null, "/images/team/naman.jpg");
const tushar = await person("Tushar Teotia", "tushar@geekroom.co.in", "lead", "Design lead", manas, "/images/team/tushar.jpg");
const jagriti = await person("Jagriti Rai", "jagriti@geekroom.co.in", "lead", "Community lead", naman, "/images/team/jagriti.jpg");
const ishaan = await person("Ishaan Vats", "ishaan@geekroom.co.in", "lead", "Web lead", akshay, "/images/team/ishaan.jpg");
const members = [
  await person("Riya Sen", "riya@example.com", "member", "Designer", tushar),
  await person("Kabir Mehta", "kabir@example.com", "member", "Social media", jagriti),
  await person("Aanya Gupta", "aanya@example.com", "member", "Volunteer coordinator", jagriti),
  await person("Dev Malhotra", "dev@example.com", "member", "Frontend", ishaan),
  await person("Sara Khan", "sara@example.com", "member", "Content", tushar),
];
const all = [manas, akshay, naman, tushar, jagriti, ishaan, ...members];

const proj = async (key, name, description, leadId, targetDate) =>
  (await sql`insert into projects ${sql({ key, name, description, lead_id: leadId, target_date: targetDate })} returning id`)[0].id;
const cc7 = await proj("CC7", "Code Cubicle 7.0", "The seventh edition: 4,000+ builders, finale at a partner office.", naman, "2026-12-14");
const blr = await proj("HBLR2", "HackBLR 2", "Second edition of HackBLR in Bengaluru.", akshay, "2027-02-20");
const out = await proj("SPON", "Sponsor outreach Q4", "Close partners for CC7 and HackBLR 2.", manas, null);

const titles = [
  ["Lock the finale venue", cc7, naman], ["Design the CC7 brand kit", cc7, tushar], ["Poster set for Instagram", cc7, members[0]],
  ["Shortlist judges", cc7, naman], ["Volunteer roster for finale day", cc7, members[2]], ["Registration page on geekroom.co.in", cc7, members[3]],
  ["Write problem statements", blr, akshay], ["Venue walk-through in Bengaluru", blr, ishaan], ["Discord server cleanup", null, members[1]],
  ["Pitch deck refresh", out, tushar], ["Follow up with Groq", out, manas], ["Mastercard renewal call", out, manas],
  ["Swag vendor quotes", cc7, jagriti], ["Mentor onboarding doc", blr, members[4]], ["Fix mobile nav on event page", null, members[3]],
];
const statuses = ["done", "done", "done", "in_progress", "in_review", "todo", "backlog"];
const day = 86_400_000;
for (let i = 0; i < titles.length; i++) {
  const [title, projectId, assigneeId] = titles[i];
  const status = statuses[i % statuses.length];
  const created = new Date(Date.now() - (40 - i * 2) * day);
  const creator = assigneeId === manas ? manas : [manas, naman, akshay][i % 3];
  const [t] = await sql`insert into tasks ${sql({
    title, project_id: projectId, assignee_id: assigneeId, creator_id: creator, status,
    priority: (i % 5), estimate: [1, 2, 3, 5, 8][i % 5], created_at: created,
    completed_at: status === "done" ? new Date(created.getTime() + 5 * day) : null,
  })} returning id`;
  await sql`insert into activities ${sql({ actor_id: creator, kind: "created", task_id: t.id, created_at: created })}`;
  if (status === "done") await sql`insert into activities ${sql({ actor_id: assigneeId, kind: "completed", task_id: t.id, subject_id: assigneeId, created_at: new Date(created.getTime() + 5 * day) })}`;
}

// A year of background activity so the contribution graphs have shape
for (const id of all) {
  const busy = 0.15 + Math.random() * 0.5;
  for (let d = 0; d < 365; d++) {
    if (Math.random() > busy) continue;
    const k = 1 + Math.floor(Math.random() * 6);
    for (let j = 0; j < k; j++)
      await sql`insert into activities ${sql({ actor_id: id, kind: "commented", created_at: new Date(Date.now() - d * day - j * 3600_000) })}`;
  }
  for (let w = 0; w < 6; w++) {
    const date = new Date(Date.now() - w * 5 * day).toISOString().slice(0, 10);
    const minutes = 30 + Math.floor(Math.random() * 6) * 30;
    await sql`insert into worklogs ${sql({ user_id: id, minutes, note: ["Sponsor call", "Venue run", "Community moderation", "Design review"][w % 4], date })}`;
    await sql`insert into activities ${sql({ actor_id: id, kind: "logged", data: sql.json({ minutes, note: "Logged work" }), created_at: new Date(date) })}`;
  }
}

console.log("Seeded. Sign in as manas@geekroom.co.in / geekroom123");
await sql.end();
