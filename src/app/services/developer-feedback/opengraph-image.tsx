import { renderOg } from "@/lib/og";
import { getService } from "@/data/services";

export const alt = "Geek Room service: developer feedback";
export const size = { width: 2400, height: 1260 };
export const contentType = "image/png";

const service = getService("developer-feedback");

export default function Image() {
  return renderOg({
    eyebrow: `Service ${service.index} · ${service.eyebrow}`,
    title: service.title,
    subtitle: service.summary,
  });
}
