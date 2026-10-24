// Gedeelde HubSpot-verwerking voor de formulier-API's (contact, offerte,
// samples).
//
// Kern van een aanvraag (moet slagen, anders krijgt de bezoeker een fout):
//   contact (upsert op e-mail) + deal.
// Best-effort (mag falen zonder de aanvraag te breken): bedrijf, associaties,
// bijlage-upload en notitie.
//
// Logging: nooit formulierinhoud, e-mailadressen, adressen, bestandsnamen of
// HubSpot-antwoordteksten (die kunnen ingevoerde waarden bevatten). Alleen
// een label, de HTTP-status en eventueel HubSpot's foutcategorie.

import { MAIL_FALLBACK } from "@/lib/site";

const HUBSPOT_API_BASE = "https://api.hubapi.com";

// Pipeline, fase en eigenaar van nieuwe deals komen uit de omgeving, zodat
// Het Knuffelhuis niet per ongeluk in de Parkmade-pipeline terechtkomt.
// Zonder HUBSPOT_DEAL_STAGE_ID gebruikt HubSpot de standaard-pipeline; een
// deal moet echter een fase hebben, dus zet die altijd in de omgeving.
const DEAL_PIPELINE_ID = process.env.HUBSPOT_DEAL_PIPELINE_ID || "default";
const DEAL_FIRST_STAGE_ID = process.env.HUBSPOT_DEAL_STAGE_ID || "appointmentscheduled";
const DEAL_OWNER_ID = process.env.HUBSPOT_DEAL_OWNER_ID || "";

const CRM_TIMEOUT_MS = 8000;
const UPLOAD_TIMEOUT_MS = 12000;

export const GENERIC_SEND_ERROR = `Versturen is niet gelukt, probeer het later opnieuw of ${MAIL_FALLBACK}.`;

/** Status van de (optionele) bijlage na verwerking. */
export type AttachmentStatus = "none" | "saved" | "failed";

export type LeadResult =
  | { ok: true; attachment: AttachmentStatus }
  | { ok: false; status: number; error: string };

function hubspotHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function errorSummary(err: unknown): string {
  return err instanceof Error ? err.name : "onbekende fout";
}

async function logHubspotFailure(label: string, res: Response): Promise<void> {
  let category = "";
  try {
    const data = await res.json();
    if (typeof data?.category === "string") category = ` (${data.category})`;
  } catch {
    // Geen leesbare foutbody: alleen de status loggen.
  }
  console.error(`${label} mislukt: HubSpot-status ${res.status}${category}`);
}

function hubspotFetch(token: string, path: string, init: { method: string; body?: string }, timeoutMs = CRM_TIMEOUT_MS) {
  return fetch(`${HUBSPOT_API_BASE}${path}`, {
    method: init.method,
    headers: hubspotHeaders(token),
    body: init.body,
    signal: AbortSignal.timeout(timeoutMs),
  });
}

// Koppelt twee objecten via HubSpot's default-associatie, zodat we geen
// specifieke associationTypeId hoeven te gokken/onderhouden. Best-effort.
async function associateDefault(
  token: string,
  fromType: string,
  fromId: string,
  toType: string,
  toId: string,
  label: string
): Promise<void> {
  try {
    const res = await hubspotFetch(token, `/crm/v4/objects/${fromType}/${fromId}/associations/default/${toType}/${toId}`, {
      method: "PUT",
    });
    if (!res.ok) await logHubspotFailure(`Associatie (${label})`, res);
  } catch (err) {
    console.error(`Associatie (${label}) gooide een fout: ${errorSummary(err)}`);
  }
}

// Bedrijf opzoeken op exacte naam, en aanmaken als het nog niet bestaat.
// Company heeft geen ingebouwd uniek sleutelveld zoals email bij Contact
// (alleen domain is dat, en dat vragen we niet uit), dus dit is een
// zoek-dan-aanmaken in plaats van een echte upsert.
async function findOrCreateCompany(token: string, bedrijfsnaam: string): Promise<string | undefined> {
  const searchRes = await hubspotFetch(token, "/crm/v3/objects/companies/search", {
    method: "POST",
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: "name", operator: "EQ", value: bedrijfsnaam }] }],
      properties: ["name"],
      limit: 1,
    }),
  });

  if (!searchRes.ok) {
    await logHubspotFailure("Company-zoekopdracht", searchRes);
    return undefined;
  }

  const searchData = await searchRes.json();
  const existingId: string | undefined = searchData?.results?.[0]?.id;
  if (existingId) return existingId;

  const createRes = await hubspotFetch(token, "/crm/v3/objects/companies", {
    method: "POST",
    body: JSON.stringify({ properties: { name: bedrijfsnaam } }),
  });

  if (!createRes.ok) {
    await logHubspotFailure("Company aanmaken", createRes);
    return undefined;
  }

  const createData = await createRes.json();
  return createData?.id;
}

/**
 * Uploadt een door de klant aangeleverd bestand (logo, ontwerp) naar
 * HubSpot's Files API en geeft het file-ID terug (of `undefined` bij falen).
 * `PRIVATE` toegang: niet publiek/raadbaar via URL, alleen zichtbaar voor wie
 * in HubSpot is ingelogd — passend voor klantbestanden die niet voor iedereen
 * bedoeld zijn. Zelfde bewezen patroon als eerder gebouwd voor Merchmark.
 */
