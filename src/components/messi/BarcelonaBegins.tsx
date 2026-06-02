import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  { year: "2000", t: "The Napkin", d: "Carles Rexach signs Messi to a paper napkin at a Barcelona restaurant." },
  { year: "2001", t: "Crossing the Atlantic", d: "The Messi family relocates to Spain. La Masia opens its doors." },
  { year: "2003", t: "Debut", d: "First-team friendly debut vs Porto, aged 16." },
  { year: "2004", t: "La Liga", d: "Official La Liga debut vs Espanyol — youngest Barcelona player ever." },
  { year: "2005", t: "First Goal", d: "First senior goal, assisted by Ronaldinho, against Albacete." },
];

export function BarcelonaBegins() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".bb-left", {
        yPercent: -20, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.to(".bb-right", {
        yPercent: 20, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo(".bb-title", { color: "oklch(0.7 0.16 240)" }, {
        color: "oklch(0.42 0.18 15)", ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 60%", end: "bottom 60%", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-background px-6 py-40">
      <div className="mx-auto grid max-w-7xl gap-24 lg:grid-cols-2">
        <div className="bb-left">
          <div className="sticky top-32">
            <div className="mb-6 text-xs uppercase tracking-wider-2 text-muted-foreground">Chapter 02 · La Masia</div>
            <h2 className="bb-title text-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9]">
              Signed on a<br /><em>napkin.</em>
            </h2>
            <p className="mt-8 max-w-md text-balance text-base text-muted-foreground">
              December 14, 2000. A 13-year-old, ill from missed hormone treatments, walks into Barcelona's offices. Carles Rexach has no contract paper. He grabs a napkin and writes the future of football onto it.
            </p>
            <blockquote className="text-display mt-10 border-l-2 border-gold pl-6 text-2xl italic text-foreground">
              "I, Carles Rexach, in my capacity as technical secretary of FCB, commit to sign Lionel Messi…"
            </blockquote>
          </div>
        </div>
        <div className="bb-right space-y-6">
          {milestones.map((m, i) => (
            <div key={i} className="rounded-md border border-border bg-card/60 p-6 backdrop-blur-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-display text-4xl font-bold text-sky">{m.year}</span>
                <span className="text-[10px] uppercase tracking-wider-2 text-muted-foreground">#{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-3 text-display text-xl">{m.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{m.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
