import Link from "next/link";
import { PLUSH_MINIMUM } from "@/lib/site";

/** Afsluitende call-to-action. Eén primaire actie, één secundaire. */
export function CtaBlock({
  title = "Laten we jouw knuffel maken",
  text = `Een concreet ontwerp of nog maar een eerste idee? Vertel ons wat je zoekt. Knuffels maken we vanaf ${PLUSH_MINIMUM} stuks.`,
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="section section--accent" aria-labelledby="cta-title">
      <div className="wrap cta-block">
        <div>
          <h2 id="cta-title">{title}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-row">
          <Link href="/contact?mode=offerte" className="btn btn-primary">
            Vraag een offerte aan
          </Link>
        </div>
      </div>
    </section>
  );
}
