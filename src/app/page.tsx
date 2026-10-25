import Link from "next/link";
import Image from "next/image";
import { CaseCard } from "@/components/CaseCard";
import { CountUp } from "@/components/CountUp";
import { CtaBlock } from "@/components/CtaBlock";
import { Doodles, Wave } from "@/components/Decor";
import { Faq } from "@/components/Faq";
import { Icon, IconBadge, type IconName } from "@/components/Icon";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { cases } from "@/lib/cases";
import { faqs } from "@/lib/faq";
import { merchandise } from "@/lib/merchandise";
import { steps } from "@/lib/process";
import { PLUSH_MINIMUM } from "@/lib/site";

const MARQUEE = ["Knuffels op maat", "Sleutelhangers", "Tijdelijke tattoo’s", "Magneten", "Petjes", "Kleding"];

const FEATURES: { icon: IconName; title: string; text: string; figure?: boolean }[] = [
  { icon: "match", title: "1:1 naar jouw ontwerp", text: "Vorm, verhoudingen, kleuren en details precies zoals jouw merk of karakter." },
  { icon: "users", title: "Eén aanspreekpunt", text: "Van eerste schets tot levering regelt één vast contactpersoon het hele traject." },
  { icon: "box", title: "Vanaf 500 stuks", text: "Een eigen ontwerp in een oplage die past bij een bedrijf of organisatie.", figure: true },
  { icon: "shield", title: "Veilig voor iedereen", text: "Gemaakt en getest volgens de geldende EU-normen, veilig voor alle leeftijden." },
];

const DETAILS: { icon: IconName; title: string; text: string }[] = [
  { icon: "match", title: "Vorm en formaat", text: "Jouw karakter, logo of ontwerp, nagemaakt tot in het kleinste detail. Vorm, kleur en materiaal naar wens." },
  { icon: "needle", title: "Stof en afwerking", text: "Meestal zachte velboa of pluche, met geborduurde details die blijven zitten." },
  { icon: "tag", title: "Label en hangtag", text: "Een waslabel en hangtag in jouw eigen ontwerp, zodat de knuffel van begin tot eind van jou is." },
];

// Waarom klanten kiezen voor Het Knuffelhuis. Overgenomen van de Parkmade-site
// (localhost:3100) zonder het displaypunt. TODO: bevestig of alle punten kloppen
// voor Het Knuffelhuis, vooral de keurmerken (CE, EN 71, GPSR).
const WHY: { icon: IconName; text: string }[] = [
  { icon: "users", text: "Eén aanspreekpunt, van eerste idee tot levering" },
  { icon: "box", text: "Eén bestelling voor je hele assortiment" },
  { icon: "sparkle", text: "Exclusief ontwerp, nergens anders verkrijgbaar" },
  { icon: "match", text: "Ervaren designers die meedenken als je zelf geen ontwerp hebt" },
  { icon: "factory", text: "Vaste producenten die hun kwaliteit al bewezen hebben" },
  { icon: "shield", text: "CE, EN 71 en GPSR-compliant, met traceerbare documentatie" },
];

