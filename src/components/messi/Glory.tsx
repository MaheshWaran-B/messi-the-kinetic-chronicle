import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import img from "@/assets/world-cup-glory.jpg";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

const arc = [
  { y: "2014", t: "Maracanã", d: "Lost the World Cup final to Germany. Awarded the Golden Ball through tears." },
  { y: "2015 / 16", t: "Copa twice", d: "Two consecutive Copa América finals — two losses to Chile on penalties." },
  { y: "2016", t: "Retirement", d: "Announced international retirement at 29. Returned weeks later." },
  { y: "2021", t: "Maracanã reborn", d: "First major Argentina trophy in 28 years — Copa América at Brazil's home." },
  { y: "2022", t: "Lusail", d: "World Cup. Argentina. Immortality." },
];

export function Glory() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".glory-wrap", { filter: "grayscale(1) brightness(0.7)" }, {
        filter: "grayscale(0) brightness(1)", ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 50%", end: "bottom 80%", scrub: true },
      });
      gsap.from(".glory-row", {
        opacity: 0, y: 60, ease: "power3.out", stagger: 0.2,
        scrollTrigger: { trigger: ".glory-arc", start: "top 75%" },
      });

      const img = ref.current!.querySelector<HTMLElement>(".glory-img");
      if (img) {
        const onMove = (e: MouseEvent) => {
          const r = img.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(img, { rotateY: x * 12, rotateX: -y * 12, duration: 0.6, ease: "power2.out", transformPerspective: 1000 });
        };
        const onLeave = () => gsap.to(img, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power3.out" });
        img.addEventListener("mousemove", onMove);
        img.addEventListener("mouseleave", onLeave);
      }
    }, ref);

    // Canvas confetti
    const canvas = canvasRef.current;
    if (!canvas) return () => ctx.revert();
    const c = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let particles: { x: number; y: number; vx: number; vy: number; r: number; c: string; rot: number; vr: number }[] = [];
    let active = false;
    let scrollVel = 0;
    let lastY = window.scrollY;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#d4af37", "#f5d77a", "#4a90e2", "#ffffff"];
    const spawn = () => {
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: Math.random() * canvas.width, y: -20,
          vx: (Math.random() - 0.5) * 1.2, vy: 1 + Math.random() * 2 + Math.abs(scrollVel) * 0.4,
          r: 3 + Math.random() * 5, c: colors[Math.floor(Math.random() * colors.length)],
          rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.1,
        });
      }
    };

    const loop = () => {
      c.clearRect(0, 0, canvas.width, canvas.height);
      if (active) spawn();
      particles = particles.filter((p) => p.y < canvas.height + 20);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        c.save(); c.translate(p.x, p.y); c.rotate(p.rot);
        c.fillStyle = p.c; c.fillRect(-p.r, -p.r * 0.4, p.r * 2, p.r * 0.8);
        c.restore();
      });
      raf = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      const dy = window.scrollY - lastY;
      scrollVel = scrollVel * 0.8 + dy * 0.2;
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 60%",
      end: "bottom 20%",
      onToggle: (self) => { active = self.isActive; },
    });

    loop();
    return () => {
      ctx.revert(); st.kill(); cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  return (
    <section ref={ref} className="glory-wrap relative min-h-screen overflow-hidden bg-background px-6 py-32">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-20 h-full w-full" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 text-xs uppercase tracking-wider-2 text-sky">Chapter 03 · Albiceleste</div>
        <h2 className="text-display text-[clamp(3rem,9vw,9rem)] font-bold leading-[0.88]">
          From <em className="text-muted-foreground">tears</em>
          <br />
          to <span className="bg-gradient-to-r from-gold to-sky bg-clip-text text-transparent">gold.</span>
        </h2>

        <div className="mt-20 grid items-start gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div className="glory-arc space-y-8">
            {arc.map((a, i) => (
              <div key={i} className="glory-row flex gap-6 border-t border-border pt-6">
                <div className="text-display w-28 shrink-0 text-2xl text-gold">{a.y}</div>
                <div>
                  <h3 className="text-display text-xl">{a.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glory-img gpu overflow-hidden rounded-md" style={{ transformStyle: "preserve-3d" }}>
            <img src={img} alt="A golden trophy lifted to the sky" width={1920} height={1280} loading="lazy" className="h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
