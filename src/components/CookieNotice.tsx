"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ANALYTICS_CONFIGURED,
  CONSENT_EVENT,
  OPEN_SETTINGS_EVENT,
  getConsent,
  setConsent,
  type ConsentChoice,
} from "@/lib/consent";

// Zolang er geen analytics is ingesteld (NEXT_PUBLIC_GA_MEASUREMENT_ID) zet de
// site geen niet-functionele cookies en tonen we niets. Met analytics verschijnt
// de melding totdat er gekozen is; via "Cookie-instellingen" (footer en
// privacypagina) opent het paneel om de keuze te wijzigen.

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function useConsent(): ConsentChoice | null {
  return useSyncExternalStore(subscribe, getConsent, () => null);
}

// `null` op de server; pas na hydratatie weten we of er al gekozen is.
const noopSubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function CookieNotice() {
  const consent = useConsent();
  const mounted = useMounted();

  if (!ANALYTICS_CONFIGURED || !mounted) return null;

  const openSettings = () => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));

  return (
    <>
      {consent === null && (
        <div className="cookie-bar" role="region" aria-label="Cookies" aria-live="polite">
          <p>
            Met jouw toestemming gebruiken we Google Analytics om te zien welke pagina’s bezocht worden, zodat we de site kunnen verbeteren. Lees meer in ons{" "}
            <Link href="/privacy#cookies">privacybeleid</Link>.{" "}
            <button type="button" className="link-button" onClick={openSettings}>
              Instellingen
            </button>
          </p>
          <div className="cta-row">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setConsent("declined")}>
              Alleen noodzakelijk
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setConsent("accepted")}>
              Accepteren
            </button>
          </div>
        </div>
      )}
      <CookieSettingsDialog />
    </>
  );
}

// Paneel om de keuze per onderdeel te bekijken en te wijzigen. Native <dialog>
// via showModal(): modaal, focus-trap, Escape en inerte achtergrond komen van de
// browser; bij sluiten gaat de focus terug naar de knop waarmee het openging.
function CookieSettingsDialog() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const id = useId();

  useEffect(() => {
    const onOpen = () => {
      const active = document.activeElement;
      triggerRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
      setAnalytics(getConsent() === "accepted");
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    titleRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      const trigger = triggerRef.current;
      if (trigger && trigger.isConnected) trigger.focus();
    };
  }, [open]);

  function save(allowAnalytics: boolean) {
    setConsent(allowAnalytics ? "accepted" : "declined"); // intrekken stopt Analytics direct
    setAnnouncement("Je cookiekeuze is opgeslagen.");
    setOpen(false);
  }

  return (
    <>
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
      {open && (
        <dialog
          ref={dialogRef}
          className="cookie-settings"
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-intro`}
          onClose={() => setOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="cookie-settings-inner">
            <div className="cookie-settings-head">
              <h2 id={`${id}-title`} ref={titleRef} tabIndex={-1}>
                Cookie-instellingen
              </h2>
              <button type="button" className="cookie-settings-close" onClick={() => setOpen(false)} aria-label="Sluiten">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <p id={`${id}-intro`} className="cookie-settings-intro">
              Kies per onderdeel wat je toestaat. Je keuze staat in de lokale opslag van je browser en je kunt hem hier op elk moment wijzigen. Lees meer in ons <Link href="/privacy#cookies">privacybeleid</Link>.
            </p>

            <label className="cookie-settings-row">
              <input type="checkbox" checked disabled readOnly aria-describedby={`${id}-nodig`} />
              <span>
                <strong>Noodzakelijk (altijd aan)</strong>
                <span id={`${id}-nodig`}>Deze cookiekeuze onthouden we lokaal in je browser. Dat is nodig voor de werking van de website en vraagt geen toestemming.</span>
              </span>
            </label>

            <label className="cookie-settings-row">
              <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} aria-describedby={`${id}-analytics`} />
              <span>
                <strong>Analytics (Google Analytics)</strong>
                <span id={`${id}-analytics`}>
                  Meet hoe bezoekers de website gebruiken, bijvoorbeeld welke pagina’s bekeken worden en of een aanvraag is verstuurd. Hiervoor plaatst Google Analytics cookies.
                </span>
              </span>
            </label>

            <div className="cta-row">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => save(false)}>
                Alleen noodzakelijk
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => save(true)}>
                Alles accepteren
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => save(analytics)}>
                Keuze opslaan
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

/** Knop in de footer om de keuze later te wijzigen. Niets zolang er geen analytics is. */
export function CookieSettingsButton() {
  if (!ANALYTICS_CONFIGURED) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}>
      Cookie-instellingen
    </button>
  );
}
