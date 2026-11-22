import { site } from "@/data/site";
import { stat } from "@/data/stats";

/** Topics a visitor can pick on the contact form. The API accepts exactly these. */
export const contactTopics = [
  "Developer growth package",
  "Host a hackathon",
  "Content and video",
  "Technical blogs",
  "Developer marketing",
  "Developer feedback",
  "Hiring challenge",
  "Speaker session",
  "Support",
  "Just saying hi",
] as const;
export type ContactTopic = (typeof contactTopics)[number];

/** Link to the contact form with a topic already selected. */
export const contactHref = (topic: ContactTopic) => `/contact-us?topic=${encodeURIComponent(topic)}`;

/** The three things the package does, in the order the proposal tells it */
export type ServiceGroup = "content" | "community" | "hackathons";

export const serviceGroups: { key: ServiceGroup; title: string; line: string }[] = [
  { key: "content", title: "Content", line: "builds awareness" },
  { key: "community", title: "Community", line: "builds trust" },
  { key: "hackathons", title: "Hackathons and feedback", line: "turn both into real usage" },
];

export type Service = {
  slug: string;
  href: string;
  /** "01"–"10" for package services, "+" for extra formats */
  index: string;
  title: string;
  /** Short category label */
  eyebrow: string;
  /** One line for cards and previews */
  summary: string;
  /** Longer intro for the service page */
  intro: string;
  points: { title: string; text: string }[];
  /** Where the work is published or run, e.g. YouTube, LinkedIn */
  channels?: { label: string; items: string[] };
  topic: ContactTopic;
  group: ServiceGroup;
  /** Icon key, resolved to an icon component in the UI */
  icon: "mic" | "video" | "github" | "doc" | "code" | "search" | "megaphone" | "chat" | "reddit" | "phone" | "briefcase" | "stage";
};

