import { renderOg } from "@/lib/og";

export const alt = "Geek Room services";
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Developer Growth Package",
    title: "Grow with the smarter community",
    subtitle: "Ten services, one package: content, community, hackathons and real developer feedback.",
  });
}
