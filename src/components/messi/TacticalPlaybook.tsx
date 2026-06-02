import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const PATH = "M120,560 C180,520 240,480 280,440 C320,400 340,360 360,300 C380,240 420,200 480,180 C540,160 600,160 660,180 C720,200 760,230 800,260 C840,290 870,310 900,300";

const defenders = [
  { x: 260, y: 460, id: "d1" },
  { x: 380, y: 320, id: "d2" },
  { x: 540, y: 200, id: "d3" },
  { x: 720, y: 240, id: "d4" },
];

export function TacticalPlaybook() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      const path = ref.current!.querySelector<SVGPathElement>("#shotPath")!;
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;

      gsap.to(path, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 60%", end: "bottom 50%", scrub: 1 },
      });

      gsap.to("#ball", {
        motionPath: { path: "#shotPath", align: "#shotPath", autoRotate: false, alignOrigin: [0.5, 0.5] },
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 60%", end: "bottom 50%", scrub: 1 },
      });

      gsap.to("#ballGlow", {
        motionPath: { path: "#shotPath", align: "#shotPath", autoRotate: false, alignOrigin: [0.5, 0.5] },
        scale: 1.6, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 60%", end: "bottom 50%", scrub: 1 },
      });

      // defender reactions
      defenders.forEach((d) => {
        gsap.fromTo(`#${d.id}`,
          { x: 0, y: 0 },
          {
            x: () => (Math.random() - 0.5) * 30,
            y: () => (Math.random() - 0.5) * 30,
            ease: "power2.inOut",
            scrollTrigger: { trigger: ref.current, start: "top 50%", end: "bottom 50%", scrub: 1.2 },
          });
      });

      gsap.from(".pb-text", {
        opacity: 0, y: 40, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
    }, ref);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-background px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="pb-text mb-4 text-xs uppercase tracking-wider-2 text-sky">The Tactical Playbook</div>
        <h2 className="pb-text text-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.92]">
          Goal 644. <em className="text-gold">Getafe, 2007.</em>
        </h2>
        <p className="pb-text mt-4 max-w-xl text-muted-foreground">
          Six defenders, sixty metres, eleven seconds. Scroll to retrace the run that football tried to forget — and never quite could.
        </p>

        <div className="mt-16 overflow-hidden rounded-md border border-border bg-card/40 backdrop-blur-sm">
          <svg viewBox="0 0 1000 640" className="block h-auto w-full">
            <defs>
              <linearGradient id="pitch" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="oklch(0.18 0.06 145)" />
                <stop offset="1" stopColor="oklch(0.12 0.05 145)" />
              </linearGradient>
              <linearGradient id="trail" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="oklch(0.7 0.16 240)" stopOpacity="0.2" />
                <stop offset="0.6" stopColor="oklch(0.78 0.15 85)" />
                <stop offset="1" stopColor="oklch(0.97 0.01 90)" />
              </linearGradient>
              <radialGradient id="glow">
                <stop offset="0" stopColor="oklch(0.78 0.15 85)" stopOpacity="0.8" />
                <stop offset="1" stopColor="oklch(0.78 0.15 85)" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="1000" height="640" fill="url(#pitch)" />
            {/* pitch markings */}
            <g stroke="oklch(0.5 0.05 145)" strokeOpacity="0.5" fill="none" strokeWidth="1.5">
              <rect x="20" y="20" width="960" height="600" rx="4" />
              <line x1="500" y1="20" x2="500" y2="620" />
              <circle cx="500" cy="320" r="70" />
              <rect x="20" y="180" width="120" height="280" />
              <rect x="860" y="180" width="120" height="280" />
              <rect x="20" y="240" width="50" height="160" />
              <rect x="930" y="240" width="50" height="160" />
            </g>

            {/* defenders */}
            {defenders.map((d) => (
              <g key={d.id} id={d.id} transform={`translate(${d.x},${d.y})`}>
                <circle r="10" fill="oklch(0.55 0.18 25)" />
                <circle r="14" fill="none" stroke="oklch(0.55 0.18 25)" strokeOpacity="0.4" />
              </g>
            ))}

            {/* path */}
            <path d={PATH} fill="none" stroke="oklch(0.32 0.04 260)" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.5" />
            <path id="shotPath" d={PATH} fill="none" stroke="url(#trail)" strokeWidth="4" strokeLinecap="round" />

            {/* ball */}
            <circle id="ballGlow" cx="0" cy="0" r="30" fill="url(#glow)" />
            <circle id="ball" cx="0" cy="0" r="9" fill="oklch(0.97 0.01 90)" stroke="oklch(0.08 0.03 260)" strokeWidth="1.5" />

            {/* goal marker */}
            <g transform="translate(900,300)">
              <circle r="18" fill="none" stroke="oklch(0.78 0.15 85)" strokeWidth="2" />
              <circle r="6" fill="oklch(0.78 0.15 85)" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
