// Eenvoudige spam-bescherming voor de formulier-API's, zonder externe dienst.
// 1) Honeypot: een verborgen veld "website" dat echte bezoekers nooit invullen.
// 2) Rate limit per IP, in het geheugen van de serverless-instantie. Dit is
//    best-effort (elke instantie telt apart), maar houdt eenvoudige bots tegen.
//    De gedeelde, platformbrede grens is een Vercel Firewall rate-limit rule
//    (configuratie in docs/livegang-controles.md).

export const HONEYPOT_FIELD = "website";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 6;
const hits = new Map<string, number[]>();

export function isRateLimited(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0].trim() || request.headers.get("x-real-ip") || "onbekend";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length > MAX_REQUESTS;
}

export const RATE_LIMIT_RESPONSE = () =>
  Response.json(
    { ok: false, error: "Je hebt te vaak verstuurd. Probeer het over een paar minuten opnieuw." },
    { status: 429 }
  );

// ---------------------------------------------------------------------------
// Dubbele verzending: korte dedupe op een door de browser gegenereerd
// aanvraag-ID (veld "requestId"). Ook in het geheugen van de serverless-
// instantie en dus best-effort, maar het vangt de gebruikelijke gevallen af:
// dubbelklik, een herhaalde submit of een automatische retry. Een mislukte
// verwerking geeft het ID weer vrij, zodat de bezoeker opnieuw kan proberen.
// ---------------------------------------------------------------------------

export const REQUEST_ID_FIELD = "requestId";

const REQUEST_TTL_MS = 10 * 60 * 1000;
const PENDING_STALE_MS = 60 * 1000;
const requests = new Map<string, { state: "pending" | "done"; at: number; result?: string }>();

/** Geeft het ID terug als het een geldig, door de browser gegenereerd ID is; anders `undefined` (dan geen dedupe). */
export function readRequestId(value: unknown): string | undefined {
  return typeof value === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(value) ? value : undefined;
}

export type RequestClaim = { status: "new" } | { status: "pending" } | { status: "done"; result?: string };

export function claimRequest(id: string | undefined, now = Date.now()): RequestClaim {
  if (!id) return { status: "new" };
  if (requests.size > 5000) {
    for (const [key, entry] of requests) {
      if (now - entry.at >= REQUEST_TTL_MS) requests.delete(key);
    }
  }
  const existing = requests.get(id);
  if (existing && existing.state === "done" && now - existing.at < REQUEST_TTL_MS) {
    return { status: "done", result: existing.result };
  }
  if (existing && existing.state === "pending" && now - existing.at < PENDING_STALE_MS) {
    return { status: "pending" };
  }
  requests.set(id, { state: "pending", at: now });
  return { status: "new" };
}

/** Rond een geclaimde aanvraag af: bij succes onthouden (met `result`), bij falen weer vrijgeven. */
export function finishRequest(id: string | undefined, success: boolean, result?: string, now = Date.now()): void {
  if (!id) return;
  if (success) requests.set(id, { state: "done", at: now, result });
  else requests.delete(id);
}

export const DUPLICATE_PENDING_RESPONSE = () =>
  Response.json({ ok: false, error: "We zijn je aanvraag al aan het verwerken. Even geduld alsjeblieft." }, { status: 409 });
