import { bulkToPrices, eanToPrices, json, kassalapp, MissingKeyError, type ChainPrices } from './_lib/kassalapp';

const EAN = /^\d{4,14}$/;
// Kjedene i Spydeberg. Mangler en vare pris her, slår vi opp siste kjente pris.
const LOCAL_CHAINS = ['KIWI', 'REMA_1000', 'COOP_NO', 'COOP_EXTRA'];
// Holder oss godt under Kassalapps grense på 60 kall i minuttet.
const MAX_LOOKUPS = 30;

async function inBatches<T>(items: T[], size: number, work: (item: T) => Promise<void>) {
  for (let i = 0; i < items.length; i += size) await Promise.all(items.slice(i, i + size).map(work));
}

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
      body: JSON.stringify({ eans, days: 90 }),
    });
    const prices: Record<string, ChainPrices> = bulkToPrices((result.data ?? []) as never[]);
    const dates: Record<string, Record<string, string>> = {};
    const images: Record<string, string> = {};

    const missing = eans.filter(ean => !LOCAL_CHAINS.some(chain => prices[ean]?.[chain])).slice(0, MAX_LOOKUPS);
    await inBatches(missing, 6, async ean => {
      try {
        const detail = await kassalapp<{ data?: { products?: unknown[] } }>(`/products/ean/${ean}`);
        const found = eanToPrices((detail.data?.products ?? []) as never[]);
        // Ferske priser fra prisoppslaget vinner; eldre priser fyller hullene.
        prices[ean] = { ...found.prices, ...(prices[ean] ?? {}) };
        dates[ean] = found.dates;
        if (found.image) images[ean] = found.image;
      } catch {
        // Vi bruker det prisoppslaget ga for denne varen.
      }
    });

    return json({ prices, dates, images, checkedAt: new Date().toISOString() }, { cacheSeconds: 21600 });
  } catch (error) {
    if (error instanceof MissingKeyError) return json({ prices: {}, unavailable: 'no_key' });
    return json({ prices: {}, unavailable: 'error' }, { status: 502 });
  }
}
