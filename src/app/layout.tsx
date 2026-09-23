import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
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
      <body className={`${grotesk.variable} ${instrument.variable} ${jetbrains.variable}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
