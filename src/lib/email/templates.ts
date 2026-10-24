// Bouwt de bevestigingsmail (onderwerp, platte tekst en HTML) uit de teksten
// in copy.ts en de gegevens van de aanvraag. Bewust zonder imports, zodat dit
// bestand los te testen is. Alle bezoekerstekst wordt voor de HTML ge-escaped.

import type { EmailCopy, EmailKind } from "./copy";

export type EmailSignature = {
  logoUrl: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  lines: { text: string; href?: string; bold?: boolean }[];
};

export type SummaryLine = { label: string; value: string };

export type ConfirmationData = {
  kind: EmailKind;
  naam: string;
  /** Regels van de samenvatting (producten, adres, bericht). */
  summary: SummaryLine[][];
};

/** De teksten (uit copy.ts), als parameter zodat dit bestand zonder imports blijft. */
export type EmailTexts = {
  copy: Record<EmailKind, EmailCopy>;
  signoff: string;
  signature: EmailSignature;
};

export type Confirmation = { subject: string; text: string; html: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fill(template: string, naam: string): string {
  return template.replace(/\{naam\}/g, naam);
}

/** De handtekening als HTML, ook los bruikbaar om in een mailprogramma te plakken. */
export function buildSignatureHtml(signature: EmailSignature): string {
  return (
    `<div style="margin:0;font-size:13px;line-height:1.5;color:#6b5a66;font-family:Arial,Helvetica,sans-serif">` +
    (signature.logoUrl
      ? `<img src="${escapeHtml(signature.logoUrl)}" alt="${escapeHtml(signature.logoAlt)}" width="${signature.logoWidth}" height="${signature.logoHeight}" style="display:block;border:0;margin:0 0 8px">`
      : "") +
    signature.lines
      .map((l) => {
        const inner = l.bold ? `<strong>${escapeHtml(l.text)}</strong>` : escapeHtml(l.text);
        return l.href ? `<a href="${escapeHtml(l.href)}" style="color:#6b5a66">${inner}</a>` : inner;
      })
      .join("<br>") +
    `</div>`
  );
}

// Eén groep = één product/blok; de regels staan onder elkaar, met een lege regel tussen groepen.
export function buildConfirmation(data: ConfirmationData, texts: EmailTexts): Confirmation {
  const copy = texts.copy[data.kind];
  const { signoff, signature } = texts;
  const greeting = fill(copy.greeting, data.naam);

  const text = [
    greeting,
    ...copy.intro,
    data.summary.length ? copy.summaryHeading : "",
    ...data.summary.map((group) => group.map((l) => (l.label ? `${l.label}: ${l.value}` : l.value)).join("\n")),
    ...copy.outro,
    [signoff, ...signature.lines.map((l) => l.text)].join("\n"),
  ]
    .filter((part) => part !== "")
    .join("\n\n");

  const p = (value: string) => `<p style="margin:0 0 14px;line-height:1.55">${escapeHtml(value)}</p>`;
  const summaryHtml = data.summary.length
    ? `<p style="margin:18px 0 8px;font-weight:bold">${escapeHtml(copy.summaryHeading)}</p>` +
      data.summary
        .map(
          (group) =>
            `<div style="margin:0 0 10px;padding:10px 12px;background:#f6efe2;border-radius:4px;line-height:1.5">` +
            group
              .map((l) =>
                l.label
                  ? `<span style="color:#6b5a66">${escapeHtml(l.label)}:</span> ${escapeHtml(l.value).replace(/\n/g, "<br>")}`
                  : escapeHtml(l.value).replace(/\n/g, "<br>")
              )
              .join("<br>") +
            `</div>`
        )
        .join("")
    : "";

  const signatureHtml = buildSignatureHtml(signature);

  const html =
    `<!doctype html><html lang="nl"><body style="margin:0;padding:24px;background:#ffffff;color:#2a1e2e;font-family:Arial,Helvetica,sans-serif;font-size:15px">` +
    `<div style="max-width:560px">` +
    p(greeting) +
    copy.intro.map(p).join("") +
    summaryHtml +
    `<div style="height:8px"></div>` +
    copy.outro.map(p).join("") +
    `<p style="margin:18px 0 10px">${escapeHtml(signoff)}</p>` +
    signatureHtml +
    `</div></body></html>`;

  return { subject: copy.subject, text, html };
}
