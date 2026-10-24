import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/lib/cases";
import { PhotoSlot } from "@/components/PhotoSlot";

export function CaseCard({ item, priority = false, large = false }: { item: CaseStudy; priority?: boolean; large?: boolean }) {
  return (
    <Link href={`/cases/${item.slug}`} className="case-card">
      <div className="case-media">
        {item.image ? (
          <div className="frame ratio-4-3" style={{ position: "relative" }}>
            <Image
              src={item.image}
              alt={item.imageAlt ?? ""}
              fill
              sizes={large ? "(max-width: 900px) 100vw, 640px" : "(max-width: 900px) 100vw, 480px"}
              priority={priority}
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <PhotoSlot
            tone={item.tone}
            ratio={large ? "4-5" : "4-3"}
            wanted="Hoofdfoto van de knuffel uit dit project"
          />
        )}
      </div>
      <div className="case-meta">
        <span>{item.sector}</span>
        <span aria-hidden="true">·</span>
        <span>{item.aantal} stuks</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.teaser}</p>
      <span className="link-arrow">Bekijk het project</span>
    </Link>
  );
}
