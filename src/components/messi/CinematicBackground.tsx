import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useBackground, BackgroundSection } from "./BackgroundContext";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Import images
import heroSilhouette from "@/assets/hero-silhouette.jpg";
import rosarioChildhood from "@/assets/rosario-childhood.jpg";
import barcelonaStadium from "@/assets/barcelona-stadium.jpg";
import worldCupGlory from "@/assets/world-cup-glory.jpg";
import parisPsg from "@/assets/paris-psg.jpg";
import miamiInter from "@/assets/miami-inter.jpg";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  alpha: number;
  rot: number;
  vr: number;
  twinkleSpeed?: number;
}

const SECTION_IMAGES: Record<BackgroundSection, string | null> = {
  hero: heroSilhouette,
  rosario: rosarioChildhood,
  "barcelona-begins": barcelonaStadium,
  dynasty: barcelonaStadium,
  glory: worldCupGlory,
  counters: worldCupGlory,
  "trophy-room": worldCupGlory, // will display cup or can be overridden
  tactical: null, // pitch drawing / chalkboard
  paris: parisPsg,
  miami: miamiInter,
  coda: null,
};

// Colors and effects matching each section
const THEMES: Record<
  BackgroundSection,
  {
    bgGradient: string; // CSS background style
    particleColors: string[];
    particleCount: number;
    particleSpeed: number;
    particleSize: [number, number];
    style: "spark" | "confetti" | "tactical" | "twinkle";
  }
> = {
  hero: {
    bgGradient: "radial-gradient(ellipse at center, rgba(8, 12, 28, 0.4) 0%, rgba(8, 12, 28, 0.95) 100%)",
    particleColors: ["#d4af37", "#f5d77a", "#ffffff"],
    particleCount: 80,
    particleSpeed: 0.3,
    particleSize: [1, 3],
    style: "spark",
  },
  rosario: {
    bgGradient: "radial-gradient(ellipse at center, rgba(247, 245, 240, 0.45) 0%, rgba(247, 245, 240, 0.98) 100%)",
    particleColors: ["#b58d3d", "#d4af37", "#8c6227"],
    particleCount: 60,
    particleSpeed: 0.2,
    particleSize: [1.5, 4],
    style: "spark",
  },
  "barcelona-begins": {
    bgGradient: "radial-gradient(ellipse at center, rgba(10, 20, 45, 0.4) 0%, rgba(10, 12, 28, 0.96) 100%)",
    particleColors: ["#a50044", "#004d98", "#edbb00"],
    particleCount: 90,
    particleSpeed: 0.5,
    particleSize: [1.5, 3.5],
    style: "spark",
  },
  dynasty: {
    bgGradient: "radial-gradient(ellipse at center, rgba(12, 10, 36, 0.35) 0%, rgba(8, 6, 20, 0.97) 100%)",
    particleColors: ["#a50044", "#004d98", "#edbb00", "#ffffff"],
    particleCount: 110,
    particleSpeed: 0.6,
    particleSize: [1.5, 4],
    style: "spark",
  },
  glory: {
    bgGradient: "radial-gradient(ellipse at center, rgba(15, 32, 54, 0.35) 0%, rgba(6, 12, 22, 0.96) 100%)",
    particleColors: ["#75aadb", "#ffffff", "#f6d55c", "#d4af37"],
    particleCount: 140,
    particleSpeed: 0.9,
    particleSize: [2, 5],
    style: "confetti",
  },
  counters: {
    bgGradient: "radial-gradient(ellipse at center, rgba(10, 22, 38, 0.4) 0%, rgba(6, 10, 18, 0.97) 100%)",
    particleColors: ["#75aadb", "#ffffff", "#d4af37"],
    particleCount: 80,
    particleSpeed: 0.4,
    particleSize: [1.5, 3],
    style: "spark",
  },
  "trophy-room": {
    bgGradient: "radial-gradient(ellipse at center, rgba(18, 16, 12, 0.4) 0%, rgba(6, 5, 4, 0.98) 100%)",
    particleColors: ["#d4af37", "#f5d77a", "#ffffff"],
    particleCount: 100,
    particleSpeed: 0.3,
    particleSize: [1, 3],
    style: "spark",
  },
  tactical: {
    bgGradient: "radial-gradient(ellipse at center, rgba(12, 32, 22, 0.45) 0%, rgba(4, 12, 8, 0.98) 100%)",
    particleColors: ["#00ff66", "#ffffff", "#008833"],
    particleCount: 40,
    particleSpeed: 0.15,
    particleSize: [2, 4],
    style: "tactical",
  },
  paris: {
    bgGradient: "radial-gradient(ellipse at center, rgba(10, 18, 38, 0.4) 0%, rgba(5, 8, 18, 0.97) 100%)",
    particleColors: ["#002F6C", "#E30613", "#ffffff"],
    particleCount: 80,
    particleSpeed: 0.5,
    particleSize: [1.5, 4],
    style: "spark",
  },
  miami: {
    bgGradient: "radial-gradient(ellipse at center, rgba(42, 20, 36, 0.4) 0%, rgba(18, 8, 16, 0.97) 100%)",
    particleColors: ["#F4A9BE", "#F7B500", "#ffffff"],
    particleCount: 95,
    particleSpeed: 0.4,
    particleSize: [2, 4.5],
    style: "spark",
  },
  coda: {
    bgGradient: "radial-gradient(ellipse at center, rgba(8, 8, 12, 0.5) 0%, rgba(4, 4, 6, 0.98) 100%)",
    particleColors: ["#ffffff", "#dddddd", "#b0c4de"],
    particleCount: 120,
    particleSpeed: 0.05,
    particleSize: [0.5, 1.5],
    style: "twinkle",
  },
};

