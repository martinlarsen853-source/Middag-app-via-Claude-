import { bulkToPrices, json, kassalapp, MissingKeyError } from './_lib/kassalapp';

const EAN = /^\d{8,14}$/;

// GET /api/prices?eans=7038010010187,7025110072160 → dagens pris per kjede for hver strekkode.
// GET med sortert liste gjør at Vercels CDN kan gjenbruke svaret for alle som spør om de samme varene.
export async function GET(request: Request): Promise<Response> {
  const raw = new URL(request.url).searchParams.get('eans') ?? '';
  const eans = [...new Set(raw.split(',').map(e => e.trim()).filter(e => EAN.test(e)))].sort();
  if (eans.length === 0) return json({ prices: {} });
  if (eans.length > 100) return json({ error: 'Maks 100 varer per kall' }, { status: 400 });

  try {
    const result = await kassalapp<{ data?: unknown[] }>('/products/prices-bulk', {
      method: 'POST',
      body: JSON.stringify({ eans, days: 1 }),
    });
    return json(
      { prices: bulkToPrices((result.data ?? []) as never[]), checkedAt: new Date().toISOString() },
      { cacheSeconds: 21600 },
    );
  } catch (error) {
    if (error instanceof MissingKeyError) return json({ prices: {}, unavailable: 'no_key' });
    return json({ prices: {}, unavailable: 'error' }, { status: 502 });
  }
}