export async function uploadFile(token: string, file: File): Promise<string | undefined> {
  const form = new FormData();
  form.append("file", file, file.name);
  form.append("options", JSON.stringify({ access: "PRIVATE" }));
  form.append("folderPath", "/knuffelhuis-aanvragen");

  const res = await fetch(`${HUBSPOT_API_BASE}/files/v3/files`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
    signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
  });

  if (!res.ok) {
    await logHubspotFailure("Bestand uploaden", res);
    return undefined;
  }

  const data = await res.json();
  return typeof data?.id === "string" || typeof data?.id === "number" ? String(data.id) : undefined;
}

export type LeadInput = {
  token: string;
  /** Alleen voor logregels, bijv. "contact", "offerte" of "samples". */
  label: string;
  /** Contacteigenschappen (HubSpot-propertynamen); moet `email` bevatten. Alleen ingevulde velden meesturen. */
  contactProperties: Record<string, string>;
  bedrijfsnaam: string;
  dealName: string;
  /** Optionele bijlage; reeds gevalideerd door de aanroeper. */
  file?: File;
  /** Bouwt de notitietekst (HTML); krijgt de uitkomst van de bijlage-upload mee. */
  buildNoteBody: (attachment: AttachmentStatus) => string;
};

/**
 * Verwerkt één aanvraag in HubSpot: contact + deal (kern), daarna
 * best-effort bedrijf, associaties, bijlage en notitie. Alleen als contact én
 * deal zijn aangemaakt is het resultaat `ok`.
 */
export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const { token, label, contactProperties, bedrijfsnaam, dealName, file, buildNoteBody } = input;
  const failure: LeadResult = { ok: false, status: 502, error: GENERIC_SEND_ERROR };

  // 1. Contact (kern).
  let contactId: string | undefined;
  try {
    const upsertRes = await hubspotFetch(token, "/crm/v3/objects/contacts/batch/upsert", {
      method: "POST",
      body: JSON.stringify({
        inputs: [{ idProperty: "email", id: contactProperties.email, properties: contactProperties }],
      }),
    });
    if (!upsertRes.ok) {
      await logHubspotFailure(`Contact-upsert (${label})`, upsertRes);
      return failure;
    }
    const upsertData = await upsertRes.json();
    contactId = upsertData?.results?.[0]?.id;
  } catch (err) {
    console.error(`Contact-upsert (${label}) gooide een fout: ${errorSummary(err)}`);
    return failure;
  }

  // 2. Bedrijf (best-effort): het contact staat al goed, met bedrijfsnaam als tekstveld.
  let companyId: string | undefined;
  if (contactId && bedrijfsnaam) {
    try {
      companyId = await findOrCreateCompany(token, bedrijfsnaam);
      if (companyId) await associateDefault(token, "contacts", contactId, "companies", companyId, "contact-company");
    } catch (err) {
      console.error(`Bedrijf aanmaken/koppelen (${label}) gooide een fout: ${errorSummary(err)}`);
    }
  }

  // 3. Deal (kern): één nieuwe aanvraag in de verkooppipeline, altijd in de eerste fase.
  let dealId: string | undefined;
  try {
    const dealRes = await hubspotFetch(token, "/crm/v3/objects/deals", {
      method: "POST",
      body: JSON.stringify({
        properties: {
          dealname: dealName,
          pipeline: DEAL_PIPELINE_ID,
          dealstage: DEAL_FIRST_STAGE_ID,
          ...(DEAL_OWNER_ID ? { hubspot_owner_id: DEAL_OWNER_ID } : {}),
        },
      }),
    });
    if (!dealRes.ok) {
      await logHubspotFailure(`Deal aanmaken (${label})`, dealRes);
      return failure;
    }
    const dealData = await dealRes.json();
    dealId = dealData?.id;
  } catch (err) {
    console.error(`Deal aanmaken (${label}) gooide een fout: ${errorSummary(err)}`);
    return failure;
  }

  if (dealId && contactId) await associateDefault(token, "deals", dealId, "contacts", contactId, "deal-contact");
  if (dealId && companyId) await associateDefault(token, "deals", dealId, "companies", companyId, "deal-company");

  // 4. Bijlage (best-effort): eerst uploaden, zodat het file-ID als bijlage op de notitie kan.
  let attachment: AttachmentStatus = "none";
  let attachmentId: string | undefined;
  if (file) {
    try {
      attachmentId = await uploadFile(token, file);
    } catch (err) {
      console.error(`Bestand uploaden (${label}) gooide een fout: ${errorSummary(err)}`);
    }
    attachment = attachmentId ? "saved" : "failed";
  }

  // 5. Notitie met de volledige aanvraag aan de deal (best-effort).
  if (dealId) {
    try {
      const noteProperties: Record<string, string> = {
        hs_note_body: buildNoteBody(attachment),
        hs_timestamp: Date.now().toString(),
      };
      if (attachmentId) noteProperties.hs_attachment_ids = attachmentId;

      const noteRes = await hubspotFetch(token, "/crm/v3/objects/notes", {
        method: "POST",
        body: JSON.stringify({ properties: noteProperties }),
      });
      if (!noteRes.ok) {
        await logHubspotFailure(`Notitie aanmaken (${label})`, noteRes);
      } else {
        const noteData = await noteRes.json();
        const noteId = noteData?.id;
        if (noteId) await associateDefault(token, "notes", noteId, "deals", dealId, "note-deal");
      }
    } catch (err) {
      console.error(`Notitie toevoegen (${label}) gooide een fout: ${errorSummary(err)}`);
    }
  }

  return { ok: true, attachment };
}

export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
