export const site = {
  name: "Geek Room",
  email: "community@geekroom.in",
  address: "E-807, DSIDC, Narela - 110040",
  socials: {
    linkedin: "https://www.linkedin.com/company/geekr00m/",
    instagram: "https://www.instagram.com/geekroom__/",
  },
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Events", href: "/event" },
  { label: "Contact", href: "/contact-us" },
];

export const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "About us", href: "/about-us" },
      { label: "Our Events", href: "/event" },
      { label: "Contact", href: "/contact-us" },
    ],
  },
  {
    title: "Events",
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
    title: "Join 150K+ builders",
    body: "Be part of a network of 150K+ developers, students, founders and professionals across 400+ colleges and 20+ campus chapters who hack, build and grow together.",
    image: "/images/home/developers.jpg",
  },
  {
    title: "Geek Room hackathons are a safe space to learn",
    body: "Our hackathons are built for learning, connecting and growing alongside your peers. Building in public is the way forward.",
    image: "/images/home/safe-space.jpg",
  },
  {
    title: "Network with the best people in industry",
    body: "Every Geek Room event is a chance to meet, talk to and learn from people across the industry. We've hosted finales at Microsoft, Mastercard and Paytm, and worked with 80+ companies including Google, Meta, Groq, Qdrant, Pathway, Vapi and Oracle.",
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
};

export const partners: Partner[] = [
  { name: "GitHub", logo: "/images/partners/github.png", col: 1, row: 2, big: true },
  { name: "Vapi", logo: "/images/partners/vapi.png", col: 6, row: 1 },
  { name: "Groq", logo: "/images/partners/groq.png", col: 3, row: 2 },
  { name: "Mastercard", logo: "/images/partners/mastercard.png", col: 4, row: 2 },
  { name: "Qdrant", logo: "/images/partners/qdrant.png", col: 5, row: 2 },
  { name: "OmniDimension", logo: "/images/partners/omnidimension.png", col: 6, row: 2 },
  { name: "Pathway", logo: "/images/partners/pathway.png", col: 3, row: 3 },
  { name: "Battery Smart", logo: "/images/partners/battery-smart.png", col: 5, row: 3 },
  { name: "NordVPN", logo: "/images/partners/nordvpn.png", col: 7, row: 3 },
  { name: "Major League Hacking", logo: "/images/partners/mlh.png", col: 4, row: 4 },
  { name: "Bolt", logo: "/images/partners/bolt.png", col: 6, row: 4 },
];

export const services = [
  {
    title: "Hiring Challenges",
    body: "Run hiring challenges with us and move past old-school recruitment, and evaluate candidates on the real skills that make them right for your team, like our Hire-A-Thon with InvoLead.",
  },
  {
    title: "Exclusive Hackathons",
    body: "Host an exclusive hackathon with Geek Room and get strong branding and engagement across 10+ media channels with 70,000+ views.",
  },
  {
    title: "Speaker Sessions",
    body: "Run speaker sessions to showcase your brand and tech, and help grow the open-source and build-in-public culture as hackers adopt your tools natively.",
  },
];

