import {
  DUPLICATE_PENDING_RESPONSE,
  HONEYPOT_FIELD,
  REQUEST_ID_FIELD,
  RATE_LIMIT_RESPONSE,
  claimRequest,
  finishRequest,
  isRateLimited,
  readRequestId,
} from "@/lib/spamGuard";
import { GENERIC_SEND_ERROR, escapeHtml, submitLead } from "@/lib/hubspot";
import { validateSampleInput, type SampleInput } from "@/lib/validation/forms";
import { MAIL_FALLBACK } from "@/lib/site";
import { jsonError, missingTokenResponse } from "../_lib/formSupport";
import { queueSampleConfirmation } from "../_lib/confirmationMail";

// hs_note_body is HTML, geen platte tekst: gebruik <br>/<ul> voor de opmaak.
function formatSampleNote(input: SampleInput): string {
  const e = escapeHtml;
  const parts = [
    "<strong>SAMPLEAANVRAAG KLEDING</strong><br><br>",
    "<strong>Klant</strong><br>",
    `Naam: ${e(input.naam)}<br>`,
    `Bedrijf: ${input.bedrijfsnaam ? e(input.bedrijfsnaam) : "-"}<br>`,
    `E-mail: ${e(input.email)}<br>`,
    `Telefoon: ${input.telefoon ? e(input.telefoon) : "-"}<br><br>`,
    "<strong>Verzendadres</strong><br>",
    `${e(input.straat)}<br>`,
    `${e(input.postcode)} ${e(input.plaats)}<br>`,
    `${e(input.land)}<br><br>`,
    "<strong>Gevraagde samples</strong>",
    `<ul>${input.types.map((t) => `<li>${e(t)}</li>`).join("")}</ul>`,
    `Kwaliteit: ${e(input.kwaliteit)}<br>`,
    `Maten: ${input.maten.length ? e(input.maten.join(", ")) : "-"}`,
  ];
  if (input.opmerkingen) parts.push("<br><br><strong>Opmerkingen</strong><br>", e(input.opmerkingen).replace(/\n/g, "<br>"));
  return parts.join("");
}

export async function POST(request: Request) {
  if (isRateLimited(request)) return RATE_LIMIT_RESPONSE();

  // Een sampleaanvraag is klein (geen bestand); een grote body is nooit legitiem.
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > 64 * 1024) return jsonError("De aanvraag is te groot.", 413);

  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return jsonError("Ongeldige aanvraag.");
    body = parsed as Record<string, unknown>;
  } catch {
    return jsonError("Ongeldige aanvraag.");
  }

  // Honeypot ingevuld: waarschijnlijk een bot. Doe alsof het gelukt is, maar verwerk niets.
  if (String(body[HONEYPOT_FIELD] ?? "").trim()) return Response.json({ ok: true });

  const input = validateSampleInput(body);
  if (!input.ok) return jsonError(input.error);
  const value = input.value;

  const token = process.env.HUBSPOT_PRIVATE_API_TOKEN;
  if (!token) {
    return missingTokenResponse("samples", `De sampleaanvraag kan momenteel niet worden verwerkt. Je kunt ook ${MAIL_FALLBACK}.`);
  }

  // Dubbele verzending (zelfde aanvraag-ID): niet nogmaals naar HubSpot.
  const requestId = readRequestId(body[REQUEST_ID_FIELD]);
  const claim = claimRequest(requestId);
  if (claim.status === "done") return Response.json({ ok: true });
  if (claim.status === "pending") return DUPLICATE_PENDING_RESPONSE();

  const contactProperties: Record<string, string> = { email: value.email, firstname: value.naam };
  if (value.bedrijfsnaam) contactProperties.company = value.bedrijfsnaam;
  if (value.telefoon) contactProperties.phone = value.telefoon;
  contactProperties.address = value.straat;
  contactProperties.city = value.plaats;
  contactProperties.zip = value.postcode;
  contactProperties.country = value.land;

  let result;
  try {
    result = await submitLead({
      token,
      label: "samples",
      contactProperties,
      bedrijfsnaam: value.bedrijfsnaam,
      dealName: value.bedrijfsnaam ? `Sampleaanvraag – ${value.bedrijfsnaam} – ${value.naam}` : `Sampleaanvraag – ${value.naam}`,
      buildNoteBody: () => formatSampleNote(value),
    });
  } catch {
    result = { ok: false as const, status: 502, error: GENERIC_SEND_ERROR };
  }

  finishRequest(requestId, result.ok);
  if (!result.ok) return jsonError(result.error, result.status);
  queueSampleConfirmation(value, requestId);
  return Response.json({ ok: true });
}
