import { site } from "@/data/site";

export type Service = {
  slug: string;
  href: string;
  index: string;
  eyebrow: string;
  title: string;
  /** Short line for cards and metadata */
  summary: string;
  points: string[];
};

export const serviceList: Service[] = [
  {
    slug: "github-stars",
    href: "/services/github-stars",
    index: "01",
    eyebrow: "Developer marketing",
    title: "GitHub Star Campaigns",
    summary:
      "Put your open-source repo in front of 150K+ real developers. We plan the launch, fix the README, and run the campaign that turns visitors into stargazers.",
    points: ["Repo and README audit", "Launch-day push across our channels", "Hackathon and workshop tracks", "Weekly star and traffic reports"],
  },
  {
    slug: "technical-writing",
    href: "/services/technical-writing",
    index: "02",
    eyebrow: "Content by engineers",
    title: "Technical Writing",
    summary:
      "Tutorials, launch posts and deep dives written by experienced developers, with every code sample run before it ships and every draft reviewed by an engineer.",
    points: ["Tutorials and how-to guides", "Launch and release posts", "Code-tested samples", "Engineer-led technical review"],
  },
];

export const serviceMail = (service: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(`${service} with Geek Room`)}`;
