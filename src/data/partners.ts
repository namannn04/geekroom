/**
 * Partner directory for the /partners page.
 * Companies and organizations from Geek Room's events, Luma listings, partner pages and public
 * acknowledgements. Roles differ by event: some sponsored, co-hosted, provided technology,
 * supplied a venue or supported prizes. Not every one of the 500+ companies we've worked with.
 */

export type PartnerCategory = {
  slug: string;
  title: string;
  /** Short line under the category title */
  blurb: string;
};

export const partnerCategories: PartnerCategory[] = [
  { slug: "infrastructure", title: "Cloud, compute and data", blurb: "The platforms our builders run on." },
  { slug: "ai", title: "AI models, APIs and agents", blurb: "The models and tools behind what gets built." },
  { slug: "devtools", title: "Developer platforms and tools", blurb: "Where code gets written, shipped and judged." },
  { slug: "fintech", title: "Finance, mobility and commerce", blurb: "Industry partners who bring real problems." },
  { slug: "services", title: "Tech services and hiring", blurb: "Teams that hire and grow with our community." },
  { slug: "hardware", title: "Hardware, security and consumer tech", blurb: "Prizes, protection and the gear on every desk." },
  { slug: "community", title: "Universities and communities", blurb: "Campuses and communities we build alongside." },
];

export type DirectoryPartner = {
  name: string;
  category: string;
  /** What they do, and how they worked with us */
  role: string;
  logo?: string;
  /** The logo is an icon with no name in it, so the name is shown beside it */
  mark?: boolean;
  /** The logo is dark (made for light backgrounds), so render it white */
  invert?: boolean;
  /** Event or partner page on this site */
  link?: { href: string; label: string };
};

