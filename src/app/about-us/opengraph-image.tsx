import { renderOg } from "@/lib/og";
import { stat } from "@/data/stats";

export const alt = "About Geek Room";
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "About Geek Room",
    title: `From a group chat to ${stat.builders} builders`,
    subtitle: `Founded in 2023. ${stat.events} events, ${stat.partners} partner companies and builders from ${stat.countries} countries.`,
  });
}
