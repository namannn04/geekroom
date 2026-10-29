/** Event categories, in the order they appear in filters and the footer. */
export const eventKinds = ["Hackathon", "Global Hackathon", "Vibe-a-thon", "Meetup", "Hiring"] as const;
export type EventKind = (typeof eventKinds)[number];

/** URL-safe form of a category, used for `/event?category=…` links. */
export const kindSlug = (kind: EventKind) => kind.toLowerCase().replace(/\s+/g, "-");

export type EventItem = {
  slug: string;
  title: string;
  kind: EventKind;
  /** Further categories the event also belongs to, e.g. a hackathon that doubled as a hiring drive */
  alsoIn?: EventKind[];
  /** ISO date (yyyy-mm-dd) used for sorting and the date chip. Empty while dates are still to be announced. */
  iso: string;
  /** Running now, or announced but not yet dated. Shown as a pill on the ticket. */
  status?: "live" | "upcoming";
  city: string;
  /** Three-letter city code printed on the ticket stub */
  code: string;
  date?: string;
  /** Only the month is known: the chip shows the month instead of a day */
  approx?: boolean;
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
    slug: "global-ai-hackathon",
    kind: "Global Hackathon",
    status: "live",
    iso: "2026-10-09",
    city: "Global",
    code: "GLB",
    title: "Global AI Hackathon",
    date: "9 Oct – 29 Nov 2026",
    location: "Online, worldwide",
    image: "/images/events/global-ai-hackathon.webp",
    register: { label: "Register now", url: "https://hackculture.io/hackathons/ai-global-hackathon" },
    tagline: "Build Globally. Ship Boldly.",
    highlights: [
      "Open to builders from any country",
      "Fully virtual, teams of 1–4",
      "$11.5K prize pool, including $1,000 cash",
      "Problem statements go live 1 Nov, prototypes due 15 Nov",
      "Judging round on 29 Nov",
    ],
    description: [
      "Geek Room's Global AI Hackathon is a fully virtual, AI-focused hackathon open to developers, students, researchers and builders from any country, background and skill level.",
      "Registration and team formation are open until 15 November. Problem statements go live on 1 November, teams build and submit a working prototype within the two-week window, and judging runs on 29 November.",
      "Bifrost (by Maxim AI) is the title partner and Tavily (by Nebius) the track partner, with Omnidimension and Pathway as community partners.",
    ],
  },
  {
    slug: "hacksmart-2",
    kind: "Hackathon",
    status: "upcoming",
    iso: "",
    city: "To be announced",
    code: "TBA",
    title: "HackSmart 2.0",
    image: "/images/events/hacksmart.png",
    tagline: "HackSmart is back for a second edition",
    description: [
      "HackSmart returns for its second edition, after the first HackSmart brought 200+ shortlisted builders to Battery Smart HQ in Gurugram in January 2026.",
      "Dates, venue and registrations will be announced soon.",
    ],
  },
  {
    slug: "trackshift-2026",
    kind: "Hackathon",
    iso: "2026-09-12",
    city: "Mohali",
    code: "MOH",
    title: "TrackShift 2026",
    date: "12–13 September 2026",
    location: "Plaksha University, Mohali",
    image: "/images/events/trackshift.webp",
    register: { label: "Event page", url: "https://hackculture.io/hackathons/trackshift-2026" },
    tagline: "Where ideas pit stop & innovation refuels",
    highlights: [
      "3,600+ students registered",
      "36K+ event page views",
      "24-hour finale at Plaksha University",
      "₹1.75L prize pool, plus a TGR Haas F1 facility visit and Mphasis internships for the top three",
    ],
    description: [
      "TrackShift is an applied innovation challenge by the Mphasis CSR Foundation with the DS Brar Center for Girls and Women in STEM and the TGR Haas F1 Team, hosted at Plaksha University. Geek Room ran it as an implementation partner alongside HackCulture.",
      "The 2026 edition treats motorsport as the proof of concept: every challenge starts from a motorsport engineering principle, from energy and overtake intelligence to track-limits detection and tyre degradation.",
      "Student teams submitted ideas online, and the shortlist built and presented through a 24-hour finale at Plaksha University in Mohali on 12–13 September.",
    ],
  },
  {
    slug: "meetup3",
    kind: "Meetup",
    iso: "2026-05-10",
    city: "Gurugram",
    code: "GGN",
    title: "Geek Room Meetup #3",
    date: "10 May 2026",
    location: "Nagarro Corporate Office, Sector 18, Gurugram",
    image: "/images/events/meetup-3.jpg",
    register: { label: "Event page", url: "https://luma.com/uza47084" },
    description: [
      "The third edition of the Geek Room Meetup took over the Nagarro office in Gurugram on 10 May.",
      "Developers, designers, students and founders came together for talks, product showcases and networking, with a few surprises along the way.",
    ],
  },
  {
    slug: "vibeathon2",
    kind: "Vibe-a-thon",
    iso: "2025-06-29",
    city: "Online",
    code: "WEB",
    title: "Vibe-a-thon 2.0",
    date: "29 June 2025",
    location: "Online, worldwide",
    image: "/images/events/vibe-a-thon-2.jpg",
    register: { label: "Event page", url: "https://luma.com/vn8yatnt" },
    tagline: "Code the vibe. Build the future. Again.",
    highlights: [
      "10-hour online coding jam, open to builders worldwide",
      "Live surprise problem statements from Omnidimension",
      "Solo builds with any AI tool: Trae, Cursor, Windsurf, Copilot",
      "$500+ in cash prizes",
    ],
    description: [
      "Vibe-a-thon is Geek Room's signature online coding jam, open to builders anywhere in the world, where the only rule is to build with vibe. The second edition stretched it to ten hours of real-time building.",
      "Omnidimension, a voice AI platform, set live surprise problem statements, and each builder coded solo with whatever AI tools fuelled their flow, in a high-energy, music-driven room.",
    ],
  },
  {
    slug: "meetup1",
    kind: "Meetup",
    iso: "2025-06-28",
    city: "Noida",
    code: "NOI",
    title: "Geek Room Meetup #1",
    date: "28 June 2025",
    location: "OpsTree Solutions, Sector 126, Noida",
    image: "/images/events/meetup-1.jpg",
    register: { label: "Event page", url: "https://luma.com/m20tn1s7" },
    description: [
      "The first edition of the Geek Room Meetup, held at the OpsTree Solutions office in Noida.",
      "It started the meetup series that has since moved through Microsoft and Nagarro offices in Gurugram.",
    ],
  },
  {
    slug: "vibeathon1",
    kind: "Vibe-a-thon",
    iso: "2025-05-25",
    city: "Online",
    code: "WEB",
    title: "Vibe-a-thon 1.0",
    date: "25 May 2025",
    location: "Online, worldwide",
    image: "/images/events/vibe-a-thon-1.jpg",
    register: { label: "Event page", url: "https://luma.com/o135s404" },
    tagline: "Code the vibe. Build the future.",
    highlights: [
      "Online and open to builders anywhere",
      "Surprise problem statements revealed live",
      "Individual vibe-coding sessions",
      "Any AI tool allowed: Cursor, Windsurf, Copilot",
      "₹10K+ in cash prizes",
    ],
    description: [
      "The first Vibe-a-thon was a one-of-a-kind coding jam where energy meets innovation: less a regular hackathon, more a vibe-coding session where the rhythm of creativity takes over.",
      "Builders got on-the-spot problem statements and shipped quirky apps, smart automations and GenAI tools in real time, with music, caffeine and code in the true spirit of Geek Room.",
    ],
  },
  {
    slug: "pears",
    kind: "Global Hackathon",
    iso: "2025-03-02",
    city: "Online",
    code: "GLB",
    title: "Pears Global Hackathon",
    date: "2–9 March 2025",
    location: "Online, worldwide",
    image: "/images/events/pears-global-hackathon.jpg",
    register: { label: "Event page", url: "https://luma.com/9mqll98a" },
    tagline: "Peer-to-peer, built worldwide",
    highlights: [
      "Global online hackathon, free and open worldwide",
      "Every project built on Pears technology",
      "$5,000 prize pool, plus tablets and AirPods",
      "Two judging rounds: 2 and 9 March",
    ],
    description: [
      "Pears Hackathon 2025 was a global online hackathon run by Geek Room with Pears Technology, open to students, professionals and anyone passionate about building.",
      "Every project had to integrate Pears' peer-to-peer technology. Teams submitted on DoraHacks for the first round on 2 March, and the final judging round ran on 9 March, with expert mentorship throughout.",
    ],
  },
  {
    slug: "cc6.0",
    kind: "Hackathon",
    iso: "2026-10-11",
    city: "Noida",
    code: "NOI",
    title: "Code Cubicle 6.0",
    date: "11 October 2026",
    location: "Paytm Office, Noida",
    image: "/images/events/code-cubicle-6.webp",
    register: { label: "Event page", url: "https://hackculture.io/hackathons/code-cubicle-6-0" },
    tagline: "Where builders ship from the office cubicle",
    highlights: [
      "3,700+ builders registered",
      "1,631 teams from 180+ colleges",
      "Working professionals from 100+ companies",
      "Prize pool above $20,000",
      "Online round 3 Oct, finale 11 Oct",
    ],
    description: [
      "Code Cubicle 6.0 is the sixth edition of Geek Room's flagship hackathon series, and the biggest one yet. Registrations closed with 3,700+ builders across 1,631 teams: students, developers, founders and working professionals.",
      "Teams pitch in the online round on 3 October, and the shortlist builds through the offline finale at the Paytm office in Noida on 11 October.",
    ],
  },
  {
    slug: "grandprix",
    kind: "Hackathon",
    iso: "2026-08-22",
    city: "Noida",
    code: "NOI",
    title: "AI Race Month GrandPrix",
    date: "22 August 2026",
    location: "Paytm Office, Sector 98, Noida",
    image: "/images/events/grand-prix.jpg",
    tagline: "One race. Two hackathons.",
    highlights: [
      "1,500+ participants",
      "500+ teams from 175+ colleges",
      "30 finalists at the Paytm office",
      "Winners go straight to the TrackShift × Mphasis F1 national finale",
    ],
    description: [
      "AI Race Month was a month-long AI hackathon run by Geek Room with the SheBuilds ecosystem, built around AI, racing and fintech, including a Paytm UPI challenge for Gen Z.",
      "Teams raced through an online qualifier on 15 August, and the top 30 built, demoed and pitched live at the GrandPrix finale at Paytm's Noida office on 22 August.",
      "Partners included Plaksha University, Paytm, Qdrant, SheBuilds, Wayzyy, Smartprix and Pathway.",
    ],
  },
  {
    slug: "hacksmart",
    kind: "Hackathon",
    alsoIn: ["Hiring"],
    iso: "2026-01-31",
    city: "Gurugram",
    code: "GGN",
    title: "HackSmart 2026",
    date: "31 Jan – 1 Feb 2026",
    location: "Battery Smart HQ, Sector 62, Gurugram",
    image: "/images/events/hacksmart.png",
    tagline: "Code India Forward",
    highlights: [
      "1,000+ registrations",
      "200+ builders shortlisted",
      "24-hour build sprint",
      "Battery intelligence, EV operations and cloud problem statements",
      "Doubled as a hiring hackathon",
    ],
    description: [
      "HackSmart was Battery Smart's first tech hackathon, run with AWS: an industry-sponsored challenge that doubled as a hiring hackathon, so builders were evaluated on what they shipped rather than on a CV.",
      "Engineering students from IITs, BITS, NITs and other campuses worked on real clean-mobility problems with mentors from Battery Smart and AWS, before demo-led judging by Battery Smart's leadership picked the top five teams.",
    ],
  },
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
    highlights: [
      "551 teams registered",
      "Top 50 teams in the offline finale",
      "1,500+ people in the room",
      "Professionals from 100+ companies, students from 50+ colleges",
      "40K+ Luma page views before the event",
    ],
    description: [
      "HackBLR 2026 is a national-level AI hackathon for developers, AI engineers, founders and builders who want to turn bold ideas into working AI-powered products.",
      "The themes are AI agents, voice AI, LLM applications and real-world AI systems. Participants build impactful solutions with modern AI tooling and fast development workflows.",
      "It runs in two stages: a large online round first, after which the top teams qualify for the offline grand finale in Bengaluru to build and demo production-ready AI apps in front of industry experts and founders.",
      "Builders travelled in from Delhi, Punjab, Mumbai, Kolkata, Chennai and Bengaluru, with tracks across fintech, healthcare, legal, developer tools and voice AI. Partners included Qdrant, Vapi, TRAE, MiniMax, Bump.fm, Plaksha University and HiDevs.",
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
      "The focus is on shipping real, meaningful AI-driven products, from autonomous and multi-agent workflows to applied AI for everyday problems, and turning ideas into working prototypes.",
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
    highlights: [
      "3,741 registrations on Unstop",
      "250 teams through the profile shortlist",
      "Top 15 teams in the finale",
      "Finale at Microsoft Bengaluru",
    ],
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
    highlights: [
      "2,900+ teams entered, as reported by finalists",
      "Top 18 teams in the finale",
      "Finale at Microsoft Hyderabad",
    ],
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
    highlights: [
      "1,000+ participants",
      "Our first exclusive hackathon with Mastercard",
      "Finale at the Mastercard AI Garage, Gurugram",
      "GenAI problem statements, from financial safety to climate adaptation",
    ],
    description: [
      "Code Cubicle 3.0 is a hackathon presented by Geek Room and Mastercard, all about innovative, technology-driven solutions.",
      "Winners also get the chance to attend an AI symposium hosted by Mastercard, meet leading data scientists and pitch their ideas to them.",
      "The online round ran on 15 September, and the top teams built through the offline finale on 21 September on challenges spanning personalised assistants, customer support, governance, gender equality and structured-data querying with GenAI.",
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
      "14,500+ applications, under 5% accepted",
      "Top 150 teams on site, from IITs, IIITs, NITs, DTU and IGDTUW",
      "~30% of hackers from outside Delhi, ~17% industry professionals",
      "Powered by Groq, Pathway, Reactive Network and AI Hello",
      "An MLH 2025 Season hackathon",
      "Prize pool of 5 Lakhs+",
    ],
    description: [
      "Code Kshetra is a 36-hour hackathon packed with creativity and cutting-edge ideas, hosted by JIMS Sector-5 Rohini together with Geek Room.",
      "Code Kshetra 2.0 is as much about building memories and having fun as it is about building projects. Bring your laptop, your wildest ideas and a spare charger.",
      "Come ready to build. Your ideas will thrive, even if your sleep schedule doesn't.",
    ],
  },
  {
    slug: "codeseva",
    kind: "Hackathon",
    iso: "2025-01-25",
    approx: true,
    city: "Gurugram",
    code: "GGN",
    title: "Code Seva",
    date: "January 2025",
    location: "Microsoft Office, Gurugram",
    image: "/images/home/network.jpg",
    tagline: "Technology for social good",
    highlights: ["100+ teams competing", "Top 15 teams in the finale", "Final presentations at Microsoft Gurugram"],
    description: [
      "Code Seva is Geek Room's social-good hackathon: teams build technology aimed at real community problems rather than the next product pitch.",
      "100+ teams competed, and the top 15 presented their solutions at the Microsoft office in Gurugram.",
    ],
  },
  {
    slug: "hireathon",
    kind: "Hiring",
    iso: "2024-11-23",
    approx: true,
    city: "Gurugram",
    code: "GGN",
    title: "Hire-A-Thon × InvoLead",
    date: "November 2024",
    location: "91springboard, Gurugram",
    image: "/images/events/hire-a-thon.jpg",
    tagline: "Show your skills, skip the interview loop",
    highlights: [
      "A skills-first hiring hackathon",
      "Final-year students and working professionals",
      "Judged by InvoLead's tech panel",
      "Launched Geek Suite, our professional community",
    ],
    description: [
      "Hire-A-Thon was a hiring hackathon run with InvoLead: instead of long interview rounds, candidates proved themselves by tackling real-world problem statements, with a direct shot at a role at InvoLead.",
      "InvoLead's tech panel judged the projects and gave feedback, and participants competed for cash prizes and goodies along with the job opportunities.",
      "The event also marked the start of Geek Suite, a professional community under the Geek Room umbrella for professional-to-professional and professional-to-student connections.",
    ],
  },
  {
    slug: "cc2.0",
    kind: "Hackathon",
    iso: "2024-08-03",
    city: "Gurugram",
    code: "GGN",
    title: "Code Cubicle 2.0",
    date: "3 August 2024",
    location: "Microsoft Office, DLF Cyber City, Gurugram",
    image: "/images/events/code-cubicle-2.jpeg",
    highlights: [
      "2,000+ participants",
      "300 teams in the online judging round",
      "Top 16 teams in the Microsoft finale",
      "Rated 4.5/5 on Devfolio",
    ],
    description: [
      "Code Cubicle 2.0 took Geek Room's flagship hackathon to the Microsoft office in Gurugram.",
      "Teams were screened on their profiles before the online round on 27 July; 300 teams went through intensive online judging and the top 16 pitched at the offline finale on 3 August.",
      "Orkes was the title sponsor, with Techcanvass, 0x.Day, JetBrains, QuillAudits, AlgoZenith, Polygon, ETHIndia, Balsamiq and Coding Ninjas backing the edition.",
    ],
  },
  {
    slug: "cc1.0",
    kind: "Hackathon",
    iso: "2024-05-19",
    city: "Noida",
    code: "NOI",
    title: "Code Cubicle 1.0",
    date: "19 May 2024",
    location: "Eccosphere Coworking, Sector 67, Noida",
    image: "/images/events/code-cubicle-1.jpg",
    tagline: "Unlocking collaboration and innovation, one cubicle at a time",
    highlights: ["3K+ participants", "12+ college teams", "Our first solo hackathon"],
    description: [
      "Code Cubicle 1.0 was Geek Room's first solo hackathon and the start of the series that became our flagship.",
      "After an online round on 15 May, teams met in Noida on 19 May for live project presentations, pitching and judging, with sponsors including Polygon, ETHIndia, Devfolio, QuillAudits, StockGro and GiveMyCertificate.",
    ],
  },
  {
    slug: "ck1.0",
    kind: "Hackathon",
    iso: "2024-02-05",
    city: "Delhi",
    code: "DEL",
    title: "Code Kshetra 1.0",
    date: "5–6 February 2024",
    location: "JIMS Sector-5, Rohini, Delhi",
    image: "/images/events/code-kshetra-1.jpg",
    tagline: "Where geeks battle with code and innovation",
    highlights: ["36 hours, offline", "Started the Geek Room JIMS chapter", "Backed by Polygon, Replit, Rise In and echo3D"],
    description: [
      "The first Code Kshetra was a 36-hour hackathon organised by JIMS Sector-5 Rohini and Geek Room, and one of Geek Room's earliest milestones.",
      "It also set up the Geek Room JIMS chapter, the first of the campus chapters that now span 20+ colleges.",
    ],
  },
];

/** Whether an event belongs to a category, as its main kind or a secondary one. */
export const inKind = (e: EventItem, kind: EventKind) => e.kind === kind || !!e.alsoIn?.includes(kind);

/** All of an event's categories for display, main kind first: "Hackathon · Hiring". */
export const kindLabel = (e: EventItem) => [e.kind, ...(e.alsoIn ?? [])].join(" · ");

/** Events sorted newest first, with undated upcoming events ahead of everything */
export const eventsByDate = [...events].sort((a, b) => Number(!b.iso) - Number(!a.iso) || b.iso.localeCompare(a.iso));

export function formatChip(iso: string, approx = false) {
  if (!iso) return { day: "TBA", month: "", year: "", label: "Dates TBA" };
  const d = new Date(`${iso}T00:00:00`);
  const month = d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
  const year = d.getFullYear();
  // Month-only dates: the month takes the day's slot so no day is invented
  if (approx) return { day: month, month: "", year, label: `${month} ${year}` };
  const day = d.toLocaleDateString("en-IN", { day: "2-digit" });
  return { day, month, year, label: `${day} ${month} ${year}` };
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
