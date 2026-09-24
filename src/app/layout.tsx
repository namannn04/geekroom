import type { Metadata } from "next";
import { Anybody, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/motion/SmoothScroll";
import PageTransition from "@/components/motion/PageTransition";
import ChinkuDock from "@/components/layout/ChinkuDock";
import "./globals.css";

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
  metadataBase: new URL("https://geekroom.co.in"),
  title: {
    default: "Geek Room",
    template: "%s | Geek Room",
  },
  description:
    "Geek Room is a nationwide builder community of 150K+ developers across 400+ colleges, running hackathons, meetups and hiring challenges.",
  openGraph: {
    type: "website",
    title: "Geek Room",
    description:
      "Geek Room is a nationwide builder community of 150K+ developers across 400+ colleges, running hackathons, meetups and hiring challenges.",
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
        <SmoothScroll>
          <PageTransition>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </PageTransition>
          {/* Outside the page transition so its fixed position isn't trapped by transforms */}
          <ChinkuDock />
        </SmoothScroll>
      </body>
    </html>
  );
}
