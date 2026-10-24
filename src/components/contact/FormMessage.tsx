"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Toegankelijke formuliermelding. Fouten krijgen `role="alert"`, succes
 * `role="status"`; bij verschijnen verplaatst de focus ernaartoe, zodat
 * toetsenbord- en screenreadergebruikers de uitkomst niet missen (zeker als
 * het formulier zelf verdwijnt na succes).
 */
export function FormMessage({ kind, children }: { kind: "error" | "success"; children: ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, [kind]);

  return (
    <p
      ref={ref}
      role={kind === "error" ? "alert" : "status"}
      aria-live={kind === "error" ? "assertive" : "polite"}
      tabIndex={-1}
      className={`form-message form-message--${kind}`}
    >
      {children}
    </p>
  );
}
