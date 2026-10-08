// Felles logikk for AI-forslag: sjekk av forespørselen, instruksen til Claude,
// svarformatet og kontroll av svaret. Holdes fri for nettverkskall så den kan testes.

export type Goal = 'spar' | 'protein' | 'sunnere';

export type MealFacts = {
  mealId: string;
  name: string;
  category: string;
  pricePerPortion: number; // kroner, regnet ut i appen fra butikkprisene
  protein: number; // gram per porsjon, grovt anslag
  fish: boolean;
  redMeat: number; // gram rått rødt kjøtt per porsjon
  ultra: number; // antall typisk ultraprosesserte ingredienser
  minutes: number;
};

export type PlanItem = MealFacts & { entryId: string; persons: number };
export type Candidate = MealFacts & { mine: boolean };

export type ForslagRequest = { goal: Goal; store: string | null; plan: PlanItem[]; candidates: Candidate[] };

export type Swap = { entryId: string; mealId: string; reason: string };
export type ForslagResult = { summary: string; swaps: Swap[]; tips: string[] };

const GOALS: Goal[] = ['spar', 'protein', 'sunnere'];
const MAX_PLAN = 14;
const MAX_CANDIDATES = 80;

const text = (value: unknown, max = 80) => (typeof value === 'string' ? value.slice(0, max) : '');
const num = (value: unknown, max: number) => {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return Math.round(Math.min(max, Math.max(0, n)));
};

function facts(raw: Record<string, unknown>): MealFacts | null {
  const mealId = text(raw.mealId, 60);
  const name = text(raw.name);
  if (!mealId || !name) return null;
  return {
    mealId,
    name,
    category: text(raw.category, 30),
    pricePerPortion: num(raw.pricePerPortion, 2000),
    protein: num(raw.protein, 500),
    fish: raw.fish === true,
    redMeat: num(raw.redMeat, 2000),
    ultra: num(raw.ultra, 20),
    minutes: num(raw.minutes, 600),
  };
}

// Godtar bare det appen faktisk sender, med fornuftige grenser, så ingen kan
// sende enorme eller rare forespørsler som koster penger.
export function parseRequest(body: unknown): ForslagRequest | null {
  if (!body || typeof body !== 'object') return null;
  const raw = body as Record<string, unknown>;
  if (!GOALS.includes(raw.goal as Goal)) return null;
  if (!Array.isArray(raw.plan) || !Array.isArray(raw.candidates)) return null;
  if (raw.plan.length === 0 || raw.plan.length > MAX_PLAN || raw.candidates.length > MAX_CANDIDATES) return null;

  const plan: PlanItem[] = [];
  for (const item of raw.plan as Record<string, unknown>[]) {
    const base = item && typeof item === 'object' ? facts(item) : null;
    const entryId = text(item?.entryId, 60);
    if (!base || !entryId) return null;
    plan.push({ ...base, entryId, persons: Math.max(1, num(item.persons, 12)) });
  }
  const candidates: Candidate[] = [];
  for (const item of raw.candidates as Record<string, unknown>[]) {
    const base = item && typeof item === 'object' ? facts(item) : null;
    if (base) candidates.push({ ...base, mine: item.mine === true });
  }
  if (candidates.length === 0) return null;
  return { goal: raw.goal as Goal, store: text(raw.store, 40) || null, plan, candidates };
}

export const SYSTEM_PROMPT = `Du hjelper en norsk husstand å forbedre ukas middager i appen Handleklar.

Du får ukeplanen og en liste med andre middager de kan velge. For hver middag står pris per porsjon i kroner (regnet ut fra butikkprisene i appen), protein per porsjon i gram (grovt anslag), om det er fisk, gram rødt kjøtt per porsjon (rå vekt), hvor mange ingredienser som typisk er ultraprosessert, og tid i minutter.

Målet er ett av disse:
- spar: gjør uka billigere uten at maten blir mye dårligere.
- protein: gi mer protein per porsjon uten at prisen stiger mye.
- sunnere: følg Helsedirektoratets kostråd – fisk til middag 2–3 ganger i uka, begrens rødt og bearbeidet kjøtt, mer grønt og mindre ultraprosessert mat.

Slik svarer du:
- Foreslå 0–3 bytter. Et bytte erstatter én middag i planen (entryId) med én middag fra kandidatlista (mealId). Bruk hver kandidat og hver middag i planen høyst én gang.
- Foreslå bare bytter som faktisk hjelper målet ut fra tallene. Foretrekk middager husstanden har lagt inn selv (mine: true) og retter som ligner i tid og type.
- reason: én kort setning på enkel norsk (bokmål), høyst 120 tegn, som sier hva byttet gir.
- summary: én eller to korte setninger om uka sett opp mot målet.
- tips: 0–2 korte, konkrete råd som ikke er bytter, for eksempel å legge til en salat. Ingen medisinske råd.
- Finnes det ingen gode bytter, la swaps være tom og si det i summary.`;

// Svarformatet, med id-ene låst til det som finnes i forespørselen.
export function outputSchema(request: ForslagRequest): Record<string, unknown> {
  return {
    type: 'object',
    additionalProperties: false,
    required: ['summary', 'swaps', 'tips'],
    properties: {
      summary: { type: 'string' },
      swaps: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['entryId', 'mealId', 'reason'],
          properties: {
            entryId: { type: 'string', enum: request.plan.map(item => item.entryId) },
            mealId: { type: 'string', enum: request.candidates.map(item => item.mealId) },
            reason: { type: 'string' },
          },
        },
      },
      tips: { type: 'array', items: { type: 'string' } },
    },
  };
}

export function userMessage(request: ForslagRequest): string {
  return JSON.stringify({
    mål: request.goal,
    butikk: request.store,
    ukeplan: request.plan,
    kandidater: request.candidates,
  });
}

// Stoler ikke blindt på svaret: ukjente id-er, doble bytter og for lange tekster fjernes.
export function cleanResult(raw: unknown, request: ForslagRequest): ForslagResult | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as Record<string, unknown>;
  const entries = new Set(request.plan.map(item => item.entryId));
  const meals = new Set(request.candidates.map(item => item.mealId));
  const planned = new Set(request.plan.map(item => item.mealId));
  const usedEntries = new Set<string>();
  const usedMeals = new Set<string>();
  const swaps: Swap[] = [];
  for (const swap of Array.isArray(value.swaps) ? value.swaps : []) {
    if (!swap || typeof swap !== 'object') continue;
    const { entryId, mealId, reason } = swap as Record<string, unknown>;
    if (typeof entryId !== 'string' || typeof mealId !== 'string') continue;
    if (!entries.has(entryId) || !meals.has(mealId) || planned.has(mealId)) continue;
    if (usedEntries.has(entryId) || usedMeals.has(mealId)) continue;
    usedEntries.add(entryId);
    usedMeals.add(mealId);
    swaps.push({ entryId, mealId, reason: text(reason, 200) });
    if (swaps.length === 3) break;
  }
  const tips = (Array.isArray(value.tips) ? value.tips : [])
    .filter((tip): tip is string => typeof tip === 'string' && tip.trim().length > 0)
    .slice(0, 2)
    .map(tip => tip.slice(0, 200));
  return { summary: text(value.summary, 400), swaps, tips };
}
