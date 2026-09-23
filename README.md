# Geek Room

Website for **Geek Room** — one of India's biggest student tech communities (50k+ members), built with Next.js.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router, static generation)
- TypeScript
- Tailwind CSS v4
- [Motion](https://motion.dev/) for animations
- Fonts: Space Grotesk, Instrument Serif and JetBrains Mono (Google Fonts)

## Design — "Signal"

An ink-dark, abstract system built from the Geek Room `</>` mark:

- **Colour:** ink `#08090a` canvas, paper `#f4f1ea` text, teal `#19b3bf` → orange `#ff5a1f` signal gradient
- **Type:** uppercase Space Grotesk headlines with italic Instrument Serif accents (`<em>` inside `.display`),
  JetBrains Mono for labels and numbering
- **Texture:** paper grid, film noise, blurred glow fields and a pointer-reactive canvas dot field
- **Motifs:** numbered sections (`01 — LABEL`), date-chip event cards, bento offerings, impact band,
  scroll-filled timeline, outlined footer wordmark

## Pages

| Route | Description |
| --- | --- |
| `/` | Home — hero, featured events, offerings, impact, story, speakers, partners, reviews, FAQ |
| `/about-us` | Manifesto, stats, timeline, team and reviews |
| `/event` | Filterable events (all / hackathons / meetups) |
| `/event/[slug]` | Event details, sticky register panel and related events |
| `/contact-us` | Enquiry form (opens a pre-filled email) and contact channels |
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

## Project structure

```
src/
  app/            # routes (App Router)
  components/
    layout/       # Navbar, Footer
    ui/           # shared building blocks (Reveal, SectionHead, DotField, GeekMark, Marquee, ...)
    home/         # homepage sections
    about/        # About Us sections
    events/       # event card, grid and filterable explorer
    contact/      # contact form
  data/
    site.ts       # site config, team, speakers, partners, FAQ, milestones
    events.ts     # events catalogue
public/images/    # brand, event, team, speaker and partner images
```

## Editing content

All copy lives in `src/data/`. To add a new event, append an entry to `events` in
`src/data/events.ts` and drop its image into `public/images/events/` — the listing, detail
page and sidebars pick it up automatically.
