import { eventKinds, events, inKind, kindSlug } from "@/data/events";
import { stat, totals } from "@/data/stats";

export const site = {
  name: "Geek Room",
  email: "team@geekroom.co.in",
  socials: {
    linktree: "https://linktr.ee/geekroom",
    linkedin: "https://www.linkedin.com/company/geekr00m/",
    instagram: "https://www.instagram.com/geekroom__/",
  },
};

export const navLinks: { label: string; href: string; external?: boolean; badge?: string }[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Events", href: "/event" },
  { label: "Services", href: "/services" },
  { label: "Partners", href: "/partners" },
  { label: "Spaces", href: "https://spaces.geekroom.co.in/", external: true, badge: "Beta" },
  { label: "Contact", href: "/contact-us" },
];

export type FooterLink = { label: string; href: string; badge?: string; count?: number };

/** Footer link groups. Event categories are listed with how many events each one has run. */
export const footerColumns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About us", href: "/about-us" },
      { label: "Our events", href: "/event" },
      { label: "Partners", href: "/partners" },
      { label: "Brochure", href: "/brochure" },
      { label: "Contact", href: "/contact-us" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Developer Growth Package", href: "/services" },
      { label: "Podcasts & YouTube", href: "/services/podcasts" },
      { label: "Technical Blogs", href: "/services/technical-writing" },
      { label: "GitHub & Reddit", href: "/services/github-stars" },
      { label: "SEO & GEO", href: "/services/seo-geo" },
      { label: "Hackathons", href: "/services/hackathons" },
      { label: "Developer Feedback", href: "/services/developer-feedback" },
    ],
  },
  {
    title: "Event categories",
    links: eventKinds.map((kind) => ({
      label: kind === "Hiring" ? "Hiring challenges" : `${kind}s`,
      href: `/event?category=${kindSlug(kind)}`,
      count: events.filter((e) => inKind(e, kind)).length,
    })),
  },
  {
    title: "Flagship events",
    links: [
      { label: "HackBLR", href: "/event/hackblr1" },
      { label: "Hack Geek Room", href: "/event/hackgr" },
      { label: "Code Cubicle", href: "/event/cc6.0" },
      { label: "AI Race Month", href: "/event/grandprix" },
      { label: "Code Kshetra", href: "/event/ck2.0" },
    ],
  },
];

export const heroImages = [
  { src: "/images/hero/hero-3.jpg", className: "left-[8%] top-[16%] w-[16%] aspect-[227/158]" },
  { src: "/images/hero/hero-1.jpg", className: "left-[38%] top-[12%] w-[18%] aspect-[263/315]" },
  { src: "/images/hero/hero-2.jpg", className: "right-[2%] top-[14.5%] w-[17.5%] aspect-[252/188]" },
  { src: "/images/hero/hero-5.jpg", className: "left-[2%] top-[54.5%] w-[19%] aspect-[274/205]" },
  { src: "/images/hero/hero-4.jpg", className: "right-[2%] top-[51%] w-[19%] aspect-[278/207]" },
  { src: "/images/hero/hero-6.jpg", className: "left-[40%] top-[73%] w-[21%] aspect-[301/209]" },
];

export const features = [
  {
    title: `Join ${stat.builders} builders`,
    body: `Be part of a global network of ${stat.builders} developers, founders, engineers and students who hack, build and grow together: online from anywhere, and in person at partner offices.`,
    image: "/images/home/developers.jpg",
  },
  {
    title: "Geek Room hackathons are a safe space to learn",
    body: "Our hackathons are built for learning, connecting and growing alongside your peers. Building in public is the way forward.",
    image: "/images/home/safe-space.jpg",
  },
  {
    title: "Network with the best people in industry",
    body: `Every Geek Room event is a chance to meet, talk to and learn from people across the industry. We've hosted finales at Microsoft, Mastercard and Paytm, partnered with ${stat.partners} companies including GitHub, Groq, Qdrant, Pathway and Vapi, and our builders come from ${stat.companies} companies.`,
    image: "/images/home/network.jpg",
  },
];

export type Partner = {
  name: string;
  logo: string;
  /** 1-based position on the 8-column partner wall */
  col: number;
  row: number;
  big?: boolean;
  /** What we ran together: shown on the back of the logo tile. Only facts from our own event pages. */
  story?: { event: string; href: string; detail: string };
};

