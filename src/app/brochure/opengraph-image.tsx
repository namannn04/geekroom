import { renderOg } from "@/lib/og";
import { stat } from "@/data/stats";

export const alt = "Partner with Geek Room";
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Partnership proposal · 2027–28",
    title: "Grow with the smarter community",
    subtitle: `The Developer Growth Package: ten services across content, community, hackathons and developer feedback, for ${stat.builders} builders.`,
  });
}
