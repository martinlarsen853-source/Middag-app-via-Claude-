import type { Meal } from '@/data/meals';
import { mealNutrition } from '@/lib/nutrition';
import { mealPrice, type PriceBook } from '@/lib/prices';
import type { PlanEntry } from '@/lib/shopping';

// Forslag til bytter i ukeplanen: spar penger, mer protein eller sunnere uke.
// Appen regner ut pris og næring. Claude velger byttene når nøkkelen er på plass,
// ellers bruker vi enkle regler her i appen.

export type Goal = 'spar' | 'protein' | 'sunnere';

export const GOALS: { key: Goal; label: string; icon: 'wallet-outline' | 'barbell-outline' | 'leaf-outline' }[] = [
  { key: 'spar', label: 'Spar penger', icon: 'wallet-outline' },
  { key: 'protein', label: 'Mer protein', icon: 'barbell-outline' },
  { key: 'sunnere', label: 'Sunnere', icon: 'leaf-outline' },
];

type MealFacts = {
  mealId: string;
  name: string;
  category: string;
  pricePerPortion: number;
  protein: number;
  fish: boolean;
  redMeat: number;
  ultra: number;
  minutes: number;
};

export type SwapIdea = { entryId: string; mealId: string; reason: string };
export type Suggestions = {
  source: 'ai' | 'local';
  note: string | null; // hvorfor vi viser enkle forslag i stedet for AI
  summary: string;
  swaps: SwapIdea[];
  tips: string[];
};

export function facts(meal: Meal, persons: number, chain: string | null, book: PriceBook): MealFacts {
  const nutrition = mealNutrition(meal);
  return {
    mealId: String(meal.id),
    name: meal.name,
    category: meal.category,
    pricePerPortion: Math.round(mealPrice(meal, persons, chain, book).total / Math.max(1, persons)),
    protein: nutrition.protein,
    fish: nutrition.fish,
    redMeat: nutrition.redMeat,
    ultra: nutrition.ultra.length,
    minutes: meal.timeMinutes,
  };
}

type Planned = { entry: PlanEntry; meal: Meal };

export function buildRequest(goal: Goal, planned: Planned[], candidates: Meal[], mine: Set<string>, chain: string | null, storeName: string | null, book: PriceBook) {
  const inPlan = new Set(planned.map(item => String(item.meal.id)));
  const persons = planned[0]?.entry.persons ?? 2;
  return {
    goal,
    store: storeName,
    plan: planned.map(({ entry, meal }) => ({ ...facts(meal, entry.persons, chain, book), entryId: entry.id, persons: entry.persons })),
    candidates: candidates
      .filter(meal => !inPlan.has(String(meal.id)))
      .slice(0, 80)
      .map(meal => ({ ...facts(meal, persons, chain, book), mine: mine.has(String(meal.id)) })),
  };
}

// Hvor godt et bytte treffer målet. Høyere er bedre, null betyr «ikke verdt det».
function gain(goal: Goal, from: MealFacts, to: MealFacts): number | null {
  const cheaper = from.pricePerPortion - to.pricePerPortion;
  const protein = to.protein - from.protein;
  const slower = to.minutes - from.minutes;
  if (slower > 30) return null;
  if (goal === 'spar') return cheaper >= 10 && protein > -20 ? cheaper : null;
  if (goal === 'protein') return protein >= 8 && cheaper > -20 ? protein : null;
  // Sunnere: fisk i stedet for rødt kjøtt, eller færre ultraprosesserte varer.
  let score = 0;
  if (to.fish && !from.fish) score += 30;
  score += (from.redMeat - to.redMeat) / 10;
  score += (from.ultra - to.ultra) * 8;
  return score >= 12 && cheaper > -30 ? score : null;
}

// Enkle forslag uten AI: det beste bytte for hver middag, de tre beste totalt.
export function localSuggestions(request: ReturnType<typeof buildRequest>, note: string | null): Suggestions {
  const options: { entryId: string; to: MealFacts & { mine: boolean }; from: MealFacts; score: number }[] = [];
  for (const from of request.plan) {
    for (const to of request.candidates) {
      const score = gain(request.goal, from, to);
      if (score !== null) options.push({ entryId: from.entryId, from, to, score: score + (to.mine ? 5 : 0) });
    }
  }
  options.sort((a, b) => b.score - a.score);
  const usedEntries = new Set<string>();
  const usedMeals = new Set<string>();
  const swaps: SwapIdea[] = [];
  for (const option of options) {
    if (usedEntries.has(option.entryId) || usedMeals.has(option.to.mealId)) continue;
    usedEntries.add(option.entryId);
    usedMeals.add(option.to.mealId);
    swaps.push({ entryId: option.entryId, mealId: option.to.mealId, reason: localReason(request.goal, option.from, option.to) });
    if (swaps.length === 3) break;
  }
  const summary = swaps.length
    ? `Fant ${swaps.length} ${swaps.length === 1 ? 'bytte' : 'bytter'} som passer målet.`
    : 'Fant ingen bytter som gjør uka tydelig bedre for dette målet. Uka ser fin ut!';
  return { source: 'local', note, summary, swaps, tips: [] };
}

function localReason(goal: Goal, from: MealFacts, to: MealFacts): string {
  if (goal === 'spar') return `Ca. ${from.pricePerPortion - to.pricePerPortion} kr billigere per porsjon.`;
  if (goal === 'protein') return `Ca. ${to.protein - from.protein} g mer protein per porsjon.`;
  if (to.fish && !from.fish) return 'Fisk i stedet for kjøtt, i tråd med rådet om fisk 2–3 ganger i uka.';
  if (to.ultra < from.ultra) return 'Færre ferdigvarer og mindre ultraprosessert.';
  return 'Mindre rødt kjøtt.';
}

export async function fetchSuggestions(request: ReturnType<typeof buildRequest>): Promise<Suggestions> {
  try {
    const response = await fetch('/api/forslag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const data = (await response.json()) as Partial<{ summary: string; swaps: SwapIdea[]; tips: string[]; unavailable: string }>;
    if (data.unavailable === 'no_key') return localSuggestions(request, 'AI-forslag er ikke slått på ennå, så dette er enkle forslag regnet ut i appen.');
    if (data.unavailable === 'busy') return localSuggestions(request, 'AI-en har mye å gjøre akkurat nå, så dette er enkle forslag regnet ut i appen.');
    if (!response.ok || data.unavailable || !Array.isArray(data.swaps)) {
      return localSuggestions(request, 'Fikk ikke svar fra AI-en, så dette er enkle forslag regnet ut i appen.');
    }
    // Svaret sjekkes på serveren, men vi tar bare med bytter vi kjenner igjen.
    const entries = new Set(request.plan.map(item => item.entryId));
    const meals = new Set(request.candidates.map(item => item.mealId));
    return {
      source: 'ai',
      note: null,
      summary: data.summary ?? '',
      swaps: data.swaps.filter(swap => entries.has(swap.entryId) && meals.has(swap.mealId)),
      tips: data.tips ?? [],
    };
  } catch {
    return localSuggestions(request, 'Fikk ikke kontakt med AI-en, så dette er enkle forslag regnet ut i appen.');
  }
}
