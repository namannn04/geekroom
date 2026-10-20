# Geek Room

Website for **Geek Room** — one of India's biggest student tech communities (50k+ members), built with Next.js.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router, static generation)
- TypeScript, Tailwind CSS v4
- [GSAP](https://gsap.com/) + ScrollTrigger, SplitText and DrawSVG for scroll-driven motion
- [Lenis](https://lenis.darkroom.engineering/) smooth scrolling, synced to the GSAP ticker
- [Motion](https://motion.dev/) (Framer Motion) for the page transition and UI state animation
- Fonts: Anybody (variable width axis), Schibsted Grotesk, JetBrains Mono

## Design: "Signal" v2

Checked against the [Impeccable](https://impeccable.style/) detector (`npx impeccable detect <url>`).

- **Colour:** tinted ink `#0d0e0c`, paper `#eeece6`, one accent: signal orange `#ff5a1f`.
  Teal `#19b3bf` only appears in the `</>` brand mark.
- **Type:** Anybody at a condensed 72% width for headlines; `<em>` inside `.display` switches to the
  expanded light cut in orange. No gradient text, no italic serif.
- **Motion vocabulary:** `power3/power4.out` and `power2.inOut` only, no bounce or elastic.
  Every animation respects `prefers-reduced-motion`.

## Motion map

| Where | Effect |
| --- | --- |
| Page change | Orange slash + ink panel sweep across with the destination name (`PageTransition`) |
| Section headings | Characters rise out of a mask while the width axis tightens from expanded (`SectionHead`) |
| Hero | Stretch-in headline; on scroll lines diverge, the `</>` mark comes apart, partner rows counter-slide |
| Featured events | Section pins; tickets run horizontally on a live date axis with a playhead |
| Offerings | Cards open along the slash, glyph strokes draw in |
| Impact | Log-scale bars and counters tied to scroll position (they wind back when scrolling up) |
| Story | Photos wipe up from an over-scaled crop; sticky index tracks the active panel |
| Speakers | Cards deal out from a fanned deck |
| Partners | Hairline logo grid flips up in a wave |
| Reviews | Words light up in reading order |
| Events page | Date axis + typographic index; rows draw their rule, hover sweeps a fill with a cursor preview |
| Footer | Wordmark letters rise from below the fold |

## Pages

| Route | Description |
| --- | --- |
| `/` | Home: hero, signal track, offerings, impact, story, speakers, partners, reviews, FAQ |
| `/about-us` | Manifesto, stats, timeline, team and reviews |
| `/event` | Date axis and filterable typographic event index |
| `/event/[slug]` | Event details, sticky register panel and ticket recommendations |
| `/contact-us` | Secure Resend-backed enquiry form and contact channels |
| `/thank-you` | Post-submission page |
| 404 | Custom not-found page |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint
```

## Contact form setup

The contact form posts to a same-origin server route; the Resend API key and
Turnstile secret never enter the browser bundle. Copy `.env.example` to
`.env.local` and configure:

- `RESEND_API_KEY`: a server-side Resend API key.
- `CONTACT_TO_EMAIL`: the private inbox that receives enquiries.
- `CONTACT_FROM_EMAIL`: a sender on a domain verified in Resend, formatted as
  `Geek Room Website <team@geekroom.co.in>`.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: the public Cloudflare Turnstile widget key.
- `TURNSTILE_SECRET_KEY`: the server-only Turnstile verification secret.
- `CONTACT_ALLOWED_ORIGINS`: optional comma-separated production origins.

Also add the same values to the deployment provider's environment settings.
The API rejects cross-origin and oversized requests, validates every field and
Turnstile token server-side, uses a honeypot, and applies a small per-instance
IP rate limit before calling Resend.

## Geek Room Track (`track.geekroom.co.in`)

A Linear-style workspace for the team, served from the same app on the `track.` subdomain.
`src/middleware.ts` rewrites `track.*` requests into `src/app/track/`, and the main domain
redirects `/track/*` to the subdomain.

- **Three tiers:** Core → Leads (report to a core member) → Members (report to a lead).
  Work flows down the tree: core can assign to anyone, a lead to themself and their crew,
  a member only to themself. Any task can be broken into sub-tasks and delegated further.
- **Tasks:** list and board views, status/priority/assignee/project/effort/due pickers,
  sub-tasks, comments and a full activity trail. Press `C` anywhere to create a task.
- **Effort counts:** shipping a task credits its effort points (1/2/3/5/8) to the assignee;
  logged work (sponsor calls, venue runs, moderation) earns 1 point per hour. Every action
  lands on the person's GitHub-style contribution graph.
- **Pages:** My work, All tasks, Projects, Team (hierarchy + invites), People profiles, Insights
  (team activity graph, effort board, by-tier and by-crew totals).
- **Access:** invite-only. A core member or lead creates an invite link (valid 7 days, single use);
  the person sets a password. The very first core account is created at `/setup`.

Stack: Drizzle ORM + Postgres (Neon on Vercel), `jose` signed session cookies, `bcryptjs`.

### Running it locally

```bash
createdb geekroom_track                       # or point DATABASE_URL at any Postgres
echo 'DATABASE_URL=postgres://localhost:5432/geekroom_track' >> .env.local
npm run db:migrate                            # apply drizzle/ migrations
npm run track:seed                            # optional demo team (empty DB only)
npm run dev                                   # open http://track.localhost:3000
```

Demo login after seeding: `manas@geekroom.co.in` / `geekroom123`.

### Deploying

1. Set `DATABASE_URL`, `AUTH_SECRET` and `TRACK_SETUP_KEY` on the Vercel project.
2. Run `npm run db:migrate` against the production database (after schema changes too;
   create new migrations with `npm run db:generate`).
3. Add `track.geekroom.co.in` as a domain on the project.
4. Open `https://track.geekroom.co.in/setup`, enter the setup key and create the first core account.

Preview deployments don't get a `track.` host, so the tracker is only reachable on the
production domain (and `track.localhost` in dev).

## Project structure

```
src/
  app/(site)/     # public site routes (App Router)
  components/
    layout/       # Navbar, Footer
    motion/       # SmoothScroll (Lenis) and PageTransition
    ui/           # shared building blocks (SectionHead, DotField, GeekMark, JoinCta, ...)
    home/         # homepage sections
    about/        # About Us sections
    events/       # EventTicket, EventIndex, EventHero
    contact/      # contact form
  lib/gsap.ts     # GSAP plugin registration and defaults
  lib/track/      # Track: schema, db client, session, permissions, queries
  app/track/      # Track routes and server actions (served on track.geekroom.co.in)
  components/track/ # Track UI
  data/
    site.ts       # site config, team, speakers, partners, FAQ, milestones
    events.ts     # events catalogue
public/images/    # brand, event, team, speaker and partner images
```

## Editing content

All copy lives in `src/data/`. To add a new event, append an entry to `events` in
`src/data/events.ts` and drop its image into `public/images/events/` — the listing, detail
page and sidebars pick it up automatically.
