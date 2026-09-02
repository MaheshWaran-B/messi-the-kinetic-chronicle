import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useBackground } from "./BackgroundContext";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
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
        if (self.isActive) setActiveSection("hero");
      },
    });

    if (reduced) return () => st.kill();

    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray<HTMLElement>(".hero-letter");
      gsap.set(letters, { y: 120, rotate: 45, opacity: 0 });
      gsap.to(letters, {
        y: 0, rotate: 0, opacity: 1, duration: 1.4,
        ease: "expo.out", stagger: 0.06, delay: 0.2,
      });
      gsap.from(".hero-sub > span", {
        y: 30, opacity: 0, duration: 1, ease: "power3.out",
        stagger: 0.12, delay: 0.9,
      });

      gsap.to(".hero-content", {
        yPercent: -50, opacity: 0, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, ref);

    return () => {
      ctx.revert();
      st.kill();
    };
  }, [reduced, setActiveSection]);

  const word = "THE GOAT";
  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-transparent grain">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/30" />

      <div className="hero-content relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-wider-2 text-sky">
          <span className="h-px w-12 bg-sky/60" />
          <span>1987 — Present</span>
          <span className="h-px w-12 bg-sky/60" />
        </div>
        <h1 className="text-display flex flex-wrap justify-center text-[clamp(4rem,18vw,18rem)] font-bold leading-[0.85] text-foreground">
          {word.split("").map((c, i) => (
            <span key={i} className="hero-letter gpu inline-block" style={{ marginRight: c === " " ? "0.3em" : "-0.02em" }}>
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </h1>
        <p className="hero-sub mt-8 max-w-xl text-balance text-sm uppercase tracking-wider-2 text-muted-foreground sm:text-base">
          <span className="block">A scroll through the life,</span>
          <span className="block">the heartbreak, and the immortality</span>
          <span className="block text-gold">of Lionel Andrés Messi.</span>
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-wider-2 text-muted-foreground">
          <span>Scroll</span>
          <div className="relative h-12 w-px overflow-hidden bg-border">
            <div className="absolute inset-x-0 top-0 h-4 animate-[scrollPulse_1.6s_ease-in-out_infinite] bg-gold" />
          </div>
        </div>
      </div>
      <style>{`@keyframes scrollPulse{0%{transform:translateY(-100%)}100%{transform:translateY(300%)}}`}</style>
    </section>
  );
}
