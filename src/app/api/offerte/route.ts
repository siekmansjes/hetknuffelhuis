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
import { validateOfferteInput, type OfferteInput } from "@/lib/validation/forms";
import { MAIL_FALLBACK } from "@/lib/site";
import { attachmentNote, jsonError, missingTokenResponse, okResponse, readUpload, requestTooLarge } from "../_lib/formSupport";
import { queueOfferteConfirmation } from "../_lib/confirmationMail";

// hs_note_body is HTML, geen platte tekst: newlines worden genegeerd, dus
// gebruiken we zelf <br>/<ul> voor de opmaak.
function formatOfferteNote(input: OfferteInput, logoNote?: string | null): string {
  const e = escapeHtml;
  const parts = [
    "<strong>OFFERTEAANVRAAG</strong><br><br>",
    "<strong>Klant</strong><br>",
    `Naam: ${e(input.naam)}<br>`,
    `Bedrijf: ${input.bedrijfsnaam ? e(input.bedrijfsnaam) : "-"}<br>`,
    `E-mail: ${e(input.email)}<br>`,
    `Telefoon: ${input.telefoon ? e(input.telefoon) : "-"}<br><br>`,
    "<strong>Aanvraag</strong>",
    `<ul>${input.wanted.map((w) => `<li>${e(w.label)}</li>`).join("")}</ul>`,
    `Aantal: ${input.aantal ?? "-"}<br>`,
    `Formaat: ${input.formaat ? e(input.formaat) : "-"}<br>`,
    `Gewenste levering: ${input.leverdatum ? e(input.leverdatum) : "-"}<br><br>`,
    "<strong>Omschrijving</strong><br>",
    e(input.omschrijving).replace(/\n/g, "<br>"),
  ];
  if (logoNote) parts.push("<br><br><strong>Bestand</strong><br>", e(logoNote));
  return parts.join("");
}

function buildDealName(naam: string, bedrijfsnaam: string): string {
  return bedrijfsnaam ? `Offerteaanvraag – ${bedrijfsnaam} – ${naam}` : `Offerteaanvraag – ${naam}`;
}

export async function POST(request: Request) {
  if (isRateLimited(request)) return RATE_LIMIT_RESPONSE();

  const tooLarge = requestTooLarge(request);
  if (tooLarge) return tooLarge;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError("Ongeldige aanvraag.");
  }

  // Honeypot ingevuld: waarschijnlijk een bot. Doe alsof het gelukt is, maar verwerk niets.
  if (String(form.get(HONEYPOT_FIELD) ?? "").trim()) return Response.json({ ok: true });

  const input = validateOfferteInput({
    naam: form.get("naam"),
    email: form.get("email"),
    bedrijfsnaam: form.get("bedrijfsnaam"),
    telefoon: form.get("telefoon"),
    wanted: form.getAll("wanted"),
    aantal: form.get("aantal"),
    formaat: form.get("formaat"),
    leverdatum: form.get("leverdatum"),
    omschrijving: form.get("omschrijving"),
  });
  if (!input.ok) return jsonError(input.error);
  const value = input.value;

  const upload = await readUpload(form, "logo");
  if (!upload.ok) return jsonError(upload.error);
  const logo = upload.file;

  const token = process.env.HUBSPOT_PRIVATE_API_TOKEN;
  if (!token) {
    return missingTokenResponse("offerte", `De offerteaanvraag kan momenteel niet worden verwerkt. Je kunt ook ${MAIL_FALLBACK}.`);
  }

  // Dubbele verzending (zelfde aanvraag-ID): niet nogmaals naar HubSpot.
  const requestId = readRequestId(form.get(REQUEST_ID_FIELD));
  const claim = claimRequest(requestId);
  if (claim.status === "done") return Response.json({ ok: true });
  if (claim.status === "pending") return DUPLICATE_PENDING_RESPONSE();

  const contactProperties: Record<string, string> = { email: value.email, firstname: value.naam };
  if (value.bedrijfsnaam) contactProperties.company = value.bedrijfsnaam;
  if (value.telefoon) contactProperties.phone = value.telefoon;

  let result;
  try {
    result = await submitLead({
      token,
      label: "offerte",
      contactProperties,
      bedrijfsnaam: value.bedrijfsnaam,
      dealName: buildDealName(value.naam, value.bedrijfsnaam),
      file: logo,
      buildNoteBody: (attachment) => formatOfferteNote(value, attachmentNote(logo, attachment)),
    });
  } catch {
    result = { ok: false as const, status: 502, error: GENERIC_SEND_ERROR };
  }

  finishRequest(requestId, result.ok);
  if (!result.ok) return jsonError(result.error, result.status);
  queueOfferteConfirmation(value, logo?.name, requestId);
  return okResponse(result.attachment);
}
