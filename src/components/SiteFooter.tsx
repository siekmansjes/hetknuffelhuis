import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { CookieSettingsButton } from "@/components/CookieNotice";
import { COMPANY, PLUSH_MINIMUM, whatsappUrl } from "@/lib/site";
import { merchandise } from "@/lib/merchandise";

export function SiteFooter() {
  const legal = [
    COMPANY.kvk && `KvK ${COMPANY.kvk}`,
    COMPANY.btwId && `btw ${COMPANY.btwId}`,
    COMPANY.postcodePlaats,
  ].filter(Boolean);

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="brand" style={{ color: "var(--on-night)" }}>
              <LogoMark size={44} />
              <span className="brand-name">Het Knuffelhuis</span>
            </div>
            <p style={{ maxWidth: 300 }}>
              Knuffels op maat voor bedrijven en organisaties, vanaf {PLUSH_MINIMUM} stuks. Met sleutelhangers, tattoo’s, magneten, petjes en kleding in dezelfde
              stijl.
            </p>
          </div>

          <div className="footer-col">
            <h2>Knuffels</h2>
            <Link href="/knuffels">Knuffels op maat</Link>
            <Link href="/cases">Cases</Link>
            <Link href="/werkwijze">Werkwijze</Link>
            <Link href="/faq">Veelgestelde vragen</Link>
          </div>

          <div className="footer-col">
            <h2>Merchandise</h2>
            {merchandise.map((item) => (
              <Link key={item.slug} href={`/merchandise#${item.slug}`}>
                {item.name}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h2>Contact</h2>
            {COMPANY.email && <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>}
            {COMPANY.phoneDisplay && (
              <>
                <a href={`tel:+${COMPANY.phoneInternational}`}>{COMPANY.phoneDisplay}</a>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </>
            )}
            {COMPANY.instagramUrl && (
              <a href={COMPANY.instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
            {COMPANY.linkedinUrl && (
              <a href={COMPANY.linkedinUrl} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            <Link href="/contact?mode=offerte" className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start", marginTop: 8, color: "var(--on-accent)" }}>
              Offerte aanvragen
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Het Knuffelhuis{legal.length ? ` · ${legal.join(" · ")}` : ""}
          </span>
          <Link href="/privacy">Privacy</Link>
          <Link href="/voorwaarden">Voorwaarden</Link>
          <CookieSettingsButton />
        </div>
      </div>
    </footer>
  );
}
