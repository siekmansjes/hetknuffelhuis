import Link from "next/link";
import Image from "next/image";
import type { CaseStudy } from "@/lib/cases";
import { PhotoSlot } from "@/components/PhotoSlot";

export function CaseCard({ item, priority = false }: { item: CaseStudy; priority?: boolean }) {
  return (
    <Link href={`/cases/${item.slug}`} className="case-card">
      <div className="case-media">
        {item.image ? (
          <div className="frame ratio-16-10" style={{ position: "relative" }}>
            <Image
              src={item.image}
              alt={item.imageAlt ?? ""}
              fill
              sizes="(max-width: 900px) 100vw, 480px"
              priority={priority}
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <PhotoSlot
            tone={item.tone}
            ratio="16-10"
            wanted="Hoofdfoto van de knuffel uit dit project"
          />
        )}
      </div>
      <h3>{item.title}</h3>
      <p>{item.teaser}</p>
      <span className="link-arrow">Bekijk het project</span>
    </Link>
  );
}
