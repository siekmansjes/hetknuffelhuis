import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CaseCard } from "@/components/CaseCard";
import { CtaBlock } from "@/components/CtaBlock";
import { cases } from "@/lib/cases";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Cases: uitgelichte knuffelprojecten",
  description: "Volg hoe de knuffels Mopi en Gigi stap voor stap worden gemaakt: van ontwerpschets en prototypes tot het echte sample.",
  path: "/cases",
});

export default function CasesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Cases" }]} />
          <h1>
            Uitgelichte <em>projecten</em>
          </h1>
          <p className="lead">Deze knuffels worden nu gemaakt. Per project laten we in vier stappen zien hoe het gaat, van ontwerpschets tot het echte sample.</p>
        </div>
      </section>
      <section className="section section--tight section--deep">
        <div className="wrap">
          <div className="cases-grid--wide">
            {cases.map((item, i) => (
              <CaseCard key={item.slug} item={item} priority={i === 0} />
            ))}
          </div>
        </div>
      </section>
      <CtaBlock title="Jouw project als volgende?" />
    </>
  );
}
