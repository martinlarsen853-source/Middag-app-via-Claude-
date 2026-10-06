import type { Ingredient, Meal } from '@/data/meals';
import { STOPS, stopFor, type StopId } from '@/lib/stops';

// Oppskriftene er lagret med mengder for fire personer.
export const BASE_PERSONS = 4;

const COUNT_UNITS = ['stk', 'boks', 'pose', 'pakke', 'pk', 'glass', 'flaske', 'beger', 'porsjon', 'terning'];

export function scaleQuantity(quantity: number, persons: number): number {
  return (quantity * persons) / BASE_PERSONS;
}

export function formatQuantity(quantity: number, unit: string): string {
  const rounded =
    unit === 'g' || unit === 'ml'
      ? Math.round(quantity)
      : Math.round(quantity * 4) / 4; // nærmeste kvarte for stk, fedd, ss osv.
  const text = Number.isInteger(rounded) ? String(rounded) : String(rounded).replace('.', ',');
  return `${text} ${unit}`;
}

// Anslått pakkepris i kroner, samme vurdering som nettsiden bruker.
export function ingredientPrice(name: string): number {
  const n = (name || '').toLowerCase();
  if (/(entrecôte|entrecote|indrefilet|ytrefilet|biff|mørbrad|lam|ribbe)/.test(n)) return 180;
  if (/(laks|torsk|ørret|scampi|reker|kamskjell|fiskefilet|klippfisk)/.test(n)) return 120;
  if (/(kjøttdeig|karbonadedeig|kjøtt|kylling|svin|bacon|pølse|skinke|salami|karbonader|kjøttbolle|kjøttkake|falafel|fiskepinner)/.test(n)) return 95;
  if (/(parmesan|mozzarella|fetaost|brunost)/.test(n)) return 55;
  if (/(ost|fløte|matfløte|rømme|crème|creme|kesam|yoghurt|potetmos)/.test(n)) return 38;
  if (/(smør|margarin|melk|egg)/.test(n)) return 32;
  if (/(pinjekjerner|nøtter|mandler|valnøtter|peanøtter|peanøttsmør)/.test(n)) return 45;
  if (/(pizzabunn|tortilla|lefse|naan|pita|brød|loff|baguette|rundstykk|taco-skjell|krutonger)/.test(n)) return 30;
  if (/(pasta|spaghetti|penne|tagliatelle|farfalle|lasagne|nudler|ris|risotto|couscous|bulgur|quinoa|semule|mel|sukker|havregryn|gryn)/.test(n)) return 25;
  if (/(olje|eddik|balsamico|soya|ketjap|fiskesaus|ketchup|sennep|majones|pesto|salsa|tahini|tomatpuré|tomatpure|buljong|kraft|fond|honning|sirup|saus|karripasta|harissa)/.test(n)) return 35;
  if (/(hermetisk|knust tomat|passata|kokosmelk|bønner|kikerter|linser|erter|oliven)/.test(n)) return 22;
  return 18; // grønnsaker, frukt, urter og krydder
}

export function estimateMealPrice(meal: Meal, persons: number = BASE_PERSONS): number {
  if (!meal.ingredients.length) return 0;
  const factor = persons / BASE_PERSONS;
  let total = 0;
  for (const ing of meal.ingredients) {
    const unitPrice = ingredientPrice(ing.name);
    const unit = (ing.unit || '').toLowerCase();
    // Antallsvarer ganges opp, vekt og volum regnes som én pakke.
    const multiplier = COUNT_UNITS.includes(unit)
      ? Math.max(1, Math.round((ing.quantity || 1) * factor))
      : 1;
    total += unitPrice * multiplier;
  }
  return Math.round(total);
}

export type ShoppingItem = {
  // Plassen i oppskriften. Brukes som nøkkel for avhuking, så huking følger
  // varen selv om butikkens rekkefølge endres underveis.
  index: number;
  ingredient: Ingredient;
};

export type ShoppingStop = {
  stop: StopId;
  label: string;
  items: ShoppingItem[];
};

// Grupperer rettens varer per stopp og legger stoppene i butikkens rekkefølge.
export function buildShoppingList(meal: Meal, storeStops: StopId[]): ShoppingStop[] {
  const byStop = new Map<StopId, ShoppingItem[]>();
  meal.ingredients.forEach((ingredient, index) => {
    const stop = stopFor(ingredient);
    const list = byStop.get(stop) ?? [];
    list.push({ index, ingredient });
    byStop.set(stop, list);
  });

  const ordered: ShoppingStop[] = [];
  for (const stop of storeStops) {
    const items = byStop.get(stop);
    if (items?.length) {
      ordered.push({ stop, label: STOPS[stop], items });
      byStop.delete(stop);
    }
  }
  // Stopp butikken mangler i rekkefølgen sin havner sist, så ingen vare forsvinner.
  for (const [stop, items] of byStop) {
    ordered.push({ stop, label: STOPS[stop], items });
  }
  return ordered;
}
