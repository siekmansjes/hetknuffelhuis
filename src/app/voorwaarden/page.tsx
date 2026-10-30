import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { COMPANY, buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Algemene voorwaarden",
  description: "De algemene voorwaarden die gelden voor offertes, bestellingen en leveringen van Het Knuffelhuis.",
  path: "/voorwaarden",
});

// Dezelfde voorwaarden als Parkmade (betaling 50/50, 14 dagen klachttermijn,
// 30 dagen geldigheid, enz.), zo bepaald door de eigenaar.
const LAST_UPDATED = "30 oktober 2026";

export default function VoorwaardenPage() {
  const contact = COMPANY.email ? <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> : "het contactformulier op deze website";
  const identity = [COMPANY.kvk && `KvK-nummer ${COMPANY.kvk}`, COMPANY.btwId && `btw-identificatienummer ${COMPANY.btwId}`, COMPANY.postcodePlaats && `gevestigd te ${COMPANY.postcodePlaats}`]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="section" style={{ paddingTop: "clamp(36px, 5vw, 72px)" }}>
      <div className="wrap wrap--narrow">
        <Breadcrumbs items={[{ name: "Algemene voorwaarden" }]} />
        <div className="prose" style={{ marginTop: 28 }}>
          <h1>Algemene voorwaarden</h1>
          <p className="hint">Laatst bijgewerkt: {LAST_UPDATED}</p>
          {!COMPANY.kvk && <p className="placeholder-note">Concept: bedrijfsgegevens nog invullen.</p>}

          <p>
            Deze algemene voorwaarden zijn van toepassing op alle offertes, bestellingen en overeenkomsten tussen Het Knuffelhuis{identity ? ` (${identity})` : ""} en de opdrachtgever, tenzij schriftelijk anders is overeengekomen.
          </p>

          <h2>1. Toepasselijkheid</h2>
          <p>
            Deze voorwaarden gelden voor iedere offerte en overeenkomst tussen Het Knuffelhuis en een opdrachtgever, voor zover van deze voorwaarden niet door partijen uitdrukkelijk en schriftelijk is afgeweken. Eventuele inkoop- of andere voorwaarden van de opdrachtgever worden uitdrukkelijk van de hand gewezen.
          </p>

          <h2>2. Offertes en totstandkoming van de overeenkomst</h2>
          <p>
            Alle offertes van Het Knuffelhuis zijn vrijblijvend en 30 dagen geldig vanaf de offertedatum, tenzij in de offerte een andere termijn staat. Een overeenkomst komt pas tot stand op het moment dat de opdrachtgever de offerte schriftelijk (waaronder per e-mail) bevestigt, of Het Knuffelhuis op verzoek van de opdrachtgever met de uitvoering start.
          </p>

          <h2>3. Prijzen</h2>
          <p>
            Alle prijzen zijn in euro’s en exclusief btw, tenzij anders vermeld. Prijzen zijn gebaseerd op de in de offerte genoemde aantallen, materialen en uitvoering; wijzigingen hierin kunnen leiden tot een aangepaste prijs, die vooraf met de opdrachtgever wordt afgestemd.
          </p>

          <h2>4. Ontwerp, prototype of sample en akkoord</h2>
          <p>
            Voordat een bestelling in productie gaat, ontvangt de opdrachtgever een mockup, prototype of sample ter goedkeuring. Productie start pas na schriftelijk akkoord van de opdrachtgever op dit ontwerp. Fouten (bijvoorbeeld in tekst, kleur of logo) die pas na dit akkoord worden ontdekt, komen voor rekening van de opdrachtgever, tenzij de fout is veroorzaakt door Het Knuffelhuis en niet zichtbaar was in het goedgekeurde ontwerp.
          </p>

          <h2>5. Levering en levertijd</h2>
          <p>
            Genoemde levertijden zijn indicatief en gaan in na ontvangst van het ontwerpakkoord en, indien van toepassing, de aanbetaling. Overschrijding van een levertijd geeft de opdrachtgever geen recht op schadevergoeding, tenzij uitdrukkelijk anders is overeengekomen.
          </p>

          <h2>6. Betaling</h2>
          <p>
            Tenzij in de offerte anders is aangegeven, geldt de volgende betalingsregeling: 50% van het offertebedrag wordt vooraf gefactureerd en is verschuldigd bij opdrachtbevestiging; de productie start na ontvangst van deze aanbetaling. De resterende 50% wordt gefactureerd bij levering en dient binnen 14 dagen na factuurdatum te zijn voldaan. Bij overschrijding van deze betaaltermijn is de opdrachtgever van rechtswege in verzuim en is Het Knuffelhuis gerechtigd wettelijke (handels)rente en redelijke incassokosten in rekening te brengen.
          </p>

          <h2>7. Eigendomsvoorbehoud</h2>
          <p>Alle door Het Knuffelhuis geleverde producten blijven eigendom van Het Knuffelhuis totdat de opdrachtgever alle uit de overeenkomst verschuldigde bedragen volledig heeft voldaan.</p>

          <h2>8. Annulering en wijziging</h2>
          <p>
            Omdat producten specifiek voor de opdrachtgever op maat worden gemaakt, kan een bevestigde bestelling niet kosteloos worden geannuleerd zodra de productie is gestart. Bij annulering na orderbevestiging maar vóór productiestart is de opdrachtgever de reeds gemaakte kosten (waaronder ontwerp- en voorbereidingskosten) verschuldigd; bij annulering na productiestart is de volledige offerteprijs verschuldigd.
          </p>

          <h2>9. Aansprakelijkheid</h2>
          <p>
            De aansprakelijkheid van Het Knuffelhuis voor schade die voortvloeit uit de uitvoering van de overeenkomst is beperkt tot het bedrag dat voor de betreffende bestelling in rekening is gebracht. Het Knuffelhuis is nooit aansprakelijk voor indirecte schade, waaronder gevolgschade, gederfde winst of reputatieschade. Deze beperking geldt niet bij opzet of bewuste roekeloosheid van Het Knuffelhuis.
          </p>

          <h2>10. Klachten</h2>
          <p>
            Klachten over een levering dienen binnen 14 dagen na ontvangst schriftelijk te worden gemeld via {contact}, onder vermelding van het offertenummer en een duidelijke omschrijving van de klacht. Na deze termijn wordt de levering geacht te zijn geaccepteerd.
          </p>

          <h2>11. Intellectueel eigendom</h2>
          <p>
            Een door de opdrachtgever aangeleverd logo of ontwerp blijft eigendom van de opdrachtgever; Het Knuffelhuis gebruikt dit uitsluitend voor de uitvoering van de overeenkomst. Het Knuffelhuis mag geleverd werk, tenzij de opdrachtgever hier vooraf schriftelijk bezwaar tegen maakt, tonen als voorbeeld van haar werk (bijvoorbeeld op de website of in een portfolio).
          </p>

          <h2>12. Overmacht</h2>
          <p>
            Het Knuffelhuis is niet gehouden tot nakoming van een verplichting als zij daartoe verhinderd is door overmacht, waaronder in ieder geval wordt verstaan: vertraging of tekortkoming bij een leverancier, transportproblemen, en andere omstandigheden buiten de redelijke invloed van Het Knuffelhuis.
          </p>

          <h2>13. Toepasselijk recht en geschillen</h2>
          <p>
            Op alle overeenkomsten met Het Knuffelhuis is Nederlands recht van toepassing. Geschillen worden bij voorkeur in onderling overleg opgelost; komen partijen er niet uit, dan is de bevoegde rechter in het arrondissement waar Het Knuffelhuis is gevestigd bij uitsluiting bevoegd.
          </p>

          <h2>14. Contact</h2>
          <p>Vragen over deze algemene voorwaarden kun je sturen via {contact}.</p>
        </div>
      </div>
    </section>
  );
}