export const directory: DirectoryPartner[] = [
  // Cloud, compute and data
  { name: "Amazon Web Services", category: "infrastructure", role: "Cloud platform. HackSmart partner.", logo: "/images/partners/aws.svg", link: { href: "/event/hacksmart", label: "HackSmart" } },
  { name: "Google Cloud", category: "infrastructure", role: "Cloud platform.", logo: "/images/partners/google-cloud.png" },
  { name: "Microsoft", category: "infrastructure", role: "Cloud and developer platform, and host of our Code Cubicle finales.", logo: "/images/partners/microsoft.png", link: { href: "/event/cc5.0", label: "Code Cubicle 5.0" } },
  { name: "Pathway", category: "infrastructure", role: "Real-time data processing framework for AI and analytics.", logo: "/images/partners/pathway.png", link: { href: "/event/ck2.0", label: "Code Kshetra 2.0" } },
  { name: "Qdrant", category: "infrastructure", role: "Vector database and AI search infrastructure.", logo: "/images/partners/qdrant.png", link: { href: "/event/hackblr1", label: "HackBLR" } },
  { name: "Groq", category: "infrastructure", role: "AI inference hardware and cloud.", logo: "/images/partners/groq.png", link: { href: "/event/ck2.0", label: "Code Kshetra 2.0" } },
  { name: "Superlinked", category: "infrastructure", role: "Data and retrieval technology for AI applications.", logo: "/images/partners/superlinked.svg", link: { href: "/event/infer-a-thon", label: "Infer-a-thon" } },
  { name: "Reactive Network", category: "infrastructure", role: "Event-driven smart contract infrastructure.", logo: "/images/partners/reactive-network.svg", link: { href: "/event/ck2.0", label: "Code Kshetra 2.0" } },

  // AI models, APIs and agents
  { name: "Bifrost by Maxim AI", category: "ai", role: "Gateway for managing and routing AI model requests.", logo: "/images/partners/bifrost.png", mark: true, link: { href: "/event/global-ai-hackathon", label: "Global AI Hackathon" } },
  { name: "Tavily", category: "ai", role: "Web search and research API for AI agents.", logo: "/images/partners/tavily.svg", invert: true, link: { href: "/event/global-ai-hackathon", label: "Global AI Hackathon" } },
  { name: "Vapi", category: "ai", role: "Developer platform for voice AI agents.", logo: "/images/partners/vapi.png", link: { href: "/event/hackblr1", label: "HackBLR" } },
  { name: "OmniDimension", category: "ai", role: "Voice AI and agent platform.", logo: "/images/partners/omnidimension.png", link: { href: "/event/vibeathon2", label: "Vibe-a-thon 2.0" } },
  { name: "MiniMax", category: "ai", role: "AI models and tools.", logo: "/images/partners/minimax.svg", mark: true, link: { href: "/event/hackblr1", label: "HackBLR" } },
  { name: "ML.ai", category: "ai", role: "AI coding agent, used at INFRA SHIFT.", logo: "/images/partners/mlai.png", mark: true },
  { name: "2nd Brain Labs", category: "ai", role: "AI and developer tools. Partnered on a Vibe-a-thon featuring Synapse CLI.", logo: "/images/partners/2nd-brain-labs.png" },
  { name: "Hey Bubba AI", category: "ai", role: "AI company and Hack Geek Room sponsor.", logo: "/images/partners/hey-bubba.png", mark: true, link: { href: "/event/hackgr", label: "Hack Geek Room" } },
  { name: "AiHello", category: "ai", role: "AI company and Code Kshetra sponsor.", logo: "/images/partners/aihello.png", invert: true, link: { href: "/event/ck2.0", label: "Code Kshetra 2.0" } },
  { name: "NeoApps.AI", category: "ai", role: "AI application development platform, a Code Kshetra supporter.", logo: "/images/partners/neoapps.png" },

  // Developer platforms and tools
  { name: "GitHub", category: "devtools", role: "Code hosting and developer collaboration.", logo: "/images/partners/github.png" },
  { name: "TRAE", category: "devtools", role: "AI coding tool, supporting events including HackBLR.", logo: "/images/partners/trae.svg", mark: true, link: { href: "/event/hackblr1", label: "HackBLR" } },
  { name: "AWS Kiro", category: "devtools", role: "AWS's agentic development environment.", logo: "/images/partners/kiro.svg", mark: true },
  { name: "n8n", category: "devtools", role: "Workflow automation platform.", logo: "/images/partners/n8n.png" },
  { name: "Cloudinary", category: "devtools", role: "Media management and delivery platform.", logo: "/images/partners/cloudinary.svg", mark: true },
  { name: "Devfolio", category: "devtools", role: "Hackathon platform.", logo: "/images/partners/devfolio.png", mark: true, link: { href: "/event/cc2.0", label: "Code Cubicle 2.0" } },
  { name: "HackCulture", category: "devtools", role: "Hackathon platform and partner for Code Cubicle 6.0.", logo: "/images/partners/hackculture.png", invert: true, link: { href: "/event/cc6.0", label: "Code Cubicle 6.0" } },
  { name: "Major League Hacking", category: "devtools", role: "Student hackathon and developer community organization.", logo: "/images/partners/mlh.png", link: { href: "/event/hackblr1", label: "HackBLR" } },

  // Finance, mobility and commerce
  { name: "Mastercard", category: "fintech", role: "Payments network and partner for our first exclusive hackathon.", logo: "/images/partners/mastercard.png", link: { href: "/event/cc3.0", label: "Code Cubicle 3.0" } },
  { name: "Paytm", category: "fintech", role: "Payments and financial services, and event and venue partner.", logo: "/images/partners/paytm.svg", link: { href: "/event/cc6.0", label: "Code Cubicle 6.0" } },
  { name: "Battery Smart", category: "fintech", role: "EV battery-swapping company and HackSmart partner.", logo: "/images/partners/battery-smart.png", link: { href: "/event/hacksmart-2", label: "HackSmart 2.0" } },
  { name: "Smartprix", category: "fintech", role: "Product discovery and price-comparison platform.", logo: "/images/partners/smartprix.png", link: { href: "/event/grandprix", label: "AI Race Month" } },
  { name: "Wayzyy", category: "fintech", role: "Short-term rental marketplace, and event and prize partner.", logo: "/images/partners/wayzyy.svg", link: { href: "/partners/wayzyy", label: "Partner page" } },
  { name: "Bump.fm", category: "fintech", role: "Music and creator platform, and HackBLR supporter.", logo: "/images/partners/bump.svg", link: { href: "/event/hackblr1", label: "HackBLR" } },

  // Tech services and hiring
  { name: "Mphasis", category: "services", role: "IT services and consulting, behind the TrackShift × Mphasis F1 finale.", logo: "/images/partners/mphasis.png", invert: true, link: { href: "/event/grandprix", label: "AI Race Month" } },
  { name: "Infrasity", category: "services", role: "Developer marketing company and INFRA SHIFT host.", logo: "/images/partners/infrasity.png" },
  { name: "InvoLead", category: "services", role: "Hiring partner for our Hire-A-Thon.", logo: "/images/partners/involead.png", invert: true, link: { href: "/event/hireathon", label: "Hire-A-Thon" } },
  { name: "Zintlr", category: "services", role: "Sales intelligence platform.", logo: "/images/partners/zintlr.svg", link: { href: "/event/hackblr1", label: "HackBLR" } },

  // Hardware, security and consumer tech
  { name: "Logitech", category: "hardware", role: "Computer peripherals, and Code Cubicle 6.0 prize partner.", logo: "/images/partners/logitech.png", link: { href: "/event/cc6.0", label: "Code Cubicle 6.0" } },
  { name: "NordVPN", category: "hardware", role: "Cybersecurity and VPN service.", logo: "/images/partners/nordvpn.png" },
  { name: "Pears Technology", category: "hardware", role: "Developer technology partner for the Pears Global Hackathon.", logo: "/images/partners/pears.svg", mark: true, link: { href: "/event/pears", label: "Pears Global Hackathon" } },
  { name: "Bolt", category: "hardware", role: "Featured on the Geek Room partner wall.", logo: "/images/partners/bolt.png" },

  // Universities and communities
  { name: "Plaksha University", category: "community", role: "University, venue and community partner for Hack Summit, HackBLR and AI Race Month.", logo: "/images/partners/plaksha.webp", link: { href: "/event/grandprix", label: "AI Race Month" } },
  { name: "SheBuilds", category: "community", role: "Builder community and AI Race Month collaborator.", logo: "/images/partners/shebuilds.png", link: { href: "/event/grandprix", label: "AI Race Month" } },
  { name: "HiDevs", category: "community", role: "Developer community partner for HackBLR.", logo: "/images/partners/hidevs.png", mark: true, link: { href: "/event/hackblr1", label: "HackBLR" } },
];

