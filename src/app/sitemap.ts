import type { MetadataRoute } from "next";
import { events } from "@/data/events";
import { serviceList } from "@/data/services";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about-us", "/event", "/contact-us", "/services", ...serviceList.map((s) => s.href), "/partners", "/brochure", "/partners/wayzyy", ...events.map((event) => `/event/${event.slug}`)]
    .map((path) => ({ url: `https://www.geekroom.co.in${path}` }));
}