export function CinematicBackground() {
  const { activeSection, overrideImage } = useBackground();
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse coordinates
  const mouseRef = useRef({ x: -1000, y: -1000 });
  // Scroll velocity tracker
  const lastScrollY = useRef(0);
  const scrollVel = useRef(0);

  // Determine current background image to show
  const activeImage = overrideImage || SECTION_IMAGES[activeSection];
  const theme = THEMES[activeSection];

  // Manage mouse move for image parallax
  useEffect(() => {
    if (reduced) return;
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Gentle parallax effect on the image container
      const xPercent = (e.clientX / window.innerWidth - 0.5) * 12;
      const yPercent = (e.clientY / window.innerHeight - 0.5) * 12;

      gsap.to(".cinematic-bg-img", {
        x: `${xPercent}px`,
        y: `${yPercent}px`,
        duration: 1.2,
        ease: "power2.out",
      });
    };

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;
      scrollVel.current = scrollVel.current * 0.85 + diff * 0.15;
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  // Particle Canvas System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const initCanvas = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    initCanvas();
    window.addEventListener("resize", initCanvas);

    // Populate particles based on active theme
    const createParticles = () => {
      particles = [];
      const count = reduced ? Math.min(theme.particleCount, 20) : theme.particleCount;
      const width = window.innerWidth;
      const height = window.innerHeight;

      for (let i = 0; i < count; i++) {
        const sizeMin = theme.particleSize[0];
        const sizeMax = theme.particleSize[1];
        const size = sizeMin + Math.random() * (sizeMax - sizeMin);
        const color = theme.particleColors[Math.floor(Math.random() * theme.particleColors.length)];

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * theme.particleSpeed * 2,
          vy: -Math.random() * theme.particleSpeed - 0.1, // Float upwards by default
          r: size,
          color,
          alpha: 0.1 + Math.random() * 0.7,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.05,
          twinkleSpeed: 0.005 + Math.random() * 0.015,
        });
      }
    };

    createParticles();

    // Animation Loop
    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(0, 0, width, height);

      // Decaying scroll velocity
      scrollVel.current *= 0.95;

      const style = theme.style;
      const mouse = mouseRef.current;

      // Draw connections for tactical mode
      if (style === "tactical") {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 255, 102, 0.08)";
        ctx.lineWidth = 0.8;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
            }
          }
        }
        ctx.stroke();
      }

      particles.forEach((p) => {
        // Move particle
        p.rot += p.vr;

        // Apply scroll velocity (make particles react to scrolls)
        const verticalForce = scrollVel.current * 0.05;
        p.y -= verticalForce;

        // Base movement
        p.x += p.vx;
        p.y += p.vy;

        // Mouse interaction (push away or attract slightly)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          const force = (180 - dist) / 180;
          const angle = Math.atan2(dy, dx);
          
          if (style === "tactical") {
            // Attract in tactical node mode
            p.x -= Math.cos(angle) * force * 1.5;
            p.y -= Math.sin(angle) * force * 1.5;
          } else {
            // Push away in spark/confetti modes
            p.x += Math.cos(angle) * force * 2.0;
            p.y += Math.sin(angle) * force * 2.0;
          }
        }

        // Wrap around boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Draw particle based on style
        ctx.save();
        ctx.translate(p.x, p.y);

        if (style === "confetti") {
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          // Rectangular confetti
          ctx.fillRect(-p.r, -p.r * 0.4, p.r * 2, p.r * 0.8);
        } else if (style === "twinkle") {
          // Sinusoidal opacity for stars
          p.alpha += p.twinkleSpeed || 0.01;
          const alphaVal = 0.15 + Math.abs(Math.sin(p.alpha)) * 0.75;
          ctx.globalAlpha = alphaVal;
          
          ctx.fillStyle = p.color;
          // Draw a small four-pointed star
          ctx.beginPath();
          ctx.moveTo(0, -p.r * 1.5);
          ctx.lineTo(p.r * 0.4, -p.r * 0.4);
          ctx.lineTo(p.r * 1.5, 0);
          ctx.lineTo(p.r * 0.4, p.r * 0.4);
          ctx.moveTo(0, p.r * 1.5);
          ctx.lineTo(-p.r * 0.4, p.r * 0.4);
          ctx.lineTo(-p.r * 1.5, 0);
          ctx.lineTo(-p.r * 0.4, -p.r * 0.4);
          ctx.closePath();
          ctx.fill();
        } else if (style === "tactical") {
          ctx.globalAlpha = p.alpha * 0.8;
          ctx.fillStyle = p.color;
          // Tactical node circle
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();

          // Outer glowing ring
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.3;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, p.r + 4, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Default spark (circle)
          ctx.globalAlpha = p.alpha;
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.r);
          grad.addColorStop(0, p.color);
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", initCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [activeSection, theme, reduced]);

  // Handle active background image transitions (using local image refs)
  const imageSources = [
    heroSilhouette,
    rosarioChildhood,
    barcelonaStadium,
    worldCupGlory,
    parisPsg,
    miamiInter,
  ];

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 -z-10 h-screen w-screen overflow-hidden transition-all duration-1000"
      style={{
        backgroundColor: activeSection === "rosario" ? "oklch(0.97 0.015 85)" : "oklch(0.08 0.03 260)",
      }}
    >
      {/* Background mesh glow gradient */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: theme.bgGradient,
        }}
      />

      {/* Image container with mouse parallax */}
      <div className="cinematic-bg-img absolute inset-[-10%] h-[120%] w-[120%]">
        {imageSources.map((src) => {
          const isSelected = activeImage === src;
          // Opacity of backdrops: Hero silhouette is darker/opacity-60 originally;
          // others are stadium (25% opacity) or 3D world cup (20-30% opacity).
          let targetOpacity = 0;
          if (isSelected) {
            if (src === heroSilhouette) targetOpacity = 0.55;
            else if (src === rosarioChildhood) targetOpacity = 0.35;
            else if (src === barcelonaStadium) targetOpacity = 0.28;
            else if (src === worldCupGlory) targetOpacity = 0.3;
            else if (src === parisPsg) targetOpacity = 0.3;
            else if (src === miamiInter) targetOpacity = 0.32;
            else targetOpacity = 0.3;
          }

          // Special mixing for Rosario light theme
          const isRosario = activeSection === "rosario";

          return (
            <div
              key={src}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{
                backgroundImage: `url(${src})`,
                opacity: targetOpacity,
                mixBlendMode: isRosario && src === rosarioChildhood ? "multiply" : "normal",
                transform: isSelected ? "scale(1.05)" : "scale(1)",
                transition: "opacity 1000ms ease-in-out, transform 30s ease-out",
                // Combine custom Ken Burns zoom animations when visible
                animation: isSelected && !reduced ? "kenBurns 24s infinite alternate ease-in-out" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Vignette Overlay for Text Readability */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background:
            activeSection === "rosario"
              ? "radial-gradient(circle, transparent 30%, rgba(247, 245, 240, 0.8) 75%, oklch(0.97 0.015 85) 100%)"
              : "radial-gradient(circle, transparent 20%, rgba(8, 12, 28, 0.45) 60%, oklch(0.08 0.03 260) 95%)",
        }}
      />

      {/* Interactive canvas particles overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70" />

      {/* Global CSS for Ken Burns Effect */}
      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1.02) translate(0px, 0px); }
          50% { transform: scale(1.07) translate(-1%, -0.5%); }
          100% { transform: scale(1.03) translate(0.5%, 0.5%); }
        }
      `}</style>
    </div>
  );
}
