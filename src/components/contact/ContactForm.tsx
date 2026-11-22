"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle, Send } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { contactTopics, type ContactTopic } from "@/data/services";

const topics = contactTopics;

/** A prompt per topic, so people tell us what we need on the first message. */
const prompts: Record<ContactTopic, string> = {
  "Developer growth package": "Tell us about your product, who you want to reach, and what a great year with developers looks like for you…",
  "Host a hackathon": "What would builders make with your product? Online or in person, rough dates and audience size…",
  "Content and video": "Podcasts, YouTube sessions or shorts? Tell us about the product and the story you want told…",
  "Technical blogs": "What should we write about, who is the reader, and where should it be published?",
  "Developer marketing": "GitHub, Reddit, SEO and GEO or a launch campaign? Share your repo or product link and your goal…",
  "Developer feedback": "Which part of your product do you want developers to test, and who is your target user?",
  "Hiring challenge": "Which roles are you hiring for, how many, and what should candidates be able to build?",
  "Speaker session": "Who would speak, on what topic, and would you prefer a meetup, hackathon or online session?",
  Support: "What do you need help with? Include the event name and the email you registered with, if it's about an event…",
  "Just saying hi": "Hi Geek Room! …",
};
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "dark";
      appearance: "interaction-only";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export default function ContactForm() {
  const router = useRouter();
  const widgetContainer = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const reduced = useReducedMotion();
  const [topic, setTopic] = useState<ContactTopic>(topics[0]);
  const [sent, setSent] = useState(false);

  // Service pages link here with ?topic=…, so the right chip is already selected
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("topic");
    const match = topics.find((t) => t === requested);
    if (match) setTopic(match);
  }, []);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const renderTurnstile = useCallback(() => {
    if (!turnstileSiteKey || !window.turnstile || !widgetContainer.current || widgetId.current) return;

    widgetId.current = window.turnstile.render(widgetContainer.current, {
      sitekey: turnstileSiteKey,
      action: "contact",
      theme: "dark",
      appearance: "interaction-only",
      callback: setTurnstileToken,
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => setTurnstileToken(""),
    });
  }, []);

  useEffect(() => {
    renderTurnstile();
    return () => {
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [renderTurnstile]);

  const resetTurnstile = () => {
    setTurnstileToken("");
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    if (!turnstileToken) {
      setStatus("error");
      setErrorMessage("Please complete the security check before sending.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");
    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          org: data.get("org"),
          message: data.get("message"),
          website: data.get("website"),
          topic,
          turnstileToken,
        }),
      });
      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(result?.error ?? "We could not send your message. Please try again.");
        resetTurnstile();
        return;
      }

      setSent(true);
      window.setTimeout(() => router.push("/thank-you"), reduced ? 0 : 1100);
    } catch {
      setStatus("error");
      setErrorMessage("We could not reach the server. Check your connection and try again.");
      resetTurnstile();
    }
  };

  const field =
    "w-full rounded-2xl border border-line-strong bg-ink px-4 py-3.5 text-paper outline-none transition-colors placeholder:text-subtle focus:border-orange";

  return (
    <form onSubmit={onSubmit} className="relative overflow-hidden rounded-[1.75rem] bg-ink-2 p-6 md:p-9">
      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 grid place-items-center bg-ink-2/95 text-center"
            role="status"
          >
            <div>
              <motion.span
                className="mx-auto grid size-16 place-items-center rounded-full bg-orange text-ink"
                initial={{ scale: 0.6, x: 0, y: 0, rotate: 0 }}
                animate={reduced ? { scale: 1 } : { scale: [0.6, 1, 1], x: [0, 0, 240], y: [0, 0, -180], rotate: [0, 0, -20] }}
                transition={{ duration: 1.1, times: [0, 0.35, 1], ease: [0.65, 0, 0.35, 1] }}
              >
                <Send className="size-6" />
              </motion.span>
              <p className="display mt-6 text-4xl">Sent</p>
              <p className="mt-2 text-muted">On its way to the Geek Room team.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={renderTurnstile}
      />

      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset disabled={status === "sending"}>
        <legend className="label">I&apos;m reaching out about</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {topics.map((item) => (
            <label
              key={item}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange ${
                topic === item
                  ? "border-orange bg-orange text-ink"
                  : "border-line-strong text-muted hover:border-paper hover:text-paper"
              }`}
            >
              <input
                type="radio"
                name="topic"
                value={item}
                checked={topic === item}
                onChange={() => setTopic(item)}
                className="sr-only"
              />
              {item}
            </label>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">Name</span>
            <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className={`${field} mt-2`} />
          </label>
          <label className="block">
            <span className="label">Email</span>
            <input
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="you@company.com"
              className={`${field} mt-2`}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="label">Organisation (optional)</span>
            <input
              name="org"
              maxLength={150}
              autoComplete="organization"
              placeholder="Company, startup or community"
              className={`${field} mt-2`}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="label">Message</span>
            <textarea
              name="message"
              required
              maxLength={5000}
              rows={5}
              placeholder={prompts[topic]}
              className={`${field} mt-2 resize-none`}
            />
          </label>
        </div>
      </fieldset>

      <div ref={widgetContainer} className="mt-5 min-h-[65px]" />
      {!turnstileSiteKey && (
        <p className="mt-3 text-sm text-orange">Security verification is not configured yet. Please email us directly.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending" || !turnstileSiteKey}
        className="btn-primary mt-5 w-full cursor-pointer justify-center !py-4 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            Sending <LoaderCircle className="size-4 animate-spin" />
          </>
        ) : (
          <>
            Send message <ArrowUpRight className="size-4" />
          </>
        )}
      </button>
      <p aria-live="polite" className={`mt-4 text-center text-sm ${status === "error" ? "text-orange" : "text-subtle"}`}>
        {status === "error" ? errorMessage : "Your message is sent securely to the Geek Room team."}
      </p>
    </form>
  );
}
