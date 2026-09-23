export type EventKind = "Hackathon" | "Meetup";

export type EventItem = {
  slug: string;
  title: string;
  kind: EventKind;
  /** ISO date (yyyy-mm-dd) used for sorting and the date chip */
  iso: string;
  city: string;
  /** Three-letter city code printed on the ticket stub */
  code: string;
  date?: string;
  location?: string;
  image: string;
  register?: { label: string; url: string };
  /** Short bullet highlights shown above the description */
  highlights?: string[];
  tagline?: string;
  description: string[];
};

export const events: EventItem[] = [
  {
    slug: "hackblr1",
    kind: "Hackathon",
    iso: "2026-04-26",
    city: "Bengaluru",
    code: "BLR",
    title: "HackBLR (MLH HackDays)",
    date: "26 April 2026",
    location: "Zintlr Private Limited, Bengaluru",
    image: "/images/events/hackblr.png",
    register: { label: "Register Here", url: "https://luma.com/ia0ik7c6" },
    description: [
      "HackBLR 2026 is a national-level AI hackathon for developers, AI engineers, founders and builders who want to turn bold ideas into working AI-powered products.",
      "The themes are AI agents, voice AI, LLM applications and real-world AI systems — participants build impactful solutions with modern AI tooling and fast development workflows.",
      "It runs in two stages: a large online round first, after which the top teams qualify for the offline grand finale in Bengaluru to build and demo production-ready AI apps in front of industry experts and founders.",
    ],
  },
  {
    slug: "hackgr",
    kind: "Hackathon",
    iso: "2026-03-07",
    city: "Delhi NCR",
    code: "NCR",
    title: "Hack Geek Room",
    date: "7th March 2026",
    location: "OPSTree Global",
    image: "/images/events/hack-geek-room.jpeg",
    register: { label: "Registration Link", url: "https://luma.com/ges4hpol" },
    description: [
      "Hack Geek Room is a high-impact hackathon for builders and innovators who want to push what AI, AI agents and intelligent systems can do.",
      "The focus is on shipping real, meaningful AI-driven products — from autonomous and multi-agent workflows to applied AI for everyday problems — and turning ideas into working prototypes.",
    ],
  },
  {
    slug: "cc5.0",
    kind: "Hackathon",
    iso: "2025-09-14",
    city: "Bengaluru",
    code: "BLR",
    title: "Code Cubicle 5.0",
    date: "14 September 2025",
    location: "Microsoft Office (Bengaluru)",
    image: "/images/events/code-cubicle-5.jpg",
    register: {
      label: "Register Here",
      url: "https://unstop.com/hackathons/code-cubicle-5-geek-room-1537583",
    },
    description: [
      "Code Cubicle is Geek Room's flagship hybrid hackathon series, bringing young innovators from across India together to tackle real-world problems, build solutions and pitch them to industry leaders.",
      "Backed by industry partners, past editions have drawn 20,000+ registrations with finales at the Mastercard and Microsoft offices. The 5th edition is hosted at Microsoft's Bengaluru office.",
    ],
  },
  {
    slug: "grmeetup",
    kind: "Meetup",
    iso: "2025-11-08",
    city: "Gurugram",
    code: "GGN",
    title: "Geek Room Meetup #2",
    date: "8 November 2025",
    location: "Microsoft Office (Gurugram)",
    image: "/images/events/meetup-2.jpg",
    register: { label: "Register Here", url: "https://luma.com/ojciiuyi" },
    description: [
      "The second edition of the Geek Room Meetup is happening on 8th November at the Microsoft office in Gurugram.",
      "Expect an evening of tech talks and community vibes where developers, designers and innovators swap ideas, learn from each other and make meaningful connections.",
    ],
  },
  {
    slug: "cc4.0",
    kind: "Hackathon",
    iso: "2025-07-05",
    city: "Hyderabad",
    code: "HYD",
    title: "Code Cubicle 4.0",
    date: "5th July 2025",
    location: "Microsoft Office (Hyderabad)",
    image: "/images/events/code-cubicle-4.jpg",
    register: {
      label: "Register Now",
      url: "https://unstop.com/p/code-cubicle-40-geek-room-1478969",
    },
    description: [
      "Code Cubicle is Geek Room's flagship hybrid hackathon series, bringing young innovators from across India together to tackle real-world problems, build solutions and pitch them to industry leaders.",
      "Past editions have seen 7,000+ registrations with finales at the Mastercard and Microsoft offices. The 4th edition is hosted at Microsoft's Hyderabad office.",
    ],
  },
  {
    slug: "cc3.0",
    kind: "Hackathon",
    iso: "2024-09-21",
    city: "Gurugram",
    code: "GGN",
    title: "Code Cubicle 3.0",
    date: "21 September 2024",
    location: "Mastercard Office, Gurugram",
    image: "/images/events/code-cubicle-3.jpg",
    register: { label: "Register Here", url: "https://code-cubicle-3.devfolio.co/" },
    description: [
      "Code Cubicle 3.0 is a hackathon presented by Geek Room and Mastercard, all about innovative, technology-driven solutions.",
      "Winners also get the chance to attend an AI symposium hosted by Mastercard, meet leading data scientists and pitch their ideas to them.",
    ],
  },
  {
    slug: "ck2.0",
    kind: "Hackathon",
    iso: "2025-02-15",
    city: "Delhi",
    code: "DEL",
    title: "Code Kshetra 2.0",
    date: "February 2025",
    location: "JIMS Sector-5, Rohini, Delhi",
    image: "/images/events/code-kshetra-2.jpg",
    tagline: "Meet the largest hack in North India",
    highlights: [
      "15,000+ registrations",
      "400+ on-site hackers",
      "Powered by Groq, Pathway, Reactive Network",
      "An MLH 2025 Season hackathon",
      "Prize pool of 5 Lakhs+",
    ],
    description: [
      "Code Kshetra is a 36-hour hackathon packed with creativity and cutting-edge ideas, hosted by JIMS Sector-5 Rohini together with Geek Room.",
      "Code Kshetra 2.0 is as much about building memories and having fun as it is about building projects. Bring your laptop, your wildest ideas and a spare charger.",
      "Come ready to build — your ideas will thrive, even if your sleep schedule doesn't.",
    ],
  },
];

/** Events sorted newest first */
export const eventsByDate = [...events].sort((a, b) => b.iso.localeCompare(a.iso));

export function formatChip(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return {
    day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
  };
}

/** Deterministic bar widths for an event's barcode, seeded from its slug. */
export function barcode(seed: string, bars = 34) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return Array.from({ length: bars }, () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return 1 + ((h >>> 0) % 4);
  });
}

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}
