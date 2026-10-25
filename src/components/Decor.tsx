// Sierelement: golfrand tussen secties. Decoratief (aria-hidden).

/** Golvende bovenrand. `from` is de kleur van het blok erboven. */
export function Wave({ from = "paper" }: { from?: "paper" | "tint" | "night" }) {
  return (
    <svg className={`wave wave--${from}`} viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 0h1440v26c-180 40-330 34-520 6S560 4 380 22C240 36 120 46 0 26z" fill="currentColor" />
    </svg>
  );
}
