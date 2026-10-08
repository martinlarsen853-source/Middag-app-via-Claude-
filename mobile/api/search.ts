import { bulkToPrices, groupSearchRows, json, kassalapp, MissingKeyError, rankHits } from './_lib/kassalapp';

// GET /api/search?q=kjøttdeig → ekte varer med bilde, størrelse og pris per kjede.
export async function GET(request: Request): Promise<Response> {
  const query = (new URL(request.url).searchParams.get('q') ?? '').trim();
  if (query.length < 2) return json({ products: [] });
  if (query.length > 80) return json({ error: 'For langt søk' }, { status: 400 });

  try {
    // Steg 1: inntil 100 ulike varer (én rad per strekkode).
    const params = new URLSearchParams({ search: query, size: '100', exclude_without_ean: '1', unique: '1' });
    const result = await kassalapp<{ data?: unknown[] }>(`/products?${params}`);
    const candidates = rankHits(groupSearchRows((result.data ?? []) as never[]), query, 25);

    // Steg 2: dagens pris i alle kjeder for de beste treffene, i ett kall.
    if (candidates.length) {
      try {
        const bulk = await kassalapp<{ data?: unknown[] }>('/products/prices-bulk', {
          method: 'POST',
          body: JSON.stringify({ eans: candidates.map(hit => hit.ean), days: 90 }),
        });
        const prices = bulkToPrices((bulk.data ?? []) as never[]);
        for (const hit of candidates) if (prices[hit.ean]) hit.prices = { ...hit.prices, ...prices[hit.ean] };
      } catch {
        // Uten prisoppslaget viser vi treffene med prisen fra søket.
      }
    }
    const products = rankHits(candidates, query, 20);
    return json({ products }, { cacheSeconds: 3600 });
  } catch (error) {
    if (error instanceof MissingKeyError) return json({ products: [], unavailable: 'no_key' });
    return json({ products: [], unavailable: 'error' }, { status: 502 });
  }
}
