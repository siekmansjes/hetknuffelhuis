import { test } from "node:test";
import assert from "node:assert/strict";

// Dynamische import met een variabel pad: Node draait .ts direct, maar tsc
// (zonder allowImportingTsExtensions) weigert statische `.ts`-imports.
type Forms = typeof import("../src/lib/validation/forms");
const forms = (await import(new URL("../src/lib/validation/forms.ts", import.meta.url).href)) as Forms;
const { validateOfferteInput, validateSampleInput, validateContactInput } = forms;

const customer = { naam: "Test", email: "test@example.com" };

test("offerte: kies minstens één onderdeel", () => {
  const result = validateOfferteInput({ ...customer, wanted: [], omschrijving: "Een beer" });
  assert.equal(result.ok, false);
});

test("offerte: geldige aanvraag", () => {
  const result = validateOfferteInput({ ...customer, wanted: ["knuffels", "petjes"], aantal: "500", omschrijving: "Een beer" });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.aantal, 500);
    assert.deepEqual(result.value.wanted.map((w) => w.id), ["knuffels", "petjes"]);
  }
});

test("offerte: onbekend onderdeel wordt geweigerd", () => {
  const result = validateOfferteInput({ ...customer, wanted: ["raket"], omschrijving: "x" });
  assert.equal(result.ok, false);
});

test("offerte: ongeldig e-mailadres", () => {
  const result = validateOfferteInput({ naam: "Test", email: "nope", wanted: ["knuffels"], omschrijving: "x" });
  assert.equal(result.ok, false);
});

test("sample: vereist kledingstuk, kwaliteit en adres", () => {
  const base = { ...customer, straat: "Straat 1", postcode: "1234 AB", plaats: "Plaats" };
  assert.equal(validateSampleInput({ ...base, types: [], kwaliteit: "premium" }).ok, false);
  assert.equal(validateSampleInput({ ...base, types: ["hoodie"], kwaliteit: "gold" }).ok, false);
  const ok = validateSampleInput({ ...base, types: ["hoodie"], kwaliteit: "beide", maten: ["M", "L"] });
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.value.land, "Nederland");
});

test("contact: bericht is verplicht", () => {
  assert.equal(validateContactInput({ ...customer, bericht: "" }).ok, false);
  assert.equal(validateContactInput({ ...customer, bericht: "Hoi" }).ok, true);
});
