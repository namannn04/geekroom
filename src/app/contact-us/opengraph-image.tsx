import { renderOg } from "@/lib/og";

export const alt = "Contact Geek Room";
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Contact",
    title: "Let's talk",
    subtitle: "Partnerships, hackathons, hiring challenges, speaker sessions or support. Drop us a line.",
  });
}
