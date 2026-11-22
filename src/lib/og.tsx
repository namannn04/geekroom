import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ImageResponse } from "next/og";
import { EYES, LEFT, MARK_COLORS, RIGHT, SLASH, STROKE_W, toPath, VIEWBOX } from "@/lib/geekmark";
import { stat } from "@/data/stats";

/**
 * Shared renderer for per-page link previews (Open Graph and X cards).
 * Rendered at 2× 1200×630 so text stays crisp after platforms downscale and recompress it.
 */
const S = 2;
export const ogSize = { width: 1200 * S, height: 630 * S };
export const ogContentType = "image/png";

const INK = "#0d0e0c";
const PAPER = "#eeece6";
const MUTED = "rgba(238,236,230,0.7)";
const ORANGE = "#ff5a1f";

type Font = { name: string; data: ArrayBuffer; weight: 400 | 500 | 800; style: "normal" };

/** Fetch one static cut from Google Fonts as TTF. Returns null offline so the card still renders. */
async function googleFont(family: string, axes: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family}:${axes}&display=swap`)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return src ? await (await fetch(src)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

let fontsPromise: Promise<Font[]> | null = null;
function loadFonts() {
  fontsPromise ??= Promise.all([
    googleFont("Anybody", "wdth,wght@75,800"),
    googleFont("Schibsted+Grotesk", "wght@400"),
    googleFont("JetBrains+Mono", "wght@500"),
  ]).then(([display, sans, mono]) => {
    const fonts: Font[] = [];
    if (display) fonts.push({ name: "Anybody", data: display, weight: 800, style: "normal" });
    if (sans) fonts.push({ name: "Schibsted", data: sans, weight: 400, style: "normal" });
    if (mono) fonts.push({ name: "JetBrains", data: mono, weight: 500, style: "normal" });
    return fonts;
  });
  return fontsPromise;
}

/** Read an image from /public and return it as a PNG data URL (the renderer can't decode WebP). */
export async function publicImage(src: string, width = 900): Promise<string | null> {
  try {
    const file = await readFile(path.join(process.cwd(), "public", src));
    // Vector logos are rasterized at high density so they stay sharp when scaled up
    const input = src.endsWith(".svg") ? sharp(file, { density: 1200 }) : sharp(file);
    const png = await input.resize({ width, withoutEnlargement: !src.endsWith(".svg") }).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Shorten to max characters, cutting at a word boundary */
const clip = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:·-]+$/, "")}…`;
};

function Mark({ width }: { width: number }) {
  return (
    <svg width={width} height={(width * VIEWBOX.h) / VIEWBOX.w} viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`} fill="none">
      <g stroke={MARK_COLORS.teal} strokeWidth={STROKE_W} strokeLinecap="round" strokeLinejoin="round">
        <path d={toPath(LEFT)} />
        <path d={toPath(RIGHT)} />
      </g>
      <path d={toPath(SLASH, true)} fill={MARK_COLORS.orange} />
      {EYES.map(({ c, r }) => (
        <circle key={c[0]} cx={c[0]} cy={c[1]} r={r} fill={MARK_COLORS.white} />
      ))}
    </svg>
  );
}

export type OgCard = {
  /** Small orange label above the title, e.g. "Service 04 · Developer marketing" */
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Pulsing "live" dot before the eyebrow */
  live?: boolean;
  /** Image from /public shown on the right, e.g. an event cover */
  image?: string;
  /** Logos from /public shown in a row under the subtitle */
  logos?: string[];
};

/** Render a page's preview card. */
export async function renderOg({ eyebrow, title, subtitle, live, image, logos }: OgCard) {
  const [fonts, cover, logoImgs] = await Promise.all([
    loadFonts(),
    image ? publicImage(image) : Promise.resolve(null),
    Promise.all((logos ?? []).map((l) => publicImage(l, 320))),
  ]);
  const has = (name: string) => fonts.some((f) => f.name === name);
  const display = has("Anybody") ? "Anybody" : undefined;
  const sans = has("Schibsted") ? "Schibsted" : undefined;
  const mono = has("JetBrains") ? "JetBrains" : undefined;

  const titleText = clip(title, cover ? 60 : 72);
  // Step the title down as it gets longer so title, subtitle and logos never crowd the footer
  const len = titleText.length;
  const titleSize = (cover ? (len > 34 ? 66 : len > 20 ? 78 : 88) : len > 40 ? 76 : len > 24 ? 88 : 108) * S;
  const subMax = cover ? 100 : logos?.length ? 100 : 120;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: INK,
          backgroundImage: `radial-gradient(circle at 85% 0%, rgba(255,90,31,0.22), rgba(13,14,12,0) 55%)`,
          color: PAPER,
          padding: `${56 * S}px ${72 * S}px`,
          gap: 56 * S,
        }}
      >
        {/* Copy column */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 * S }}>
            <Mark width={76 * S} />
            <div style={{ display: "flex", fontFamily: display, fontSize: 36 * S, fontWeight: 800, letterSpacing: -0.5 * S }}>GEEK ROOM</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 * S, fontFamily: mono, fontSize: 24 * S, color: ORANGE, letterSpacing: 2 * S }}>
              {live && <div style={{ display: "flex", width: 16 * S, height: 16 * S, borderRadius: 999, background: ORANGE }} />}
              {eyebrow.toUpperCase()}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 20 * S,
                fontFamily: display,
                fontSize: titleSize,
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: -1 * S,
                textTransform: "uppercase",
              }}
            >
              {titleText}
            </div>
            {subtitle && (
              <div style={{ display: "flex", marginTop: 26 * S, fontFamily: sans, fontSize: 30 * S, lineHeight: 1.35, color: MUTED, maxWidth: (cover ? 640 : 960) * S }}>
                {clip(subtitle, subMax)}
              </div>
            )}
            {logoImgs.some(Boolean) && (
              <div style={{ display: "flex", alignItems: "center", gap: 44 * S, marginTop: 32 * S }}>
                {logoImgs.map((src, i) =>
                  // eslint-disable-next-line @next/next/no-img-element
                  src ? <img key={i} src={src} height={38 * S} style={{ height: 38 * S, objectFit: "contain" }} alt="" /> : null,
                )}
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 22 * S, color: MUTED }}>
            <div style={{ display: "flex" }}>geekroom.co.in</div>
            <div style={{ display: "flex" }}>{cover ? `${stat.builders} builders` : `${stat.builders} builders · ${stat.events} events · ${stat.companies} companies`}</div>
          </div>
        </div>

        {/* Optional image column */}
        {cover && (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              width={420 * S}
              height={420 * S}
              alt=""
              style={{ width: 420 * S, height: 420 * S, objectFit: "cover", borderRadius: 32 * S, border: `${2 * S}px solid rgba(238,236,230,0.15)` }}
            />
          </div>
        )}
      </div>
    ),
    { ...ogSize, fonts: fonts.length ? fonts : undefined },
  );
}
