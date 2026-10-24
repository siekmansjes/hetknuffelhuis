// Pure validatiefuncties voor de formulieren (contact, offerte, kleding-sample)
// en uploads. Bewust zonder imports (ook geen `@/`-alias), zodat dit bestand
// zowel in de API-routes als in de browser (client-controle) als onder
// `node --test` gebruikt kan worden.

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

// ---------------------------------------------------------------------------
// Limieten
// ---------------------------------------------------------------------------

export const LIMITS = {
  naam: 100,
  bedrijfsnaam: 150,
  email: 254,
  telefoon: 40,
  bericht: 5000,
  opmerkingen: 2000,
  omschrijving: 3000,
  korteTekst: 120,
  straat: 150,
  postcode: 20,
  plaats: 100,
  land: 80,
  bestandsnaam: 150,
  /** Hoogste aantal dat we als redelijk accepteren. */
  maxQuantity: 10_000_000,
} as const;

// Vercel accepteert max. ~4,5 MB per serverless-aanvraag; 4 MB houdt ruimte voor de overige formuliervelden.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const ALLOWED_UPLOAD_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".pdf", ".ai", ".eps"] as const;
/** Ruimte bovenop het bestand voor de overige multipart-velden; gebruikt als grof plafond op Content-Length. */
export const MAX_REQUEST_BYTES = MAX_UPLOAD_BYTES + 512 * 1024;

export const UPLOAD_ERRORS = {
  empty: "Het geüploade bestand is leeg.",
  tooLarge: "Het bestand is groter dan de maximale 4 MB.",
  type: "Alleen afbeeldingen, pdf-, ai- of eps-bestanden zijn toegestaan.",
  content: "Het bestand lijkt geen geldig bestand van dit type. Controleer het bestand en probeer het opnieuw.",
} as const;

// ---------------------------------------------------------------------------
// Basis: tekst, e-mail, telefoon, aantallen
// ---------------------------------------------------------------------------

// Stuurtekens (behalve nieuwe regel/tab in meerregelige velden) worden vervangen,
// zodat niets onzichtbaars of regelafbrekends in HubSpot-velden terechtkomt.
const CONTROL_CHARS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

export function cleanText(value: unknown, multiline = false): string {
  if (typeof value !== "string") return "";
  let text = value.replace(/\r\n?/g, "\n").replace(CONTROL_CHARS, " ");
  if (!multiline) text = text.replace(/\s+/g, " ");
  return text.trim();
}

const EMAIL_PATTERN = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/;

export function isValidEmail(value: string): boolean {
  if (value.length === 0 || value.length > LIMITS.email) return false;
  if (!EMAIL_PATTERN.test(value)) return false;
  const [local, domain] = value.split("@");
  if (local.length > 64) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  if (domain.startsWith(".") || domain.startsWith("-") || domain.includes("..")) return false;
  return true;
}

type TextRule = { label: string; max: number; required?: boolean; multiline?: boolean };

function readText(input: Record<string, unknown>, key: string, rule: TextRule): Result<string> {
  const text = cleanText(input[key], rule.multiline);
  if (!text) return rule.required ? { ok: false, error: `${rule.label} is verplicht.` } : { ok: true, value: "" };
  if (text.length > rule.max) {
    return { ok: false, error: `${rule.label} is te lang (maximaal ${rule.max} tekens).` };
  }
  return { ok: true, value: text };
}

/**
 * Leest een aantal als positief geheel getal. Leeg = geen aantal opgegeven
 * (toegestaan: het aantal is in het offerteformulier optioneel). Kleinere
 * aantallen dan het productminimum zijn bewust GEEN fout: die zijn volgens de
 * site op aanvraag mogelijk.
 */
