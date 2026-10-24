import { after } from "next/server";
import { EMAIL_COPY, EMAIL_SIGNATURE, EMAIL_SIGNOFF, SUMMARY_LABELS as L, type EmailKind } from "@/lib/email/copy";
import { buildConfirmation, type SummaryLine } from "@/lib/email/templates";
import { sendConfirmationEmail } from "@/lib/email/send";
import type { OfferteInput, SampleInput } from "@/lib/validation/forms";

type Customer = { naam: string; email: string };

function firstName(naam: string): string {
  return naam.trim().split(/\s+/)[0] || naam;
}

/**
 * Verstuurt de bevestigingsmail ná het antwoord aan de bezoeker (`after`), zodat
 * het formulier er niet op wacht. Een mislukte mail laat de aanvraag niet
 * falen: de aanvraag staat dan al in HubSpot.
 */
function queue(kind: EmailKind, customer: Customer, summary: SummaryLine[][], idempotencyKey?: string) {
  after(async () => {
    const confirmation = buildConfirmation(
      { kind, naam: firstName(customer.naam), summary },
      { copy: EMAIL_COPY, signoff: EMAIL_SIGNOFF, signature: EMAIL_SIGNATURE }
    );
    await sendConfirmationEmail({ to: customer.email, confirmation, idempotencyKey });
  });
}

export function queueOfferteConfirmation(input: OfferteInput, bestandsnaam: string | undefined, requestId?: string) {
  const lines: SummaryLine[] = [{ label: L.wanted, value: input.wanted.map((w) => w.label).join(", ") }];
  if (input.aantal) lines.push({ label: L.quantity, value: String(input.aantal) });
  if (input.formaat) lines.push({ label: L.size, value: input.formaat });
  if (input.leverdatum) lines.push({ label: L.delivery, value: input.leverdatum });
  const summary: SummaryLine[][] = [lines, [{ label: L.description, value: input.omschrijving }]];
  if (bestandsnaam) summary.push([{ label: L.file, value: bestandsnaam }]);
  queue("offerte", input, summary, requestId);
}

export function queueSampleConfirmation(input: SampleInput, requestId?: string) {
  const lines: SummaryLine[] = [
    { label: L.sample, value: input.types.join(", ") },
    { label: L.quality, value: input.kwaliteit },
  ];
  if (input.maten.length) lines.push({ label: L.sizes, value: input.maten.join(", ") });
  const summary: SummaryLine[][] = [
    lines,
    [{ label: L.address, value: `${input.straat}\n${input.postcode} ${input.plaats}\n${input.land}` }],
  ];
  if (input.opmerkingen) summary.push([{ label: L.comments, value: input.opmerkingen }]);
  queue("samples", input, summary, requestId);
}

export function queueContactConfirmation(customer: Customer, bericht: string, bestandsnaam: string | undefined, requestId?: string) {
  const summary: SummaryLine[][] = [[{ label: "", value: bericht }]];
  if (bestandsnaam) summary.push([{ label: L.file, value: bestandsnaam }]);
  queue("contact", customer, summary, requestId);
}
