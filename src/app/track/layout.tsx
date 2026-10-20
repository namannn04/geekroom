import type { Metadata } from "next";

// Every tracker page reads the session and live data, so nothing here is prerendered
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Geek Room Track", template: "%s · Geek Room Track" },
  description: "Where the Geek Room team plans, hands out and ships work, and where every contribution counts.",
  robots: { index: false, follow: false },
};

export default function TrackRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
