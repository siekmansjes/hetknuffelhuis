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
import { validateContactInput } from "@/lib/validation/forms";
import { MAIL_FALLBACK } from "@/lib/site";
import { attachmentNote, jsonError, missingTokenResponse, okResponse, readUpload, requestTooLarge } from "../_lib/formSupport";
import { queueContactConfirmation } from "../_lib/confirmationMail";

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

  const input = validateContactInput({
    naam: form.get("naam"),
    email: form.get("email"),
    bedrijfsnaam: form.get("bedrijfsnaam"),
    telefoon: form.get("telefoon"),
    bericht: form.get("bericht"),
  });
  if (!input.ok) return jsonError(input.error);
  const { naam, email, bedrijfsnaam, telefoon, bericht } = input.value;

  const upload = await readUpload(form, "logo");
  if (!upload.ok) return jsonError(upload.error);
  const logo = upload.file;

  const token = process.env.HUBSPOT_PRIVATE_API_TOKEN;
  if (!token) return missingTokenResponse("contact", `Het formulier kan momenteel niet worden verwerkt. Je kunt ook ${MAIL_FALLBACK}.`);

  // Dubbele verzending (zelfde aanvraag-ID): niet nogmaals naar HubSpot.
  const requestId = readRequestId(form.get(REQUEST_ID_FIELD));
  const claim = claimRequest(requestId);
  if (claim.status === "done") return Response.json({ ok: true });
  if (claim.status === "pending") return DUPLICATE_PENDING_RESPONSE();

  // Alleen ingevulde velden meesturen, zodat een update van een bestaand
  // contact geen al ingevulde velden in HubSpot leegtrekt.
  const contactProperties: Record<string, string> = { email, firstname: naam };
  if (bedrijfsnaam) contactProperties.company = bedrijfsnaam;
  if (telefoon) contactProperties.phone = telefoon;

  let result;
  try {
    // Een bericht is net zo goed een lead als een offerteaanvraag: eigen deal.
    result = await submitLead({
      token,
      label: "contact",
      contactProperties,
      bedrijfsnaam,
      dealName: `Bericht – ${naam}`,
      file: logo,
      buildNoteBody: (attachment) => {
        const parts = [
          `<strong>Bericht via het contactformulier op de website</strong><br><br>${escapeHtml(bericht).replace(/\n/g, "<br>")}`,
        ];
        const bijlage = attachmentNote(logo, attachment);
        if (bijlage) parts.push(`<br><br><strong>Bijgevoegd bestand</strong><br>${escapeHtml(bijlage)}`);
        return parts.join("");
      },
    });
  } catch {
    result = { ok: false as const, status: 502, error: GENERIC_SEND_ERROR };
  }

  finishRequest(requestId, result.ok);
  if (!result.ok) return jsonError(result.error, result.status);
  queueContactConfirmation({ naam, email }, bericht, logo?.name, requestId);
  return okResponse(result.attachment);
}
