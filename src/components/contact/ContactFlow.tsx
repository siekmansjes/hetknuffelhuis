"use client";

import { useRouter } from "next/navigation";
import { ContactForm } from "./ContactForm";
import { OfferteForm } from "./OfferteForm";
import { SampleForm } from "./SampleForm";
import { COMPANY, whatsappUrl } from "@/lib/site";

type Mode = "keuze" | "contact" | "offerte" | "samples";

/**
 * De modus komt uit de `?mode=`-queryparam (server-side gelezen in page.tsx).
 * Elke wissel is een `router.push`, zodat de terugknop van de browser stap
 * voor stap terugspringt.
 */
export function ContactFlow({ initialMode }: { initialMode?: string }) {
  const router = useRouter();
  const mode: Mode = initialMode === "contact" || initialMode === "offerte" || initialMode === "samples" ? initialMode : "keuze";

  const goTo = (next: Mode) => router.push(next === "keuze" ? "/contact" : `/contact?mode=${next}`);
  // Bewust een expliciete push naar de keuze, niet router.back(): veel plekken
  // linken rechtstreeks naar een modus, en back() zou dan de hele flow verlaten.
  const goBack = () => router.push("/contact");

  if (mode === "contact") return <ContactForm onBack={goBack} />;
  if (mode === "offerte") return <OfferteForm onBack={goBack} />;
  if (mode === "samples") return <SampleForm onBack={goBack} />;

  return (
    <div>
      <div style={{ maxWidth: 640, marginBottom: 40, display: "flex", flexDirection: "column", gap: 16 }}>
        <h1>
          Waar kunnen we je <em>mee helpen?</em>
        </h1>
        <p style={{ fontSize: "var(--fs-md)", color: "var(--ink-soft)" }}>Kies wat het beste bij je past. Zo komt je aanvraag meteen bij de juiste persoon terecht.</p>
      </div>

      <div className="mode-grid">
        <button type="button" className="mode-card mode-card--primary" onClick={() => goTo("offerte")}>
          <h2>Offerte aanvragen</h2>
          <p>Voor knuffels op maat of merchandise. Vertel wat je wilt laten maken en wij sturen je een offerte.</p>
          <span className="link-arrow">Start je aanvraag</span>
        </button>
        <button type="button" className="mode-card" onClick={() => goTo("samples")}>
          <h2>Kleding-sample</h2>
          <p>Zie en voel de kwaliteit van onze kleding en kies je maat.</p>
          <span className="link-arrow">Vraag een sample aan</span>
        </button>
        <button type="button" className="mode-card" onClick={() => goTo("contact")}>
          <h2>Een vraag of bericht</h2>
          <p>Liever eerst even overleggen of iets vragen? Stuur ons een bericht.</p>
          <span className="link-arrow">Stuur een bericht</span>
        </button>
      </div>

      {(COMPANY.email || COMPANY.phoneDisplay) && (
        <div className="contact-direct">
          <span>Liever direct contact?</span>
          {COMPANY.email && <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>}
          {COMPANY.phoneDisplay && (
            <>
              <a href={`tel:+${COMPANY.phoneInternational}`}>{COMPANY.phoneDisplay}</a>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                WhatsApp
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
