# Geek Room

Website for **Geek Room** — one of India's biggest student tech communities (50k+ members), built with Next.js.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router, static generation)
- TypeScript
- Tailwind CSS v4
- [Motion](https://motion.dev/) for animations
- Fonts: Clash Display (Fontshare), Plus Jakarta Sans and Bebas Neue (Google Fonts)

## Pages

| Route | Description |
| --- | --- |
| `/` | Home — hero, highlights, features, partners, services, speakers, FAQ |
| `/about-us` | Story, stats, milestone timeline, team and reviews |
| `/event` | All events |
| `/event/[slug]` | Event details with registration link and related events |
| `/contact-us` | Email and address |
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
    ui/           # shared building blocks (Reveal, PersonCard, CountUp, ...)
    home/         # homepage sections
    about/        # About Us sections
    events/       # event card, grid and sidebar
  data/
    site.ts       # site config, team, speakers, partners, FAQ, milestones
    events.ts     # events catalogue
public/images/    # brand, event, team, speaker and partner images
```

## Editing content

All copy lives in `src/data/`. To add a new event, append an entry to `events` in
`src/data/events.ts` and drop its image into `public/images/events/` — the listing, detail
page and sidebars pick it up automatically.
