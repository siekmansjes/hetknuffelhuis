import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

export type Crumb = { name: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const list = [{ name: "Home", href: "/" }, ...items];
  return (
    <nav className="breadcrumbs" aria-label="Kruimelpad">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: list.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            ...(item.href ? { item: `${SITE_URL}${item.href === "/" ? "" : item.href}` } : {}),
          })),
        }}
      />
      <ol>
        {list.map((item, i) => (
          <li key={item.name}>
            {item.href && i < list.length - 1 ? <Link href={item.href}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
