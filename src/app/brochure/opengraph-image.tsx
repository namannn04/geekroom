import { renderOg } from "@/lib/og";
import { stat } from "@/data/stats";

export const alt = "Partner with Geek Room";
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Partner brochure",
    title: "Partner with Geek Room",
    subtitle: `Reach ${stat.builders} developers through hackathons, meetups, hiring challenges and brand partnerships.`,
  });
}
