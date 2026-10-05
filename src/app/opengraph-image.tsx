import { ImageResponse } from "next/og";
import { EYES, LEFT, MARK_COLORS, RIGHT, SLASH, STROKE_W, toPath, VIEWBOX } from "@/lib/geekmark";

// Link-preview card shown when the site is shared on X, LinkedIn, Discord, WhatsApp, etc.
export const alt = "Geek Room — India's builder community";
// Rendered at 2× the standard 1200×630 so text stays crisp after platforms downscale and recompress it
const S = 2;
export const size = { width: 1200 * S, height: 630 * S };
export const contentType = "image/png";

/** Pull a bold Anybody cut for the wordmark; falls back to the bundled font if offline. */
async function loadDisplayFont() {
  try {
    const css = await (
      await fetch("https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@75,800&display=swap")
    ).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return src ? await (await fetch(src)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const font = await loadDisplayFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56 * S,
          background: "#0d0e0c",
          color: "#eeece6",
          fontFamily: font ? "Anybody" : undefined,
        }}
      >
        <svg
          width={360 * S}
          height={(360 * S * VIEWBOX.h) / VIEWBOX.w}
          viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
          fill="none"
        >
          <g stroke={MARK_COLORS.teal} strokeWidth={STROKE_W} strokeLinecap="round" strokeLinejoin="round">
            <path d={toPath(LEFT)} />
            <path d={toPath(RIGHT)} />
          </g>
          <path d={toPath(SLASH, true)} fill={MARK_COLORS.orange} />
          {EYES.map(({ c, r }) => (
            <circle key={c[0]} cx={c[0]} cy={c[1]} r={r} fill={MARK_COLORS.white} />
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120 * S, fontWeight: 800, lineHeight: 1, letterSpacing: -2 * S }}>GEEK ROOM</div>
          <div style={{ marginTop: 24 * S, fontSize: 40 * S, color: "#ff5a1f" }}>
            150K+ builders · 400+ colleges
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Anybody", data: font, weight: 800, style: "normal" }] : undefined,
    },
  );
}
