import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap notfound">
        <span className="eyebrow">404</span>
        <h1>
          Deze pagina is <em>zoek</em>
        </h1>
        <p className="lead" style={{ maxWidth: "46ch" }}>
          De pagina die je zoekt bestaat niet (meer). Ga terug naar de homepage of bekijk onze knuffels.
        </p>
        <div className="cta-row">
          <Link href="/" className="btn btn-primary">
            Naar de homepage
          </Link>
          <Link href="/knuffels" className="btn btn-secondary">
            Knuffels op maat
          </Link>
        </div>
      </div>
    </section>
  );
}