export const partners: Partner[] = [
  { name: "GitHub", logo: "/images/partners/github.png", col: 1, row: 2, big: true },
  { name: "Vapi", logo: "/images/partners/vapi.png", col: 6, row: 1, story: { event: "HackBLR", href: "/event/hackblr1", detail: "Partnered HackBLR, with tracks across voice AI and more" } },
  { name: "Groq", logo: "/images/partners/groq.png", col: 3, row: 2, story: { event: "Code Kshetra 2.0", href: "/event/ck2.0", detail: "Powered 14,500+ applications for 150 spots" } },
  { name: "Mastercard", logo: "/images/partners/mastercard.png", col: 4, row: 2, story: { event: "Code Cubicle 3.0", href: "/event/cc3.0", detail: "Our first exclusive hackathon, at the Gurugram office" } },
  { name: "Qdrant", logo: "/images/partners/qdrant.png", col: 5, row: 2, story: { event: "HackBLR", href: "/event/hackblr1", detail: "Partnered 1,500+ builders in one room in Bengaluru" } },
  { name: "OmniDimension", logo: "/images/partners/omnidimension.png", col: 6, row: 2, story: { event: "Vibe-a-thon 2.0", href: "/event/vibeathon2", detail: "Set live surprise problem statements for the room" } },
  { name: "Pathway", logo: "/images/partners/pathway.png", col: 3, row: 3, story: { event: "Code Kshetra 2.0", href: "/event/ck2.0", detail: "Backed one of North India's biggest hackathons" } },
  { name: "Battery Smart", logo: "/images/partners/battery-smart.png", col: 5, row: 3, story: { event: "HackSmart", href: "/event/hacksmart-2", detail: "Two editions of a hiring hackathon with pre-placement interviews" } },
  { name: "NordVPN", logo: "/images/partners/nordvpn.png", col: 7, row: 3 },
  { name: "Major League Hacking", logo: "/images/partners/mlh.png", col: 4, row: 4, story: { event: "HackBLR", href: "/event/hackblr1", detail: "HackBLR ran as MLH HackDays, and Code Kshetra 2.0 as an MLH season event" } },
  { name: "Bolt", logo: "/images/partners/bolt.png", col: 6, row: 4 },
];

/** Home "Work with us" cards: the three pillars of the Developer Growth Package */
export const services = [
  {
    title: "Content that builds awareness",
    body: "Podcasts, YouTube sessions, technical blogs, shorts and SEO and GEO, made by developers for developers and built to keep ranking.",
  },
  {
    title: "Hackathons that drive real usage",
    body: "Three hackathons a year: a global online hackathon, your track at a flagship like HackBLR or Code Kshetra, and a hiring or exclusive hackathon.",
    proof: [
      { value: stat.buildersLong, label: "Community members" },
      { value: stat.registrations, label: "Hackathon registrations" },
      { value: stat.partners, label: "Partner companies" },
    ],
  },
  {
    title: "Community that builds trust",
    body: "Developer marketing, GitHub and Reddit campaigns and real developer feedback, reaching builders inside the communities they already trust.",
  },
];

export type Person = {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  /** X (formerly Twitter) profile */
  x?: string;
};

export const speakers: Person[] = [
  {
    name: "Samyam Bhutani",
    role: "Partner Engineer @ Meta",
    image: "/images/speakers/samyam-bhutani.png",
    linkedin: "https://linkedin.com/in/sanyambhutani",
  },
  {
    name: "Nishchay Dhankar",
    role: "Founding Engineer @ Nace AI",
    image: "/images/speakers/nishchay-dhankar.jpg",
    linkedin: "https://linkedin.com/in/nischaydnk/",
  },
  {
    name: "Ayon Roy",
    role: "Executive Data Scientist @ NielsenIQ",
    image: "/images/speakers/ayon-roy.jpg",
    linkedin: "https://www.linkedin.com/in/ayon-roy/",
  },
  {
    name: "Manav Gupta",
    role: "aka TensorBoy",
    image: "/images/speakers/manav-gupta.jpeg",
    linkedin: "https://www.linkedin.com/in/--manav-gupta--/",
  },
  {
    name: "Sonu Kumar",
    role: "Founder @ AI Anytime",
    image: "/images/speakers/sonu-kumar.png",
    linkedin: "https://www.linkedin.com/in/sonukr0/",
  },
];

