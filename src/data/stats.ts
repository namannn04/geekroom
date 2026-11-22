/**
 * Geek Room's headline numbers. Every page that states a community-wide total reads it from
 * here, so the site never shows two different figures. Update a number in one place only.
 * Event-specific figures (registrations, teams, finalists) live with each event instead.
 */
export const totals = {
  builders: 150_000,
  events: 80,
  companies: 500,
  countries: 60,
  registrations: 25_000,
  speakers: 35,
  whatsappGroups: 100,
} as const;

const short = (n: number) => (n >= 1000 ? `${n / 1000}K+` : `${n}+`);

/** Display strings: "150K+", "80+", "500+", "60+" */
export const stat = {
  builders: short(totals.builders),
  events: short(totals.events),
  companies: short(totals.companies),
  countries: short(totals.countries),
  registrations: short(totals.registrations),
  speakers: short(totals.speakers),
  whatsappGroups: short(totals.whatsappGroups),
  /** Long form for prose that prefers digits: "150,000+" */
  buildersLong: `${totals.builders.toLocaleString("en-US")}+`,
} as const;
