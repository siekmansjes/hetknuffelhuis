import type { Metadata, Viewport } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CookieNotice } from "@/components/CookieNotice";
import { AnalyticsLoader } from "@/components/AnalyticsLoader";
import { JsonLd } from "@/components/JsonLd";
import { COMPANY, INDEXING_ENABLED, ORGANIZATION_ID, PLUSH_MINIMUM, SITE_NAME, SITE_URL, WEBSITE_ID, buildPageMetadata } from "@/lib/site";
import "./globals.css";

// Koppen: Outfit, een ronde, geometrische sans met rustige letters (f en ff
// zijn gewoon). Tekst: DM Sans, rustig en goed leesbaar.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const TITLE = "Knuffels op maat voor bedrijven en organisaties | Het Knuffelhuis";
const DESCRIPTION = `Het Knuffelhuis maakt knuffels op maat voor bedrijven, organisaties en merken, vanaf ${PLUSH_MINIMUM} stuks. Met sleutelhangers, tijdelijke tattoo’s, magneten, petjes en kleding in dezelfde stijl.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildPageMetadata({ title: TITLE, description: DESCRIPTION, path: "/" }),
  title: { default: TITLE, template: "%s | Het Knuffelhuis" },
  // Zolang het echte domein niet is ingesteld blijft de site uit Google.
  robots: INDEXING_ENABLED ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fdfcf9",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      description: `${SITE_NAME} maakt knuffels op maat voor bedrijven en organisaties, vanaf ${PLUSH_MINIMUM} stuks, en levert daarnaast sleutelhangers, tijdelijke tattoo’s, magneten, petjes en kleding.`,
      ...(COMPANY.email ? { email: COMPANY.email } : {}),
      ...(COMPANY.phoneInternational ? { telephone: `+${COMPANY.phoneInternational}` } : {}),
      ...(COMPANY.kvk ? { identifier: { "@type": "PropertyValue", propertyID: "KvK", value: COMPANY.kvk } } : {}),
      sameAs: [COMPANY.linkedinUrl, COMPANY.instagramUrl].filter(Boolean),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "nl-NL",
      publisher: { "@id": ORGANIZATION_ID },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${outfit.variable} ${dmSans.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Naar de inhoud
        </a>
        <JsonLd data={organizationJsonLd} />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <CookieNotice />
        <AnalyticsLoader />
      </body>
    </html>
  );
}