const STEP_ICONS: IconName[] = ["chat", "match", "check", "truck"];
const MERCH_ICONS: Record<string, IconName> = {
  sleutelhangers: "keyring",
  "tijdelijke-tattoos": "tattoo",
  magneten: "magnet",
  petjes: "cap",
  kleding: "shirt",
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Voor bedrijven en organisaties</span>
            <h1>
              Jouw merk als knuffel, <em>helemaal op maat.</em>
            </h1>
            <p className="hero-lead">
              Van jouw merk, logo of eigen karakter maken wij een knuffel die mensen graag vasthouden. Naar eigen ontwerp, van schets tot levering, vanaf {PLUSH_MINIMUM} stuks.
            </p>
            <div className="cta-row">
              <Link href="/contact?mode=offerte" className="btn btn-primary btn-ripple">
                Vraag een offerte aan
              </Link>
              <Link href="/cases" className="btn btn-secondary">
                Bekijk onze cases
              </Link>
            </div>
            <p className="hero-note">Ook sleutelhangers, tattoo’s, magneten, petjes en kleding in dezelfde stijl.</p>
          </div>
          <div className="hero-art">
            <div className="blob blob--fill" aria-hidden="true" />
            <div className="blob blob--stitch" aria-hidden="true" />
            {/* TODO: IMAGE ASSET NEEDED — voorbeeldbeeld vervangen door een eigen foto van een knuffel uit een van de cases, vrijgesteld op een witte achtergrond (de witte achtergrond valt weg tegen de blob). */}
            <Image
              className="hero-photo"
              src="/beeld/knuffels-voorbeeld.webp"
              alt="Zeven knuffels in verschillende dieren, elk met een eigen borduurlogo (voorbeeldbeeld)"
              width={1400}
              height={1050}
              priority
              sizes="(max-width: 900px) 90vw, 500px"
            />
            <Doodles />
          </div>
        </div>
      </section>

      {/* Lopende band */}
      <div className="marquee" aria-label="Wat we maken">
        <div className="marquee-track">
          {[0, 1].map((group) => (
            <div key={group} className="marquee-group" aria-hidden={group === 1 ? "true" : undefined}>
              {MARQUEE.map((item) => (
                <span key={item} className="marquee-item">
                  {item}
                  <Icon name="sparkle" size={20} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Kort samengevat */}
      <section className="section section--tight" aria-labelledby="features-title">
        <div className="wrap">
          <h2 id="features-title" className="sr-only">
            Kort samengevat
          </h2>
          <div className="feature-grid">
            {FEATURES.map((feature, i) => (
              <Reveal key={feature.title} className="feature-card" delay={i * 90}>
                <IconBadge name={feature.icon} size={32} />
                <h3>
                  {feature.figure ? (
                    <>
                      Vanaf <span className="feature-figure"><CountUp to={PLUSH_MINIMUM} /></span> stuks
                    </>
                  ) : (
                    feature.title
                  )}
                </h3>
                <p>{feature.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="section section--tint section--wave" aria-labelledby="cases-title">
        <Wave from="paper" />
        <div className="wrap">
          <Reveal className="section-head">
            <span className="eyebrow">Recente projecten</span>
            <h2 id="cases-title">
              Drie knuffels, <em>drie verhalen</em>
            </h2>
            <p>Zo zien knuffels op maat eruit als ze uit de schetsboeken komen. Met een blik op de details die het verschil maken.</p>
          </Reveal>
          <div className="cases-grid">
            {cases.map((item, i) => (
              <Reveal key={item.slug} delay={i * 110} className="case-reveal">
                <CaseCard item={item} priority={i === 0} />
              </Reveal>
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
      <section className="section section--wave" aria-labelledby="details-title">
        <Wave from="tint" />
        <div className="wrap split">
          <Reveal>
            <PhotoSlot
              tone="deep"
              ratio="4-5"
              wanted="Close-up van een knuffel: borduurwerk, label en vacht in beeld"
              sizes="(max-width: 900px) 100vw, 560px"
            />
          </Reveal>
          <Reveal className="split-copy" delay={120}>
            <h2 id="details-title">
              Het verschil zit in de <em>kleine dingen</em>
            </h2>
            <p>Een goede knuffel herken je aan wat je pas ziet als je hem vasthoudt. Daar besteden we de meeste aandacht aan.</p>
            <ul className="detail-list detail-list--icons">
              {DETAILS.map((detail) => (
                <li key={detail.title}>
                  <IconBadge name={detail.icon} size={24} tone="soft" />
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
          </Reveal>
        </div>
      </section>

      {/* Waarom kiezen klanten voor Het Knuffelhuis */}
      <section id="waarom" className="section section--tint section--wave" aria-labelledby="why-title">
        <Wave from="paper" />
        <div className="wrap">
          <Reveal className="section-head">
            <h2 id="why-title">Waarom kiezen klanten voor Het Knuffelhuis?</h2>
          </Reveal>
          <div className="why-grid">
            {WHY.map((item, i) => (
              <Reveal key={item.text} className="why-item" delay={(i % 2) * 90}>
                <IconBadge name={item.icon} size={24} tone="soft" />
                <span>{item.text}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Werkwijze */}
      <section className="section section--night section--wave" aria-labelledby="process-title">
        <Wave from="tint" />
        <div className="wrap">
          <Reveal className="section-head">
            <h2 id="process-title">
              In vier stappen van idee naar <em>knuffel</em>
            </h2>
          </Reveal>
          <ol className="steps">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.title} className="step" delay={i * 110}>
                <IconBadge name={STEP_ICONS[i]} size={30} />
                <span className="step-label">Stap {i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            ))}
          </ol>
          <p style={{ marginTop: 48 }}>
            <Link href="/werkwijze" className="link-arrow">
              Lees de volledige werkwijze
            </Link>
          </p>
        </div>
      </section>

      {/* Merchandise */}
      <section className="section section--tint section--wave" aria-labelledby="merch-title">
        <Wave from="night" />
        <div className="wrap">
          <Reveal className="section-head">
            <h2 id="merch-title">
              Past bij je knuffel: <em>de rest van de set</em>
            </h2>
            <p>Naast knuffels maken we een beperkt, bewust gekozen assortiment in dezelfde stijl.</p>
          </Reveal>
          <div className="merch-list">
            {merchandise.map((item) => (
              <Link key={item.slug} href={`/merchandise#${item.slug}`} className="merch-row">
                <IconBadge name={MERCH_ICONS[item.slug] ?? "box"} size={26} tone="soft" />
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
          <Reveal className="callout">
            <IconBadge name="shirt" size={34} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--tint section--wave" aria-labelledby="faq-title">
        <Wave from="paper" />
        <div className="wrap two-col">
          <div className="section-head" style={{ marginBottom: 0 }}>
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
