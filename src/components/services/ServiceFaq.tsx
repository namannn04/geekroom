import SectionHead from "@/components/ui/SectionHead";

/** Question list used at the bottom of service pages. Native details/summary, so it works without JS. */
export default function ServiceFaq({ index, faqs }: { index: string; faqs: { q: string; a: string }[] }) {
  return (
    <section className="shell grid gap-12 pb-24 md:pb-32 lg:grid-cols-[0.8fr_1.2fr]">
      <SectionHead
        size="sm"
        index={index}
        title={
          <>
            Good <em>questions</em>
          </>
        }
      />
      <div className="border-t border-line">
        {faqs.map((f) => (
          <details key={f.q} className="group border-b border-line py-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-bold [font-stretch:90%]">
              {f.q}
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line-strong text-lg transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-[40rem] leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