export type Person = {
  name: string;
  role: string;
  image: string;
  linkedin: string;
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

export const team: Person[] = [
  {
    name: "Sanidhya Goel",
    role: "Founding Member",
    image: "/images/team/sanidhya-goel.jpg",
    linkedin: "https://www.linkedin.com/in/sanidhyagoel18/",
  },
  {
    name: "Manas Chopra",
    role: "Co-Founder",
    image: "/images/team/manas-chopra.png",
    linkedin: "https://www.linkedin.com/in/themanasai/",
  },
  {
    name: "Arnav Gupta",
    role: "Co-Founder",
    image: "/images/team/arnav-gupta.png",
    linkedin: "https://www.linkedin.com/in/arnav-gupta-437a66256/",
  },
  {
    name: "Akshay Sharma",
    role: "Founding Member",
    image: "/images/team/akshay-sharma.png",
    linkedin: "https://linkedin.com/",
  },
  {
    name: "Pratham Batra",
    role: "Co-Founder",
    image: "/images/team/pratham-batra.png",
    linkedin: "https://www.linkedin.com/in/pratham1908/",
  },
  {
    name: "Vibhor Aggarwal",
    role: "Founding Member",
    image: "/images/team/vibhor-aggarwal.jpeg",
    linkedin: "https://www.linkedin.com/in/vibhor-aggarwal16/",
  },
];

export const faqs = [
  {
    q: "What does Geek Room do?",
    a: "Geek Room is a nationwide builder ecosystem connecting 150K+ developers, students, founders and professionals across 400+ colleges, 20+ campus chapters and 80+ companies through hackathons, technical communities, industry programs and skills-first hiring challenges.",
  },
  {
    q: "How do we join Geek Room?",
    a: "Follow us on LinkedIn and Instagram and register for any of our upcoming events. Every event is an open door into the community.",
  },
  {
    q: "How much do we charge for events?",
    a: "Most Geek Room events are free for participants. Any event-specific details are always listed on the registration page.",
  },
  {
    q: "If I am an organizer / brand, how do I partner with Geek Room?",
    a: "Drop us a mail at community@geekroom.in and we'll get talking about hosting something amazing together.",
  },
];

export const stats = [
  { value: 4.5, suffix: "★", label: "Average event rating", decimals: 1 },
  { value: 400, suffix: "+", label: "Colleges" },
  { value: 80, suffix: "+", label: "Companies" },
];

export const milestones = [
  { date: "2023", short: "Founded at MSIT", text: "Manas, Arnav and Pratham start Geek Room as a WhatsApp group for students at MSIT." },
  { date: "Feb 2024", short: "Code Kshetra 1", text: "Hosted Code Kshetra 1 at JIMS and set up the Geek Room JIMS Chapter." },
  { date: "May 2024", short: "30,000 members", text: "Organised Code Cubicle 1, our first solo hackathon, while crossing 30,000 members across channels." },
  { date: "Aug 2024", short: "CC 2.0 at Microsoft", text: "Hosted Code Cubicle 2.0 at the Microsoft office." },
  { date: "Sept 2024", short: "Mastercard hackathon", text: "Landed our first exclusive hackathon with Mastercard." },
  { date: "Nov 2024", short: "Hire-A-Thon", text: "Ran our first hiring hackathon with InvoLead and launched Geek Suite, our community for professionals." },
  { date: "Feb 2025", short: "Code Kshetra 2.0", text: "Organised Code Kshetra 2.0 with Groq: 14,500+ applications for 150 spots, making it one of North India's biggest hackathons." },
  { date: "Sept 2025", short: "CC 5.0 in Bengaluru", text: "Code Cubicle 5.0 drew 3,741 registrations to a finale at Microsoft Bengaluru, taking the series past 25,000 registrations over five editions." },
  { date: "Apr 2026", short: "HackBLR", text: "HackBLR put 1,500+ people in one room in Bengaluru, from 100+ companies and 50+ colleges." },
  { date: "Aug 2026", short: "AI Race Month", text: "AI Race Month brought 500+ teams from 175+ colleges to a GrandPrix finale at Paytm Noida." },
  { date: "Oct 2026", short: "CC 6.0: 3,700+ builders", text: "Code Cubicle 6.0 closed registrations at 3,700+ builders and 1,631 teams, the biggest edition yet, with the finale at Paytm Noida." },
];

/** Headline achievements that circle the 3D mark in the hero. `short` is used on small screens. */
export const achievements = [
  { value: "150K+", label: "builders in the community", short: "builders" },
  { value: "400+", label: "colleges", short: "colleges" },
  { value: "80+", label: "partner companies", short: "companies" },
  { value: "20+", label: "campus chapters", short: "chapters" },
  { value: "25K+", label: "Code Cubicle registrations", short: "CC regs" },
  { value: "14.5K+", label: "Code Kshetra 2.0 applications", short: "CK apps" },
  { value: "3.7K+", label: "builders at Code Cubicle 6.0", short: "CC 6.0" },
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

/** Headline numbers used in the impact band (all taken from Geek Room's own figures). */
export const impact = [
  { value: 150000, suffix: "+", label: "Builders in the community" },
  { value: 25000, suffix: "+", label: "Code Cubicle registrations across the first five editions" },
  { value: 14500, suffix: "+", label: "Applications for Code Kshetra 2.0" },
  { value: 3700, suffix: "+", label: "Builders registered for Code Cubicle 6.0" },
  { value: 400, suffix: "+", label: "Colleges" },
];

export const pillars = ["Learn", "Connect", "Grow", "Build in public", "Ship", "Hack"];
