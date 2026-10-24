"use client";

import { useRef, useState, type FormEvent } from "react";
import { FileUploadField } from "./FileUploadField";
import { CustomerFields } from "./CustomerFields";
import { BackButton, PrivacyConsent, SuccessPanel } from "./FormShell";
import { FormMessage } from "./FormMessage";
import { HoneypotField } from "./HoneypotField";
import { newRequestId, postRequest } from "./submit";
import { LIMITS, isValidEmail } from "@/lib/validation/forms";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ onBack }: { onBack: () => void }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [attachmentFailed, setAttachmentFailed] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const submitting = useRef(false);
  const requestId = useRef<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const payload = new FormData(event.currentTarget);

    if (!isValidEmail(String(payload.get("email") ?? "").trim())) {
      setStatus("error");
      setError("Vul een geldig e-mailadres in.");
      return;
    }

    submitting.current = true;
    setStatus("submitting");
    setError("");
    requestId.current ??= newRequestId();
    payload.set("requestId", requestId.current);

    const outcome = await postRequest("/api/contact", { method: "POST", body: payload });
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
        <SuccessPanel title="Bedankt voor je bericht" attachmentFailed={attachmentFailed}>
          We hebben je bericht ontvangen en reageren zo snel mogelijk.
        </SuccessPanel>
      </div>
    );
  }

  return (
    <div className="form-shell">
      <BackButton onBack={onBack} />
      <h1 style={{ fontSize: "var(--fs-h2)", marginTop: 20 }}>
        Stuur ons een <em>bericht</em>
      </h1>
      <p style={{ marginTop: 12, color: "var(--ink-soft)", fontSize: "var(--fs-md)" }}>
        Een vraag, een idee of een eerste schets? Laat het ons weten.
      </p>

      <form onSubmit={handleSubmit} aria-busy={status === "submitting"} className="form-card">
        <HoneypotField />
        <p className="hint">Velden met een * zijn verplicht.</p>
        <CustomerFields prefix="contact" />
        <div className="field">
          <label htmlFor="contact-bericht" className="label">
            Bericht <span className="req" aria-hidden="true">*</span>
          </label>
          <textarea id="contact-bericht" name="bericht" rows={5} maxLength={LIMITS.bericht} required className="textarea" />
        </div>
        <FileUploadField id="contact-logo" name="logo" label="Bestand toevoegen (optioneel)" />
        <PrivacyConsent checked={privacy} onChange={setPrivacy} />
        {status === "error" && <FormMessage kind="error">{error}</FormMessage>}
        <button type="submit" className="btn btn-primary" disabled={status === "submitting" || !privacy}>
          {status === "submitting" ? "Versturen…" : "Verstuur bericht"}
        </button>
        {!privacy && status !== "submitting" && <p className="hint">Vink het vakje hierboven aan om te kunnen versturen.</p>}
      </form>
    </div>
  );
}
