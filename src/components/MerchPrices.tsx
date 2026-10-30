import Link from "next/link";
import { merchPrices } from "@/lib/merchandisePrices";

const nl = new Intl.NumberFormat("nl-NL");

/** Indicatieve prijsstaffels per product, uitklapbaar zodat de pagina rustig blijft. */
export function MerchPrices({ priceIds }: { priceIds: string[] }) {
  const products = priceIds.map((id) => ({ id, ...merchPrices[id] })).filter((p) => p.name);
  if (products.length === 0) return null;

  return (
    <div className="price-block">
      <h3>Prijzen per stuk</h3>
      <p className="price-note">Indicatief en exclusief btw. Een exacte prijs volgt in een offerte op basis van jouw ontwerp en aantallen.</p>
      {products.map((product) => (
        <details key={product.id} className="price-details">
          <summary>
            <span>{product.name}</span>
            <span className="price-min">vanaf {nl.format(product.min)} stuks</span>
          </summary>
          {product.variants.map((variant) => (
            <div key={variant.variant ?? "standaard"} className="price-variant">
              {variant.variant && <h4>{variant.variant}</h4>}
              <div className="price-scroll">
                <table className="price-table">
                  <thead>
                    <tr>
                      <th scope="row">Vanaf</th>
                      {variant.tiers.map(([vanaf]) => (
                        <th key={vanaf} scope="col">
                          {nl.format(vanaf)} st.
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Per stuk</th>
                      {variant.tiers.map(([vanaf, prijs]) => (
                        <td key={vanaf}>{prijs}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </details>
      ))}
      <p className="price-note">
        Andere aantallen nodig? <Link href="/contact?mode=contact">Stuur ons een bericht</Link>, we denken graag mee.
      </p>
    </div>
  );
}
