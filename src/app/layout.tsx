import type { Metadata } from "next";
import { Anybody, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
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
  metadataBase: new URL("https://www.geekroom.co.in"),
  title: {
    default: "Geek Room",
    template: "%s | Geek Room",
  },
  description:
    "Geek Room is a global builder community of 150K+ developers, founders and companies, running hackathons, vibe-a-thons, meetups and hiring challenges online and in person.",
  openGraph: {
    type: "website",
    title: "Geek Room",
    description:
      "Geek Room is a global builder community of 150K+ developers, founders and companies, running hackathons, vibe-a-thons, meetups and hiring challenges online and in person.",
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
        {children}
      </body>
    </html>
  );
}
