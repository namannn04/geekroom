# Geek Room

The website for **Geek Room**, a community of developers, students, founders, and technology enthusiasts. Explore upcoming events, discover community initiatives, meet the team, and connect with Geek Room.

[Website](https://geekroom.co.in) · [LinkedIn](https://www.linkedin.com/company/geekr00m/) · [Instagram](https://www.instagram.com/geekroom__/)

## Overview

- Event catalogue with category filters, individual event pages, and registration links.
- Community highlights, team profiles, speakers, and partner showcases.
- Contact form powered by Resend and protected with Cloudflare Turnstile.
- Responsive layouts, scroll-driven animation, and optional 3D decoration.
- Generated sitemap, social preview images, and a custom 404 page.

## Technology

- **Application:** Next.js 15 App Router, React 19, and TypeScript.
- **Styling:** Tailwind CSS v4.
- **Animation:** GSAP, Motion, and Lenis.
- **3D:** Three.js, React Three Fiber, and Drei.
- **Email:** Resend, with server-side validation and Cloudflare Turnstile.

## Local development

Use Node.js 20 or later and npm. The repository includes `package-lock.json`; use npm to keep dependency resolution consistent.

```bash
git clone https://github.com/namannn04/geekroom.git
cd geekroom
npm ci
cp .env.example .env.local
npm run dev
```

Open [localhost:3000](http://localhost:3000). Configure the environment variables below to enable contact form submissions.

### Available commands

- `npm run dev` — start the development server.
- `npm run build` — create a production build.
- `npm run start` — serve the production build after building.
- `npm run lint` — run ESLint.

## Environment configuration

Use `.env.example` as the reference for `.env.local` and your deployment environment.

- **`RESEND_API_KEY`** — server-side API key used to send contact emails.
- **`CONTACT_TO_EMAIL`** — inbox that receives enquiries.
- **`CONTACT_FROM_EMAIL`** — sender on a domain verified in Resend, such as `Geek Room Website <team@geekroom.co.in>`.
- **`NEXT_PUBLIC_TURNSTILE_SITE_KEY`** — public Cloudflare Turnstile widget key.
- **`TURNSTILE_SECRET_KEY`** — server-side Turnstile verification secret.
- **`CONTACT_ALLOWED_ORIGINS`** — optional comma-separated origins allowed to submit the form. When omitted, origins must match the request host.

Keep API keys and server-side secrets out of source control. Only the Turnstile site key should use the `NEXT_PUBLIC_` prefix. For local form testing, use Turnstile credentials suitable for your development hostname.

The contact endpoint validates fields and Turnstile tokens, checks request origins and size, includes a honeypot, and limits requests per IP within each server instance.

## Project structure

```text
public/images/             Brand, event, team, speaker, and partner assets
src/
  app/                     Pages, metadata, and API routes
    api/contact/           Contact form endpoint
    event/[slug]/          Individual event pages
    partners/wayzyy/       Wayzyy partner page
  components/
    about/                 About page sections
    contact/               Contact form components
    events/                Event listing and ticket components
    home/                  Homepage sections
    layout/                Navigation and footer
    motion/                Scrolling, transitions, and deferred decoration
    three/                 3D visuals
    ui/                    Shared interface components
  data/
    events.ts              Event catalogue and related helpers
    site.ts                Community content and site configuration
  lib/                     Shared motion and visual utilities
```

## Pages

- `/` — community homepage.
- `/about-us` — story, milestones, team, and community reviews.
- `/event` — event catalogue and category filters.
- `/event/[slug]` — event details and registration.
- `/partners/wayzyy` — Wayzyy partnership details.
- `/brochure` — community brochure.
- `/contact-us` — enquiry form and contact channels.
- `/thank-you` — contact submission confirmation.

## Updating content

Edit community content, navigation, speakers, partners, and FAQs in `src/data/site.ts`.

To add or update an event:

1. Add its image to `public/images/events/`.
2. Add or edit its entry in `src/data/events.ts`, following the existing event type and entries.
3. Use a unique slug and check dates, category, image path, and registration links.
4. Review the event catalogue and individual event page locally.

Event pages and the sitemap use the shared event catalogue. Content is maintained in source files; this repository currently has no database configuration or `db:seed` command.

## Design and accessibility

The visual system pairs a paper background (`#eeece6`) with dark ink (`#0d0e0c`) and signal orange (`#ff5a1f`). Typography uses Anybody, Schibsted Grotesk, and JetBrains Mono.

Motion supports reduced-motion preferences. Decorative WebGL content is deferred on eligible desktop screens, while smaller screens retain a static hero graphic. Navigation includes a visible-on-focus skip link and a mobile menu with Escape handling, focus containment, and scroll locking.

## Validation and deployment

Before submitting changes:

```bash
npm run lint
npm run build
```

Check affected pages at mobile and desktop widths, keyboard navigation, reduced-motion behavior, and event links. For contact form changes, verify both successful submissions and validation failures with configured credentials.

Deploy to a platform that supports Next.js with a Node.js server runtime. The contact API requires server-side execution. Configure environment variables on the deployment platform, then build and start with:

```bash
npm ci
npm run build
npm run start
```

## Contributing

Keep changes focused and include a clear description of the behavior or content being updated. Follow the existing TypeScript, component, and styling conventions, run the checks above for code changes, and include screenshots for visible interface changes.

For community enquiries and partnerships, contact [team@geekroom.co.in](mailto:team@geekroom.co.in).
