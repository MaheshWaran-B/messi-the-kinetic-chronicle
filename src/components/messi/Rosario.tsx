import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import img from "@/assets/rosario-childhood.jpg";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useBackground } from "./BackgroundContext";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  { side: "L", label: "Born", v: "Rosario, Argentina · 24 June 1987" },
  { side: "R", label: "First Club", v: "Grandoli — age 5, coached by his father" },
  { side: "L", label: "Newell's Old Boys", v: "Joined 1995. Scored nearly 500 goals as a kid." },
  { side: "R", label: "Diagnosis", v: "Growth hormone deficiency at age 10. Treatment cost: $900/month." },
];

const stats = [
  { v: 500, suffix: "+", label: "Goals as a child" },
  { v: 13, suffix: "", label: "Age signed by Barça" },
  { v: 1, suffix: "", label: "Napkin contract" },
];

export function Rosario() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { setActiveSection } = useBackground();

  useEffect(() => {
    if (!ref.current) return;

    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: (self) => {
        if (self.isActive) setActiveSection("rosario");
      },
    });

    if (reduced) return () => st.kill();

    const ctx = gsap.context(() => {
      gsap.to(".rosario-shutter", {
        clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power3.out",
        scrollTrigger: { trigger: ".rosario-shutter", start: "top 75%", end: "top 30%", scrub: 1 },
      });
      gsap.from(".rosario-card", {
        opacity: 0, x: (i) => (i % 2 === 0 ? -80 : 80), duration: 1, ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: ".rosario-cards", start: "top 80%" },
      });

      gsap.utils.toArray<HTMLElement>(".counter").forEach((el) => {
        const end = Number(el.dataset.v);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end, duration: 2, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 70%" },
          onUpdate: () => { el.textContent = Math.round(obj.v).toString().padStart(2, "0"); },
        });
      });
    }, ref);

    return () => {
      ctx.revert();
      st.kill();
    };
  }, [reduced, setActiveSection]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-transparent px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex items-baseline gap-6">
          <span className="text-xs uppercase tracking-wider-2 text-ink/60">Chapter 01</span>
          <span className="h-px flex-1 bg-ink/20" />
          <span className="text-xs uppercase tracking-wider-2 text-ink/60">Rosario · 1987</span>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-display text-[clamp(2.5rem,7vw,6.5rem)] font-bold leading-[0.95] text-ink">
              A boy<br />from <em className="text-blaugrana">Rosario.</em>
            </h2>
            <div
              className="rosario-shutter gpu mt-10 aspect-[4/5] w-full overflow-hidden rounded-md shadow-2xl"
              style={{ clipPath: "inset(50% 50% 50% 50% round 50%)" }}
            >
              <img src={img} alt="A child playing football on a Rosario street" width={1280} height={1600} loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="rosario-cards flex flex-col gap-5 lg:pt-32">
            {cards.map((c, i) => (
              <div key={i} className={`rosario-card border-l-2 border-ink/80 bg-ink/[0.04] p-6 backdrop-blur-sm ${c.side === "R" ? "lg:ml-12" : ""}`}>
                <div className="mb-1 text-[10px] uppercase tracking-wider-2 text-ink/50">{c.label}</div>
                <div className="text-display text-xl text-ink">{c.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 grid gap-6 border-t border-ink/15 pt-12 md:grid-cols-3">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-display text-6xl font-bold text-ink">
                <span className="counter" data-v={s.v}>00</span>{s.suffix}
              </div>
              <div className="mt-2 text-xs uppercase tracking-wider-2 text-ink/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
