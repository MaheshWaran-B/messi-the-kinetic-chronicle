import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/messi/Hero";
import { Rosario } from "@/components/messi/Rosario";
import { BarcelonaBegins } from "@/components/messi/BarcelonaBegins";
import { Dynasty } from "@/components/messi/Dynasty";
import { Glory } from "@/components/messi/Glory";
import { HorizontalEras } from "@/components/messi/HorizontalEras";
import { GoatCounter } from "@/components/messi/GoatCounter";
import { TrophyRoom } from "@/components/messi/TrophyRoom";
import { TacticalPlaybook } from "@/components/messi/TacticalPlaybook";
import { Coda } from "@/components/messi/Coda";
import { ScrollProgress } from "@/components/messi/ScrollProgress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Messi · A Scrollytelling Biography" },
      { name: "description", content: "A cinematic, scroll-bound journey through the life of Lionel Messi — from Rosario to immortality." },
      { property: "og:title", content: "Messi · A Scrollytelling Biography" },
      { property: "og:description", content: "Scroll through the life, the heartbreak and the immortality of Lionel Messi." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,700&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <ScrollProgress />
      <Hero />
      <Rosario />
      <BarcelonaBegins />
      <Dynasty />
      <Glory />
      <GoatCounter />
      <TrophyRoom />
      <TacticalPlaybook />
      <HorizontalEras />
      <Coda />
    </main>
  );
}
