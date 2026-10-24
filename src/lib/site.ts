import type { Metadata } from "next";

// Centrale plek voor domein en bedrijfsgegevens. Het echte domein komt uit
// NEXT_PUBLIC_SITE_URL (zie .env.example); lokaal valt het terug op localhost.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3200";
export const SITE_NAME = "Het Knuffelhuis";

// Indexering staat pas aan als het echte domein is ingesteld én
// NEXT_PUBLIC_ENABLE_INDEXING=true (alleen in de Vercel-productieomgeving).
export const INDEXING_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_INDEXING === "true" && Boolean(process.env.NEXT_PUBLIC_SITE_URL);

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Minimale afname voor knuffels op maat. Eén plek, want dit staat op veel pagina's. */
export const PLUSH_MINIMUM = 500;

// Bedrijfsgegevens. Een leeg veld wordt nergens getoond (dus ook geen
// placeholder op de live site); vul ze in zodra ze bekend zijn.
// TODO: echte gegevens invullen.
export const COMPANY = {
  email: "", // bv. info@hetknuffelhuis.nl
  phoneDisplay: "", // bv. 06 12 34 56 78
  phoneInternational: "", // zonder + of spaties, bv. 31612345678
  kvk: "",
  btwId: "",
  postcodePlaats: "",
  linkedinUrl: "",
  instagramUrl: "",
};

export function whatsappUrl(): string {
  const text = "Hoi Het Knuffelhuis, ik heb een vraag over knuffels op maat.";
  return `https://wa.me/${COMPANY.phoneInternational}?text=${encodeURIComponent(text)}`;
}

/** "Mail ons via …" met het e-mailadres als dat bekend is. */
export const MAIL_FALLBACK = COMPANY.email ? `mail ons via ${COMPANY.email}` : "neem op een andere manier contact met ons op";

export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Het Knuffelhuis: knuffels op maat voor bedrijven en organisaties",
};

/**
 * Bouwt de metadata voor een pagina, inclusief eigen OG/Twitter-data.
 * next/metadata erft openGraph/twitter niet veld-voor-veld van de layout,
 * dus elke pagina zet een compleet blok via deze helper.
 */
export function buildPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "nl_NL",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}
