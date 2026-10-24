import {
  MAX_REQUEST_BYTES,
  UPLOAD_ERRORS,
  safeFileName,
  validateUploadMeta,
  validateUploadSignature,
} from "@/lib/validation/forms";
import { type AttachmentStatus } from "@/lib/hubspot";

export function jsonError(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

/** Grove bovengrens op de aanvraaggrootte, vóórdat de body wordt ingelezen. */
export function requestTooLarge(request: Request): Response | null {
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > MAX_REQUEST_BYTES) return jsonError(UPLOAD_ERRORS.tooLarge, 413);
  return null;
}

/**
 * Leest en valideert een optioneel geüpload bestand (grootte, extensie en
 * bestandskop). Geeft een bestand met opgeschoonde naam terug.
 */
export async function readUpload(
  form: FormData,
  field: string
): Promise<{ ok: true; file?: File } | { ok: false; error: string }> {
  const entry = form.get(field);
  if (!(entry instanceof File) || entry.size === 0) return { ok: true };
  const meta = validateUploadMeta(entry);
  if (!meta.ok) return meta;
  try {
    const head = new Uint8Array(await entry.slice(0, 1024).arrayBuffer());
    const signature = validateUploadSignature(entry.name, head);
    if (!signature.ok) return signature;
  } catch {
    return { ok: false, error: "Het bestand kon niet worden gelezen. Probeer het opnieuw." };
  }
  return { ok: true, file: new File([entry], safeFileName(entry.name), { type: entry.type }) };
}

export function attachmentNote(file: File | undefined, status: AttachmentStatus): string | null {
  if (!file) return null;
  const name = file.name;
  return status === "failed" ? `${name} (uploaden naar HubSpot mislukt: vraag het bestand opnieuw op bij de klant)` : name;
}

export function okResponse(attachment: AttachmentStatus) {
  return Response.json(attachment === "failed" ? { ok: true, attachment: "failed" } : { ok: true });
}

/**
 * Zonder HubSpot-token kan een aanvraag niet worden opgeslagen. In productie is
 * dat een fout; tijdens lokaal ontwikkelen laten we het formulier gewoon slagen
 * (zonder iets te loggen van de inhoud), zodat de hele flow te testen is.
 */
export function missingTokenResponse(label: string, failMessage: string): Response {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[dev] ${label}-aanvraag gevalideerd, niet opgeslagen: HUBSPOT_PRIVATE_API_TOKEN ontbreekt.`);
    return Response.json({ ok: true });
  }
  console.error("HUBSPOT_PRIVATE_API_TOKEN ontbreekt in de serveromgeving.");
  return jsonError(failMessage, 500);
}
