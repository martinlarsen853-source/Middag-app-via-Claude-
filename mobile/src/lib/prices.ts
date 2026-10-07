import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';

import { API_ORIGIN } from '@/constants/config';
import type { Ingredient, Meal } from '@/data/meals';
import type { Store } from '@/data/stores';
import { BASE_PERSONS, ingredientPrice, mealBase } from '@/lib/meals';

// Pris per kjede for én vare, f.eks. { KIWI: 54.9, REMA_1000: 57.9 }.
export type ChainPrices = Record<string, number>;
export type PriceBook = Record<string, ChainPrices>;

// Kassalapp sine kjedekoder. Butikker brukeren legger til selv får kjede ut fra navnet.
const CHAIN_RULES: [RegExp, string][] = [
  [/rema/i, 'REMA_1000'],
  [/kiwi/i, 'KIWI'],
  [/meny/i, 'MENY_NO'],
  [/spar/i, 'SPAR_NO'],
  [/joker/i, 'JOKER_NO'],
  [/bunnpris/i, 'BUNNPRIS'],
  [/prix/i, 'COOP_PRIX'],
  [/mega/i, 'COOP_MEGA'],
  [/obs/i, 'COOP_OBS'],
  [/marked/i, 'COOP_MARKED'],
  [/oda/i, 'ODA_NO'],
  [/extra|coop/i, 'COOP_EXTRA'],
];

export function chainFor(store: Pick<Store, 'id' | 'name'>): string | null {
  const text = `${store.id} ${store.name}`;
  return CHAIN_RULES.find(([pattern]) => pattern.test(text))?.[1] ?? null;
}

const COUNT_UNITS = ['stk', 'boks', 'pose', 'pakke', 'pk', 'glass', 'flaske', 'beger', 'porsjon', 'terning', 'hode', 'bunt'];
const PANTRY_NAME = /^(salt|pepper|salt og pepper|vann|olje|olivenolje|rapsolje|nøytral olje|matolje)$/i;

// Skjeer og en klype salt kjøper man ikke til hver middag.
export function isPantry(ingredient: Ingredient): boolean {
  if (ingredient.pantry !== undefined) return ingredient.pantry;
  const unit = ingredient.unit.toLowerCase();
  return unit === 'ss' || unit === 'ts' || unit === 'klype' || PANTRY_NAME.test(ingredient.name.trim());
}

// Gjør om til felles grunnenhet så oppskriftens mengde kan sammenlignes med pakken.
function toBase(value: number, unit: string | null | undefined): { value: number; unit: 'g' | 'ml' | 'stk' } | null {
  switch ((unit ?? '').toLowerCase()) {
    case 'g':
      return { value, unit: 'g' };
    case 'kg':
      return { value: value * 1000, unit: 'g' };
    case 'ml':
      return { value, unit: 'ml' };
    case 'cl':
      return { value: value * 10, unit: 'ml' };
    case 'dl':
      return { value: value * 100, unit: 'ml' };
    case 'l':
      return { value: value * 1000, unit: 'ml' };
    case 'stk':
      return { value, unit: 'stk' };
    default:
      return null;
  }
}

// Hvor mange hele pakker som må kjøpes. Litt slingringsmonn, så 410 g ikke blir to pakker à 400 g.
export function packsNeeded(ingredient: Ingredient, persons: number, base = BASE_PERSONS): number {
  const quantity = (ingredient.quantity * persons) / base;
  const unit = ingredient.unit.toLowerCase();
  if (unit === 'pk' || unit === 'pakke') return Math.max(1, Math.ceil(quantity - 0.05));

  const product = ingredient.product;
  if (product?.packSize) {
    const need = toBase(quantity, unit);
    const pack = toBase(product.packSize, product.packUnit);
    if (need && pack && need.unit === pack.unit && pack.value > 0) {
      return Math.max(1, Math.ceil(need.value / pack.value - 0.05));
    }
    // Ukjent forhold mellom oppskrift og pakke (f.eks. «2 stk løk» mot en kilopose): én pakke.
    return 1;
  }
  return COUNT_UNITS.includes(unit) ? Math.max(1, Math.round(quantity)) : 1;
}

export type PriceSource = 'exact' | 'other-chain' | 'estimate' | 'pantry';

export type ItemPrice = { amount: number; packs: number; source: PriceSource; unitPrice: number | null };

export function ingredientCost(
  ingredient: Ingredient,
  persons: number,
  base: number,
  chain: string | null,
  book: PriceBook,
): ItemPrice {
  const packs = packsNeeded(ingredient, persons, base);
  if (isPantry(ingredient)) return { amount: 0, packs, source: 'pantry', unitPrice: null };

  const prices = ingredient.product ? book[ingredient.product.ean] : undefined;
  const exact = chain && prices ? prices[chain] : undefined;
  if (exact) return { amount: exact * packs, packs, source: 'exact', unitPrice: exact };

  // Kjeden mangler pris (vanlig for Coop): snittet fra de andre kjedene er et godt anslag.
  const others = prices ? Object.values(prices) : [];
  if (others.length) {
    const average = others.reduce((sum, value) => sum + value, 0) / others.length;
    return { amount: average * packs, packs, source: 'other-chain', unitPrice: average };
  }

  return { amount: ingredientPrice(ingredient.name) * packs, packs, source: 'estimate', unitPrice: null };
}

