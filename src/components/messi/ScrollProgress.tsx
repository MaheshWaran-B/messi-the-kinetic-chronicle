import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-border/40">
        <div className="h-full origin-left bg-gradient-to-r from-sky via-foreground to-gold" style={{ transform: `scaleX(${p})` }} />
      </div>
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 hidden text-[10px] uppercase tracking-wider-2 text-muted-foreground md:block">
        {String(Math.round(p * 100)).padStart(2, "0")} <span className="text-foreground/40">/ 100</span>
      </div>
    </>
  );
}
