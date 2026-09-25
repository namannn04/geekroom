import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOPICS = new Set(["Partnership", "Host a hackathon", "Speaker session", "Hiring challenge", "Just saying hi"]);
const MAX_BODY_BYTES = 16_000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

type RateEntry = { count: number; resetAt: number };
const rateLimits = new Map<string, RateEntry>();

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  org?: unknown;
  message?: unknown;
  topic?: unknown;
  website?: unknown;
  turnstileToken?: unknown;
};

type TurnstileResult = {
  success: boolean;
  action?: string;
  hostname?: string;
};

const json = (body: object, status = 200, headers?: Record<string, string>) =>
  NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function isAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";

  const configuredOrigins = process.env.CONTACT_ALLOWED_ORIGINS?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  try {
    const normalizedOrigin = new URL(origin).origin;
    if (configuredOrigins?.length) return configuredOrigins.includes(normalizedOrigin);

    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    return new URL(origin).host === (forwardedHost ?? request.nextUrl.host);
  } catch {
    return false;
  }
}

function takeRateLimit(ip: string) {
  const now = Date.now();

  if (rateLimits.size > 1_000) {
    for (const [key, entry] of rateLimits) {
      if (entry.resetAt <= now) rateLimits.delete(key);
    }
  }

  const existing = rateLimits.get(ip);
  if (!existing || existing.resetAt <= now) {
    rateLimits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= RATE_LIMIT) {
    return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  if (!cleaned || cleaned.length > maxLength) return null;
  return cleaned;
}

function isValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function verifyTurnstile(token: string, ip: string, expectedHostname: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return false;

    const result = (await response.json()) as TurnstileResult;
    return result.success && result.action === "contact" && result.hostname === expectedHostname;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) return json({ error: "Request rejected." }, 403);

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) return json({ error: "Request is too large." }, 413);

  let payload: ContactPayload;
  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) return json({ error: "Request is too large." }, 413);
    const parsed = JSON.parse(rawBody) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return json({ error: "Invalid request." }, 400);
    payload = parsed as ContactPayload;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Silently accept honeypot submissions so automated senders get no useful signal.
  if (typeof payload.website === "string" && payload.website.trim()) return json({ ok: true });

  const name = cleanString(payload.name, 100);
  const email = cleanString(payload.email, 254);
  const org = typeof payload.org === "string" ? payload.org.trim() : "";
  const message = cleanString(payload.message, 5_000);
  const topic = cleanString(payload.topic, 50);
  const turnstileToken = cleanString(payload.turnstileToken, 2_048);

  if (!name || !email || !isValidEmail(email) || org.length > 150 || !message || !topic || !TOPICS.has(topic)) {
    return json({ error: "Please check the form fields and try again." }, 400);
  }
  if (!turnstileToken) return json({ error: "Please complete the security check." }, 400);

  const ip = getClientIp(request);
  const expectedHostname = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim().split(":")[0] ?? request.nextUrl.hostname;
  if (!(await verifyTurnstile(turnstileToken, ip, expectedHostname))) {
    return json({ error: "Security verification failed. Please try again." }, 400);
  }

  // Count only verified visitors so bots cannot exhaust another visitor's IP allowance.
  const rate = takeRateLimit(ip);
  if (!rate.allowed) {
    return json(
      { error: "Too many messages. Please wait a few minutes and try again." },
      429,
      { "Retry-After": String(rate.retryAfter) },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("Contact email environment variables are incomplete.");
    return json({ error: "Messaging is temporarily unavailable. Please email us directly." }, 503);
  }

  const text = [
    `Topic: ${topic}`,
    `Name: ${name}`,
    `Email: ${email}`,
    org ? `Organisation: ${org}` : null,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[${topic}] Enquiry from ${name.replace(/[\r\n]/g, " ")}`,
      text,
      tags: [{ name: "source", value: "contact-form" }],
    });

    if (error) {
      console.error("Resend rejected a contact email:", error.name);
      return json({ error: "We could not send your message. Please try again." }, 502);
    }

    return json({ ok: true });
  } catch (error) {
    console.error("Contact email delivery failed:", error instanceof Error ? error.name : "UnknownError");
    return json({ error: "We could not send your message. Please try again." }, 502);
  }
}
