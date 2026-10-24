import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBlock } from "@/components/CtaBlock";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { faqs } from "@/lib/faq";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Veelgestelde vragen",
  description: "Antwoorden op veelgestelde vragen over knuffels op maat, minimale afname, ontwerp, levertijd, merchandise en kleding-samples.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer.join(" ") },
          })),
        }}
      />
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Veelgestelde vragen" }]} />
          <span className="eyebrow">Veelgestelde vragen</span>
          <h1>
            Goed om te <em>weten</em>
          </h1>
          <p className="lead">De vragen die we het vaakst krijgen over knuffels, merchandise en kleding.</p>
        </div>
      </section>
      <section className="section section--tight">
        <div className="wrap wrap--narrow">
          <Faq items={faqs} />
        </div>
      </section>
      <CtaBlock title="Nog een vraag?" text="Stuur ons een bericht of vraag meteen een offerte aan. We denken graag met je mee." />
    </>
  );
}
