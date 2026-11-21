import type { MetadataRoute } from "next";
import { events } from "@/data/events";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about-us", "/event", "/contact-us", "/services", "/services/github-stars", "/services/technical-writing", "/brochure", "/partners/wayzyy", ...events.map((event) => `/event/${event.slug}`)]
    .map((path) => ({ url: `https://www.geekroom.co.in${path}` }));
}