export function parseQuantity(value: unknown): Result<number | null> {
  if (value === undefined || value === null) return { ok: true, value: null };
  if (typeof value === "number") {
    if (!Number.isInteger(value) || value < 1) return { ok: false, error: "Vul bij aantal een positief geheel getal in." };
    if (value > LIMITS.maxQuantity) return { ok: false, error: "Het aantal is te hoog. Neem voor grote aantallen contact met ons op." };
    return { ok: true, value };
  }
  if (typeof value !== "string") return { ok: false, error: "Vul bij aantal een positief geheel getal in." };
  const text = value.trim();
  if (text === "") return { ok: true, value: null };
  if (!/^\d{1,9}$/.test(text)) return { ok: false, error: "Vul bij aantal een positief geheel getal in." };
  const quantity = Number(text);
  if (quantity < 1) return { ok: false, error: "Vul bij aantal een positief geheel getal in." };
  if (quantity > LIMITS.maxQuantity) return { ok: false, error: "Het aantal is te hoog. Neem voor grote aantallen contact met ons op." };
  return { ok: true, value: quantity };
}

// ---------------------------------------------------------------------------
// Klantgegevens (gedeeld door alle drie de formulieren)
// ---------------------------------------------------------------------------

export type CustomerFields = {
  naam: string;
  bedrijfsnaam: string;
  email: string;
  telefoon: string;
};

function readCustomer(input: Record<string, unknown>): Result<CustomerFields> {
  const naam = readText(input, "naam", { label: "Naam", max: LIMITS.naam, required: true });
  if (!naam.ok) return naam;
  const email = readText(input, "email", { label: "E-mailadres", max: LIMITS.email, required: true });
  if (!email.ok) return email;
  if (!isValidEmail(email.value)) return { ok: false, error: "Vul een geldig e-mailadres in." };
  const bedrijfsnaam = readText(input, "bedrijfsnaam", { label: "Bedrijfsnaam", max: LIMITS.bedrijfsnaam });
  if (!bedrijfsnaam.ok) return bedrijfsnaam;
  const telefoon = readText(input, "telefoon", { label: "Telefoonnummer", max: LIMITS.telefoon });
  if (!telefoon.ok) return telefoon;
  return {
    ok: true,
    value: { naam: naam.value, bedrijfsnaam: bedrijfsnaam.value, email: email.value, telefoon: telefoon.value },
  };
}

// ---------------------------------------------------------------------------
// Contactformulier
// ---------------------------------------------------------------------------

export type ContactInput = CustomerFields & { bericht: string };

export function validateContactInput(input: Record<string, unknown>): Result<ContactInput> {
  const customer = readCustomer(input);
  if (!customer.ok) return customer;
  const bericht = readText(input, "bericht", { label: "Bericht", max: LIMITS.bericht, required: true, multiline: true });
  if (!bericht.ok) return bericht;
  return { ok: true, value: { ...customer.value, bericht: bericht.value } };
}

// ---------------------------------------------------------------------------
// Offerteaanvraag
// ---------------------------------------------------------------------------

/** Waar de aanvraag over gaat. Eén definitie voor formulier, validatie en mail. */
export const WANTED_OPTIONS = [
  { id: "knuffels", label: "Knuffels op maat" },
  { id: "sleutelhangers", label: "Sleutelhangers" },
  { id: "tijdelijke-tattoos", label: "Tijdelijke tattoo\u2019s" },
  { id: "magneten", label: "Magneten" },
  { id: "petjes", label: "Petjes" },
  { id: "kleding", label: "Kleding" },
] as const;

export type WantedId = (typeof WANTED_OPTIONS)[number]["id"];

function readWanted(raw: unknown): Result<{ id: WantedId; label: string }[]> {
  const list = Array.isArray(raw) ? raw : [];
  const picked: { id: WantedId; label: string }[] = [];
  for (const entry of list) {
    const option = WANTED_OPTIONS.find((o) => o.id === entry);
    if (!option) return { ok: false, error: "Een gekozen onderdeel is ongeldig." };
    if (!picked.some((p) => p.id === option.id)) picked.push({ id: option.id, label: option.label });
  }
  if (picked.length === 0) return { ok: false, error: "Kies minstens \u00e9\u00e9n onderdeel waarvoor je een offerte wilt." };
  return { ok: true, value: picked };
}

