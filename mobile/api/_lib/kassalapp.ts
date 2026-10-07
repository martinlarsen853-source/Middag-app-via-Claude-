// Felles logikk for funksjonene som snakker med Kassalapp. Filer under api/_lib
// blir ikke egne endepunkter hos Vercel.

const API_BASE = 'https://kassal.app/api/v1';

export type ChainPrices = Record<string, number>;

export type ProductHit = {
  ean: string;
  name: string;
  brand: string | null;
  image: string | null;
  weight: number | null;
  weightUnit: string | null;
  prices: ChainPrices;
};

type SearchRow = {
  name?: string;
  brand?: string | null;
  vendor?: string | null;
  ean?: string | null;
  image?: string | null;
  current_price?: number | null;
  weight?: number | null;
  weight_unit?: string | null;
  store?: { code?: string | null } | null;
};

type BulkRow = {
  ean?: string;
  stores?: { store?: string; current_price?: number | null }[];
};

export class MissingKeyError extends Error {}

export async function kassalapp<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = process.env.KASSALAPP_API_KEY;
  if (!key) throw new MissingKeyError('KASSALAPP_API_KEY mangler');
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Kassalapp svarte ${response.status}`);
  }
  return (await response.json()) as T;
}

// Barnemat og dyrefôr dukker ofte opp i søk etter vanlige råvarer.
const NOISE = /\d+\s?mnd|\d+\s?år|barnemat|baby|småbarn|hund|katt|kattemat|hundemat/i;

// Kassalapp gir én rad per vare per butikk. Vi slår dem sammen per strekkode,
// samler pris per kjede og rangerer vanlige dagligvarer øverst.
export function groupSearchRows(rows: SearchRow[], query: string, limit = 20): ProductHit[] {
  const needle = query.trim().toLowerCase();
  const byEan = new Map<string, ProductHit & { score: number }>();

  for (const row of rows) {
    if (!row?.ean || !row.name) continue;
    const existing = byEan.get(row.ean);
    const chain = row.store?.code ?? null;
    const price = typeof row.current_price === 'number' && row.current_price > 0 ? row.current_price : null;

    if (existing) {
      if (chain && price !== null && existing.prices[chain] === undefined) existing.prices[chain] = price;
      if (!existing.image && row.image) existing.image = row.image;
      continue;
    }

    const name = row.name.trim();
    const lower = name.toLowerCase();
    const index = lower.indexOf(needle);
    const score =
      (index === -1 ? 500 : index) + (lower.startsWith(needle) ? 0 : 5) + name.length * 0.03 + (NOISE.test(name) ? 1000 : 0);

    byEan.set(row.ean, {
      ean: row.ean,
      name,
      brand: row.brand || row.vendor || null,
      image: row.image || null,
      weight: typeof row.weight === 'number' ? row.weight : null,
      weightUnit: row.weight_unit || null,
      prices: chain && price !== null ? { [chain]: price } : {},
      score,
    });
  }

  return [...byEan.values()]
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map(({ score: _score, ...hit }) => hit);
}

export function bulkToPrices(rows: BulkRow[]): Record<string, ChainPrices> {
  const result: Record<string, ChainPrices> = {};
  for (const row of rows) {
    if (!row?.ean) continue;
    const prices: ChainPrices = {};
    for (const store of row.stores ?? []) {
      if (store?.store && typeof store.current_price === 'number' && store.current_price > 0) {
        prices[store.store] = store.current_price;
      }
    }
    result[row.ean] = prices;
  }
  return result;
}

export function json(body: unknown, init: { status?: number; cacheSeconds?: number } = {}): Response {
  const headers: Record<string, string> = { 'Content-Type': 'application/json; charset=utf-8' };
  if (init.cacheSeconds) {
    // Vercels CDN mellomlagrer svaret, så vi holder oss godt under Kassalapps grense på 60 kall i minuttet.
    headers['Cache-Control'] = `public, s-maxage=${init.cacheSeconds}, stale-while-revalidate=86400`;
  } else {
    headers['Cache-Control'] = 'no-store';
  }
  return new Response(JSON.stringify(body), { status: init.status ?? 200, headers });
}
