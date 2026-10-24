import { HONEYPOT_FIELD } from "@/lib/spamGuard";

// Verborgen val voor bots: mensen zien en vullen dit veld niet in.
export function HoneypotField() {
  return (
    <div aria-hidden="true" className="honeypot">
      <label>
        Laat dit veld leeg
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
