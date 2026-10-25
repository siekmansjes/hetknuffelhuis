import type { ReactNode } from "react";

// Eigen setje getekende lijn-icoontjes (24x24, afgeronde lijnen), in dezelfde
// stijl als de rest van de site. Ze kleuren mee met `currentColor`.
const PATHS: Record<string, ReactNode> = {
  // 1:1 nagemaakt: potlood en liniaal
  match: (
    <>
      <path d="M4 20l1.2-4.2L16.6 4.4a1.6 1.6 0 0 1 2.2 0l.8.8a1.6 1.6 0 0 1 0 2.2L8.2 18.8z" />
      <path d="M14.5 6.5l3 3M5.2 15.8l3 3" />
      <path d="M13 20h7" />
    </>
  ),
  check: <path d="M5 12.8l4.6 4.6L19 7.6" />,
  truck: (
    <>
      <path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7" />
      <circle cx="7" cy="17.3" r="1.9" />
      <circle cx="17" cy="17.3" r="1.9" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.2 2.8v5.4c0 4.4-3 7.9-7.2 9.8-4.2-1.9-7.2-5.4-7.2-9.8V5.8z" />
      <path d="M8.8 12l2.3 2.3 4.2-4.4" />
    </>
  ),
  needle: (
    <>
      <path d="M4 20L18.5 5.5" />
      <path d="M16 3.5l4.5 4.5" />
      <path d="M8 16.2c-3.2-1.2-4.4 2-2.4 3.2" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.2V4.5h7.7l9.3 9.3-7.7 7.7z" />
      <circle cx="8" cy="9" r="1.2" />
    </>
  ),
  fabric: <path d="M3 7.5c3-3 6 3 9 0s6 3 9 0M3 13c3-3 6 3 9 0s6 3 9 0M3 18.5c3-3 6 3 9 0s6 3 9 0" />,
  box: (
    <>
      <path d="M3 7.8L12 3l9 4.8v8.4L12 21l-9-4.8z" />
      <path d="M3 7.8l9 4.7 9-4.7M12 12.5V21" />
    </>
  ),
  chat: <path d="M4 5.5h16v10.5H9.5L5 20v-4H4z" />,
  sparkle: <path d="M12 3l2.1 5.4 5.4.5-4.1 3.7 1.3 5.4-4.7-3-4.7 3 1.3-5.4-4.1-3.7 5.4-.5z" />,
  factory: (
    <>
      <path d="M3 20.5V10l6 3.6V10l6 3.6V5.5h3.5v15z" />
      <path d="M7 17h2M12 17h2M16.5 17h.01" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.2 19.5c.4-3.3 2.8-5.2 5.8-5.2s5.4 1.9 5.8 5.2" />
      <path d="M15.5 5.6a3 3 0 0 1 0 5.8M17.2 14.6c2 .5 3.3 2.2 3.6 4.9" />
    </>
  ),
  keyring: (
    <>
      <circle cx="9" cy="8" r="4.2" />
      <path d="M12 11l7 7.5-2.6 2.5-7-7.5z" />
      <path d="M16.4 16l2 2" />
    </>
  ),
  tattoo: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <circle cx="9" cy="10" r=".7" />
      <circle cx="15" cy="10" r=".7" />
      <path d="M8 14.2c1.2 2.2 6.8 2.2 8 0" />
    </>
  ),
  magnet: (
    <>
      <path d="M5.5 4v8.2a6.5 6.5 0 0 0 13 0V4h-4v8.2a2.5 2.5 0 0 1-5 0V4z" />
      <path d="M5.5 8h4M14.5 8h4" />
    </>
  ),
  cap: (
    <>
      <path d="M4 15.5c0-4.8 3.5-8.2 8-8.2s8 3.4 8 8.2" />
      <path d="M4 15.5h16.5c0 1.8-1.6 3-3.5 3H9" />
      <path d="M12 7.3v3.5" />
    </>
  ),
  shirt: <path d="M8.5 4L3 6.8l2 4.4 2.3-1V20h9.4v-9.8l2.3 1 2-4.4L15.5 4c-.7 1.7-2 2.7-3.5 2.7S9.2 5.7 8.5 4z" />,
  mail: (
    <>
      <path d="M3 6h18v12H3z" />
      <path d="M3.5 7l8.5 6 8.5-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  bear: (
    <>
      <circle cx="12" cy="13" r="6.5" />
      <circle cx="6.3" cy="6.8" r="2.4" />
      <circle cx="17.7" cy="6.8" r="2.4" />
      <circle cx="9.6" cy="12" r=".6" />
      <circle cx="14.4" cy="12" r=".6" />
      <path d="M10.6 15.2c.9.9 1.9.9 2.8 0" />
    </>
  ),
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 28 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}

/** Icoon in een rond vlak, zoals op de iconenkaarten. */
export function IconBadge({ name, size = 28, tone = "deep" }: { name: IconName; size?: number; tone?: "deep" | "soft" }) {
  return (
    <span className={`icon-badge icon-badge--${tone}`} aria-hidden="true">
      <Icon name={name} size={size} />
    </span>
  );
}
