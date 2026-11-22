import { renderOg } from "@/lib/og";

export const alt = "Geek Room events";
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Events",
    title: "Hackathons, vibe-a-thons and meetups",
    subtitle: "Online and in person, with finales at Microsoft, Mastercard and Paytm. Most events are free to join.",
  });
}
