import { useEffect, useState } from 'react';

import { API_ORIGIN } from '@/constants/config';
import type { Product } from '@/data/meals';
import { formatKroner, rememberPrices, type ChainPrices } from '@/lib/prices';

export type SearchHit = {
  ean: string;
  name: string;
  brand: string | null;
  image: string | null;
  weight: number | null;
  weightUnit: string | null;
  prices: ChainPrices;
};

export type SearchState = 'idle' | 'loading' | 'done' | 'no_key' | 'error';

const CHAIN_NAMES: Record<string, string> = {
  REMA_1000: 'Rema',
  KIWI: 'Kiwi',
  COOP_EXTRA: 'Extra',
  MENY_NO: 'Meny',
  SPAR_NO: 'Spar',
  COOP_PRIX: 'Prix',
  COOP_MEGA: 'Mega',
  COOP_OBS: 'Obs',
  JOKER_NO: 'Joker',
  BUNNPRIS: 'Bunnpris',
};

export function sizeText(weight: number | null | undefined, unit: string | null | undefined): string | null {
  if (!weight || !unit) return null;
  return `${String(weight).replace('.', ',')} ${unit}`;
}

export function cheapestText(prices: ChainPrices | undefined): string | null {
  const entries = Object.entries(prices ?? {}).sort((a, b) => a[1] - b[1]);
  if (!entries.length) return null;
  const [chain, price] = entries[0];
  return `${formatKroner(price)} hos ${CHAIN_NAMES[chain] ?? chain}`;
}

export function hitToProduct(hit: SearchHit): Product {
  return { ean: hit.ean, name: hit.name, image: hit.image, packSize: hit.weight, packUnit: hit.weightUnit };
}

export function hitMeta(hit: SearchHit): string {
  return [hit.brand, sizeText(hit.weight, hit.weightUnit), cheapestText(hit.prices) ?? 'ingen pris'].filter(Boolean).join(' · ');
}

// Søker hos Kassalapp mens du skriver, med en liten pause så vi ikke spør for hvert tastetrykk.
export function useProductSearch(query: string, delay = 350): { hits: SearchHit[]; state: SearchState } {
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [state, setState] = useState<SearchState>('idle');

  useEffect(() => {
    const needle = query.trim();
    if (needle.length < 2) {
      setHits([]);
      setState('idle');
      return;
    }
    setState('loading');
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${API_ORIGIN}/api/search?q=${encodeURIComponent(needle)}`, {
          signal: controller.signal,
        });
        const body = (await response.json()) as { products?: SearchHit[]; unavailable?: string };
        if (body.unavailable === 'no_key') {
          setHits([]);
          setState('no_key');
        } else if (!response.ok || body.unavailable) {
          setHits([]);
          setState('error');
        } else {
          const products = body.products ?? [];
          products.forEach(hit => rememberPrices(hit.ean, hit.prices));
          setHits(products);
          setState('done');
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') setState('error');
      }
    }, delay);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, delay]);

  return { hits, state };
}