export type OfferteInput = CustomerFields & {
  wanted: { id: WantedId; label: string }[];
  aantal: number | null;
  formaat: string;
  leverdatum: string;
  omschrijving: string;
};

export function validateOfferteInput(input: Record<string, unknown>): Result<OfferteInput> {
  const customer = readCustomer(input);
  if (!customer.ok) return customer;
  const wanted = readWanted(input.wanted);
  if (!wanted.ok) return wanted;
  const aantal = parseQuantity(input.aantal);
  if (!aantal.ok) return aantal;
  const formaat = readText(input, "formaat", { label: "Formaat", max: LIMITS.korteTekst });
  if (!formaat.ok) return formaat;
  const leverdatum = readText(input, "leverdatum", { label: "Gewenste levering", max: LIMITS.korteTekst });
  if (!leverdatum.ok) return leverdatum;
  const omschrijving = readText(input, "omschrijving", {
    label: "Omschrijving",
    max: LIMITS.omschrijving,
    required: true,
    multiline: true,
  });
  if (!omschrijving.ok) return omschrijving;
  return {
    ok: true,
    value: {
      ...customer.value,
      wanted: wanted.value,
      aantal: aantal.value,
      formaat: formaat.value,
      leverdatum: leverdatum.value,
      omschrijving: omschrijving.value,
    },
  };
}

// ---------------------------------------------------------------------------
// Kleding-sample (om maat en kwaliteit te kiezen)
// ---------------------------------------------------------------------------

export const SAMPLE_TYPES = [
  { id: "t-shirt", label: "T-shirt" },
  { id: "hoodie", label: "Hoodie" },
  { id: "petje", label: "Petje" },
] as const;

export const SAMPLE_QUALITIES = [
  { id: "standaard", label: "Standaard (comfort)" },
  { id: "premium", label: "Premium" },
  { id: "beide", label: "Beide, om te vergelijken" },
] as const;

export const SAMPLE_SIZES = ["Kindermaten", "XS", "S", "M", "L", "XL", "XXL"] as const;

function pickFrom<T extends { id: string; label: string }>(raw: unknown, options: readonly T[]): T[] | null {
  const list = Array.isArray(raw) ? raw : [];
  const picked: T[] = [];
  for (const entry of list) {
    const option = options.find((o) => o.id === entry);
    if (!option) return null;
    if (!picked.includes(option)) picked.push(option);
  }
  return picked;
}

export type SampleInput = CustomerFields & {
  types: string[];
  kwaliteit: string;
  maten: string[];
  straat: string;
  postcode: string;
  plaats: string;
  land: string;
  opmerkingen: string;
};

export function validateSampleInput(input: Record<string, unknown>): Result<SampleInput> {
  const customer = readCustomer(input);
  if (!customer.ok) return customer;
  const types = pickFrom(input.types, SAMPLE_TYPES);
  if (!types) return { ok: false, error: "Een gekozen kledingstuk is ongeldig." };
  if (types.length === 0) return { ok: false, error: "Kies minstens \u00e9\u00e9n kledingstuk waarvan je een sample wilt zien." };
  const quality = SAMPLE_QUALITIES.find((q) => q.id === input.kwaliteit);
  if (!quality) return { ok: false, error: "Kies welke kwaliteit je wilt zien." };
  const rawSizes = Array.isArray(input.maten) ? input.maten : [];
  const maten = rawSizes.filter((m): m is (typeof SAMPLE_SIZES)[number] => (SAMPLE_SIZES as readonly unknown[]).includes(m));
  if (maten.length !== rawSizes.length) return { ok: false, error: "Een gekozen maat is ongeldig." };
  const straat = readText(input, "straat", { label: "Straat en huisnummer", max: LIMITS.straat, required: true });
  if (!straat.ok) return straat;
  const postcode = readText(input, "postcode", { label: "Postcode", max: LIMITS.postcode, required: true });
  if (!postcode.ok) return postcode;
  const plaats = readText(input, "plaats", { label: "Plaats", max: LIMITS.plaats, required: true });
  if (!plaats.ok) return plaats;
  const land = readText(input, "land", { label: "Land", max: LIMITS.land });
  if (!land.ok) return land;
  const opmerkingen = readText(input, "opmerkingen", { label: "Opmerkingen", max: LIMITS.opmerkingen, multiline: true });
  if (!opmerkingen.ok) return opmerkingen;
  return {
    ok: true,
    value: {
      ...customer.value,
      types: types.map((t) => t.label),
      kwaliteit: quality.label,
      maten: [...new Set(maten)],
      straat: straat.value,
      postcode: postcode.value,
      plaats: plaats.value,
      land: land.value || "Nederland",
      opmerkingen: opmerkingen.value,
    },
  };
}

