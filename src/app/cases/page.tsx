import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CaseCard } from "@/components/CaseCard";
import { CtaBlock } from "@/components/CtaBlock";
import { cases } from "@/lib/cases";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Cases: onze laatste knuffelprojecten",
  description: "Bekijk drie recente knuffelprojecten van Het Knuffelhuis, met de details die het verschil maken: borduurwerk, label, materiaal en verpakking.",
  path: "/cases",
});

export default function CasesPage() {
  const hasExample = cases.some((c) => c.isExample);
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Cases" }]} />
          <span className="eyebrow">Cases</span>
          <h1>
            Onze laatste drie <em>knuffelprojecten</em>
          </h1>
          <p className="lead">Van eerste schets tot de laatste doos. Per project laten we zien wat er is gemaakt en welke details daarbij horen.</p>
          {hasExample && (
            <p className="placeholder-note">Voorbeeldinhoud: de teksten en fotovakken worden vervangen door de echte projecten.</p>
          )}
        </div>
      </section>
      <section className="section section--tight">
        <div className="wrap">
          <div className="cases-grid--wide">
            {cases.map((item, i) => (
              <CaseCard key={item.slug} item={item} large={false} priority={i === 0} />
            ))}
          </div>
        </div>
      </section>
      <CtaBlock title="Jouw project als volgende?" />
    </>
  );
}
