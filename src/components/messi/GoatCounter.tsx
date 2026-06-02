import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

const counters = [
  { v: 872, l: "Career goals" },
  { v: 384, l: "Career assists" },
  { v: 45, l: "Trophies" },
  { v: 8, l: "Ballons d'Or" },
];

export function GoatCounter() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".goat-num").forEach((el) => {
        const end = Number(el.dataset.v);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end, ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "top 30%", scrub: 1 },
          onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString(); },
        });
      });
      ScrollTrigger.create({
        trigger: ref.current, start: "top 30%",
        onEnter: () => {
          gsap.fromTo("body", { y: 0 }, { y: -8, duration: 0.08, yoyo: true, repeat: 5, ease: "power1.inOut" });
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} className="relative border-y border-border bg-background px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-baseline gap-6">
          <span className="text-xs uppercase tracking-wider-2 text-gold">The GOAT Dashboard</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {counters.map((c, i) => (
            <div key={i} className="border-l border-gold/40 pl-5">
              <div className="text-display text-[clamp(3rem,7vw,6rem)] font-bold leading-none">
                <span className="goat-num bg-gradient-to-b from-foreground to-gold bg-clip-text text-transparent" data-v={c.v}>0</span>
                <span className="text-gold">+</span>
              </div>
              <div className="mt-3 text-xs uppercase tracking-wider-2 text-muted-foreground">{c.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
