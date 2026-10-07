import type { Ingredient, Meal } from '@/data/meals';
import { STOPS, stopFor, type StopId } from '@/lib/stops';

// Oppskriftene er lagret med mengder for fire personer.
export const BASE_PERSONS = 4;

export function mealBase(meal: Pick<Meal, 'basePersons'>): number {
  return meal.basePersons && meal.basePersons > 0 ? meal.basePersons : BASE_PERSONS;
}

export function scaleQuantity(quantity: number, persons: number, base: number = BASE_PERSONS): number {
  return (quantity * persons) / base;
}

// Enheter man bare kan kjøpe hele av. I butikken blir «0,5 boks» til «1 boks».
const WHOLE_UNITS = ['pk', 'pakke', 'boks', 'pose', 'glass', 'flaske', 'beger', 'hode', 'bunt', 'stk', 'terning'];

// Mengden slik den vises i oppskriften og handlelista. Varer valgt som pakker
// rundes alltid opp; på handlelista rundes også bokser, poser og stykk opp.
export function displayAmount(
  ingredient: Ingredient,
  persons: number,
  base: number = BASE_PERSONS,
  { shopping = false }: { shopping?: boolean } = {},
): string {
  const quantity = scaleQuantity(ingredient.quantity, persons, base);
  const unit = ingredient.unit.toLowerCase();
  if (unit === 'pk' || (shopping && WHOLE_UNITS.includes(unit))) {
    return `${Math.max(1, Math.ceil(quantity - 0.05))} ${ingredient.unit}`;
  }
  return formatQuantity(quantity, ingredient.unit);
}

export function formatQuantity(quantity: number, unit: string): string {
  const rounded =
    unit === 'g' || unit === 'ml'
      ? Math.round(quantity)
      : Math.round(quantity * 4) / 4; // nærmeste kvarte for stk, fedd, ss osv.
  const text = Number.isInteger(rounded) ? String(rounded) : String(rounded).replace('.', ',');
  return `${text} ${unit}`;
}

// Anslått pakkepris i kroner for varer uten koblet Kassalapp-vare.
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
