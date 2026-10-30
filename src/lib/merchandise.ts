// Het merchandise-assortiment naast de knuffels. Specificaties, minimale
// aantallen en prijzen zijn overgenomen van Parkmade (zelfde producten); de
// prijzen staan in merchandisePrices.ts. Levertijden worden per aanvraag
// afgestemd en staan hier niet.

export type MerchTone = "sky" | "iris" | "lilac" | "deep";

export type MerchItem = {
  slug: string;
  name: string;
  /** Korte regel voor de lijst op de homepage. */
  short: string;
  intro: string;
  /** Veelgestelde specificaties. */
  specs: { label: string; value: string }[];
  points: string[];
  /** Sleutels in merchPrices (merchandisePrices.ts): de producten waarvan we prijzen tonen. */
  priceIds: string[];
  tone: MerchTone;
  /** Echte of voorbeeldfoto. Zonder foto toont de pagina een fotovak. */
  photo?: string;
  photoAlt?: string;
  /** Wat voor foto hier nog nodig is (voor het fotovak). */
  photoWanted: string;
};

export const merchandise: MerchItem[] = [
  {
    slug: "sleutelhangers",
    name: "Sleutelhangers",
    short: "Zacht PVC met 2.5D-reliëf, in de vorm van jouw ontwerp.",
    intro:
      "Sleutelhangers op maat, gemaakt naar jouw eigen ontwerp en vorm. Laat je logo of karakter uitvoeren in zacht PVC met 2.5D-reliëf, met ruimte voor je logo op de achterzijde.",
    specs: [
      { label: "Materiaal", value: "Zacht PVC, 2.5D-reliëf" },
      { label: "Afmeting", value: "5-6 cm hoog" },
      { label: "Kleuren", value: "Ontwerp in tot 5 kleuren mogelijk" },
      { label: "Verpakking", value: "Per stuk in een kleine polybag" },
    ],
    points: ["Achterzijde bedrukt met eigen logo", "Geschikt voor presentatie bij de kassa"],
    priceIds: ["sleutelhanger"],
    tone: "sky",
    // TODO: IMAGE ASSET NEEDED — tijdelijk voorbeeldbeeld (met Parkmade-logo); vervangen door eigen foto.
    photo: "/beeld/sleutelhangers-voorbeeld.webp",
    photoAlt: "Verschillende sleutelhangers in zacht PVC en van pluche (voorbeeldbeeld)",
    photoWanted: "Sleutelhangers in verschillende vormen, vlak neergelegd op een lichte ondergrond",
  },
  {
    slug: "tijdelijke-tattoos",
    name: "Tijdelijke tattoo’s",
    short: "Eigen ontwerp, populair bij kinderen.",
    intro:
      "Tijdelijke tattoo met eigen ontwerp. Blijft goed zitten, ook bij contact met water, en is per stuk verpakt met de gebruiksinstructie achterop.",
    specs: [
      { label: "Materiaal", value: "Papier en recyclebare folie" },
      { label: "Afmeting", value: "5 x 5 cm" },
      { label: "Verpakking", value: "Per stuk in een polybag, met gebruiksinstructie" },
    ],
    points: ["Exclusief displaydoosje: vraag naar de mogelijkheden voor een doosje op maat"],
    priceIds: ["tijdelijke-tattoo"],
    tone: "iris",
    photo: "/beeld/tattoos-voorbeeld.webp",
    photoAlt: "Tijdelijke tattoos in zakjes, naast een displaydoos (voorbeeldbeeld)",
    photoWanted: "Tattoos in zakjes, bij voorkeur met een kind dat er één opplakt",
  },
  {
    slug: "magneten",
    name: "Magneten",
    short: "Koelkastmagneet in de vorm van jouw logo of ontwerp.",
    intro:
      "Een koelkastmagneet in de vorm van jouw logo of eigen ontwerp. Uitgevoerd in PVC met 2.5D-reliëf: een klein souvenir dat mensen graag meenemen.",
    specs: [
      { label: "Materiaal", value: "PVC, 2.5D-reliëf" },
      { label: "Afmeting", value: "5-6 cm" },
      { label: "Kleuren", value: "Ontwerp in 3-5 kleuren mogelijk" },
      { label: "Verpakking", value: "Per stuk in een kleine polybag" },
    ],
    points: ["Past goed bij een knuffel in dezelfde stijl"],
    priceIds: ["magneet"],
    tone: "lilac",
    // TODO: IMAGE ASSET NEEDED — tijdelijk voorbeeldbeeld (met Parkmade-logo); vervangen door eigen foto.
    photo: "/beeld/magneten-voorbeeld.webp",
    photoAlt: "Verschillende magneten in de vorm van dieren, objecten en logo's (voorbeeldbeeld)",
    photoWanted: "Magneten op een koelkastdeur of metalen vlak, in de stijl van een van de knuffelprojecten",
  },
  {
    slug: "petjes",
    name: "Petjes",
    short: "Trucker cap met mesh of katoenen 6-panel cap.",
    intro: "Petjes met jouw logo of eigen ontwerp, in twee uitvoeringen: een sportieve trucker cap met mesh en een klassieke katoenen cap.",
    specs: [
      { label: "Cap met mesh", value: "Polyester mesh, verstelbare sluiting, one size" },
      { label: "Cap katoen", value: "100% katoen, 6-panel, verstelbare sluiting, one size" },
      { label: "Kleuren", value: "In diverse kleuren, afgestemd op jouw huisstijl" },
    ],
    points: ["Ook bruikbaar voor medewerkers, teams en verenigingen", "Sample aan te vragen om kwaliteit en pasvorm te zien"],
    priceIds: ["cap-mesh", "cap-katoen"],
    tone: "sky",
    photo: "/beeld/pet-voorbeeld.webp",
    photoAlt: "Trucker cap met opgedrukt ontwerp (voorbeeldbeeld)",
    photoWanted: "Cap met bedrukking, schuin van voren, op een lichte achtergrond",
  },
  {
    slug: "kleding",
    name: "Kleding",
    short: "T-shirts en hoodies in comfort of premium, ook voor kinderen.",
    intro:
      "T-shirts en hoodies met jouw logo of eigen ontwerp, als merchandise of als kleding voor medewerkers, teams en verenigingen. Kies een comfort- of premiumkwaliteit; dat verschil kun je als sample zelf voelen en passen.",
    specs: [
      { label: "T-shirt comfort", value: "100% halfgekamd katoen, 150 g/m²" },
      { label: "T-shirt premium", value: "Gekamd katoen, 142 g/m², tailored fit" },
      { label: "Hoodie comfort", value: "50% katoen / 50% polyester, 270 g/m², kangoeroezak" },
      { label: "Hoodie premium", value: "60% ringgesponnen gekamd katoen / 40% polyester, 240 g/m², tailored fit, sponge-fleece binnenkant" },
      { label: "Maten", value: "Volwassenen S t/m XXL, kindermaten ook mogelijk" },
    ],
    points: ["Sample aan te vragen om maat en kwaliteit te kiezen", "Veel kleuren beschikbaar"],
    priceIds: ["t-shirt-standaard", "t-shirt-premium", "hoodie-standaard", "hoodie-premium", "t-shirt-kind-comfort", "t-shirt-kind-premium", "hoodie-kind-comfort", "hoodie-kind-premium"],
    tone: "iris",
    photoWanted: "T-shirt en hoodie met bedrukking, plat neergelegd of gedragen",
  },
];

export function getMerch(slug: string): MerchItem | undefined {
  return merchandise.find((m) => m.slug === slug);
}
