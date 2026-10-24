"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FormMessage } from "./FormMessage";

export function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button type="button" onClick={onBack} className="back-link">
      <span aria-hidden="true">←</span> Terug naar de keuze
    </button>
  );
}

/** Succesweergave na een verstuurd formulier. */
export function SuccessPanel({ title, children, attachmentFailed }: { title: string; children: ReactNode; attachmentFailed: boolean }) {
  return (
    <>
      <h1 style={{ fontSize: "var(--fs-h2)", marginTop: 20 }}>{title}</h1>
      <div className="form-card">
        <FormMessage kind="success">
          {children}
          {attachmentFailed && " Het bijgevoegde bestand is helaas niet goed aangekomen. Stuur het ons gerust nog een keer na, dan nemen we het mee."}
        </FormMessage>
        <p>
          <Link href="/" className="link-arrow">
            Terug naar de homepage
          </Link>
        </p>
      </div>
    </>
  );
}

export function PrivacyConsent({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="consent">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>
        Ik ga akkoord dat Het Knuffelhuis mijn gegevens gebruikt om op deze aanvraag te reageren.{" "}
        <Link href="/privacy" target="_blank">
          Lees het privacybeleid
        </Link>
        .
      </span>
    </label>
  );
}
