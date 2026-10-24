import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { cases } from "@/lib/cases";

const PAGES = ["/", "/knuffels", "/cases", "/merchandise", "/werkwijze", "/faq", "/contact", "/privacy", "/voorwaarden"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((path) => ({ url: `${SITE_URL}${path === "/" ? "" : path}`, changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.7 })),
    ...cases.map((c) => ({ url: `${SITE_URL}/cases/${c.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
