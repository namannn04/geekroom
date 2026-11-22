import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BadgeCheck, Calendar, IndianRupee, KeyRound, Receipt, Smartphone } from "lucide-react";
import SectionHead from "@/components/ui/SectionHead";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Wayzyy: community partner",
  description: "Wayzyy is a short-term rental marketplace for India with all-inclusive pricing, verified stays and hosts who keep 100% of their nightly rate.",
  path: "/partners/wayzyy",
});

// UTM so Wayzyy can see traffic from this site; every outbound link below reuses it
const WAYZYY = "https://wayzyy.com";
const link = (path = "") => `${WAYZYY}${path}?utm_source=geekroom&utm_medium=partner-page`;

const points = [
  { icon: Receipt, title: "One all-in price", text: "The price you see is the price you pay. The 7% service fee and itemised GST are already inside the nightly rate, so there are no surprises at checkout." },
  { icon: IndianRupee, title: "Hosts keep 100%", text: "No percentage commission. Hosts keep the full nightly rate and pay a simple prepaid pack instead, so more of every booking stays with the person running the home." },
  { icon: BadgeCheck, title: "Verified, not vague", text: "Guests and hosts verify with Aadhaar through DigiLocker, and Wayzyy Verified listings are reviewed by hand before they earn the badge." },
  { icon: KeyRound, title: "Built for groups", text: "Villas and homes sized for friends, families, offsites and community trips, with pools, workation setups and room for the whole crew." },
  { icon: Calendar, title: "Easy for hosts", text: "Import an existing listing in minutes, sync calendars two-way over iCal, and use request-to-book with automatic refunds if a request is declined." },
  { icon: Smartphone, title: "Web, Android and iOS", text: "Search, compare and book from the browser or the apps, starting with Goa." },
];

export default function WayzyyPage() {
  return (
    <>
      <section className="shell pt-32 md:pt-40">
        <Link href="/" className="btn-ghost mb-10 !py-2">
          <ArrowLeft className="size-3.5" /> Back home
        </Link>
        <div className="flex items-center gap-4">
          <Image src="/images/partners/wayzyy.svg" alt="Wayzyy logo" width={72} height={72} priority className="size-16 md:size-[4.5rem]" />
          <p className="label">Community partner</p>
        </div>
        <h1 className="display mt-8 text-[clamp(3rem,9vw,7.5rem)]">
          Stay <em>somewhere</em> worth the trip.
        </h1>
        <p className="mt-8 max-w-[40rem] text-lg leading-relaxed text-muted md:text-xl">
          Wayzyy is a short-term rental marketplace for India. Verified villas and homes, one honest price, and hosts who keep what they earn. It is built by people from the same builder world as Geek Room, and it is live in Goa today.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={link()} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Visit wayzyy.com <ArrowUpRight className="size-4" />
          </a>
          <a href={link("/goa-stays")} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Browse Goa stays <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </section>

      <section className="shell grid gap-12 py-24 md:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <SectionHead
          size="sm"
          index="01"
          title={
            <>
              Why <em>builders</em> like it
            </>
          }
          intro="Travel for a hackathon, an offsite or a weekend with friends works better when the stay is simple, trusted and fairly priced."
        />
        <ul className="grid border-t border-l border-line sm:grid-cols-2">
          {points.map(({ icon: Icon, title, text }) => (
            <li key={title} className="border-r border-b border-line p-6">
              <Icon className="size-6 text-orange" />
              <h3 className="mt-4 font-display text-xl font-bold [font-stretch:90%]">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell pb-24 md:pb-32">
        <div className="rounded-[1.75rem] bg-orange p-8 text-ink md:p-12">
          <p className="display text-[clamp(2rem,5vw,4rem)]">Heading to Goa?</p>
          <p className="mt-4 max-w-[34rem] text-lg leading-relaxed">
            Planning a team trip or a group stay around an event? See what is available, with the full price up front.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={link("/goa-stays")} target="_blank" rel="noopener noreferrer" className="btn bg-ink text-paper hover:bg-ink-3">
              Explore Goa stays <ArrowUpRight className="size-4" />
            </a>
            <a href={link("/host")} target="_blank" rel="noopener noreferrer" className="btn border border-ink/30 hover:bg-ink/10">
              Host with Wayzyy <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
