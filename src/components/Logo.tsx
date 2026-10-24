import Image from "next/image";

// Het logo (huisje met giraffe) is aangeleverd met een witte achtergrond.
// `mix-blend-mode: multiply` laat die wit precies de kleur van de pagina
// aannemen, dus er is geen transparante versie nodig op lichte vlakken.
// Origineel: bronbestanden/logo/ (niet in git).

/** Header: het huisje en de naam naast elkaar. */
export function Logo() {
  return (
    <>
      <Image
        src="/logo-mark.webp"
        alt=""
        width={320}
        height={273}
        priority
        sizes="60px"
        className="logo-mark"
      />
      <Image
        src="/logo-naam.webp"
        alt="Het Knuffelhuis"
        width={640}
        height={84}
        priority
        sizes="170px"
        className="logo-wordmark"
      />
    </>
  );
}

/** Compleet logo met tagline, voor lichte vlakken (footer-paneel). */
export function LogoFull({ width = 220 }: { width?: number }) {
  return (
    <Image
      src="/logo.webp"
      alt="Het Knuffelhuis, knuffels op maat"
      width={900}
      height={544}
      sizes={`${width}px`}
      className="logo-full"
      style={{ width, height: "auto" }}
    />
  );
}
