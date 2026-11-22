import Image from "next/image";

type Props = {
  name: string;
  logo?: string;
  /** Icon-only logo: show the name beside it */
  mark?: boolean;
  /** Dark logo made for light backgrounds: render it white */
  invert?: boolean;
  size?: "sm" | "md" | "lg";
};

/** A partner's logo; an icon plus name for icon-only marks; a typographic wordmark when we have no logo file. */
export default function PartnerMark({ name, logo, mark = false, invert = false, size = "md" }: Props) {
  const text = { sm: "text-base", md: "text-xl", lg: "text-2xl" }[size];
  const word = (
    <span className={`font-display leading-none font-extrabold whitespace-nowrap text-paper uppercase [font-stretch:80%] ${text}`}>{name}</span>
  );

  if (!logo) return <span aria-label={name}>{word}</span>;

  if (mark) {
    const icon = { sm: "size-6", md: "size-9", lg: "size-11" }[size];
    return (
      <span className="inline-flex items-center gap-3" aria-label={name}>
        <Image src={logo} alt="" width={44} height={44} className={`${icon} shrink-0 rounded-lg object-contain`} />
        {word}
      </span>
    );
  }

  const h = { sm: "max-h-7", md: "max-h-10", lg: "max-h-12" }[size];
  return (
    <Image
      src={logo}
      alt={name}
      width={160}
      height={60}
      className={`${h} h-auto w-auto max-w-full object-contain ${invert ? "brightness-0 invert" : ""}`}
    />
  );
}
