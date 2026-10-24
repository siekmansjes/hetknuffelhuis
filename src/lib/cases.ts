// De drie meest recente knuffelprojecten.
//
// LET OP: dit is voorbeeldinhoud (`isExample: true`). De teksten tussen
// [vierkante haken] en de fotovakken moeten vervangen worden door de echte
// gegevens en foto's van de drie projecten. Zodra dat gebeurd is: zet
// `isExample` op false (of haal het veld weg), dan verdwijnt de gele
// voorbeeldmelding vanzelf.
//
// Foto's: zet de bestanden in /public/cases/<slug>/ en vul `image` /
// `photo` in met het pad, bv. "/cases/case-1/hero.webp".

export type CaseTone = "sky" | "iris" | "lilac" | "deep" | "surface";

export type CaseDetail = {
  title: string;
  text: string;
  tone: CaseTone;
  /** Pad naar de echte foto, bv. "/cases/case-1/borduurwerk.webp". */
  photo?: string;
  /** Alt-tekst bij de foto. */
  alt?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  /** Korte teaser voor de overzichten. */
  teaser: string;
  klant: string;
  sector: string;
  jaar: string;
  aantal: string;
  formaat: string;
  opdracht: string;
  aanpak: string;
  resultaat: string;
  tone: CaseTone;
  /** Hoofdfoto (wordt in de kaart en bovenaan de casepagina getoond). */
  image?: string;
  imageAlt?: string;
  details: CaseDetail[];
  isExample?: boolean;
};

const DETAIL_TITLES = ["Borduurwerk", "Label & hangtag", "Stof & vacht", "Verpakking"] as const;
const DETAIL_TONES: CaseTone[] = ["sky", "iris", "lilac", "deep"];

function exampleDetails(): CaseDetail[] {
  return DETAIL_TITLES.map((title, i) => ({
    title,
    text: "[Korte toelichting bij deze foto: wat zie je hier en waarom is het bijzonder?]",
    tone: DETAIL_TONES[i],
  }));
}

export const cases: CaseStudy[] = [
  {
    slug: "case-1",
    title: "[Titel van het eerste project]",
    teaser: "[Eén of twee zinnen over dit project: voor wie, welke knuffel en wat maakt hem bijzonder.]",
    klant: "[Klantnaam]",
    sector: "[Sector]",
    jaar: "[Jaar]",
    aantal: "[Aantal]",
    formaat: "[Formaat]",
    opdracht: "[Wat wilde de opdrachtgever? Welk karakter, merk of verhaal moest er een knuffel van worden?]",
    aanpak: "[Hoe zijn jullie te werk gegaan? Van schets en prototype tot productie.]",
    resultaat: "[Wat is er geleverd, en hoe is de knuffel ontvangen?]",
    tone: "surface",
    details: exampleDetails(),
    isExample: true,
  },
  {
    slug: "case-2",
    title: "[Titel van het tweede project]",
    teaser: "[Eén of twee zinnen over dit project: voor wie, welke knuffel en wat maakt hem bijzonder.]",
    klant: "[Klantnaam]",
    sector: "[Sector]",
    jaar: "[Jaar]",
    aantal: "[Aantal]",
    formaat: "[Formaat]",
    opdracht: "[Wat wilde de opdrachtgever? Welk karakter, merk of verhaal moest er een knuffel van worden?]",
    aanpak: "[Hoe zijn jullie te werk gegaan? Van schets en prototype tot productie.]",
    resultaat: "[Wat is er geleverd, en hoe is de knuffel ontvangen?]",
    tone: "surface",
    details: exampleDetails(),
    isExample: true,
  },
  {
    slug: "case-3",
    title: "[Titel van het derde project]",
    teaser: "[Eén of twee zinnen over dit project: voor wie, welke knuffel en wat maakt hem bijzonder.]",
    klant: "[Klantnaam]",
    sector: "[Sector]",
    jaar: "[Jaar]",
    aantal: "[Aantal]",
    formaat: "[Formaat]",
    opdracht: "[Wat wilde de opdrachtgever? Welk karakter, merk of verhaal moest er een knuffel van worden?]",
    aanpak: "[Hoe zijn jullie te werk gegaan? Van schets en prototype tot productie.]",
    resultaat: "[Wat is er geleverd, en hoe is de knuffel ontvangen?]",
    tone: "surface",
    details: exampleDetails(),
    isExample: true,
  },
];

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}
