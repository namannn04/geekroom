import PersonCard from "@/components/ui/PersonCard";
import Reveal from "@/components/ui/Reveal";
import { team } from "@/data/site";

// Vertical offsets for each column to create the staggered wall
const offsets = ["md:pt-[70px]", "md:pt-[190px]", "md:pt-0", "md:pt-[70px]"];

export default function Team() {
  const [sanidhya, manas, arnav, akshay, pratham, vibhor] = team;
  const columns = [[sanidhya], [manas], [arnav, akshay], [pratham, vibhor]];

  return (
    <section className="relative isolate overflow-hidden py-16 md:py-24">
      <div aria-hidden className="absolute inset-0 -z-10">
        <span className="blob -left-40 top-[40%] size-[700px] bg-[#ff9500]/80" />
        <span className="blob right-[-10%] top-[15%] size-[700px] bg-[#2400ff]/80" />
        <span className="blob left-[35%] bottom-[-10%] size-[400px] bg-[#e0338f]/60" />
      </div>

      <div className="container-x">
        <Reveal>
          <h2 className="heading-lg max-w-[620px]">Meet the team behind Geek Room</h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {columns.map((col, i) => (
            <div key={i} className={`flex flex-col gap-5 ${offsets[i]}`}>
              {col.map((person, j) => (
                <Reveal key={person.name} delay={0.08 * (i + j)}>
                  <PersonCard person={person} />
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
