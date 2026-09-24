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
    "Geek Room is one of India's biggest student tech communities with over 50k members.",
  icons: {
    icon: [
      { url: "/images/brand/logo-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/images/brand/logo.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/images/brand/logo.png",
  },
  openGraph: {
    type: "website",
    title: "Geek Room",
    description:
      "Geek Room is one of India's biggest student tech communities with over 50k members.",
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
