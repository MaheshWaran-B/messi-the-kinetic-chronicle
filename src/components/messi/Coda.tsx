export function Coda() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background px-6 py-32">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-6 text-xs uppercase tracking-wider-2 text-gold">Fin · Por ahora</div>
        <h2 className="text-display text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.88]">
          He didn't<br />break the game.<br /><em className="bg-gradient-to-r from-gold via-foreground to-sky bg-clip-text text-transparent">He rewrote it.</em>
        </h2>
        <p className="mx-auto mt-10 max-w-md text-sm text-muted-foreground">
          A scrollytelling tribute. No affiliation. All statistics through 2024. Built with restraint, GSAP, and a great deal of love.
        </p>
        <div className="mt-12 flex items-center justify-center gap-4 text-[10px] uppercase tracking-wider-2 text-muted-foreground">
          <span>Rosario</span><span className="h-px w-8 bg-border" />
          <span>Barcelona</span><span className="h-px w-8 bg-border" />
          <span>Paris</span><span className="h-px w-8 bg-border" />
          <span>Miami</span>
        </div>
      </div>
    </footer>
  );
}
