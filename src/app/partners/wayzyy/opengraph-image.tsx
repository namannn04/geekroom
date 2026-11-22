import { renderOg } from "@/lib/og";

export const alt = "Wayzyy, a Geek Room community partner";
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Community partner",
    title: "Wayzyy",
    subtitle: "Verified stays across India, one all-in price, and hosts who keep 100% of their rate.",
    image: "/images/partners/wayzyy.svg",
  });
}
