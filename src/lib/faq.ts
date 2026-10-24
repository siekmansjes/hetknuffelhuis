import { PLUSH_MINIMUM } from "@/lib/site";

export type FaqEntry = { question: string; answer: string[] };

// TODO: controleer levertijd, prototype-/sample-werkwijze en veiligheidsnormen
// voordat de site live gaat; deze antwoorden zijn voorzichtig geformuleerd.
export const faqs: FaqEntry[] = [
  {
    question: "Wat is de minimale afname voor knuffels?",
    answer: [
      `Knuffels op maat maken we vanaf ${PLUSH_MINIMUM} stuks. Dat past bij een knuffel die helemaal naar jouw ontwerp wordt gemaakt: vorm, kleur, materiaal en afwerking.`,
    ],
  },
  {
    question: "Voor wie maken jullie knuffels?",
    answer: [
      "Voor bedrijven, organisaties, merken, verenigingen en andere opdrachtgevers die een eigen mascotte of karakter als knuffel willen laten maken, bijvoorbeeld als relatiegeschenk, verkoopartikel of cadeau voor klanten en medewerkers.",
    ],
  },
  {
    question: "Wat als ik nog geen ontwerp heb?",
    answer: [
      "Geen probleem. Een schets, een logo of een eerste idee is genoeg om mee te beginnen. We denken mee over vorm en uitvoering en vertalen jouw idee naar een knuffel.",
    ],
  },
  {
    question: "Wat kost een knuffel op maat?",
    answer: [
      "Dat hangt af van het ontwerp, het formaat, de gekozen materialen, de details (zoals borduurwerk) en het aantal. Daarom werken we met een offerte op maat. Vraag hem aan via het formulier; je hoeft daarvoor nog geen definitief ontwerp te hebben.",
    ],
  },
  {
    question: "Hoe lang duurt het voor mijn knuffels klaar zijn?",
    answer: [
      "De levertijd hangt af van het ontwerp en het aantal. In de offerte geven we een verwachte levertijd. Heb je een vaste datum, bijvoorbeeld voor een lancering of evenement, geef die dan aan in de aanvraag, dan kijken we of het haalbaar is.",
    ],
  },
  {
    question: "Zijn de knuffels veilig voor kinderen?",
    answer: ["Onze knuffels worden gemaakt en getest volgens de geldende EU-normen, en zijn veilig voor alle leeftijden."],
  },
  {
    question: "Kan ik ook merchandise en kleding laten maken?",
    answer: [
      "Ja. Naast knuffels maken we sleutelhangers, tijdelijke tattoo’s, magneten, petjes en kleding. Zo krijg je een set die bij elkaar past, in dezelfde stijl als je knuffel.",
    ],
  },
  {
    question: "Kan ik een sample van kleding aanvragen?",
    answer: [
      "Ja. Van kleding kun je een sample aanvragen om de kwaliteit te voelen en een maat te kiezen, bijvoorbeeld het verschil tussen comfort en premium. Vraag het aan via het contactformulier.",
    ],
  },
  {
    question: "Hoe lever ik mijn ontwerp aan?",
    answer: [
      "Je kunt een logo, schets of afbeelding uploaden in het offerteformulier (png, jpg, pdf, ai of eps tot 4 MB). Is je bestand groter of heb je er meerdere, stuur ze ons dan na je aanvraag per mail.",
    ],
  },
];
