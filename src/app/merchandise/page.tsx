import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBlock } from "@/components/CtaBlock";
import { IconBadge, type IconName } from "@/components/Icon";
import { PhotoSlot } from "@/components/PhotoSlot";
import { Reveal } from "@/components/Reveal";
import { merchandise } from "@/lib/merchandise";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Merchandise: sleutelhangers, tattoo’s, magneten, petjes en kleding",
  description:
    "Naast knuffels maakt Het Knuffelhuis sleutelhangers, tijdelijke tattoo’s, magneten, petjes en kleding op maat. Van kleding kun je een sample aanvragen om maat en kwaliteit te kiezen.",
  path: "/merchandise",
});

const MERCH_ICONS: Record<string, IconName> = {
  sleutelhangers: "keyring",
  "tijdelijke-tattoos": "tattoo",
  magneten: "magnet",
  petjes: "cap",
  kleding: "shirt",
};

export default function MerchandisePage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Merchandise" }]} />
          <h1>
            De rest van de set, <em>in dezelfde stijl</em>
          </h1>
          <p className="lead">
            Naast knuffels maken we een beperkt assortiment: sleutelhangers, tijdelijke tattoo’s, magneten, petjes en kleding. Allemaal met jouw ontwerp, zodat alles bij elkaar past.
          </p>
          <ul className="jump-nav" aria-label="Spring naar een product">
            {merchandise.map((item) => (
              <li key={item.slug}>
                <a href={`#${item.slug}`}>{item.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="wrap">
        {merchandise.map((item, i) => (
          <section key={item.slug} id={item.slug} className="merch-section" aria-labelledby={`${item.slug}-title`}>
            <Reveal className={`split ${i % 2 === 1 ? "split--flip" : ""}`}>
              <PhotoSlot
                src={item.photo}
                alt={item.photoAlt}
                tone={item.tone}
                ratio="4-3"
                wanted={item.photoWanted}
                sizes="(max-width: 900px) 100vw, 560px"
              />
              <div className="split-copy">
                <div className="merch-title">
                  <IconBadge name={MERCH_ICONS[item.slug] ?? "box"} size={28} />
                  <h2 id={`${item.slug}-title`}>{item.name}</h2>
                </div>
                <p>{item.intro}</p>
                <table className="spec-table">
                  <tbody>
                    {item.specs.map((spec) => (
                      <tr key={spec.label}>
                        <th scope="row">{spec.label}</th>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {item.points.length > 0 && (
                  <ul className="check-list">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
                {item.slug === "kleding" || item.slug === "petjes" ? (
                  <div className="cta-row">
                    <Link href="/contact?mode=samples" className="btn btn-secondary btn-sm">
                      Vraag een sample aan
                    </Link>
                    <Link href="/contact?mode=offerte" className="btn btn-primary btn-sm">
                      Vraag een offerte aan
                    </Link>
                  </div>
                ) : (
                  <div className="cta-row">
                    <Link href="/contact?mode=offerte" className="btn btn-primary btn-sm">
                      Vraag een offerte aan
                    </Link>
                  </div>
                )}
              </div>
            </Reveal>
          </section>
        ))}
      </div>

      <section className="section section--tight">
        <div className="wrap">
          <div className="callout">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h2>
                Kies maat en kwaliteit met een <em>sample</em>
              </h2>
              <p>
                Van de kleding (T-shirts, hoodies en petjes) kun je een sample aanvragen. Zo voel je het verschil tussen comfort en premium en pas je de maten, voordat je een grotere bestelling plaatst.
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

      <CtaBlock title="Welke set past bij jouw organisatie?" text="Vertel ons wat je zoekt, dan stellen we een offerte voor je samen. Een knuffel, merchandise of allebei." />
    </>
  );
}
