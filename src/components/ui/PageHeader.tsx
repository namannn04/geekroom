import Reveal from "./Reveal";

export default function PageHeader({ title }: { title: string }) {
  return (
    <section className="relative z-10 pt-[150px] pb-10 text-center md:pt-[180px]">
      <Reveal>
        <h1 className="heading-xl px-5">{title}</h1>
      </Reveal>
    </section>
  );
}
