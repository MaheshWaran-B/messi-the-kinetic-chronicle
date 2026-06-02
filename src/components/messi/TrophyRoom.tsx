import { useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const trophies = [
  { t: "FIFA World Cup", y: "2022", c: "oklch(0.78 0.15 85)" },
  { t: "Ballon d'Or", y: "×8", c: "oklch(0.82 0.16 80)" },
  { t: "Copa América", y: "2021 · 24", c: "oklch(0.7 0.16 240)" },
  { t: "Champions League", y: "×4", c: "oklch(0.55 0.18 250)" },
  { t: "La Liga", y: "×10", c: "oklch(0.6 0.2 25)" },
  { t: "Olympic Gold", y: "2008", c: "oklch(0.78 0.15 85)" },
];

export function TrophyRoom() {
  const reduced = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<Record<number, { x: number; y: number }>>({});

  const onMove = (i: number) => (e: React.MouseEvent) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 20;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -20;
    setTilt((s) => ({ ...s, [i]: { x, y } }));
  };
  const onLeave = (i: number) => () => setTilt((s) => ({ ...s, [i]: { x: 0, y: 0 } }));

  return (
    <section className="relative bg-background px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 text-xs uppercase tracking-wider-2 text-sky">The Trophy Room</div>
        <h2 className="text-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.92]">
          A cabinet that <em className="text-gold">never closes.</em>
        </h2>

        <div
          ref={wrapRef}
          className="mt-16 grid gap-6 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-3"
          onMouseLeave={() => setHover(null)}
        >
          {trophies.map((tr, i) => {
            const isHovered = hover === i;
            const isOther = hover !== null && !isHovered;
            const t = tilt[i] ?? { x: 0, y: 0 };
            return (
              <div
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseMove={onMove(i)}
                onMouseLeave={onLeave(i)}
                className="gpu relative aspect-[4/5] rounded-md border border-border bg-card p-8 transition-[transform,filter] duration-500 ease-out [transform-style:preserve-3d]"
                style={{
                  transform: `perspective(1200px) rotateY(${t.x}deg) rotateX(${t.y}deg) translateZ(${isHovered ? 60 : 0}px) scale(${isHovered ? 1.04 : 1})`,
                  filter: isOther ? "blur(4px) brightness(0.6)" : "none",
                  boxShadow: isHovered ? `0 30px 80px -20px ${tr.c}` : "0 10px 30px -20px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-md opacity-30"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${tr.c}, transparent 60%)` }}
                />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="text-[10px] uppercase tracking-wider-2 text-muted-foreground">#{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <div className="text-display text-3xl leading-tight">{tr.t}</div>
                    <div className="text-display mt-2 text-5xl font-bold" style={{ color: tr.c }}>{tr.y}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
