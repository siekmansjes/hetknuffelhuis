// Uitgelichte projecten: knuffels die nu gemaakt worden. Per project laten we
// het proces zien in vier stappen. Elke stap krijgt foto's en een korte
// toelichting zodra die er zijn; tot die tijd staat er "Info volgt".
//
// Een update plaatsen: zet bij de stap `status` op "bezig" of "klaar", vul
// `text` en `photos` in. Foto's staan in /public/cases/<slug>/.

export type CaseTone = "sky" | "iris" | "lilac" | "deep" | "surface";

export type StepStatus = "volgt" | "bezig" | "klaar";

export type StepPhoto = {
  /** Pad naar de foto, bv. "/cases/mopi/prototype-1.webp". */
  src: string;
  alt: string;
  caption?: string;
  /** "contain" toont het hele beeld op wit (standaard), "cover" vult het vak (detailfoto's). */
  fit?: "contain" | "cover";
};

export type CaseStep = {
  title: string;
  /** Korte uitleg bij de stap zelf, los van de update per project. */
  summary: string;
  /** Extra uitleg bij de stap, als alinea's. Hetzelfde voor elk project. */
  more?: string[];
  status: StepStatus;
  /** De update bij dit project. Leeg laten zolang er niets te melden is. */
  text?: string;
  photos?: StepPhoto[];
  /** Tekst die getoond wordt zolang er nog geen update is. */
  soon?: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  /** Korte teaser voor de overzichten. */
  teaser: string;
  /** Waar het project nu staat, bv. "Wordt nu gemaakt". */
  status: string;
  tone: CaseTone;
  /** Hoofdfoto (kaart en bovenaan de casepagina). */
  image?: string;
  imageAlt?: string;
  steps: CaseStep[];
};

function processSteps(name: string, sketch: StepPhoto): CaseStep[] {
  return [
    {
      title: "Ontwerpschets",
      summary: "Het startpunt van elke knuffel. Alles is aan te leveren, van een tekening tot een AI-beeld.",
      more: [
        "Vanaf daar maken we een ontwerpvoorstel dat richting productie gaat. Daarin staan de maten, de afwerking, de kleurcodes en eventuele andere informatie.",
        "Tijdens deze fase denken we ook na over hoe de hangtag eruit moet zien en of er een logo op het label komt. Op de achterkant van de hangtag staat standaardinformatie, zoals een CE-keurmerk, adresgegevens en wasvoorschriften.",
        "Zo heb je een wettelijk juist gemarkeerde en gedocumenteerde knuffel die geschikt is voor alle leeftijden.",
      ],
      status: "klaar",
      text: `Het AI-beeld is de ontwerpschets van ${name}.`,
      photos: [sketch],
    },
    {
      title: "Eerste prototype",
      summary: "De eerste echte knuffel, om vorm, verhoudingen en stoffen te beoordelen.",
      status: "volgt",
    },
    {
      title: "Definitief prototype",
      summary: "Het aangepaste prototype, met alle opmerkingen verwerkt.",
      status: "volgt",
    },
    {
      title: "Het echte sample",
      summary: "De knuffel zoals hij in productie gaat, met foto’s van alle details.",
      status: "volgt",
      soon: "Info volgt. Hier komen foto’s van de details te staan.",
    },
  ];
}

export const cases: CaseStudy[] = [
  {
    slug: "mopi",
    title: "Mopi",
    teaser: "Mopi wordt nu gemaakt. Volg stap voor stap hoe Mopi van ontwerpschets tot sample groeit.",
    status: "Wordt nu gemaakt",
    tone: "surface",
    image: "/cases/mopi/hoofdfoto.webp",
    imageAlt: "Mopi, een groene pluche knuffel met gele details",
    steps: processSteps("Mopi", {
      src: "/cases/mopi/hoofdfoto.webp",
      alt: "Ontwerpschets (AI-beeld) van Mopi, een groene pluche knuffel met gele details",
      caption: "Ontwerpschets (AI-beeld)",
    }),
  },
  {
    slug: "gigi",
    title: "Gigi",
    teaser: "Gigi wordt nu gemaakt. Volg stap voor stap hoe Gigi van ontwerpschets tot sample groeit.",
    status: "Wordt nu gemaakt",
    tone: "surface",
    image: "/cases/gigi/hoofdfoto.webp",
    imageAlt: "Gigi, een zittende giraffe-knuffel met bruine vlekken, grote groene ogen en een glimlach",
    steps: processSteps("Gigi", {
      src: "/cases/gigi/hoofdfoto.webp",
      alt: "Ontwerpschets (AI-beeld) van Gigi, een zittende giraffe met bruine vlekken en grote groene ogen",
      caption: "Ontwerpschets (AI-beeld)",
    }),
  },
];

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}

/** Aantal afgeronde stappen, en de stap waar het project nu staat (1-gebaseerd). */
export function progress(item: CaseStudy): { done: number; total: number; current: CaseStep | undefined } {
  const done = item.steps.filter((s) => s.status === "klaar").length;
  const current = item.steps.find((s) => s.status === "bezig") ?? item.steps.find((s) => s.status === "volgt");
  return { done, total: item.steps.length, current };
}
