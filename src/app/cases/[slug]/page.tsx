import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBlock } from "@/components/CtaBlock";
import { PhotoSlot } from "@/components/PhotoSlot";
import { cases, getCase } from "@/lib/cases";
import { buildPageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return {};
  return buildPageMetadata({
    title: `${item.title} (case)`,
    description: item.teaser,
    path: `/cases/${item.slug}`,
  });
}

export default async function CasePage({ params }: PageProps<"/cases/[slug]">) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();

  const index = cases.findIndex((c) => c.slug === item.slug);
  const next = cases[(index + 1) % cases.length];

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Cases", href: "/cases" }, { name: item.title }]} />
          <span className="eyebrow">Case · {item.sector}</span>
          <h1 style={{ maxWidth: "20ch" }}>{item.title}</h1>
          <p className="lead">{item.teaser}</p>
          {item.isExample && <p className="placeholder-note">Voorbeeldinhoud: vervang door het echte project.</p>}
        </div>
      </section>

      <section className="section section--tight" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {item.image ? (
            <div className="frame ratio-16-10" style={{ position: "relative" }}>
              <Image src={item.image} alt={item.imageAlt ?? ""} fill priority sizes="(max-width: 1240px) 100vw, 1200px" style={{ objectFit: "cover" }} />
            </div>
          ) : (
            <PhotoSlot
              tone={item.tone}
              ratio="16-10"
              wanted="Hoofdfoto: de knuffel (of de hele serie) uit dit project, mooi vrijgesteld"
              sizes="(max-width: 1240px) 100vw, 1200px"
              priority
            />
          )}
          <dl className="case-facts">
            <div>
              <dt>Opdrachtgever</dt>
              <dd>{item.klant}</dd>
            </div>
            <div>
              <dt>Aantal</dt>
              <dd>{item.aantal}</dd>
            </div>
            <div>
              <dt>Formaat</dt>
              <dd>{item.formaat}</dd>
            </div>
            <div>
              <dt>Jaar</dt>
              <dd>{item.jaar}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section section--deep">
        <div className="wrap story">
          <div>
            <h2>De opdracht</h2>
            <p>{item.opdracht}</p>
          </div>
          <div>
            <h2>De aanpak</h2>
            <p>{item.aanpak}</p>
          </div>
          <div>
            <h2>Het resultaat</h2>
            <p>{item.resultaat}</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="details-title">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">De details</span>
            <h2 id="details-title">
              Van dichtbij: <em>waar het in zit</em>
            </h2>
          </div>
          <div className="detail-grid">
            {item.details.map((detail) => (
              <figure key={detail.title} className="detail-item" style={{ margin: 0 }}>
                <PhotoSlot
                  src={detail.photo}
                  alt={detail.alt}
                  tone={detail.tone}
                  ratio="1-1"
                  wanted={`Close-up: ${detail.title.toLowerCase()}`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 280px"
                />
                <figcaption>
                  <strong>{detail.title}</strong>
                  <span>{detail.text}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 24 }}>
          <Link href="/cases">← Alle cases</Link>
          <Link href={`/cases/${next.slug}`} className="link-arrow">
            Volgende project: {next.title}
          </Link>
        </div>
      </section>

      <CtaBlock title="Ook zo’n knuffel voor jouw organisatie?" />
    </>
  );
}