/** The team. Designations are still to be filled in. */
export const team: Person[] = [
  {
    name: "Manas Chopra",
    role: "",
    image: "/images/team/manas.jpg",
    linkedin: "https://www.linkedin.com/in/themanasai/",
    x: "https://x.com/themanasai",
  },
  {
    name: "Akshay Kumar Sharma",
    role: "",
    image: "/images/team/akshay.jpg",
    linkedin: "https://www.linkedin.com/in/akshay-kumar-sharma-devvoyager/",
    x: "https://x.com/cappybaradeploy",
  },
  {
    name: "Naman Dadhich",
    role: "",
    image: "/images/team/naman.jpg",
    linkedin: "https://www.linkedin.com/in/namannn04/",
    x: "https://x.com/namannn04",
  },
  {
    name: "Sanidhya Vats",
    role: "",
    image: "/images/team/sandy.jpg",
    linkedin: "https://www.linkedin.com/in/sanidhya-vats",
    x: "https://x.com/vats_sanidhya",
  },
  {
    name: "Nevin Bali",
    role: "",
    image: "/images/team/bali.jpg",
    linkedin: "https://www.linkedin.com/in/nevinbali1012",
    x: "https://x.com/nevvv_devvv",
  },
  {
    name: "Tushar Teotia",
    role: "",
    image: "/images/team/tushar.jpg",
    linkedin: "https://www.linkedin.com/in/tusharteotia/",
    x: "https://x.com/DegenerateUSER_",
  },
  {
    name: "Arpit Singh",
    role: "",
    image: "/images/team/arpit.jpg",
    linkedin: "https://www.linkedin.com/in/arpit-singh08/",
    x: "https://x.com/Arpit_singh08",
  },
  {
    name: "Ishaan Vats",
    role: "",
    image: "/images/team/ishaan.jpg",
    linkedin: "https://www.linkedin.com/in/ishaanvats74/",
    x: "https://x.com/IshaanVats74",
  },
  {
    name: "Jagriti Rai",
    role: "",
    image: "/images/team/jagriti.jpg",
    linkedin: "https://www.linkedin.com/in/jagriti-rai-379452335/",
    x: "https://x.com/jagritiwth",
  },
  {
    name: "Deepti Rawat",
    role: "",
    image: "/images/team/deepti.jpg",
    linkedin: "https://www.linkedin.com/in/the-deepti/",
  },
];

export const faqs: { q: string; a: string; link?: { href: string; label: string } }[] = [
  {
    q: "What does Geek Room do?",
    a: `Geek Room is a developer growth partner. Our Developer Growth Package puts your product in front of ${stat.buildersLong} developers, founders and engineers through ten services: podcasts, YouTube sessions, technical blogs, shorts, SEO and GEO, GitHub, Reddit and developer marketing, hackathons and developer feedback. We also run hiring challenges and speaker sessions.`,
    link: { href: "/services", label: "See the ten services" },
  },
  {
    q: "How do we join Geek Room?",
    a: "Follow us on LinkedIn and Instagram and register for any of our upcoming events. Every event is an open door into the community.",
    link: { href: site.socials.linktree, label: "Join Geek Room" },
  },
  {
    q: "Can I join from outside India?",
    a: "Yes. Our global hackathons and vibe-a-thons run online and are open to builders anywhere in the world. In-person finales and meetups happen at partner offices.",
  },
  {
    q: "How much do we charge for events?",
    a: "Most Geek Room events are free for participants. Any event-specific details are always listed on the registration page.",
  },
  {
    q: "If I am an organizer / brand, how do I partner with Geek Room?",
    a: "Book a 30-minute call through our contact page or mail team@geekroom.co.in. We'll map your goals to the package and send you a plan within a week.",
    link: { href: "/contact-us?topic=Developer%20growth%20package", label: "Book a call" },
  },
];

export const stats = [
  { value: 4.5, suffix: "★", label: "Average event rating", decimals: 1 },
  { value: totals.events, suffix: "+", label: "Events run" },
  { value: totals.partners, suffix: "+", label: "Partner companies" },
];

export const milestones = [
  { date: "2023", short: "Founded at MSIT", text: "Manas, Arnav and Pratham start Geek Room as a WhatsApp group for students at MSIT." },
  { date: "Feb 2024", short: "Code Kshetra 1", text: "Hosted Code Kshetra 1 at JIMS and set up the Geek Room JIMS Chapter." },
  { date: "May 2024", short: "30,000 members", text: "Organised Code Cubicle 1, our first solo hackathon, while crossing 30,000 members across channels." },
  { date: "Aug 2024", short: "CC 2.0 at Microsoft", text: "Hosted Code Cubicle 2.0 at the Microsoft office." },
  { date: "Sept 2024", short: "Mastercard hackathon", text: "Landed our first exclusive hackathon with Mastercard." },
  { date: "Nov 2024", short: "Hire-A-Thon", text: "Ran our first hiring hackathon with InvoLead and launched Geek Suite, our community for professionals." },
  { date: "Feb 2025", short: "Code Kshetra 2.0", text: "Organised Code Kshetra 2.0 with Groq: 14,500+ applications for 150 spots, making it one of North India's biggest hackathons." },
  { date: "Mar 2025", short: "Going global", text: "Ran our first global hackathon with Pears Technology: online, free to enter and open to builders worldwide, with a $5,000 prize pool." },
  { date: "May 2025", short: "Vibe-a-thon", text: "Launched Vibe-a-thon, an online vibe-coding jam for builders anywhere, followed by a ten-hour second edition with Omnidimension in June." },
  { date: "Sept 2025", short: "CC 5.0 in Bengaluru", text: "Code Cubicle 5.0 drew 3,741 registrations to a finale at Microsoft Bengaluru, taking the series past 25,000 registrations over five editions." },
  { date: "Apr 2026", short: "HackBLR", text: "HackBLR put 1,500+ people in one room in Bengaluru, from 100+ companies and 50+ colleges." },
  { date: "Aug 2026", short: "AI Race Month", text: "AI Race Month brought 500+ teams from 175+ colleges to a GrandPrix finale at Paytm Noida." },
  { date: "Oct 2026", short: "CC 6.0: 3,700+ builders", text: "Code Cubicle 6.0 closed registrations at 3,700+ builders and 1,631 teams, the biggest edition yet, with the finale at Paytm Noida." },
];

