import Link from "next/link";
import Image from "next/image";
import { CaseCard } from "@/components/CaseCard";
import { CtaBlock } from "@/components/CtaBlock";
import { Faq } from "@/components/Faq";
import { PhotoSlot } from "@/components/PhotoSlot";
import { cases } from "@/lib/cases";
import { faqs } from "@/lib/faq";
import { merchandise } from "@/lib/merchandise";
import { steps } from "@/lib/process";
import { PLUSH_MINIMUM } from "@/lib/site";

const DETAILS = [
  { title: "Vorm en formaat", text: "Jouw mascotte of karakter, nagemaakt tot in het kleinste detail. Vorm, kleur en materiaal naar wens." },
  { title: "Stof en afwerking", text: "Meestal zachte velboa of pluche, met geborduurde details die blijven zitten." },
  { title: "Label en hangtag", text: "Een waslabel en hangtag in jouw eigen ontwerp, zodat de knuffel van begin tot eind van jou is." },
  { title: "Veilig voor iedereen", text: "Gemaakt en getest volgens de geldende EU-normen, veilig voor alle leeftijden." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Voor bedrijven en organisaties</span>
            <h1>
              Knuffels op maat, <em>tot in de naad.</em>
            </h1>
            <p className="hero-lead">
              Van jouw mascotte, merk of karakter maken wij een knuffel die mensen graag vasthouden. Naar eigen ontwerp, van schets tot levering, vanaf {PLUSH_MINIMUM} stuks.
            </p>
            <div className="cta-row">
              <Link href="/contact?mode=offerte" className="btn btn-primary">
                Vraag een offerte aan
              </Link>
              <Link href="/cases" className="btn btn-secondary">
                Bekijk onze cases
              </Link>
            </div>
            <p className="hero-note">
              Ook sleutelhangers, tattoo’s, magneten, petjes en kleding in dezelfde stijl.
            </p>
          </div>
          <div className="frame">
            {/* TODO: IMAGE ASSET NEEDED — voorbeeldbeeld vervangen door een eigen foto van een knuffel uit een van de drie cases (liggend 4:3, lichte achtergrond). */}
            <Image
              src="/beeld/knuffels-voorbeeld.webp"
              alt="Zeven knuffels in verschillende dieren, elk met een eigen borduurlogo (voorbeeldbeeld)"
              width={1400}
              height={1050}
              priority
              sizes="(max-width: 900px) 100vw, 520px"
            />
          </div>
        </div>
      </section>

      {/* Feiten */}
      <section className="section section--deep section--tight" aria-label="Kort samengevat">
        <div className="wrap facts">
          <div>
            <p className="fact-figure">Vanaf {PLUSH_MINIMUM} stuks</p>
            <p className="fact-text">Knuffels maken we in oplagen die passen bij een eigen ontwerp.</p>
          </div>
          <div>
            <p className="fact-figure">Helemaal naar eigen ontwerp</p>
            <p className="fact-text">Vorm, kleur, materiaal en details bepaal jij, wij denken mee.</p>
          </div>
          <div>
            <p className="fact-figure">Van schets tot levering</p>
            <p className="fact-text">Eén aanspreekpunt, van eerste idee tot de laatste doos.</p>
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="section section--butter" aria-labelledby="cases-title">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Recente projecten</span>
            <h2 id="cases-title">
              Drie knuffels, <em>drie verhalen</em>
            </h2>
            <p>Zo zien knuffels op maat eruit als ze uit de schetsboeken komen. Met een blik op de details die het verschil maken.</p>
          </div>
          <div className="cases-grid">
            {cases.map((item, i) => (
              <CaseCard key={item.slug} item={item} large={i === 0} priority={i === 0} />
            ))}
          </div>
          <p style={{ marginTop: 48 }}>
            <Link href="/cases" className="link-arrow">
              Alle cases bekijken
            </Link>
          </p>
        </div>
      </section>

      {/* Details */}
      <section className="section" aria-labelledby="details-title">
        <div className="wrap split">
          <PhotoSlot
            tone="blush"
            ratio="4-5"
            wanted="Close-up van een knuffel: borduurwerk, label en vacht in beeld"
            sizes="(max-width: 900px) 100vw, 560px"
          />
          <div className="split-copy">
            <span className="eyebrow">Zit in de details</span>
            <h2 id="details-title">
              Het verschil zit in de <em>kleine dingen</em>
            </h2>
            <p>Een goede knuffel herken je aan wat je pas ziet als je hem vasthoudt. Daar besteden we de meeste aandacht aan.</p>
            <ul className="detail-list">
              {DETAILS.map((detail) => (
                <li key={detail.title}>
                  <strong>{detail.title}</strong>
                  <span>{detail.text}</span>
                </li>
              ))}
            </ul>
            <p>
              <Link href="/knuffels" className="link-arrow">
                Alles over knuffels op maat
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Werkwijze */}
      <section className="section section--night" aria-labelledby="process-title">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Werkwijze</span>
            <h2 id="process-title">
              In vier stappen van idee naar <em>knuffel</em>
            </h2>
          </div>
          <ol className="steps">
            {steps.map((step) => (
              <li key={step.title} className="step">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <p style={{ marginTop: 56 }}>
            <Link href="/werkwijze" className="link-arrow">
              Lees de volledige werkwijze
            </Link>
          </p>
        </div>
      </section>

      {/* Merchandise */}
      <section className="section section--sage" aria-labelledby="merch-title">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Merchandise</span>
            <h2 id="merch-title">
              Past bij je knuffel: <em>de rest van de set</em>
            </h2>
            <p>Naast knuffels maken we een beperkt, bewust gekozen assortiment in dezelfde stijl.</p>
          </div>
          <div className="merch-list">
            {merchandise.map((item) => (
              <Link key={item.slug} href={`/merchandise#${item.slug}`} className="merch-row">
                <h3>{item.name}</h3>
                <p>{item.short}</p>
                <span className="link-arrow" aria-hidden="true">
                  Bekijk
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sample kleding */}
      <section className="section" aria-labelledby="sample-title">
        <div className="wrap">
          <div className="callout">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span className="eyebrow">Kleding eerst voelen?</span>
              <h2 id="sample-title">
                Vraag een <em>sample</em> aan om maat en kwaliteit te kiezen
              </h2>
              <p>
                Van onze kleding kun je een sample laten komen. Zo zie en voel je het verschil tussen comfort en premium, en kies je de juiste maat voordat je bestelt.
              </p>
            </div>
            <div className="cta-row">
              <Link href="/contact?mode=samples" className="btn btn-primary">
                Vraag een kleding-sample aan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--deep" aria-labelledby="faq-title">
        <div className="wrap two-col">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">Veelgestelde vragen</span>
            <h2 id="faq-title">
              Goed om te <em>weten</em>
            </h2>
            <p>Staat je vraag er niet bij? Stuur ons gerust een bericht.</p>
            <p>
              <Link href="/faq" className="link-arrow">
                Alle vragen
              </Link>
            </p>
          </div>
          <Faq items={faqs.slice(0, 4)} />
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
