"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
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
// site geen niet-functionele cookies en tonen we niets.

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
  const [forceOpen, setForceOpen] = useState(false);

  useEffect(() => {
    const open = () => setForceOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  if (!ANALYTICS_CONFIGURED || !mounted) return null;
  if (consent !== null && !forceOpen) return null;

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
    setForceOpen(false);
  };

  return (
    <div className="cookie-bar" role="dialog" aria-label="Cookies" aria-live="polite">
      <p>
        We gebruiken Google Analytics om te zien welke pagina’s bezocht worden, zodat we de site kunnen verbeteren. Dat doen we alleen met jouw toestemming.{" "}
        <Link href="/privacy#cookies">Lees meer</Link>
      </p>
      <div className="cta-row">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => choose("accepted")}>
          Accepteren
        </button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => choose("declined")}>
          Weigeren
        </button>
      </div>
    </div>
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
