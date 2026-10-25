"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Laat een blok zacht binnenkomen zodra het in beeld scrolt. Wat bij het laden
 * al in beeld staat, blijft gewoon staan (geen flits). Zonder JavaScript of met
 * "minder beweging" is alles meteen zichtbaar (zie .reveal in globals.css).
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Vertraging in milliseconden, voor een trapsgewijze opbouw. */
  delay?: number;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inView = el.getBoundingClientRect().top < window.innerHeight * 0.92;
    if (inView || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    el.classList.add("is-armed");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties | undefined = delay ? { transitionDelay: `${delay}ms` } : undefined;
  const Component = Tag as "div";
  return (
    <Component ref={ref as React.RefObject<HTMLDivElement>} className={`reveal ${className}`.trim()} style={style}>
      {children}
    </Component>
  );
}