// ---------------------------------------------------------------------------
// Uploads
// ---------------------------------------------------------------------------

// Op bestandsextensie gevalideerd, niet op MIME-type: browsers/OS'en geven
// .ai/.eps geen betrouwbaar MIME-type mee (vaak application/octet-stream of leeg).
export function validateUploadMeta(file: { name: string; size: number }): { ok: true } | { ok: false; error: string } {
  if (file.size === 0) return { ok: false, error: UPLOAD_ERRORS.empty };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: UPLOAD_ERRORS.tooLarge };
  const name = file.name.toLowerCase();
  if (!ALLOWED_UPLOAD_EXTENSIONS.some((ext) => name.endsWith(ext))) return { ok: false, error: UPLOAD_ERRORS.type };
  return { ok: true };
}

function startsWith(bytes: Uint8Array, signature: readonly number[], offset = 0): boolean {
  return signature.every((byte, index) => bytes[offset + index] === byte);
}

/**
 * Controleert of de eerste bytes passen bij de extensie, voor de formaten met
 * een vaste, stabiele signatuur (png, jpg, gif, webp, pdf). Voor svg, ai en eps
 * (variabele vorm) is dit bewust niet streng: daar blijft de extensiecontrole.
 */
export function validateUploadSignature(name: string, head: Uint8Array): { ok: true } | { ok: false; error: string } {
  const lower = name.toLowerCase();
  const bad = { ok: false as const, error: UPLOAD_ERRORS.content };
  if (lower.endsWith(".png")) return startsWith(head, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) ? { ok: true } : bad;
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return startsWith(head, [0xff, 0xd8, 0xff]) ? { ok: true } : bad;
  if (lower.endsWith(".gif")) {
    return startsWith(head, [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) || startsWith(head, [0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
      ? { ok: true }
      : bad;
  }
  if (lower.endsWith(".webp")) {
    return startsWith(head, [0x52, 0x49, 0x46, 0x46]) && startsWith(head, [0x57, 0x45, 0x42, 0x50], 8) ? { ok: true } : bad;
  }
  if (lower.endsWith(".pdf")) {
    // Sommige pdf's hebben tot 1024 bytes aan voorloopdata; wij lezen alleen de kop, dus zoeken in het gelezen deel.
    const text = String.fromCharCode(...head.slice(0, 1024));
    return text.includes("%PDF-") ? { ok: true } : bad;
  }
  return { ok: true };
}

/** Maakt van een door de bezoeker gekozen bestandsnaam een veilige, korte naam (zonder pad of stuurtekens). */
export function safeFileName(name: string): string {
  const base = cleanText(name).split(/[\\/]/).pop() ?? "";
  const trimmed = base.replace(/[<>"]/g, "_").trim();
  if (trimmed.length <= LIMITS.bestandsnaam) return trimmed || "bestand";
  const dot = trimmed.lastIndexOf(".");
  const ext = dot > 0 && trimmed.length - dot <= 10 ? trimmed.slice(dot) : "";
  return trimmed.slice(0, LIMITS.bestandsnaam - ext.length) + ext;
}
