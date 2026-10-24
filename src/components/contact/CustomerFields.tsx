import { LIMITS } from "@/lib/validation/forms";

/** Naam, bedrijf, e-mail en telefoon: gedeeld door alle formulieren. Ongecontroleerde velden. */
export function CustomerFields({ prefix }: { prefix: string }) {
  return (
    <>
      <div className="field-row">
        <div className="field">
          <label htmlFor={`${prefix}-naam`} className="label">
            Naam <span className="req" aria-hidden="true">*</span>
          </label>
          <input id={`${prefix}-naam`} name="naam" type="text" autoComplete="name" maxLength={LIMITS.naam} required className="input" />
        </div>
        <div className="field">
          <label htmlFor={`${prefix}-bedrijfsnaam`} className="label">
            Bedrijf of organisatie
          </label>
          <input id={`${prefix}-bedrijfsnaam`} name="bedrijfsnaam" type="text" autoComplete="organization" maxLength={LIMITS.bedrijfsnaam} className="input" />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor={`${prefix}-email`} className="label">
            E-mailadres <span className="req" aria-hidden="true">*</span>
          </label>
          <input id={`${prefix}-email`} name="email" type="email" autoComplete="email" maxLength={LIMITS.email} required className="input" />
        </div>
        <div className="field">
          <label htmlFor={`${prefix}-telefoon`} className="label">
            Telefoonnummer
          </label>
          <input id={`${prefix}-telefoon`} name="telefoon" type="tel" autoComplete="tel" maxLength={LIMITS.telefoon} className="input" />
        </div>
      </div>
    </>
  );
}
