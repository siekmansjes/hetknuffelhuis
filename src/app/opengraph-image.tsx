import { ImageResponse } from "next/og";

export const alt = "Het Knuffelhuis: knuffels op maat voor bedrijven en organisaties";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Deelafbeelding: tijdelijk typografisch. Vervang door een echte foto zodra die er is.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fdfcf9",
          padding: 72,
          color: "#2a2160",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "#2a2160", display: "flex" }} />
          <div style={{ fontSize: 44, fontWeight: 700 }}>Het Knuffelhuis</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>Jouw merk als knuffel, helemaal op maat.</div>
          <div style={{ fontSize: 34, color: "#3f5f8f", fontWeight: 600 }}>Voor bedrijven en organisaties · vanaf 500 stuks</div>
        </div>
      </div>
    ),
    size
  );
}
