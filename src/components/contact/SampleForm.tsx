"use client";

import { useRef, useState, type FormEvent } from "react";
import { CustomerFields } from "./CustomerFields";
import { BackButton, PrivacyConsent, SuccessPanel } from "./FormShell";
import { FormMessage } from "./FormMessage";
import { HoneypotField } from "./HoneypotField";
import { newRequestId, postRequest } from "./submit";
import { LIMITS, SAMPLE_QUALITIES, SAMPLE_SIZES, SAMPLE_TYPES, isValidEmail } from "@/lib/validation/forms";

type Status = "idle" | "submitting" | "success" | "error";

export function SampleForm({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [types, setTypes] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [quality, setQuality] = useState<string>("");
  const submitting = useRef(false);
  const requestId = useRef<string | null>(null);

  const toggle = (setter: (fn: (list: string[]) => string[]) => void, id: string) =>
    setter((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = new FormData(event.currentTarget);

    if (types.length === 0) {
      setStatus("error");
      setError("Kies minstens één kledingstuk waarvan je een sample wilt zien.");
      return;
    }
    if (!quality) {
      setStatus("error");
      setError("Kies welke kwaliteit je wilt zien.");
      return;
    }
    if (!isValidEmail(String(form.get("email") ?? "").trim())) {
      setStatus("error");
      setError("Vul een geldig e-mailadres in.");
      return;
    }

    submitting.current = true;
    setStatus("submitting");
    setError("");
    requestId.current ??= newRequestId();

    const get = (key: string) => String(form.get(key) ?? "");
    const body = {
      naam: get("naam"),
      bedrijfsnaam: get("bedrijfsnaam"),
      email: get("email").trim(),
      telefoon: get("telefoon"),
      types,
      kwaliteit: quality,
      maten: sizes,
      straat: get("straat"),
      postcode: get("postcode"),
      plaats: get("plaats"),
      land: get("land"),
      opmerkingen: get("opmerkingen"),
      website: get("website"),
      requestId: requestId.current,
    };

    const outcome = await postRequest("/api/samples", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    submitting.current = false;

    if (!outcome.ok) {
      setStatus("error");
      setError(outcome.error);
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="form-shell">
        <BackButton onBack={onBack} />
        <SuccessPanel title="Bedankt voor je sampleaanvraag" attachmentFailed={false}>
          We hebben je aanvraag ontvangen en nemen contact met je op om de verzending en het retourneren af te stemmen.
        </SuccessPanel>
      </div>
    );
  }

  return (
    <div className="form-shell">
      <BackButton onBack={onBack} />
      <h1 style={{ fontSize: "var(--fs-h2)", marginTop: 20 }}>
        Vraag een <em>kleding-sample</em> aan
      </h1>
      <p style={{ marginTop: 12, color: "var(--ink-soft)", fontSize: "var(--fs-md)" }}>
        Zie en voel de kwaliteit voordat je bestelt, en pas de maat. Kies hieronder wat je wilt zien en waar we het naartoe sturen.
      </p>

      <form onSubmit={handleSubmit} aria-busy={status === "submitting"} className="form-card">
        <HoneypotField />
        <p className="hint">Velden met een * zijn verplicht.</p>

        <fieldset className="field">
          <legend className="label">
            Welk kledingstuk wil je zien? <span className="req" aria-hidden="true">*</span>
          </legend>
          <div className="choice-grid choice-grid--inline">
            {SAMPLE_TYPES.map((option) => (
              <label key={option.id} className="choice choice--compact">
                <input type="checkbox" checked={types.includes(option.id)} onChange={() => toggle(setTypes, option.id)} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend className="label">
            Welke kwaliteit? <span className="req" aria-hidden="true">*</span>
          </legend>
          <div className="choice-grid">
            {SAMPLE_QUALITIES.map((option) => (
              <label key={option.id} className="choice choice--compact">
                <input type="radio" name="kwaliteit" checked={quality === option.id} onChange={() => setQuality(option.id)} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="field">
          <legend className="label">Welke maten wil je zien?</legend>
          <div className="choice-grid choice-grid--inline">
            {SAMPLE_SIZES.map((size) => (
              <label key={size} className="choice choice--compact">
                <input type="checkbox" checked={sizes.includes(size)} onChange={() => toggle(setSizes, size)} />
                <span>{size}</span>
              </label>
            ))}
          </div>
          <p className="hint">Weet je het nog niet precies? Laat het leeg, dan overleggen we.</p>
        </fieldset>

        <hr className="stitch" />

        <CustomerFields prefix="sample" />

        <div className="field">
          <label htmlFor="sample-straat" className="label">
            Straat en huisnummer <span className="req" aria-hidden="true">*</span>
          </label>
          <input id="sample-straat" name="straat" type="text" autoComplete="street-address" maxLength={LIMITS.straat} required className="input" />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="sample-postcode" className="label">
              Postcode <span className="req" aria-hidden="true">*</span>
            </label>
            <input id="sample-postcode" name="postcode" type="text" autoComplete="postal-code" maxLength={LIMITS.postcode} required className="input" />
          </div>
          <div className="field">
            <label htmlFor="sample-plaats" className="label">
              Plaats <span className="req" aria-hidden="true">*</span>
            </label>
            <input id="sample-plaats" name="plaats" type="text" autoComplete="address-level2" maxLength={LIMITS.plaats} required className="input" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="sample-land" className="label">
            Land
          </label>
          <input id="sample-land" name="land" type="text" autoComplete="country-name" defaultValue="Nederland" maxLength={LIMITS.land} className="input" />
        </div>
        <div className="field">
          <label htmlFor="sample-opmerkingen" className="label">
            Opmerkingen
          </label>
          <textarea id="sample-opmerkingen" name="opmerkingen" rows={3} maxLength={LIMITS.opmerkingen} className="textarea" style={{ minHeight: 96 }} />
        </div>

        <PrivacyConsent checked={privacy} onChange={setPrivacy} />

        {status === "error" && <FormMessage kind="error">{error}</FormMessage>}

        <button type="submit" className="btn btn-primary" disabled={status === "submitting" || !privacy}>
          {status === "submitting" ? "Versturen…" : "Verstuur sampleaanvraag"}
        </button>
        {!privacy && status !== "submitting" && <p className="hint">Vink het vakje hierboven aan om te kunnen versturen.</p>}
      </form>
    </div>
  );
}
