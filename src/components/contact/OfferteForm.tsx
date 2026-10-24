"use client";

import { useRef, useState, type FormEvent } from "react";
import { FileUploadField } from "./FileUploadField";
import { CustomerFields } from "./CustomerFields";
import { BackButton, PrivacyConsent, SuccessPanel } from "./FormShell";
import { FormMessage } from "./FormMessage";
import { HoneypotField } from "./HoneypotField";
import { newRequestId, postRequest } from "./submit";
import { LIMITS, WANTED_OPTIONS, isValidEmail } from "@/lib/validation/forms";
import { PLUSH_MINIMUM } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

export function OfferteForm({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [attachmentFailed, setAttachmentFailed] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [wanted, setWanted] = useState<string[]>(["knuffels"]);
  // Een ref is direct zichtbaar; state pas bij de volgende render. Zo vangen we dubbele submits af.
  const submitting = useRef(false);
  const requestId = useRef<string | null>(null);

  function toggle(id: string) {
    setWanted((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const payload = new FormData(event.currentTarget);

    if (wanted.length === 0) {
      setStatus("error");
      setError("Kies minstens één onderdeel waarvoor je een offerte wilt.");
      return;
    }
    if (!isValidEmail(String(payload.get("email") ?? "").trim())) {
      setStatus("error");
      setError("Vul een geldig e-mailadres in.");
      return;
    }

    submitting.current = true;
    setStatus("submitting");
    setError("");
    payload.delete("wanted");
    wanted.forEach((id) => payload.append("wanted", id));
    requestId.current ??= newRequestId();
    payload.set("requestId", requestId.current);

    // Geen Content-Type-header: de browser zet die zelf, inclusief de multipart-boundary.
    const outcome = await postRequest("/api/offerte", { method: "POST", body: payload });
    submitting.current = false;

    if (!outcome.ok) {
      setStatus("error");
      setError(outcome.error);
      return;
    }
    setAttachmentFailed(outcome.attachmentFailed);
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="form-shell">
        <BackButton onBack={onBack} />
        <SuccessPanel title="Bedankt voor je aanvraag" attachmentFailed={attachmentFailed}>
          We hebben je offerteaanvraag ontvangen en reageren zo snel mogelijk.
        </SuccessPanel>
      </div>
    );
  }

  const plushSelected = wanted.includes("knuffels");

  return (
    <div className="form-shell">
      <BackButton onBack={onBack} />
      <h1 style={{ fontSize: "var(--fs-h2)", marginTop: 20 }}>
        Vraag een <em>offerte</em> aan
      </h1>
      <p style={{ marginTop: 12, color: "var(--ink-soft)", fontSize: "var(--fs-md)" }}>
        Vertel kort wat je wilt laten maken. Een eerste idee is genoeg, een definitief ontwerp is niet nodig.
      </p>

      <form onSubmit={handleSubmit} aria-busy={status === "submitting"} className="form-card">
        <HoneypotField />
        <p className="hint">Velden met een * zijn verplicht.</p>

        <fieldset className="field">
          <legend className="label">
            Waarvoor wil je een offerte? <span className="req" aria-hidden="true">*</span>
          </legend>
          <div className="choice-grid">
            {WANTED_OPTIONS.map((option) => (
              <label key={option.id} className="choice">
                <input type="checkbox" checked={wanted.includes(option.id)} onChange={() => toggle(option.id)} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field-row">
          <div className="field">
            <label htmlFor="offerte-aantal" className="label">
              Gewenst aantal
            </label>
            <input id="offerte-aantal" name="aantal" type="number" inputMode="numeric" min={1} max={LIMITS.maxQuantity} className="input" />
            <p className="hint">{plushSelected ? `Knuffels maken we vanaf ${PLUSH_MINIMUM} stuks.` : "Een schatting is prima."}</p>
          </div>
          <div className="field">
            <label htmlFor="offerte-formaat" className="label">
              Gewenst formaat
            </label>
            <input id="offerte-formaat" name="formaat" type="text" maxLength={LIMITS.korteTekst} placeholder="Bijvoorbeeld 25 cm" className="input" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="offerte-leverdatum" className="label">
            Gewenste leverdatum
          </label>
          <input id="offerte-leverdatum" name="leverdatum" type="text" maxLength={LIMITS.korteTekst} placeholder="Bijvoorbeeld begin maart" className="input" />
        </div>

        <div className="field">
          <label htmlFor="offerte-omschrijving" className="label">
            Vertel over je idee <span className="req" aria-hidden="true">*</span>
          </label>
          <textarea
            id="offerte-omschrijving"
            name="omschrijving"
            rows={5}
            maxLength={LIMITS.omschrijving}
            required
            placeholder="Wie of wat moet het worden? Waar gaat de knuffel voor dienen? Welke kleuren of details zijn belangrijk?"
            className="textarea"
          />
        </div>

        <FileUploadField id="offerte-logo" name="logo" label="Logo, schets of ontwerp (optioneel)" />

        <hr className="stitch" />

        <CustomerFields prefix="offerte" />

        <PrivacyConsent checked={privacy} onChange={setPrivacy} />

        {status === "error" && <FormMessage kind="error">{error}</FormMessage>}

        <button type="submit" className="btn btn-primary" disabled={status === "submitting" || !privacy}>
          {status === "submitting" ? "Versturen…" : "Verstuur offerteaanvraag"}
        </button>
        {!privacy && status !== "submitting" && <p className="hint">Vink het vakje hierboven aan om te kunnen versturen.</p>}
      </form>
    </div>
  );
}
