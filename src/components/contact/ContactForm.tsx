"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";

const topics = ["Partnership", "Host a hackathon", "Speaker session", "Hiring challenge", "Just saying hi"];

/**
 * Enquiry form. There is no backend, so submitting composes an email to the
 * community inbox in the visitor's mail client and moves them to /thank-you.
 */
export default function ContactForm() {
  const router = useRouter();
  const [topic, setTopic] = useState(topics[0]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      data.get("org") ? `Organisation: ${data.get("org")}` : null,
      "",
      String(data.get("message") ?? ""),
    ]
      .filter((l) => l !== null)
      .join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`[${topic}] Enquiry from ${data.get("name")}`)}&body=${encodeURIComponent(body)}`;
    router.push("/thank-you");
  };

  const field =
    "w-full rounded-2xl border border-line-strong bg-ink px-4 py-3.5 text-paper outline-none transition-colors placeholder:text-subtle focus:border-orange";

  return (
    <form onSubmit={onSubmit} className="rounded-[1.75rem] bg-ink-2 p-6 md:p-9">
      <fieldset>
        <legend className="label">I&apos;m reaching out about</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {topics.map((t) => (
            <label
              key={t}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange ${
                topic === t ? "border-orange bg-orange text-ink" : "border-line-strong text-muted hover:border-paper hover:text-paper"
              }`}
            >
              <input type="radio" name="topic" value={t} checked={topic === t} onChange={() => setTopic(t)} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label">Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" className={`${field} mt-2`} />
        </label>
        <label className="block">
          <span className="label">Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={`${field} mt-2`} />
        </label>
        <label className="block sm:col-span-2">
          <span className="label">Organisation (optional)</span>
          <input name="org" autoComplete="organization" placeholder="Company, college or community" className={`${field} mt-2`} />
        </label>
        <label className="block sm:col-span-2">
          <span className="label">Message</span>
          <textarea name="message" required rows={5} placeholder="Tell us what you have in mind…" className={`${field} mt-2 resize-none`} />
        </label>
      </div>

      <button type="submit" className="btn-primary mt-8 w-full justify-center !py-4">
        Send message <ArrowUpRight className="size-4" />
      </button>
      <p className="mt-4 text-center text-xs text-subtle">Opens your email app with the message ready to send.</p>
    </form>
  );
}
