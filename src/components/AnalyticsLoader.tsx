"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  ANALYTICS_CONFIGURED,
  CONSENT_EVENT,
  GA_DISABLE_KEY,
  GA_MEASUREMENT_ID,
  expireCookies,
  hasAnalyticsConsent,
} from "@/lib/consent";

const GA_COOKIE_PREFIXES = ["_ga", "_gid", "_gat"];

// Laadt Google Analytics pas ná toestemming en stopt bij intrekken.
export function AnalyticsLoader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!ANALYTICS_CONFIGURED) return;
    const sync = () => {
      const win = window as unknown as Record<string, unknown>;
      // Alleen op een echt domein tellen; localhost telt nooit mee.
      const real = !["localhost", "127.0.0.1"].includes(window.location.hostname);
      if (real && hasAnalyticsConsent()) {
        win[GA_DISABLE_KEY] = false;
        setLoaded(true);
      } else {
        win[GA_DISABLE_KEY] = true;
        expireCookies(GA_COOKIE_PREFIXES, document, window.location.hostname);
      }
    };
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!loaded) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
