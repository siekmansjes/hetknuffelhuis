// Simpele, lokale cookie-toestemming: geen consent-management-platform, alleen
// een keuze in localStorage die bepaalt of Google Analytics geladen mag worden.
// Zolang er geen NEXT_PUBLIC_GA_MEASUREMENT_ID is ingesteld, laadt de site
// geen enkele tracker en verschijnt er ook geen cookiemelding.
//
// Dit bestand mag zonder `window` geïmporteerd worden; alle browsertoegang is
// afgeschermd.

export const CONSENT_STORAGE_KEY = "knuffelhuis:cookie-consent:v1";
export const CONSENT_EVENT = "knuffelhuis:consent-changed";
export const OPEN_SETTINGS_EVENT = "knuffelhuis:open-cookie-settings";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const GA_DISABLE_KEY = `ga-disable-${GA_MEASUREMENT_ID}`;
export const ANALYTICS_CONFIGURED = GA_MEASUREMENT_ID.length > 0;

export type ConsentChoice = "accepted" | "declined";

export function parseConsent(raw: string | null | undefined): ConsentChoice | null {
  return raw === "accepted" || raw === "declined" ? raw : null;
}

// Als localStorage niet beschikbaar is (geblokkeerd/privémodus) geldt de keuze
// alleen voor dit bezoek, via dit geheugen.
let memoryValue: string | null = null;

function getStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function getConsent(): ConsentChoice | null {
  let raw: string | null = null;
  try {
    raw = getStorage()?.getItem(CONSENT_STORAGE_KEY) ?? null;
  } catch {
    raw = null;
  }
  return parseConsent(raw ?? memoryValue);
}

export function setConsent(choice: ConsentChoice) {
  try {
    const storage = getStorage();
    if (!storage) throw new Error("geen opslag");
    storage.setItem(CONSENT_STORAGE_KEY, choice);
    memoryValue = null;
  } catch {
    memoryValue = choice;
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function hasAnalyticsConsent(): boolean {
  return ANALYTICS_CONFIGURED && getConsent() === "accepted";
}

/**
 * Verwijdert cookies waarvan de naam met een van de prefixen begint, voor het
 * huidige host en alle bovenliggende domeinen (GA zet zijn cookie meestal op
 * het hoogste domein).
 */
export function expireCookies(prefixes: string[], doc: { cookie: string }, hostname: string): string[] {
  const names = doc.cookie
    .split(";")
    .map((part) => part.split("=")[0].trim())
    .filter((name) => name && prefixes.some((prefix) => name.startsWith(prefix)));
  if (names.length === 0) return [];

  const labels = hostname.split(".");
  const isIp = /^[\d.]+$/.test(hostname) || hostname.includes(":");
  const domains: (string | null)[] = [null];
  if (!isIp && labels.length >= 2) {
    for (let i = 0; i <= labels.length - 2; i++) domains.push(labels.slice(i).join("."));
  }

  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; path=/";
  for (const name of names) {
    for (const domain of domains) {
      doc.cookie = `${name}=; ${expired}${domain ? `; domain=${domain}` : ""}`;
    }
  }
  return names;
}
