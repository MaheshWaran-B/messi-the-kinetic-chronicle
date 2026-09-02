/**
 * Chapter 2: The Paper Napkin Promise
 * Ink flow canvas, live SVG handwriting animation,
 * parchment background, stadium applause trigger.
 */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScrollVelocity } from "@/hooks/use-scroll-velocity";

gsap.registerPlugin(ScrollTrigger);

// Try to register DrawSVG if available (graceful fallback if not)
try { gsap.registerPlugin(DrawSVGPlugin); } catch (_) {}

const MILESTONES = [
  { year: "2000", t: "The Napkin", d: "Carles Rexach signs Messi on a paper napkin at a Barcelona restaurant.", color: "#d4af37" },
  { year: "2001", t: "Crossing the Atlantic", d: "The Messi family relocates to Spain. La Masia opens its doors.", color: "#a0b4d0" },
  { year: "2003", t: "Debut", d: "First-team friendly debut vs Porto, aged 16. The world had no idea.", color: "#c8a87a" },
  { year: "2004", t: "La Liga", d: "Official La Liga debut vs Espanyol — youngest Barcelona player ever.", color: "#a50044" },
  { year: "2005", t: "First Goal", d: "First senior goal, assisted by Ronaldinho, against Albacete. The prophecy begins.", color: "#004d98" },
];

