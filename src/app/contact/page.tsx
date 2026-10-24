import type { Metadata } from "next";
import { ContactFlow } from "@/components/contact/ContactFlow";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Offerte aanvragen of contact opnemen",
  description: "Vraag een offerte aan voor knuffels op maat of merchandise, vraag een kleding-sample aan, of stuur ons een bericht met je idee.",
  path: "/contact",
});

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const query = await searchParams;
  const mode = typeof query.mode === "string" ? query.mode : undefined;

  return (
    <section className="section" style={{ paddingTop: "clamp(36px, 5vw, 72px)" }}>
      <div className="wrap">
        <ContactFlow initialMode={mode} />
      </div>
    </section>
  );
}
