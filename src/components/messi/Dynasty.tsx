import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useBackground } from "./BackgroundContext";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { n: "672", l: "Barça Goals" },
  { n: "10", l: "La Liga Titles" },
  { n: "04", l: "Champions League" },
  { n: "07", l: "Ballons d'Or (at Barça)" },
];

export function Dynasty() {
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
        if (self.isActive) setActiveSection("dynasty");
      },
    });

    if (reduced) return () => st.kill();

    const ctx = gsap.context(() => {
      gsap.from(".dyn-stat", {
        y: 100, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.18,
        scrollTrigger: { trigger: ".dyn-stats", start: "top 75%" },
      });
      gsap.to(".dyn-halo", {
        opacity: 1, scale: 1.4, duration: 1.4, ease: "power2.out", stagger: 0.18, delay: 0.3,
        scrollTrigger: { trigger: ".dyn-stats", start: "top 75%" },
      });
    }, ref);

    return () => {
      ctx.revert();
      st.kill();
    };
  }, [reduced, setActiveSection]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-transparent">
      <div className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 text-xs uppercase tracking-wider-2 text-gold">Chapter 02 · b · The Peak</div>
          <h2 className="text-display text-[clamp(4rem,16vw,16rem)] font-bold leading-[0.82] tracking-tighter">
            <span className="block text-foreground">Camp</span>
            <span className="block bg-gradient-to-r from-gold via-foreground to-sky bg-clip-text italic text-transparent">Nou</span>
          </h2>
          <p className="mt-8 max-w-xl text-muted-foreground">
            Seventeen seasons. Two decades of impossibility made routine. Of free kicks bending physics, of dribbles past entire defenses, of a quiet boy becoming the most decorated player in club history.
          </p>

          <div className="dyn-stats mt-24 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="dyn-stat relative">
                <div className="dyn-halo absolute -inset-8 -z-10 rounded-full bg-gold/20 opacity-0 blur-3xl" />
                <div className="text-display text-[clamp(4rem,10vw,8rem)] font-bold leading-none text-foreground">{s.n}</div>
                <div className="mt-3 text-xs uppercase tracking-wider-2 text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