/** Headline achievements that circle the 3D mark in the hero. `short` is used on small screens. */
export const achievements = [
  { value: stat.builders, label: "builders in the community", short: "builders" },
  { value: stat.events, label: "events run", short: "events" },
  { value: stat.partners, label: "partner companies", short: "partners" },
  { value: stat.companies, label: "companies our builders work at", short: "companies" },
  { value: stat.registrations, label: "Hackathon registrations", short: "Hackathon regs" },
  { value: "300+", label: "Hackathon Project Submissions", short: "Project Submissions" },
  { value: "500+", label: "In-person builders at Code Kshetra", short: "Code Kshetra" },
  { value: "4.5★", label: "average event rating", short: "rating" },
];

export const reviews = [
  {
    title: "Hacker at Code Cubicle 3.0",
    body: "Great mentoring, great food and awesome management. The Geek Room team's hard work really shows. One of the few genuinely high-quality hackathons out there.",
  },
  {
    title: "Hacker at Code Kshetra 2.0",
    body: "Everything at Code Kshetra was awesome: the food, the competition, the organisers and the mentors.",
  },
  {
    title: "Hacker at HackBLR",
    body: "The perfect mix of learning and networking. I'm walking away with fresh ideas and valuable connections.",
  },
];

/** Participant quotes for the home page marquee, drawn from the hacker reviews. */
export const participantTestimonials: Testimonial[] = reviews.map((r) => ({ role: r.title, quote: r.body }));

/** Home page testimonials: partner and industry voices are highlighted; participant quotes run in the marquee. */
export type Testimonial = { quote: string; role: string; name?: string; image?: string };

export const corporateTestimonials: Testimonial[] = [
  {
    name: "Ankur Arora",
    role: "Vice President, Mastercard AI Garage",
    image: "/images/testimonials/ankur-arora.jpg",
    quote: "The execution was top-notch. The Geek Room team maintains a genuinely high standard of quality across every part of the event.",
  },
  {
    name: "Siddharth Chugh",
    role: "Azure Engineer, Microsoft",
    image: "/images/testimonials/siddharth-chugh.jpg",
    quote: "The innovation is what makes Geek Room different from other organisers. The sense of belonging among participants and the connections they build are unmatched.",
  },
  {
    name: "Abhijit Kar",
    role: "Professor, PhysicsWallah",
    image: "/images/testimonials/abhijit-kar.jpg",
    quote: "They manage hackathons really well. I've been part of several hackathons, but Geek Room's organisation is commendable.",
  },
];

/** Headline numbers used in the impact band (all taken from Geek Room's own figures). */
export const impact = [
  { value: totals.builders, suffix: "+", label: "Builders in the community" },
  { value: totals.registrations, suffix: "+", label: "Hackathon registrations" },
  { value: totals.companies, suffix: "+", label: "Companies our builders work at, from AI labs to global brands" },
  { value: 300, suffix: "+", label: "Hackathon project submissions" },
  { value: totals.events, suffix: "+", label: "Events run" },
];

export const pillars = ["Learn", "Connect", "Grow", "Build in public", "Ship", "Hack"];

/** Community partners: shown on the home page and on events that opt in via `communityPartners` */
export const communityPartners = [
  { name: "W3V", url: "https://web3voyager.com", logo: "/images/partners/w3v.png" },
  { name: "BangPypers", url: "https://bangpypers.github.io", logo: "/images/partners/bangpypers.svg", height: "h-[4.5rem]" },
  { name: "Sangram AI", url: "https://www.linkedin.com/company/sangram-ai/", logo: "/images/partners/sangram-ai.png", height: "h-14" },
  // Internal: opens our own page about Wayzyy
  { name: "Wayzyy", url: "/partners/wayzyy", logo: "/images/partners/wayzyy.svg", wordmark: true },
];
