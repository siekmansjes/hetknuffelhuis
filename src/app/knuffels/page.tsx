import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBlock } from "@/components/CtaBlock";
import { JsonLd } from "@/components/JsonLd";
import { CaseCard } from "@/components/CaseCard";
import { PhotoSlot } from "@/components/PhotoSlot";
import { cases } from "@/lib/cases";
import { PLUSH_MINIMUM, SITE_NAME, SITE_URL, buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Knuffels op maat laten maken",
  description: `Laat een knuffel op maat maken van jouw merk of eigen ontwerp, vanaf ${PLUSH_MINIMUM} stuks. Eigen vorm, kleur en materiaal, met borduurwerk, label en hangtag naar eigen ontwerp.`,
  path: "/knuffels",
});

const OPTIONS = [
  { title: "Vorm en formaat", text: "We bouwen jouw karakter of ontwerp na, tot in het kleinste detail. Het formaat bepaal je zelf." },
  { title: "Kleur en materiaal", text: "Meestal soft velboa of pluche. We kiezen samen de stof en kleuren die bij het karakter passen." },
  { title: "Details en borduurwerk", text: "Gezichten, logo’s en andere details worden geborduurd, zodat ze scherp blijven en goed tegen knuffelen kunnen." },
  { title: "Label en hangtag", text: "Compleet afgewerkt met een waslabel en een hangtag naar jouw eigen ontwerp." },
];

export default function KnuffelsPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Knuffels op maat",
          provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          serviceType: "Knuffels op maat voor bedrijven en organisaties",
          description: `Knuffels volledig naar eigen ontwerp, vanaf ${PLUSH_MINIMUM} stuks.`,
          areaServed: "NL",
        }}
      />
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Knuffels" }]} />
          <h1>
            Jouw merk, <em>zacht</em> en stevig afgewerkt
          </h1>
          <p className="lead">
            We maken knuffels naar jouw eigen ontwerp: vorm, kleur en materiaal volledig naar wens. Voor bedrijven, organisaties en merken, vanaf {PLUSH_MINIMUM} stuks.
          </p>
          <div className="cta-row">
            <Link href="/contact?mode=offerte" className="btn btn-primary">
              Vraag een offerte aan
            </Link>
            <Link href="/cases" className="btn btn-secondary">
              Bekijk onze cases
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap split">
          <div className="split-copy">
            <h2>
              Alles aan je knuffel is <em>jouw keuze</em>
            </h2>
            <ul className="detail-list">
              {OPTIONS.map((option) => (
                <li key={option.title}>
                  <strong>{option.title}</strong>
                  <span>{option.text}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* TODO: IMAGE ASSET NEEDED — tijdelijk voorbeeldbeeld (met Parkmade-logo); vervangen door een eigen foto van één knuffel op een lichte achtergrond. */}
          <PhotoSlot
            src="/beeld/knuffel-groen-voorbeeld.webp"
            alt="Groene pluche knuffel met gele details (voorbeeldbeeld)"
            ratio="1-1"
            wanted="Eén knuffel vrijgesteld op een lichte achtergrond, schuin van voren"
            sizes="(max-width: 900px) 100vw, 560px"
          />
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="specs-title">
        <div className="wrap two-col">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <h2 id="specs-title">
              De <em>specificaties</em>
            </h2>
            <p>Elke knuffel is anders; dit zijn de kaders waarbinnen we werken.</p>
          </div>
          <table className="spec-table">
            <tbody>
              <tr>
                <th scope="row">Minimale afname</th>
                <td>{PLUSH_MINIMUM} stuks</td>
              </tr>
              <tr>
                <th scope="row">Materiaal</th>
                <td>Op maat, meestal soft velboa of pluche met geborduurde details</td>
              </tr>
              <tr>
                <th scope="row">Afmeting</th>
                <td>Op maat</td>
              </tr>
              <tr>
                <th scope="row">Afwerking</th>
                <td>Waslabel en hangtag naar eigen ontwerp</td>
              </tr>
              <tr>
                <th scope="row">Veiligheid</th>
                <td>Getest volgens de geldende EU-normen, veilig voor alle leeftijden</td>
              </tr>
              <tr>
                <th scope="row">Levertijd</th>
                <td>In overleg, afhankelijk van ontwerp en aantal</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" aria-labelledby="proof-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="proof-title">
              Zo zien <em>recente projecten</em> eruit
            </h2>
          </div>
          <div className="cases-grid">
            {cases.map((item) => (
              <CaseCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
