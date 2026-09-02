import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import paris from "@/assets/paris-psg.jpg";
import miami from "@/assets/miami-inter.jpg";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useBackground } from "./BackgroundContext";

gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    tag: "Chapter 04 · 2021–23",
    title: "Paris",
    img: paris,
    stats: [["32", "Ligue 1 apps (Y1)"], ["21", "Goals in pink"], ["02", "Ligue 1 titles"]],
    text: "An awkward, neon-lit interlude. He arrives in tears at Le Bourget, plays beneath the Eiffel Tower, and wins his eighth Ballon d'Or in a season that ends with a star above his crest.",
  },
  {
    tag: "Chapter 05 · 2023–",
    title: "Miami",
    img: miami,
    stats: [["01", "Leagues Cup"], ["20+", "Goals · Year 1"], ["10", "The Pink Number"]],
    text: "Sunset on South Beach. He doesn't slow down — he just smiles more. Inter Miami becomes a global pilgrimage, and a sport finally falls in love with itself in America.",
  },
];

export function HorizontalEras() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { setActiveSection } = useBackground();

  useEffect(() => {
    if (!ref.current || !trackRef.current) return;

    // Trigger initial state
    const stBg = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: (self) => {
        if (self.isActive) setActiveSection("paris");
      },
    });

    if (reduced) return () => stBg.kill();

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const distance = track.scrollWidth - window.innerWidth;
      const panelWidth = window.innerWidth;

      gsap.to(track, {
        x: -distance, ease: "none",
        scrollTrigger: {
          trigger: ref.current, start: "top top",
          end: () => `+=${distance + window.innerHeight}`,
          scrub: 1, pin: true, invalidateOnRefresh: true,
          onUpdate: (self) => {
            const scrollPos = self.progress * distance;
            const activeIdx = Math.round(scrollPos / panelWidth);
            if (activeIdx === 0 || activeIdx === 1) {
              setActiveSection("paris");
            } else if (activeIdx === 2) {
              setActiveSection("miami");
            }
          }
        },
      });
    }, ref);

    return () => {
      ctx.revert();
      stBg.kill();
    };
  }, [reduced, setActiveSection]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-transparent">
      <div ref={trackRef} className="flex h-screen w-max gpu">
        <div className="flex h-full w-screen items-center justify-center px-12">
          <div className="text-center">
            <div className="mb-6 text-xs uppercase tracking-wider-2 text-sky">Beyond Barcelona</div>
            <h2 className="text-display text-[clamp(4rem,14vw,14rem)] font-bold leading-[0.85]">
              Two<br /><em className="text-gold">codas.</em>
            </h2>
            <p className="mx-auto mt-8 max-w-md text-muted-foreground">Scroll →</p>
          </div>
        </div>
        {panels.map((p, i) => (
          <article key={i} className="relative flex h-full w-screen items-center px-12">
            <div
              className="absolute inset-y-12 right-12 hidden w-[45%] rounded-md bg-cover bg-center md:block shadow-2xl border border-border/20"
              style={{ backgroundImage: `url(${p.img})` }}
            />
            <div className="relative z-10 max-w-xl">
              <div className="mb-4 text-xs uppercase tracking-wider-2 text-muted-foreground">{p.tag}</div>
              <h3 className="text-display text-[clamp(4rem,12vw,11rem)] font-bold leading-none">
                <em>{p.title}.</em>
              </h3>
              <p className="mt-8 max-w-md text-base text-muted-foreground">{p.text}</p>
              <div className="mt-10 grid grid-cols-3 gap-6">
                {p.stats.map(([n, l], k) => (
                  <div key={k}>
                    <div className="text-display text-3xl font-bold text-gold">{n}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-wider-2 text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
