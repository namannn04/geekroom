import type { Metadata } from "next";
import Link from "next/link";
import { Anybody, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";
import PageTransition from "@/components/motion/PageTransition";
import ChinkuDock from "@/components/layout/ChinkuDock";
import "./globals.css";
import { stat } from "@/data/stats";

// Anybody exposes a width axis (50–150%) that the display type and scroll animations lean on
const anybody = Anybody({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-anybody",
});

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.geekroom.co.in"),
  title: {
    default: "Geek Room",
    template: "%s | Geek Room",
  },
  description:
    `Geek Room is the developer growth partner behind a community of ${stat.builders} builders: content, community, hackathons and real developer feedback that put products in front of developers.`,
  openGraph: {
    type: "website",
    siteName: "Geek Room",
    url: "/",
    title: "Geek Room",
    description:
      `Geek Room is the developer growth partner behind a community of ${stat.builders} builders: content, community, hackathons and real developer feedback that put products in front of developers.`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Geek Room",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${anybody.variable} ${schibsted.variable} ${jetbrains.variable}`}>
        <Link href="#main-content" className="skip-link">Skip to content</Link>
        <SmoothScroll>
          <PageTransition>
            <Navbar />
            <main id="main-content" tabIndex={-1}>{children}</main>
            <Footer />
          </PageTransition>
          {/* Outside the page transition so its fixed position isn't trapped by transforms */}
          <ChinkuDock />
        </SmoothScroll>
      </body>
    </html>
  );
}
