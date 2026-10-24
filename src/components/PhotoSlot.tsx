import type { ReactNode } from "react";
import Image from "next/image";

type Tone = "sky" | "mint" | "lilac" | "deep" | "surface";

/**
 * Toont de echte foto als die er is; anders een herkenbaar fotovak waarin staat
 * welke foto er nog nodig is.
 * TODO: IMAGE ASSET NEEDED — zie de `photoWanted`/`wanted`-omschrijving per plek.
 */
export function PhotoSlot({
  src,
  alt,
  wanted,
  tone = "deep",
  ratio = "4-3",
  sizes = "(max-width: 900px) 100vw, 600px",
  priority = false,
  children,
}: {
  src?: string;
  alt?: string;
  wanted: string;
  tone?: Tone;
  ratio?: "4-3" | "4-5" | "1-1" | "16-10";
  sizes?: string;
  priority?: boolean;
  children?: ReactNode;
}) {
  if (src) {
    return (
      <div className={`frame ratio-${ratio}`} style={{ position: "relative" }}>
        <Image src={src} alt={alt ?? ""} fill sizes={sizes} priority={priority} style={{ objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div className={`photo-slot photo-slot--${tone} ratio-${ratio}`} role="img" aria-label={`Fotovak: ${wanted}`}>
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <circle cx="12" cy="12" r="3.2" />
        <path d="M8 5l1.3-2h5.4L16 5" />
      </svg>
      <strong>Foto volgt</strong>
      <span>{wanted}</span>
      {children}
    </div>
  );
}
