import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CookieSettingsButton } from "@/components/CookieNotice";
import { ANALYTICS_CONFIGURED, CONSENT_STORAGE_KEY } from "@/lib/consent";
import { COMPANY, buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacybeleid",
  description: "Hoe Het Knuffelhuis omgaat met persoonsgegevens die via deze website worden verzameld.",
  path: "/privacy",
});

// TODO: datum bijwerken bij elke inhoudelijke wijziging en de tekst laten
// controleren (afgeleid van het privacybeleid van Parkmade).
const LAST_UPDATED = "[DATUM]";

export default function PrivacyPage() {
  const contact = COMPANY.email ? (
    <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
  ) : (
    "het contactformulier op deze website"
  );

  return (
    <section className="section" style={{ paddingTop: "clamp(36px, 5vw, 72px)" }}>
      <div className="wrap wrap--narrow">
        <Breadcrumbs items={[{ name: "Privacybeleid" }]} />
        <div className="prose" style={{ marginTop: 28 }}>
          <h1>Privacybeleid</h1>
          <p className="hint">Laatst bijgewerkt: {LAST_UPDATED}</p>
          {!COMPANY.kvk && <p className="placeholder-note">Concept: bedrijfsgegevens en datum nog invullen en tekst laten controleren.</p>}

          <p>Dit privacybeleid legt uit welke persoonsgegevens Het Knuffelhuis verzamelt via deze website, waarom, en wat jouw rechten daarbij zijn.</p>

          <h2>1. Wie zijn wij</h2>
          <p>
            Het Knuffelhuis is verantwoordelijk voor de verwerking van persoonsgegevens die via deze website worden verzameld. Vragen over dit privacybeleid kun je sturen via {contact}.
          </p>

          <h2>2. Welke gegevens verzamelen wij</h2>
          <p>Via het contactformulier, de offerteaanvraag en de sampleaanvraag kun je de volgende gegevens met ons delen:</p>
          <ul>
            <li>Naam</li>
            <li>Bedrijfs- of organisatienaam (optioneel)</li>
            <li>E-mailadres</li>
            <li>Telefoonnummer (optioneel)</li>
            <li>De inhoud van je bericht, of bij een offerteaanvraag: waarvoor je een offerte wilt, het aantal, formaat, gewenste levering en je omschrijving</li>
            <li>Alleen bij een sampleaanvraag: je verzendadres (straat en huisnummer, postcode, plaats en land), de gekozen kledingstukken, kwaliteit en maten en eventuele opmerkingen</li>
            <li>Een eventueel bijgevoegd logo, schets of ander bestand (maximaal 4 MB; alleen bij het contactformulier en de offerteaanvraag)</li>
          </ul>
          <p>
            Een bijgevoegd bestand wordt via onze server naar HubSpot gestuurd en daar als privébestand opgeslagen: het is alleen zichtbaar voor medewerkers van Het Knuffelhuis die in HubSpot zijn ingelogd en wordt niet openbaar gedeeld. Wij slaan het bestand zelf niet op onze server op.
          </p>
          <p>
            Om misbruik van de formulieren te beperken, gebruiken we een verborgen veld dat echte bezoekers niet invullen en een begrenzing van het aantal aanvragen per IP-adres. Het IP-adres wordt daarvoor kortdurend in het werkgeheugen van de server bijgehouden en niet in HubSpot opgeslagen. Onze hostingprovider kan daarnaast zelf het aantal verzoeken per IP-adres tellen om misbruik te beperken.
          </p>

          <h2>3. Waarvoor gebruiken wij deze gegevens</h2>
          <p>Wij gebruiken de gegevens die je invult om:</p>
          <ul>
            <li>contact met je op te nemen naar aanleiding van je bericht of aanvraag;</li>
            <li>je een bevestiging per e-mail te sturen dat we je bericht of aanvraag hebben ontvangen;</li>
            <li>je offerteaanvraag te verwerken en op te volgen;</li>
            <li>je sampleaanvraag te verwerken: je verzendadres gebruiken om een voorbeeld van de kleding naar je te sturen en de afspraken over verzending en retourneren met je af te stemmen.</li>
          </ul>
          <p>
            De grondslag hiervoor is de uitvoering van (voorbereidende handelingen voor) een overeenkomst, en ons gerechtvaardigd belang om op zakelijke aanvragen te reageren.
          </p>

          <h2>4. Met wie delen wij gegevens</h2>
          <p>
            Wij gebruiken HubSpot als CRM-systeem om contactaanvragen, offerteverzoeken en sampleaanvragen te beheren. Gegevens die je via een formulier op deze website invult, worden vanaf onze server naar HubSpot gestuurd en daar opgeslagen als contactpersoon (en, bij een ingevulde bedrijfsnaam, ook als bedrijf). Je aanvraag wordt daarnaast vastgelegd als aanvraag (deal) met een notitie. Bij een sampleaanvraag slaan we je adres ook op bij je contactpersoon.
          </p>
          <p>Onze website wordt gehost bij een externe hostingprovider. Formulieraanvragen lopen daarom via de servers van die provider voordat ze HubSpot bereiken.</p>
          <p>
            Na een geslaagde aanvraag kunnen we je een bevestiging per e-mail sturen. Daarvoor gebruiken we Resend, een dienst voor het versturen van e-mail. Resend ontvangt je e-mailadres, je voornaam en de samenvatting van je aanvraag, alleen om die ene mail te versturen. Dit is een bevestiging van je aanvraag, geen marketingmail. Wij delen je gegevens niet met andere partijen voor marketingdoeleinden.
          </p>

          <h2>5. Hoe lang bewaren wij gegevens</h2>
          <p>
            Wij bewaren je gegevens zo lang als nodig is om je aanvraag te beantwoorden, en bij een klantrelatie zo lang als nodig voor die relatie en de daaruit voortvloeiende (wettelijke) verplichtingen. Je verzendadres bewaren we zolang het nodig is voor de verzending en het retourneren van een sample. Wil je dat je gegevens eerder worden verwijderd, neem dan contact met ons op via {contact}.
          </p>

          <h2 id="cookies">6. Cookies en lokale opslag</h2>
          <p>
            <strong>Noodzakelijk.</strong> Deze website plaatst zelf geen cookies die voor de werking nodig zijn.
            {ANALYTICS_CONFIGURED && (
              <>
                {" "}
                Je cookiekeuze onthouden we in de lokale opslag van je browser (<code>{CONSENT_STORAGE_KEY}</code>); die informatie blijft in je eigen browser staan.
              </>
            )}
          </p>
          <p>
            <strong>Analytics.</strong>{" "}
            {ANALYTICS_CONFIGURED ? (
              <>
                Alleen als je daar toestemming voor geeft, gebruiken we Google Analytics om te meten hoe bezoekers onze website gebruiken (bijvoorbeeld welke pagina’s bezocht worden). Google Analytics plaatst hiervoor cookies. Zonder toestemming wordt Google Analytics niet geladen. Je kunt je keuze op elk moment wijzigen via <CookieSettingsButton /> onderaan elke pagina. Trek je toestemming in, dan stopt de meting direct en verwijderen we de bijbehorende cookies.
              </>
            ) : (
              <>Op dit moment gebruiken we geen analytics of andere tracking.</>
            )}
          </p>

          <h2>7. Jouw rechten</h2>
          <p>
            Je hebt het recht om je gegevens in te zien, te laten corrigeren of te laten verwijderen, en om bezwaar te maken tegen de verwerking ervan. Neem hiervoor contact met ons op via {contact}. Je hebt ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens.
          </p>

          <h2>8. Beveiliging</h2>
          <p>Wij nemen passende technische en organisatorische maatregelen om je gegevens te beschermen tegen verlies of onrechtmatig gebruik.</p>

          <h2>9. Wijzigingen</h2>
          <p>
            Dit privacybeleid kan worden aangepast, bijvoorbeeld wanneer we nieuwe functionaliteit toevoegen aan de website. De datum bovenaan deze pagina geeft aan wanneer het beleid voor het laatst is bijgewerkt.
          </p>
        </div>
      </div>
    </section>
  );
}
