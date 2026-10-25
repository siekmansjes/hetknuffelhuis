// Getekende sierelementen: kleine doodles die zacht zweven, en een golfrand
// tussen secties. Allemaal decoratief (aria-hidden).

export function Doodles() {
  return (
    <div className="doodles" aria-hidden="true">
      <span className="dot dot--a" />
      <span className="dot dot--b" />
      <span className="dot dot--c" />
      <span className="dot dot--d" />
      <svg className="doodle doodle--star" viewBox="0 0 48 48" fill="none">
        <path d="M24 5l5 12.5 13 1-10 8.6 3.2 13L24 33l-11.2 7.1 3.2-13L6 18.5l13-1z" fill="var(--spot)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <svg className="doodle doodle--heart" viewBox="0 0 48 48" fill="none">
        <path d="M24 41S7 30.5 7 18.5A9.5 9.5 0 0 1 24 13a9.5 9.5 0 0 1 17 5.5C41 30.5 24 41 24 41z" fill="var(--teal)" stroke="var(--ink)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <svg className="doodle doodle--stitch" viewBox="0 0 64 24" fill="none">
        <path d="M3 12h58" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeDasharray="9 8" />
      </svg>
      <svg className="doodle doodle--plus" viewBox="0 0 40 40" fill="none">
        <path d="M20 6v28M6 20h28" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/** Golvende bovenrand. `from` is de kleur van het blok erboven. */
export function Wave({ from = "paper" }: { from?: "paper" | "tint" | "night" }) {
  return (
    <svg className={`wave wave--${from}`} viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 0h1440v26c-180 40-330 34-520 6S560 4 380 22C240 36 120 46 0 26z" fill="currentColor" />
    </svg>
  );
}
