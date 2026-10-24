// Verstuurt de bevestigingsmail via Resend (HTTP-API, geen extra pakket).
// Zonder RESEND_API_KEY doet dit niets: de aanvraag zelf blijft altijd werken.
//
// Logging: nooit e-mailadressen, namen of inhoud; alleen de uitkomst en de
// HTTP-status.

import { COMPANY, SITE_NAME } from "@/lib/site";
import type { Confirmation } from "./templates";

const RESEND_URL = "https://api.resend.com/emails";
const SEND_TIMEOUT_MS = 8000;

export const EMAIL_FROM = `${SITE_NAME} <${COMPANY.email}>`;
export const EMAIL_REPLY_TO = COMPANY.email;

export type SendResult = { sent: true } | { sent: false; reason: "niet-geconfigureerd" | "mislukt" };

export async function sendConfirmationEmail(opts: {
  to: string;
  confirmation: Confirmation;
  /** Het aanvraag-ID van de browser, zodat een herhaald verzoek geen tweede mail geeft. */
  idempotencyKey?: string;
  apiKey?: string;
  fetchImpl?: typeof fetch;
}): Promise<SendResult> {
  const apiKey = opts.apiKey ?? process.env.RESEND_API_KEY;
  // Zonder API-sleutel of zonder bekend afzenderadres verzenden we niets.
  if (!apiKey || !COMPANY.email) return { sent: false, reason: "niet-geconfigureerd" };

  const doFetch = opts.fetchImpl ?? fetch;
  try {
    const res = await doFetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(opts.idempotencyKey ? { "Idempotency-Key": `bevestiging-${opts.idempotencyKey}` } : {}),
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [opts.to],
        reply_to: EMAIL_REPLY_TO,
        subject: opts.confirmation.subject,
        text: opts.confirmation.text,
        html: opts.confirmation.html,
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`Bevestigingsmail mislukt: Resend-status ${res.status}`);
      return { sent: false, reason: "mislukt" };
    }
    return { sent: true };
  } catch (err) {
    console.error(`Bevestigingsmail gooide een fout: ${err instanceof Error ? err.name : "onbekende fout"}`);
    return { sent: false, reason: "mislukt" };
  }
}
