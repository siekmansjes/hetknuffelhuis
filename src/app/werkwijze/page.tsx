import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBlock } from "@/components/CtaBlock";
import { steps } from "@/lib/process";
import { PLUSH_MINIMUM, buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Werkwijze: van idee tot knuffel",
  description: "Zo werkt het: je vertelt ons je idee, wij maken ontwerp en offerte, na jouw akkoord gaat de knuffel in productie en leveren we alles compleet.",
  path: "/werkwijze",
});

const NEEDED = [
  "Je logo, schets of een eerste idee (png, jpg, pdf, ai of eps)",
  `Een indicatie van het gewenste aantal (knuffels vanaf ${PLUSH_MINIMUM} stuks)`,
  "Het gewenste formaat, als je dat al weet",
  "Een gewenste leverdatum, bijvoorbeeld voor een lancering of evenement",
];

export default function WerkwijzePage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Werkwijze" }]} />
          <h1>
            Van <em>idee</em> tot knuffel
          </h1>
          <p className="lead">Eén aanspreekpunt van begin tot eind. Dit gebeurt er tussen je eerste bericht en de levering.</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <ol className="steps steps--light">
            {steps.map((step) => (
              <li key={step.title} className="step">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--deep" aria-labelledby="needed-title">
        <div className="wrap two-col">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <h2 id="needed-title">
              Wat we <em>graag van je horen</em>
            </h2>
            <p>Het hoeft niet compleet te zijn. Hoe meer we weten, hoe scherper de offerte, maar een eerste idee is genoeg om te beginnen.</p>
            <p>
              <Link href="/contact?mode=offerte" className="link-arrow">
                Naar het offerteformulier
              </Link>
            </p>
          </div>
          <ul className="check-list">
            {NEEDED.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
