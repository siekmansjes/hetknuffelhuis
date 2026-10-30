# Livegang Het Knuffelhuis

Checklist om de site live te zetten. Vink af wat klaar is. Geen geheime waarden in dit bestand.

## 1. Inhoud en gegevens (blokkerend)

- [ ] **Bedrijfsgegevens** in `src/lib/site.ts` → `COMPANY`: e-mail, telefoon (+ internationaal formaat), KvK, btw-id, postcode en plaats, Instagram/LinkedIn. Lege velden worden nergens getoond. Zonder e-mailadres sturen de formulieren geen bevestigingsmail.
- [ ] **Uitgelichte projecten** (Mopi en Gigi) in `src/lib/cases.ts`: per stap `status`, `text` en `photos` invullen zodra er updates zijn. Stappen zonder update tonen "Info volgt".
- [ ] **Eigen foto's** in plaats van de tijdelijke voorbeeldbeelden (alle bevatten derden-branding of komen uit Parkmade):
  - hero (`public/beeld/knuffels-voorbeeld.webp`)
  - `/knuffels` (`public/beeld/knuffel-groen-voorbeeld.webp`)
  - sleutelhangers, magneten, tattoo's, petje (`public/beeld/*-voorbeeld.webp`), plus kleding (nu fotovak)
  - cases (`public/cases/mopi`, `gigi`; stap-foto’s komen erbij) en "Zit in de details" op de homepage (nu fotovak)
  - zoek in de code op `TODO: IMAGE ASSET NEEDED`
- [x] **Teksten bevestigd** (30 oktober 2026): CE/EN 71/GPSR met rapport van een erkend testbureau, vaste producenten en designers, prototype altijd ter goedkeuring, kledingsamples (t-shirt, petje, hoodie), minimale aantallen en prijzen van Parkmade op de site. Levertijden blijven "in overleg".
- [ ] **Privacy** (`/privacy`): datum invullen. De **algemene voorwaarden** zijn gelijk aan die van Parkmade (50% aanbetaling, 14 dagen klachttermijn, 30 dagen offertegeldigheid); ze tonen een concept-melding totdat `COMPANY.kvk` gevuld is.

## 2. Accounts en omgeving

- [ ] **Domein** registreren en aan het Vercel-project koppelen.
- [ ] **Vercel-omgevingsvariabelen** (zie `.env.example`):

| Naam | Waar | Opmerking |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | alle omgevingen | het echte domein, bv. `https://hetknuffelhuis.nl` |
| `NEXT_PUBLIC_ENABLE_INDEXING` | **alleen Production** | `true`; zonder dit blijft de site noindex |
| `HUBSPOT_PRIVATE_API_TOKEN` | Production (+ Preview) | zonder token geven de formulieren op productie een foutmelding |
| `HUBSPOT_DEAL_PIPELINE_ID`, `HUBSPOT_DEAL_STAGE_ID`, `HUBSPOT_DEAL_OWNER_ID` | Production | eigen pipeline en fase; niet die van Parkmade |
| `RESEND_API_KEY` | Production | optioneel; zonder sleutel geen bevestigingsmail |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Production | optioneel; zonder ID geen tracking en geen cookiemelding |

- [ ] **HubSpot Private App** met scopes: contacten (lezen/schrijven), bedrijven (lezen/schrijven), deals (lezen/schrijven), notities (schrijven) en bestanden.
- [ ] **Resend**: afzenderdomein verifiëren; afzender is `COMPANY.email`. Het mail-logo (`/email/logo.png`) werkt pas op het echte domein.

## 3. Rate limit

In de code: maximaal 6 verzoeken per IP per 10 minuten per serverless-instantie (`src/lib/spamGuard.ts`). Zet als vangnet ook een Vercel Firewall-regel (Firewall, Configure, New Rule):

| Veld | Waarde |
|---|---|
| Naam | Formulieren rate limit |
| If | Request Path starts with `/api/` en Method equals `POST` |
| Then | Rate Limit, key IP Address, Fixed Window, 10 minuten, limiet 12, actie 429 |

## 4. Productietest (handmatig, eenmalig per formulier)

Gebruik een eigen testadres en markeer alles in HubSpot als test.

1. **Offerte** (`/contact?mode=offerte`): vul alles in, voeg een kleine png toe. Verwacht: bevestiging op het scherm, een contact en deal (`Offerteaanvraag – <bedrijf> – <naam>`) in HubSpot met een notitie, het bestand als privébijlage, en de bevestigingsmail.
2. **Kleding-sample** (`?mode=samples`): deal `Sampleaanvraag – …` met kledingstukken, kwaliteit, maten en verzendadres.
3. **Bericht** (`?mode=contact`): deal `Bericht – <naam>`.
4. Controleer dat een ongeldig e-mailadres, een leeg verplicht veld en een te groot of fout bestandstype een duidelijke fout geven.
5. Cookiemelding (alleen als GA is ingesteld): "Alleen noodzakelijk" mag geen `_ga`-cookies of verzoeken naar googletagmanager.com geven.

## 5. Laatste controles

- [ ] Mobiel (iPhone en Android), Safari, Chrome en Firefox.
- [ ] Deelafbeelding en favicon op het echte domein (bv. een link in WhatsApp).
- [ ] Google Search Console koppelen en `/sitemap.xml` indienen.
- [ ] `npm run build`, `npm test`, `npx tsc --noEmit` en `npx eslint` zonder fouten.
- [ ] Kwaliteit-check: Lighthouse op home en een casepagina met de echte foto's (afbeeldingsformaten, LCP).
- [ ] Lokale branches `stijl-groen` en `stijl-dynamisch` opruimen.

## Al gecontroleerd

- Contrast (WCAG AA) van alle kleurcombinaties in `globals.css`: tekst minimaal 4,5:1, veldranden en knoppen minimaal 3:1.
- Geen horizontale overflow op 390 px op de belangrijkste pagina's.
- Toetsenbord: skiplink, zichtbare focus, mobiel menu met focusbeheer.
- Beweging uit bij "minder beweging" (`prefers-reduced-motion`).
