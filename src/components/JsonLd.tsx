// Structured data als JSON-LD. `<` wordt ge-escaped zodat geen tekst in de
// data het script-element kan afsluiten.
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
