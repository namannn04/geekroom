import { renderOg } from "@/lib/og";
import { serviceList } from "@/data/services";

export const alt = "Geek Room service: github stars";
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

const service = serviceList.find((s) => s.slug === "github-stars")!;

export default function Image() {
  return renderOg({
    eyebrow: `Service ${service.index} · ${service.eyebrow}`,
    title: service.title,
    subtitle: service.summary,
  });
}
