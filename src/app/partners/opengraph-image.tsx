import { renderOg } from "@/lib/og";
import { stat } from "@/data/stats";

export const alt = "Geek Room partners";
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Partners",
    title: "The companies who back the build",
    subtitle: `${stat.partners} partner companies across AI, cloud, fintech, hiring and communities, with builders from ${stat.companies} companies.`,
    logos: [
      "/images/partners/groq.png",
      "/images/partners/qdrant.png",
      "/images/partners/mastercard.png",
      "/images/partners/pathway.png",
      "/images/partners/battery-smart.png",
    ],
  });
}
