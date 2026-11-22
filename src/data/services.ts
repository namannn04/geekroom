import { site } from "@/data/site";
import { stat } from "@/data/stats";

/** Topics a visitor can pick on the contact form. The API accepts exactly these. */
export const contactTopics = [
  "Partnership",
  "Host a hackathon",
  "Hiring challenge",
  "Speaker session",
  "GitHub star campaign",
  "Technical writing",
  "Just saying hi",
] as const;
export type ContactTopic = (typeof contactTopics)[number];

/** Link to the contact form with a topic already selected. */
export const contactHref = (topic: ContactTopic) => `/contact-us?topic=${encodeURIComponent(topic)}`;

export type Service = {
  slug: string;
  href: string;
  index: string;
  eyebrow: string;
  title: string;
  /** Short line for cards and metadata */
  summary: string;
  points: string[];
  topic: ContactTopic;
  /** Mini preview on the services hub */
  teaser: "stars" | "writing" | "hackathon" | "hiring" | "speaker";
  isNew?: boolean;
};

export const serviceList: Service[] = [
  {
    slug: "hackathons",
    href: "/services/hackathons",
    index: "01",
    eyebrow: "Brand and engagement",
    title: "Exclusive Hackathons",
    summary:
      "A hackathon built around your product, run end to end by the team behind Code Cubicle, Code Kshetra and HackBLR, with finales at offices like Microsoft, Mastercard and Paytm.",
    points: ["Problem statements around your tools", `Outreach to ${stat.builders} builders`, "Shortlisting, mentoring and judging", "Finale at your office"],
    topic: "Host a hackathon",
    teaser: "hackathon",
  },
  {
    slug: "hiring-challenges",
    href: "/services/hiring-challenges",
    index: "02",
    eyebrow: "Skills-based hiring",
    title: "Hiring Challenges",
    summary:
      "Hire on what people can build, not what their resume says. Candidates solve your real problems, and you interview the ones who already proved it.",
    points: ["Role-specific challenges", "Scored on a shared rubric", "Shortlist with project links", "Pre-placement interviews"],
    topic: "Hiring challenge",
    teaser: "hiring",
  },
  {
    slug: "speaker-sessions",
    href: "/services/speaker-sessions",
    index: "03",
    eyebrow: "Developer relations",
    title: "Speaker Sessions",
    summary:
      "Put your engineers on stage at our meetups, hackathons and online sessions, and get your tech into the hands of builders who will actually use it.",
    points: ["Stage slots at live events", "Hands-on workshops", "Online sessions and livestreams", "Recap content for your channels"],
    topic: "Speaker session",
    teaser: "speaker",
  },
  {
    slug: "github-stars",
    href: "/services/github-stars",
    index: "04",
    eyebrow: "Developer marketing",
    title: "GitHub Star Campaigns",
    summary:
      `Put your open-source repo in front of ${stat.builders} real developers. We plan the launch, fix the README, and run the campaign that turns visitors into stargazers.`,
    points: ["Repo and README audit", "Launch-day push across our channels", "Hackathon and workshop tracks", "Weekly star and traffic reports"],
    topic: "GitHub star campaign",
    teaser: "stars",
    isNew: true,
  },
  {
    slug: "technical-writing",
    href: "/services/technical-writing",
    index: "05",
    eyebrow: "Content by engineers",
    title: "Technical Writing",
    summary:
      "Tutorials, launch posts and deep dives written by experienced developers, with every code sample run before it ships and every draft reviewed by an engineer.",
    points: ["Tutorials and how-to guides", "Launch and release posts", "Code-tested samples", "Engineer-led technical review"],
    topic: "Technical writing",
    teaser: "writing",
    isNew: true,
  },
];

export const serviceMail = (service: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(`${service} with Geek Room`)}`;