/** Partnerships with published numbers, told as short stories */
export const featuredPartnerships = [
  {
    partners: ["Groq", "Pathway"],
    event: "Code Kshetra 2.0",
    href: "/event/ck2.0",
    stat: { value: "14,500+", label: "applications for 150 spots" },
    text: "One of North India's biggest hackathons, powered by Groq and Pathway, with teams from IITs, IIITs, NITs, DTU and IGDTUW.",
  },
  {
    partners: ["Mastercard"],
    event: "Code Cubicle 3.0",
    href: "/event/cc3.0",
    stat: { value: "1st", label: "exclusive hackathon" },
    text: "Our first exclusive hackathon, hosted at Mastercard's Gurugram office.",
  },
  {
    partners: ["Battery Smart"],
    event: "HackSmart",
    href: "/event/hacksmart-2",
    stat: { value: "1,000+", label: "registrations in year one" },
    text: "A hiring hackathon on EV problems, now in its second edition with pre-placement interviews.",
  },
  {
    partners: ["Paytm"],
    event: "Code Cubicle 6.0 and AI Race Month",
    href: "/event/cc6.0",
    stat: { value: "3,700+", label: "builders at CC 6.0" },
    text: "Two finales at Paytm Noida in 2026, including the biggest Code Cubicle yet.",
  },
];
