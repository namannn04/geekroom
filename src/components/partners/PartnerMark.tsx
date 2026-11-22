import Image from "next/image";

/** A partner's logo, or a typographic wordmark when we don't have the logo file. */
export default function PartnerMark({ name, logo, size = "md" }: { name: string; logo?: string; size?: "sm" | "md" | "lg" }) {
  const h = { sm: "max-h-7", md: "max-h-10", lg: "max-h-12" }[size];
  if (logo) {
    return <Image src={logo} alt={name} width={140} height={60} className={`${h} h-auto w-auto max-w-full object-contain`} />;
  }
  const text = { sm: "text-base", md: "text-xl", lg: "text-2xl" }[size];
  return (
    <span className={`font-display leading-none font-extrabold whitespace-nowrap text-paper uppercase [font-stretch:80%] ${text}`} aria-label={name}>
      {name}
    </span>
  );
}
