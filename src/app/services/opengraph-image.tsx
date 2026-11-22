import { renderOg } from "@/lib/og";

export const alt = "Geek Room services";
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Services",
    title: "Grow with builders",
    subtitle: "Exclusive hackathons, hiring challenges, speaker sessions, GitHub star campaigns and technical writing.",
  });
}
