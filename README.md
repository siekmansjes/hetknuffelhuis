# Het Knuffelhuis

Website voor Het Knuffelhuis: knuffels op maat voor bedrijven en organisaties
(vanaf 500 stuks), met een beperkt merchandise-assortiment (sleutelhangers,
tijdelijke tattoo’s, magneten, petjes en kleding). Next.js (App Router) +
TypeScript, gebouwd op de basis van de Parkmade-site (formulieren, HubSpot,
validatie, spamguard) met een eigen uitstraling.

## Starten

```bash
npm install
npm run dev      # http://localhost:3200
npm test         # validatietests
npm run build
```

Zonder `.env.local` werkt alles lokaal: de formulieren slagen dan (alleen in
development) zonder iets op te slaan. Zie `.env.example` voor HubSpot, Resend,
Google Analytics en het domein.

## Pagina's

| Pad | Inhoud |
| --- | --- |
| `/` | Home: hero, cases, details, werkwijze, merchandise, kleding-sample, FAQ |
| `/knuffels` | Knuffels op maat: mogelijkheden en specificaties |
| `/cases`, `/cases/[slug]` | De 3 laatste knuffelprojecten, met detailfoto’s |
| `/merchandise` | Sleutelhangers, tattoo’s, magneten, petjes, kleding |
| `/werkwijze`, `/faq` | Proces en veelgestelde vragen |
| `/contact` | Keuze: offerte (simpel formulier), kleding-sample, bericht |
| `/privacy`, `/voorwaarden` | Juridisch (concept, zie hieronder) |

## Uitstraling

Fris en warm: warm-wit papier, één koele lichtgrijze vlakkleur, diepe blauwe
inkt en één gedempte staalblauwe actiekleur. Geen gradients of schaduwen;
haarlijnen als scheiding en rechthoekige fotovakken met een dunne rand. Fonts:
Outfit (koppen) en DM Sans (tekst). Alle tokens staan bovenin
`src/app/globals.css`. Het logo is groen met een oranje giraf; de site laat het
logo het enige groen zijn.

## Nog in te vullen (zoek op `TODO` en `[...]`)

- **Cases** (`src/lib/cases.ts`): 3 voorbeeldcases met placeholders. Vul klant,
  aantal, formaat, jaar, teksten en detailfoto’s in en zet `isExample` weg.
  Foto’s in `public/cases/<slug>/`.
- **Foto’s**: overal waar “Foto volgt” staat is een fotovak. De hero, tattoo’s
  en petjes gebruiken tijdelijke voorbeeldbeelden uit Parkmade
  (`public/beeld/*-voorbeeld.webp`); vervang die door eigen foto’s.
- **Bedrijfsgegevens** (`src/lib/site.ts` → `COMPANY`): e-mail, telefoon, KvK,
  btw, plaats, social. Lege velden worden nergens getoond.
- **Domein**: `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_ENABLE_INDEXING` (alleen in
  productie). Tot die tijd staat de site op noindex.
- **HubSpot**: eigen token en deal-fase (`HUBSPOT_DEAL_STAGE_ID`) instellen; de
  Parkmade-pipeline wordt bewust niet hergebruikt.
- **Juridisch**: `/privacy` en `/voorwaarden` zijn afgeleid van Parkmade
  (o.a. 50% aanbetaling, 14 dagen klachttermijn). Laten controleren/aanpassen.
- **Inhoud om te bevestigen**: levertijd, mockup/sample-werkwijze, EU-normen
  (`src/lib/faq.ts`, `src/lib/process.ts`), kledingopties voor samples
  (`SAMPLE_TYPES` in `src/lib/validation/forms.ts`), en minimale aantallen en
  levertijden voor merchandise (staan bewust niet op de site).
- **"Waarom kiezen klanten voor Het Knuffelhuis?"** (home, `src/app/page.tsx`): overgenomen van de
  Parkmade-site zonder displaypunt; bevestig of alle punten kloppen, vooral CE, EN 71 en GPSR.
- **Bevestigingsmail**: Resend-sleutel + verzonden afzenderadres, en een PNG-logo
  voor de handtekening (`src/lib/email/copy.ts`).
- Google Analytics is optioneel: zonder `NEXT_PUBLIC_GA_MEASUREMENT_ID` geen
  tracking en geen cookiemelding.

## Bewust anders dan Parkmade

Alleen Nederlands (geen `/en`), geen wensenlijst/samplebox, geen prijzen- of
kennisbankpagina’s, geen HubSpot-chat. De offerte is één eenvoudig formulier in
plaats van de productregel-builder.
