// Merkteken: een huisje met twee beren-oren op het dak en een gestikte naad.
// Alles in currentColor/tokens, zodat het meekleurt op donkere vlakken.
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
      {/* oren */}
      <circle cx="12.5" cy="15" r="6.5" fill="var(--accent)" />
      <circle cx="35.5" cy="15" r="6.5" fill="var(--accent)" />
      <circle cx="12.5" cy="15" r="3" fill="var(--sky)" />
      <circle cx="35.5" cy="15" r="3" fill="var(--sky)" />
      {/* huis */}
      <path
        d="M24 5.5 43.5 21v19.5a4 4 0 0 1-4 4h-31a4 4 0 0 1-4-4V21L24 5.5Z"
        fill="currentColor"
      />
      {/* gezichtje */}
      <circle cx="18" cy="28.5" r="2" fill="var(--paper)" />
      <circle cx="30" cy="28.5" r="2" fill="var(--paper)" />
      <ellipse cx="24" cy="33.5" rx="3.2" ry="2.4" fill="var(--sky)" />
      {/* naad */}
      <path d="M24 36v6" stroke="var(--paper)" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2.4 2.8" />
    </svg>
  );
}

export function Logo() {
  return (
    <>
      <LogoMark />
      <span className="brand-name">Het Knuffelhuis</span>
    </>
  );
}