export type MealPrice = {
  total: number;
  exact: boolean; // alle varer som skal kjøpes har ekte pris fra denne kjeden
  priced: number; // varer med ekte pris
  toBuy: number; // varer som telles med (ikke «har hjemme»)
};

export function mealPrice(meal: Meal, persons: number, chain: string | null, book: PriceBook): MealPrice {
  const base = mealBase(meal);
  let total = 0;
  let priced = 0;
  let toBuy = 0;
  for (const ingredient of meal.ingredients) {
    const cost = ingredientCost(ingredient, persons, base, chain, book);
    if (cost.source === 'pantry') continue;
    toBuy += 1;
    if (cost.source === 'exact') priced += 1;
    total += cost.amount;
  }
  return { total: Math.round(total), exact: toBuy > 0 && priced === toBuy, priced, toBuy };
}

export function formatPrice(price: MealPrice): string {
  return `${price.exact ? '' : 'ca. '}${price.total} kr`;
}

export function formatKroner(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} kr`;
}

export function mealEans(meals: Meal[]): string[] {
  const eans = new Set<string>();
  for (const meal of meals) for (const ing of meal.ingredients) if (ing.product?.ean) eans.add(ing.product.ean);
  return [...eans].sort();
}

// ---- Henting og mellomlagring av priser ----
// Prisene lagres i minnet og på telefonen i seks timer, så lista vises med en gang
// neste gang og vi holder oss godt innenfor Kassalapps grenser.

const CACHE_KEY = 'handleklar.prices';
const TTL_MS = 6 * 60 * 60 * 1000;
type CacheEntry = { prices: ChainPrices; at: number };
const memory = new Map<string, CacheEntry>();
const listeners = new Set<() => void>();
let diskLoaded: Promise<void> | null = null;
let unavailable: string | null = null;

function notify() {
  listeners.forEach(listener => listener());
}

function loadDisk(): Promise<void> {
  diskLoaded ??= AsyncStorage.getItem(CACHE_KEY)
    .then(raw => {
      if (!raw) return;
      const saved = JSON.parse(raw) as Record<string, CacheEntry>;
      for (const [ean, entry] of Object.entries(saved)) if (!memory.has(ean)) memory.set(ean, entry);
    })
    .catch(() => {});
  return diskLoaded;
}

function persist() {
  const fresh = Object.fromEntries([...memory].filter(([, entry]) => Date.now() - entry.at < TTL_MS));
  AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fresh)).catch(() => {});
}

// Søkeresultater har allerede pris per kjede; de legges rett i boka.
export function rememberPrices(ean: string, prices: ChainPrices) {
  memory.set(ean, { prices, at: Date.now() });
  persist();
  notify();
}

const inFlight = new Set<string>();

async function fetchPrices(eans: string[]) {
  await loadDisk();
  const stale = eans.filter(ean => {
    const entry = memory.get(ean);
    return !inFlight.has(ean) && (!entry || Date.now() - entry.at > TTL_MS);
  });
  if (stale.length === 0) {
    notify();
    return;
  }
  stale.forEach(ean => inFlight.add(ean));
  try {
    for (let i = 0; i < stale.length; i += 100) {
      const chunk = stale.slice(i, i + 100);
      const response = await fetch(`${API_ORIGIN}/api/prices?eans=${chunk.join(',')}`);
      const body = (await response.json()) as { prices?: PriceBook; unavailable?: string };
      unavailable = body.unavailable ?? null;
      if (!response.ok || body.unavailable) continue;
      for (const ean of chunk) memory.set(ean, { prices: body.prices?.[ean] ?? {}, at: Date.now() });
    }
    persist();
  } catch {
    unavailable = 'error';
  } finally {
    stale.forEach(ean => inFlight.delete(ean));
    notify();
  }
}

export function usePrices(eans: string[]): { book: PriceBook; unavailable: string | null } {
  const key = [...new Set(eans)].sort().join(',');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const listener = () => setVersion(v => v + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    if (key) fetchPrices(key.split(','));
  }, [key]);

  const book = useMemo(() => {
    const result: PriceBook = {};
    if (!key) return result;
    for (const ean of key.split(',')) {
      const entry = memory.get(ean);
      if (entry) result[ean] = entry.prices;
    }
    return result;
    // version endres når nye priser kommer inn
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version]);

  return { book, unavailable };
}

export type StorePrice = { store: Store; price: MealPrice };

// Pris i hver av brukerens butikker, billigst først.
export function pricesByStore(meal: Meal, persons: number, stores: Store[], book: PriceBook): StorePrice[] {
  return stores
    .map(store => ({ store, price: mealPrice(meal, persons, chainFor(store), book) }))
    .sort((a, b) => a.price.total - b.price.total);
}
