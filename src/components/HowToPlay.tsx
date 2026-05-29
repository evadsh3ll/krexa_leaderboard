import { StaggerGroup, StaggerItem } from "./Reveal";

const STEPS = [
  {
    n: "01",
    title: "Snap your bill",
    body: (
      <>
        Screenshot your May usage page from{" "}
        <span className="text-text">Claude</span> or{" "}
        <span className="text-text">OpenAI</span>. The bigger, the better.
      </>
    ),
  },
  {
    n: "02",
    title: "Post on X",
    body: (
      <>
        Tweet it with{" "}
        <span className="font-mono text-gold">#KREXABILLCHALLENGE</span> and tag{" "}
        <span className="font-mono text-gold">@krexa_xyz</span> so we can score you.
      </>
    ),
  },
];

export default function HowToPlay() {
  return (
    <section id="how" className="mt-28 scroll-mt-8">
      <div className="text-center">
        <span className="eyebrow">How it works</span>
        <h2 className="section-title mt-5 text-[clamp(26px,4.5vw,40px)]">
          Three steps to the board
        </h2>
      </div>

      <StaggerGroup className="mx-auto mt-9 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {STEPS.map((s) => (
          <StaggerItem key={s.n}>
            <div className="card card-hover h-full p-6">
              <div className="font-pixel text-xs text-gold">{s.n}</div>
              <h3 className="mt-4 text-lg font-semibold text-text">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-text-dim">{s.body}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
