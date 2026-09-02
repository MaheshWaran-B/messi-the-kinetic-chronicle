/**
 * Chapter 1: The Tiny Giant
 * 8mm film grain atmosphere, shattering "10 YEARS OLD" text,
 * scroll-velocity-driven grain intensity, emotional childhood narrative.
 */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useScrollVelocity } from "@/hooks/use-scroll-velocity";

gsap.registerPlugin(ScrollTrigger);

interface Shard {
  x: number; y: number;
  vx: number; vy: number;
  rot: number; vr: number;
  opacity: number;
  w: number; h: number;
}

export function Chapter1TinyGiant() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const shardsFired = useRef(false);
  const reduced = useReducedMotion();
  const { intensity } = useScrollVelocity();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 0.4], ["0%", "-30%"]);
  const textScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.08]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.85, 0.3]);

  // Film grain canvas — animated procedural noise
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Shards array for explosion effect
    let shards: Shard[] = [];
    let shardsActive = false;

    const initShards = () => {
      shards = [];
      const count = 60;
      for (let i = 0; i < count; i++) {
        shards.push({
          x: canvas.width * 0.5 + (Math.random() - 0.5) * canvas.width * 0.6,
          y: canvas.height * 0.38 + (Math.random() - 0.5) * 80,
          vx: (Math.random() - 0.5) * 8,
          vy: 3 + Math.random() * 7,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.3,
          opacity: 0.9,
          w: 20 + Math.random() * 60,
          h: 6 + Math.random() * 20,
        });
      }
      shardsActive = true;
    };

    const loop = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 8mm Film grain — increases with scroll velocity
      const grainAmount = 0.04 + intensity * 0.12;
      const grainData = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < grainData.data.length; i += 4) {
        const g = Math.random() * 255 * grainAmount;
        grainData.data[i] = g;
        grainData.data[i + 1] = g;
        grainData.data[i + 2] = g;
        grainData.data[i + 3] = Math.random() * 60;
      }
      ctx.putImageData(grainData, 0, 0);

      // Vignette
      const vig = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.2,
        canvas.width / 2, canvas.height / 2, canvas.height * 0.9
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Occasional vertical line scratch (film artifact)
      if (frame % 90 === 0) {
        const sx = Math.random() * canvas.width;
        ctx.strokeStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.2})`;
        ctx.lineWidth = 0.5 + Math.random();
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx + (Math.random() - 0.5) * 4, canvas.height);
        ctx.stroke();
      }

      // Horizontal burn flicker
      if (frame % 150 === 0) {
        ctx.fillStyle = `rgba(255,240,200,${0.03 + Math.random() * 0.06})`;
        ctx.fillRect(0, Math.random() * canvas.height * 0.9, canvas.width, 2 + Math.random() * 8);
      }

      // Shards
      if (shardsActive) {
        shards = shards.filter(s => s.opacity > 0.01);
        shards.forEach(s => {
          s.x += s.vx;
          s.y += s.vy;
          s.vy += 0.3; // gravity
          s.rot += s.vr;
          s.opacity *= 0.97;
          ctx.save();
          ctx.translate(s.x, s.y);
          ctx.rotate(s.rot);
          ctx.globalAlpha = s.opacity;
          ctx.fillStyle = `rgba(240,230,210,${s.opacity})`;
          ctx.fillRect(-s.w / 2, -s.h / 2, s.w, s.h);
          ctx.restore();
        });
        if (shards.length === 0) shardsActive = false;
      }

      raf = requestAnimationFrame(loop);
    };
    loop();

    // Needle + shatter trigger
    const section = ref.current;
    if (section) {
      ScrollTrigger.create({
        trigger: section,
        start: "top+=30% center",
        onEnter: () => {
          if (shardsFired.current) return;
          shardsFired.current = true;
          initShards();

          // Needle pierce animation
          if (needleRef.current) {
            gsap.fromTo(needleRef.current,
              { scaleY: 0, opacity: 0 },
              { scaleY: 1, opacity: 1, duration: 0.3, ease: "power4.out",
                onComplete: () => {
                  // Shatter: hide the text
                  if (textRef.current) {
                    gsap.to(textRef.current, { opacity: 0, scale: 1.15, duration: 0.25, ease: "power4.in" });
                  }
                }
              }
            );
          }
        },
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill();
      });
    };
  }, [reduced, intensity]);

  return (
    <section
      ref={ref}
      className="chapter-1 relative min-h-[200vh] overflow-hidden"
      style={{ background: "#050508" }}
    >
      {/* Film grain + vignette canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-30 h-screen w-full mix-blend-screen"
        style={{ opacity: 0.8 }}
      />

      {/* B&W desaturation overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-20"
        style={{ background: "rgba(0,0,0,0.15)", mixBlendMode: "color" }}
      />

      {/* Sticky viewport for scroll-locked content */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

        {/* Background — aged photograph texture */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 40%, #1a1410 0%, #050305 70%)",
              filter: "contrast(1.2) brightness(0.85)",
            }}
          />
          {/* Aging horizontal scan lines */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)",
              backgroundSize: "100% 3px",
            }}
          />
        </motion.div>

        {/* Main content */}
        <div className="relative z-10 w-full max-w-5xl px-8">

          {/* Chapter label */}
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-16 bg-white/20" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono">
              Chapter I · Rosario, Argentina · 1987–2000
            </span>
          </div>

          {/* THE SHATTERING TEXT */}
          <div className="relative mb-12">
            <motion.div
              ref={textRef}
              style={{ y: textY, scale: textScale }}
              className="gpu"
            >
              <h2
                className="text-display font-black leading-none select-none"
                style={{
                  fontSize: "clamp(5rem, 20vw, 18rem)",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(255,255,255,0.35)",
                  letterSpacing: "-0.04em",
                  filter: "blur(0px)",
                }}
              >
                10
              </h2>
              <h2
                className="text-display font-black leading-none select-none"
                style={{
                  fontSize: "clamp(2rem, 6vw, 5rem)",
                  color: "rgba(255,255,255,0.15)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 300,
                }}
              >
                YEARS OLD
              </h2>
            </motion.div>

            {/* The needle — pierces through the text */}
            <div
              ref={needleRef}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0"
              style={{ transformOrigin: "top center" }}
            >
              <div className="w-px bg-gradient-to-b from-white via-white/60 to-transparent" style={{ height: "60vh" }} />
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "4px solid transparent",
                  borderRight: "4px solid transparent",
                  borderTop: "12px solid white",
                }}
              />
            </div>
          </div>

          {/* Emotional body copy */}
          <div className="max-w-2xl space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-lg leading-relaxed"
              style={{ color: "rgba(240,230,210,0.8)", fontWeight: 300 }}
            >
              Every single night, a frail 10-year-old boy sits on the edge of his bed
              in Santa Fe, manually injecting growth hormones into his legs just to earn
              the right to grow normally.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-base leading-relaxed"
              style={{ color: "rgba(200,185,165,0.65)", fontWeight: 300 }}
            >
              The club can't afford the treatment. His country is in economic collapse.
              To survive, he must abandon his mother, his neighborhood, and his childhood
              at age 13.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="origin-left"
            >
              <blockquote
                className="border-l border-white/20 pl-6 text-sm italic"
                style={{ color: "rgba(200,185,165,0.5)" }}
              >
                "He was too small. Too fragile. They said the boy would never make it.<br />
                They were wrong about everything."
              </blockquote>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats strip at bottom */}
      <div className="relative z-10 px-8 pb-32 pt-16">
        <div className="mx-auto max-w-5xl grid grid-cols-3 gap-8 border-t border-white/10 pt-12">
          {[
            { n: "10", l: "Age of diagnosis" },
            { n: "$900", l: "Monthly treatment cost" },
            { n: "13", l: "Age he left Argentina" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <div
                className="text-display font-bold leading-none mb-2"
                style={{ fontSize: "clamp(3rem, 7vw, 6rem)", color: "rgba(240,220,180,0.7)" }}
              >
                {s.n}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(200,185,165,0.4)" }}>
                {s.l}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
