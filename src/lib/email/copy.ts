// De teksten van de bevestigingsmails, op één plek, zodat ze makkelijk zijn
// aan te passen. De opmaak en de verzending staan in templates.ts en send.ts.
//
// In de tekst kun je gebruiken: {naam}. Zonder RESEND_API_KEY worden er
// geen mails verstuurd (de aanvraag zelf werkt dan gewoon).

import { COMPANY, SITE_URL } from "@/lib/site";

export type EmailKind = "offerte" | "samples" | "contact";

export type EmailCopy = {
  subject: string;
  /** Aanhef, bv. "Hoi {naam},". */
  greeting: string;
  /** Alinea's vóór de samenvatting. */
  intro: string[];
  /** Kop boven de samenvatting van wat de bezoeker invulde. */
  summaryHeading: string;
  /** Alinea's na de samenvatting. */
  outro: string[];
};

export const EMAIL_SIGNOFF = "Met vriendelijke groeten,";

/** De handtekening onder elke mail. Regels met `href` worden een link. */
export const EMAIL_SIGNATURE = {
  // PNG: WebP/SVG worden niet door alle mailprogramma's getoond. Werkt pas voor
  // ontvangers als SITE_URL het echte (publieke) domein is.
  logoUrl: `${SITE_URL}/email/logo.png`,
  logoAlt: "Het Knuffelhuis",
  logoWidth: 140,
  logoHeight: 85,
  lines: [
    { text: "Het Knuffelhuis", bold: true },
    ...(COMPANY.phoneDisplay ? [{ text: COMPANY.phoneDisplay, href: `tel:+${COMPANY.phoneInternational}` }] : []),
    ...(COMPANY.email ? [{ text: COMPANY.email, href: `mailto:${COMPANY.email}` }] : []),
    { text: SITE_URL.replace(/^https?:\/\//, ""), href: SITE_URL },
  ] as { text: string; href?: string; bold?: boolean }[],
};

export const EMAIL_COPY: Record<EmailKind, EmailCopy> = {
  offerte: {
    subject: "We hebben je offerteaanvraag ontvangen",
    greeting: "Hoi {naam},",
    intro: ["Bedankt voor je offerteaanvraag bij Het Knuffelhuis. We hebben hem goed ontvangen en reageren zo snel mogelijk."],
    summaryHeading: "Dit heb je aan ons doorgegeven",
    outro: [
      "We bekijken je aanvraag en nemen contact met je op. Een exacte prijs krijg je in de offerte, op basis van jouw ontwerp en aantallen. Heb je nog geen ontwerp, dan denken we graag met je mee.",
      "Wil je iets aanvullen of klopt er iets niet? Reageer gerust op deze mail.",
    ],
  },
  samples: {
    subject: "We hebben je sampleaanvraag ontvangen",
    greeting: "Hoi {naam},",
    intro: [
      "Bedankt voor je sampleaanvraag bij Het Knuffelhuis. We hebben hem goed ontvangen en nemen contact met je op om de verzending en het retourneren af te stemmen.",
    ],
    summaryHeading: "Dit heb je aan ons doorgegeven",
    outro: ["Klopt het verzendadres niet, of wil je iets aanvullen? Reageer gerust op deze mail."],
  },
  contact: {
    subject: "We hebben je bericht ontvangen",
    greeting: "Hoi {naam},",
    intro: ["Bedankt voor je bericht aan Het Knuffelhuis. We hebben het goed ontvangen en reageren zo snel mogelijk."],
    summaryHeading: "Je bericht",
    outro: ["Wil je nog iets toevoegen? Reageer gerust op deze mail."],
  },
};

/** Labels in de samenvatting van de mail. */
export const SUMMARY_LABELS = {
  wanted: "Gewenst",
  quantity: "Aantal",
  size: "Formaat",
  delivery: "Gewenste levering",
  description: "Omschrijving",
  comments: "Opmerkingen",
  file: "Bestand",
  sample: "Sample",
  sizes: "Maten",
  quality: "Kwaliteit",
  address: "Verzendadres",
} as const;
