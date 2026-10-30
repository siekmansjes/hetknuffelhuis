import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBlock } from "@/components/CtaBlock";
import { Reveal } from "@/components/Reveal";
import { cases, getCase, progress, type StepStatus } from "@/lib/cases";
import { buildPageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return {};
  return buildPageMetadata({
    title: `${item.title}: zo wordt de knuffel gemaakt`,
    description: item.teaser,
    path: `/cases/${item.slug}`,
  });
}

const STATUS_LABEL: Record<StepStatus, string> = { volgt: "Info volgt", bezig: "Bezig", klaar: "Klaar" };

export default async function CasePage({ params }: PageProps<"/cases/[slug]">) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();

  const index = cases.findIndex((c) => c.slug === item.slug);
  const next = cases[(index + 1) % cases.length];
  const { done, total, current } = progress(item);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Breadcrumbs items={[{ name: "Cases", href: "/cases" }, { name: item.title }]} />
          <h1 style={{ maxWidth: "20ch" }}>{item.title}</h1>
          <p className="lead">{item.teaser}</p>
        </div>
      </section>

      <section className="section section--tight" style={{ paddingTop: 0 }}>
        <div className="wrap case-hero">
          {item.image && (
            <div className="frame frame--product ratio-16-10" style={{ position: "relative" }}>
              <Image src={item.image} alt={item.imageAlt ?? ""} fill priority sizes="(max-width: 900px) 100vw, 680px" style={{ objectFit: "contain" }} />
            </div>
          )}
          <dl className="case-facts">
            <div>
              <dt>Status</dt>
              <dd>{item.status}</dd>
            </div>
            <div>
              <dt>Stap</dt>
              <dd>
                {done} van {total} klaar
              </dd>
            </div>
            {current && (
              <div>
                <dt>Volgende stap</dt>
                <dd>{current.title}</dd>
              </div>
            )}
          </dl>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="process-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="process-title">
              Zo wordt {item.title} <em>gemaakt</em>
            </h2>
            <p>Vier stappen van ontwerpschets tot sample. Bij elke stap plaatsen we foto’s zodra ze er zijn.</p>
          </div>
          <ol className="case-steps">
            {item.steps.map((step, i) => (
              <Reveal as="li" key={step.title} className={`case-step case-step--${step.status}`} delay={i * 70}>
                <span className="case-step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <div className="case-step-body">
                  <div className="case-step-head">
                    <h3>{step.title}</h3>
                    <span className={`status-pill status-pill--${step.status}`}>{STATUS_LABEL[step.status]}</span>
                  </div>
                  <p className="case-step-summary">{step.summary}</p>
                  {step.more?.map((paragraph) => (
                    <p key={paragraph} className="case-step-more">
                      {paragraph}
                    </p>
                  ))}
                  {step.text && <p>{step.text}</p>}
                  {step.photos && step.photos.length > 0 ? (
                    <div className="case-step-photos">
                      {step.photos.map((photo) => (
                        <figure key={photo.src} style={{ margin: 0 }}>
                          <div className={`frame ratio-1-1${photo.fit === "cover" ? "" : " frame--product"}`} style={{ position: "relative" }}>
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 280px"
                              style={{ objectFit: photo.fit === "cover" ? "cover" : "contain" }}
                            />
                          </div>
                          {photo.caption && <figcaption>{photo.caption}</figcaption>}
                        </figure>
                      ))}
                    </div>
                  ) : (
                    !step.text && <p className="case-step-soon">{step.soon ?? "Info volgt zodra deze stap klaar is."}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 24 }}>
          <Link href="/cases">← Alle cases</Link>
          <Link href={`/cases/${next.slug}`} className="link-arrow">
            Volgend project: {next.title}
          </Link>
        </div>
      </section>

      <CtaBlock title="Ook zo’n knuffel voor jouw organisatie?" />
    </>
  );
}
