"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

export const NAV_ITEMS = [
  { href: "/knuffels", label: "Knuffels" },
  { href: "/cases", label: "Cases" },
  { href: "/merchandise", label: "Merchandise" },
  { href: "/werkwijze", label: "Werkwijze" },
  { href: "/faq", label: "Veelgestelde vragen" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Sluit het menu met Escape (en bij navigatie, via onClick op de links).
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand" aria-label="Het Knuffelhuis, naar de homepage">
          <Logo />
        </Link>
        <nav className="main-nav" aria-label="Hoofdmenu">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link"
              aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/contact?mode=offerte" className="btn btn-primary btn-sm header-cta">
            Offerte aanvragen
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Sluit menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" className="mobile-nav" aria-label="Mobiel menu">
          <Link href="/" className="mobile-link" onClick={close}>
            Home
          </Link>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="mobile-link" onClick={close}>
              {item.label}
            </Link>
          ))}
          <Link href="/contact?mode=offerte" className="btn btn-primary" onClick={close}>
            Offerte aanvragen
          </Link>
        </nav>
      )}
    </header>
  );
}
