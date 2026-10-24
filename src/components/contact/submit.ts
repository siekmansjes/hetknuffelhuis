import { MAIL_FALLBACK } from "@/lib/site";

export const FALLBACK_ERROR = `Versturen is niet gelukt, probeer het later opnieuw of ${MAIL_FALLBACK}.`;
export const NETWORK_ERROR = "We kregen geen verbinding met de server. Controleer je internetverbinding en probeer het opnieuw.";
export const RATE_LIMIT_ERROR = "Je hebt te vaak verstuurd. Probeer het over een paar minuten opnieuw.";

export type SubmitOutcome = { ok: true; attachmentFailed: boolean } | { ok: false; error: string };

/** Een willekeurig aanvraag-ID, door de server gebruikt om dubbele verzending te herkennen. */
export function newRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Verstuurt een formulier naar een API-route en geeft een begrijpelijke uitkomst
 * terug. Succes geldt alleen bij een 2xx-antwoord met `ok: true`; netwerkfouten
 * en time-outs krijgen een eigen melding in plaats van de technische browsertekst.
 */
export async function postRequest(url: string, init: RequestInit): Promise<SubmitOutcome> {
  try {
    const res = await fetch(url, {
      ...init,
      signal: typeof AbortSignal !== "undefined" && "timeout" in AbortSignal ? AbortSignal.timeout(45000) : undefined,
    });
    const data = await res.json().catch(() => null);
    // Ook een 429 van het hostingplatform (geen JSON) krijgt de duidelijke melding.
    if (res.status === 429) return { ok: false, error: RATE_LIMIT_ERROR };
    if (!res.ok || data?.ok !== true) {
      return { ok: false, error: typeof data?.error === "string" && data.error ? data.error : FALLBACK_ERROR };
    }
    return { ok: true, attachmentFailed: data.attachment === "failed" };
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }
}
