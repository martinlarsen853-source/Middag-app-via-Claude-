import { groupSearchRows, json, kassalapp, MissingKeyError } from './_lib/kassalapp';

// GET /api/search?q=kjøttdeig → ekte varer med bilde, størrelse og pris per kjede.
export async function GET(request: Request): Promise<Response> {
  const query = (new URL(request.url).searchParams.get('q') ?? '').trim();
  if (query.length < 2) return json({ products: [] });
  if (query.length > 80) return json({ error: 'For langt søk' }, { status: 400 });

  try {
    const params = new URLSearchParams({ search: query, size: '100', exclude_without_ean: '1' });
    const result = await kassalapp<{ data?: unknown[] }>(`/products?${params}`);
    const products = groupSearchRows((result.data ?? []) as never[], query);
    return json({ products }, { cacheSeconds: 3600 });
  } catch (error) {
    if (error instanceof MissingKeyError) return json({ products: [], unavailable: 'no_key' });
    return json({ products: [], unavailable: 'error' }, { status: 502 });
  }
}
