"use client";

import { useState, type ChangeEvent } from "react";
import { validateUploadMeta } from "@/lib/validation/forms";
import { FormMessage } from "./FormMessage";

export function FileUploadField({ id, name, label }: { id: string; name: string; label: string }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Dezelfde controle als op de server (max. 4 MB, toegestane typen), zodat de
  // bezoeker meteen feedback krijgt in plaats van pas na het versturen.
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setFileName(null);
      setError("");
      return;
    }
    const check = validateUploadMeta(file);
    if (!check.ok) {
      event.target.value = "";
      setFileName(null);
      setError(check.error);
      return;
    }
    setError("");
    setFileName(file.name);
  }

  const helpId = `${id}-hulp`;

  return (
    <div className="field upload-wrap">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="file"
        accept="image/*,.pdf,.ai,.eps"
        aria-describedby={helpId}
        aria-invalid={error ? true : undefined}
        onChange={handleChange}
        className="sr-only"
      />
      <label htmlFor={id} className="upload">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21.44 11.05l-9.19 9.19a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
        {fileName ?? "Kies een bestand"}
      </label>
      <p id={helpId} className="hint">
        Logo, schets of afbeelding. Png, jpg, pdf, ai of eps, maximaal 4 MB.
      </p>
      {error && <FormMessage kind="error">{error}</FormMessage>}
    </div>
  );
}
