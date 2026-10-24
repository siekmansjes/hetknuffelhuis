import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Het Knuffelhuis: knuffels op maat voor bedrijven en organisaties";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Deelafbeelding: het logo met de belofte. Vervang door een echte foto zodra die er is.
const logo = await readFile(join(process.cwd(), "public/email/logo-groot.png"));
const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fefefe",
          padding: 72,
          color: "#142539",
        }}
      >
        <img src={logoSrc} alt="" width={520} height={314} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 460 }}>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.08 }}>Jouw merk als knuffel, helemaal op maat.</div>
          <div style={{ fontSize: 28, color: "#2b5180", fontWeight: 600 }}>Voor bedrijven en organisaties · vanaf 500 stuks</div>
        </div>
      </div>
    ),
    size
  );
}