export function Chapter2NapkinPromise() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkPathRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();
  const { intensity } = useScrollVelocity();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Background: dark void → warm parchment
  const bgL = useTransform(scrollYProgress, [0, 0.6], [5, 253]);
  const bgA = useTransform(scrollYProgress, [0, 0.6], [10, 251]);
  const bgR = useTransform(scrollYProgress, [0, 0.6], [20, 247]);

  // Napkin scale
  const napkinScale = useTransform(scrollYProgress, [0, 0.3], [0.85, 1.0]);
  const napkinOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1.0], [0, 1, 1, 0.3]);

  // Ink flow canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;

    const ctx = canvas.getContext("2d")!;
    let raf: number;

    interface InkParticle {
      x: number; y: number;
      vx: number; vy: number;
      life: number;
      maxLife: number;
      size: number;
    }

    let inkParticles: InkParticle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnInk = () => {
      const count = Math.floor(2 + intensity * 6);
      for (let i = 0; i < count; i++) {
        inkParticles.push({
          x: canvas.width * (0.3 + Math.random() * 0.4),
          y: canvas.height * (0.2 + Math.random() * 0.6),
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 1,
          life: 1,
          maxLife: 60 + Math.random() * 120,
          size: 0.5 + Math.random() * 3,
        });
      }
    };

    let frame = 0;
    const loop = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn ink
      if (frame % 4 === 0) spawnInk();

      // Ink particles — simulate liquid ink dripping
      inkParticles = inkParticles.filter(p => p.life > 0.01);
      inkParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // gravity drip
        p.life -= 1 / p.maxLife;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(15, 10, 30, ${p.life * 0.15})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced, intensity]);

  // Handwriting SVG path draw-on animation
  useEffect(() => {
    if (!ref.current || reduced) return;

    const ctx = gsap.context(() => {
      // Animate the signature path draw
      const path = ref.current!.querySelector(".signature-path");
      if (path) {
        const length = (path as SVGPathElement).getTotalLength?.() || 800;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top+=5% center",
            end: "top+=40% center",
            scrub: 1.5,
          },
        });
      }

      // Milestone cards stagger
      gsap.from(".napkin-milestone", {
        opacity: 0,
        x: -60,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".napkin-milestones",
          start: "top 75%",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={ref}
      className="chapter-2 relative min-h-[250vh]"
      style={{ background: "#050a14" }}
    >
      {/* Ink flow canvas overlay */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-20 h-screen w-full"
        style={{ mixBlendMode: "multiply", opacity: 0.6 }}
      />

      {/* Parchment background transition */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: scrollYProgress.get() > 0 ?
            `rgb(${bgR.get()},${bgA.get()},${bgL.get()})` : "#050a14",
        }}
      />

      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-8">

          {/* Chapter header */}
          <div className="mb-10 flex items-center gap-4">
            <span className="h-px w-16 bg-current opacity-20" />
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-40 font-mono">
              Chapter II · La Masia · 2000–2005
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — the napkin */}
            <motion.div
              style={{ scale: napkinScale, opacity: napkinOpacity }}
              className="relative"
            >
              {/* Napkin SVG */}
              <svg
                viewBox="0 0 400 280"
                className="w-full max-w-md"
                style={{ filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.4))" }}
              >
                {/* Napkin paper */}
                <rect
                  x="10" y="10" width="380" height="260" rx="4"
                  fill="#fdfbf7"
                  stroke="#e8dfc8"
                  strokeWidth="1"
                />
                {/* Subtle crumple lines */}
                <line x1="10" y1="80" x2="390" y2="85" stroke="#d4c8a8" strokeWidth="0.5" strokeDasharray="3 8" />
                <line x1="10" y1="160" x2="390" y2="155" stroke="#d4c8a8" strokeWidth="0.5" strokeDasharray="3 8" />
                <line x1="90" y1="10" x2="88" y2="270" stroke="#d4c8a8" strokeWidth="0.3" strokeDasharray="2 12" />

                {/* The handwritten text */}
                <text x="30" y="50" fontSize="11" fontFamily="serif" fill="#2a1f0e" opacity="0.7">
                  14 de Diciembre, 2000
                </text>
                <text x="30" y="72" fontSize="9" fontFamily="serif" fill="#3a2a18" opacity="0.6">
                  Yo, Carles Rexach, en mi calidad de
                </text>
                <text x="30" y="88" fontSize="9" fontFamily="serif" fill="#3a2a18" opacity="0.6">
                  Secretario Técnico del F.C.B...
                </text>

                {/* The live-drawing signature path */}
                <path
                  className="signature-path"
                  d="M 50 200 C 60 185 75 178 95 182 C 115 186 120 198 130 195 C 145 190 148 178 165 180 C 180 182 182 195 195 192 C 215 186 220 172 240 175 C 260 178 265 192 280 190 C 295 188 305 175 320 178"
                  fill="none"
                  stroke="#1a0f05"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ opacity: 0.85 }}
                />
                {/* Rexach name */}
                <text x="100" y="240" fontSize="14" fontFamily="serif" fill="#2a1f0e" fontStyle="italic" opacity="0.75">
                  Carles Rexach
                </text>
              </svg>

              {/* Quote overlay */}
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-6 border-l-2 border-yellow-600/40 pl-5 text-sm italic"
                style={{ color: "rgba(212,175,55,0.75)" }}
              >
                "…me comprometo a fichar al jugador Lionel Messi."
              </motion.blockquote>
            </motion.div>

            {/* Right — chapter title */}
            <div>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true }}
                className="text-display font-bold leading-[0.88] mb-8"
                style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
              >
                Signed on<br />
                <em style={{ color: "#d4af37" }}>a napkin.</em>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-base leading-relaxed text-muted-foreground max-w-md"
              >
                December 14, 2000. A 13-year-old, still recovering from missed hormone
                treatments, walks into Barcelona's offices. Carles Rexach has no contract
                paper. He grabs a napkin and writes the future of football onto it.
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone timeline */}
      <div className="relative z-10 px-8 py-32">
        <div className="napkin-milestones mx-auto max-w-5xl space-y-5">
          <div className="mb-12 text-xs uppercase tracking-[0.25em] opacity-40">The Ascent</div>
          {MILESTONES.map((m, i) => (
            <motion.div
              key={i}
              className="napkin-milestone flex gap-8 items-start border-t border-white/10 pt-5 group"
            >
              <span
                className="text-display text-4xl font-bold shrink-0 w-28"
                style={{ color: m.color, opacity: 0.9 }}
              >
                {m.year}
              </span>
              <div>
                <h3 className="text-display text-xl mb-1 group-hover:text-yellow-300 transition-colors duration-300">
                  {m.t}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
