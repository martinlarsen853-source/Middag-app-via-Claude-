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
// Storhusholdning og løsvekt: store pakker og «pr kg» er sjelden det man kjøper til middag.
const BULK = /pr\.? ?kg|\b\d+(,\d+)?\s?kg\b|\b\d+\s?l\b|storkjøkken|catering/i;
// Kjedene i Spydeberg pluss de vanligste andre. Varer med pris her rangeres øverst.
const MAIN_CHAINS = ['REMA_1000', 'KIWI', 'COOP_EXTRA', 'COOP_NO', 'COOP_PRIX', 'COOP_MEGA', 'MENY_NO', 'SPAR_NO'];

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function weightInGrams(weight: number | null, unit: string | null): number | null {
  if (!weight) return null;
  switch ((unit ?? '').toLowerCase()) {
    case 'kg':
    case 'l':
      return weight * 1000;
    case 'g':
    case 'ml':
      return weight;
    default:
      return null;
  }
}

// Poeng for hvor godt en vare passer søket. Lavere er bedre.
export function relevance(hit: Pick<ProductHit, 'ean' | 'name' | 'weight' | 'weightUnit' | 'prices'>, query: string): number {
  const needle = query.trim().toLowerCase();
  const name = hit.name.toLowerCase();
  const words = needle.split(/\s+/).filter(Boolean);
  let score = 0;

  // Hele søket som eget ord («Rømme 18%») slår ord som bare begynner likt («Rømmesild»).
  const wholeWord = new RegExp(`(^|[\\s,.-])${escapeRegExp(needle)}($|[\\s,.%-])`, 'i');
  if (wholeWord.test(name)) score -= 30;
  if (name.startsWith(needle)) score -= 10;
  for (const word of words) if (!name.includes(word)) score += 40;

  // Strekkoder som starter med 2 er butikkens egne løsvektkoder, ikke vanlige pakker.
  if (hit.ean.startsWith('2')) score += 35;
  if (BULK.test(hit.name)) score += 25;
  const grams = weightInGrams(hit.weight, hit.weightUnit);
  if (grams !== null && grams >= 2000) score += 25;
  if (NOISE.test(hit.name)) score += 1000;

  const chains = Object.keys(hit.prices);
  if (chains.length === 0) score += 30;
  score -= Math.min(4, chains.filter(chain => MAIN_CHAINS.includes(chain)).length) * 6;
  if (hit.prices.REMA_1000 || hit.prices.KIWI) score -= 8;

  return score + name.length * 0.05;
}

// Kassalapp gir én rad per vare per butikk. Vi slår dem sammen per strekkode og
// samler pris per kjede. Rekkefølgen settes av relevance() etter at prisene er hentet.
export function groupSearchRows(rows: SearchRow[]): ProductHit[] {
  const byEan = new Map<string, ProductHit>();

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

    byEan.set(row.ean, {
      ean: row.ean,
      name: row.name.trim(),
      brand: row.brand || row.vendor || null,
      image: row.image || null,
      weight: typeof row.weight === 'number' ? row.weight : null,
      weightUnit: row.weight_unit || null,
      prices: chain && price !== null ? { [chain]: price } : {},
    });
  }

  return [...byEan.values()];
}

export function rankHits(hits: ProductHit[], query: string, limit = 20): ProductHit[] {
  return hits
    .map(hit => ({ hit, score: relevance(hit, query) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map(item => item.hit);
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