/** The ten services in the Developer Growth Package */
export const serviceList: Service[] = [
  {
    slug: "podcasts",
    href: "/services/podcasts",
    index: "01",
    title: "Podcasts & Discussions",
    eyebrow: "Content",
    summary: "Conversations with your founders and engineers, produced and shared with our audience.",
    intro: "Long-form conversations with your founders and engineers, in the format developers actually sit through to the end.",
    points: [
      { title: "Founder and engineer conversations", text: "Your team tells the story behind the product, in their own words." },
      { title: "Product deep dives", text: "Honest walkthroughs of real use cases, wins and trade-offs." },
      { title: "Repurposed everywhere", text: "Every episode is clipped into shorts, posts and blog material." },
    ],
    channels: { label: "Distributed on", items: ["YouTube", "Spotify", "LinkedIn", "X", "Instagram"] },
    topic: "Content and video",
    group: "content",
    icon: "mic",
  },
  {
    slug: "youtube-sessions",
    href: "/services/youtube-sessions",
    index: "02",
    title: "Sessions on YouTube & More",
    eyebrow: "Content",
    summary: "Live workshops and product walkthroughs on YouTube, LinkedIn, X and more.",
    intro: "Hands-on builds that show developers how to ship with your product, streamed on every platform we run and built to keep ranking for months.",
    points: [
      { title: "Build-along tutorials", text: "A real project built end to end with your tools, step by step." },
      { title: "Live workshops", text: "Streamed sessions with live Q&A from our community." },
      { title: "Evergreen and searchable", text: "Titled, chaptered and optimized so they keep pulling views." },
    ],
    channels: { label: "Streamed on", items: ["YouTube", "LinkedIn Live", "X", "Instagram", "Community calls"] },
    topic: "Content and video",
    group: "content",
    icon: "video",
  },
  {
    slug: "github-stars",
    href: "/services/github-stars",
    index: "03",
    title: "GitHub Marketing",
    eyebrow: "Community",
    summary: "Stars, forks and contributors: sharper READMEs, example repos and community pushes.",
    intro: "Stars, forks and contributors are how developers judge a project in five seconds. We help your repo win that test.",
    points: [
      { title: "Repo polish", text: "READMEs, docs, examples and templates that convert visitors into users." },
      { title: "Community pushes", text: "Hackathons, WhatsApp groups and socials pointing builders at your repo." },
      { title: "Contributors, not just stars", text: "Good-first-issues and build challenges that bring real contributions." },
    ],
    topic: "Developer marketing",
    group: "community",
    icon: "github",
  },
  {
    slug: "technical-writing",
    href: "/services/technical-writing",
    index: "04",
    title: "Technical Blogs",
    eyebrow: "Content",
    summary: "In-depth tutorials and build guides, written by developers for developers.",
    intro: "Code-first articles written by developers, published where developers read, and built to rank for the searches your buyers make.",
    points: [
      { title: "Written by builders", text: "Every piece is researched, coded and tested by engineers, not copywriters." },
      { title: "Top publications", text: "Placed in publications like Towards AI and on Medium." },
      { title: "SEO and GEO ready", text: "Structured to rank on Google and get cited by AI assistants." },
    ],
    channels: { label: "Formats", items: ["Tutorials", "Benchmarks", "Comparisons", "Migration guides", "Case studies"] },
    topic: "Technical blogs",
    group: "content",
    icon: "doc",
  },
  {
    slug: "hackathons",
    href: "/services/hackathons",
    index: "05",
    title: "3 Hackathons a Year",
    eyebrow: "Hackathons",
    summary: "Dedicated tracks or exclusive hackathons with your product at the center.",
    intro: "The fastest way to turn awareness into real usage: thousands of builders shipping projects on your product.",
    points: [
      { title: "Global online hackathon", text: "Thousands of builders worldwide ship projects on your stack." },
      { title: "In-person flagship", text: "Your track at a flagship like HackBLR or Code Kshetra." },
      { title: "Hiring or exclusive hackathon", text: "Find and hire talent on real problems, like HackSmart." },
    ],
    topic: "Host a hackathon",
    group: "hackathons",
    icon: "code",
  },
  {
    slug: "seo-geo",
    href: "/services/seo-geo",
    index: "06",
    title: "SEO & GEO",
    eyebrow: "Content",
    summary: "Content built to rank on Google and get cited by AI assistants like ChatGPT and Perplexity.",
    intro: "Rank on Google and get named by AI. When developers ask Google or an assistant about your space, your brand should be the answer.",
    points: [
      { title: "Search-first content", text: "Keyword research behind every blog, page and video we publish." },
      { title: "Generative engine optimization", text: "Content structured to be cited in Google AI Overviews, ChatGPT and Perplexity." },
      { title: "Automated pipeline", text: "Our open-source pipeline turns research into reviewed drafts as GitHub PRs." },
    ],
    channels: { label: "Our content pipeline", items: ["RSS", "Research", "Keywords", "Draft", "SEO", "Review", "GitHub PR"] },
    topic: "Developer marketing",
    group: "content",
    icon: "search",
  },
  {
    slug: "developer-marketing",
    href: "/services/developer-marketing",
    index: "07",
    title: "Developer Marketing",
    eyebrow: "Community",
    summary: "Launches, campaigns and community activations aimed squarely at builders.",
    intro: "Launches and campaigns that reach developers where they already talk: inside the communities they trust.",
    points: [
      { title: "Launch campaigns", text: "Coordinated pushes across every channel on launch day." },
      { title: "Community activations", text: "Challenges, AMAs and giveaways that get builders hands-on." },
      { title: "Always-on presence", text: "A steady drumbeat of posts, updates and conversations." },
    ],
    channels: { label: "Channels", items: ["WhatsApp", "LinkedIn", "X", "Instagram", "YouTube", "Email"] },
    topic: "Developer marketing",
    group: "community",
    icon: "megaphone",
  },
  {
    slug: "developer-feedback",
    href: "/services/developer-feedback",
    index: "08",
    title: "Developer Feedback",
    eyebrow: "Feedback",
    summary: "Structured feedback from real developers: DX audits, surveys and user calls.",
    intro: "Find out what developers really think of your product before the market tells you, from people who actually build with it.",
    points: [
      { title: "Recruit the right builders", text: `Matched to your audience from our ${stat.builders} community.` },
      { title: "Hands-on testing", text: "Developers complete real tasks with your product and docs." },
      { title: "Surveys and interviews", text: "Structured questions plus recorded user calls." },
      { title: "Clear DX report", text: "Friction points, quotes and prioritized fixes." },
    ],
    topic: "Developer feedback",
    group: "hackathons",
    icon: "chat",
  },
  {
    slug: "reddit-marketing",
    href: "/services/reddit-marketing",
    index: "09",
    title: "Reddit Marketing",
    eyebrow: "Community",
    summary: "An authentic presence in the subreddits where developers make their picks.",
    intro: "Reddit is where developers ask for honest opinions. We help your product show up there the right way: useful, transparent and native.",
    points: [
      { title: "Find the right subreddits", text: "Map where your users discuss tools, problems and alternatives." },
      { title: "Value-first posts", text: "Tutorials, benchmarks and stories the community upvotes." },
      { title: "Launch threads and AMAs", text: "Your team answering developers directly." },
      { title: "Active engagement", text: "Thoughtful replies that keep threads alive." },
    ],
    topic: "Developer marketing",
    group: "community",
    icon: "reddit",
  },
  {
    slug: "shorts-reels",
    href: "/services/shorts-reels",
    index: "10",
    title: "Shorts & Reels",
    eyebrow: "Content",
    summary: "Short-form video that explains your product in 60 seconds or less.",
    intro: "Short-form video that explains your product in 60 seconds or less, made for the feeds developers scroll every day.",
    points: [
      { title: "Concept to final cut", text: "Scripting, recording and editing handled end to end." },
      { title: "Repurposed long-form", text: "Podcasts, sessions and hackathons cut into scroll-stopping clips." },
      { title: "Native to each platform", text: "Formats, hooks and captions tuned per feed." },
    ],
    channels: { label: "Published on", items: ["YouTube Shorts", "Instagram Reels", "LinkedIn", "X"] },
    topic: "Content and video",
    group: "content",
    icon: "phone",
  },
];

/** Formats we also run, outside the package */
export const moreFormats: Service[] = [
  {
    slug: "hiring-challenges",
    href: "/services/hiring-challenges",
    index: "+",
    title: "Hiring Challenges",
    eyebrow: "Skills-based hiring",
    summary: "Hire on what people can build. Candidates solve your real problems, and you interview the ones who proved it.",
    intro: "Resumes all say the same thing. Candidates solve your real problems, we score the work, and you interview people who've already shown you what they can do.",
    points: [],
    topic: "Hiring challenge",
    group: "hackathons",
    icon: "briefcase",
  },
  {
    slug: "speaker-sessions",
    href: "/services/speaker-sessions",
    index: "+",
    title: "Speaker Sessions",
    eyebrow: "Developer relations",
    summary: "Put your engineers on stage at our meetups, hackathons and online sessions.",
    intro: "Builders adopt the tools they've seen someone like them use. Speaker sessions put your team in front of our community.",
    points: [],
    topic: "Speaker session",
    group: "community",
    icon: "stage",
  },
];

export const allServices = [...serviceList, ...moreFormats];
export const getService = (slug: string) => allServices.find((s) => s.slug === slug)!;

export const serviceMail = (service: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(`${service} with Geek Room`)}`;
