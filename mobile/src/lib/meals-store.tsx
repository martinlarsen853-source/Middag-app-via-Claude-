import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { MEALS, type Meal } from '@/data/meals';
import * as cloud from '@/lib/cloud';

const TOKEN_KEY = 'handleklar.household';
const CACHE_KEY = 'handleklar.customMeals';

export type MealDraft = Omit<Meal, 'id' | 'custom'> & { id?: string };

type MealsState = {
  meals: Meal[];
  customMeals: Meal[];
  findMeal: (id: string | number | undefined) => Meal | undefined;
  saveMeal: (draft: MealDraft) => Promise<Meal>;
  deleteMeal: (id: string) => Promise<void>;
  loading: boolean;
  syncError: string | null;
};

const MealsContext = createContext<MealsState | null>(null);

function toMeal(stored: cloud.StoredMeal): Meal {
  return {
    id: String(stored.id),
    name: stored.name,
    emoji: stored.emoji || '🍽️',
    description: stored.description ?? '',
    timeMinutes: Number(stored.timeMinutes) || 0,
    priceLevel: 0,
    category: stored.category || 'Enkelt',
    tags: Array.isArray(stored.tags) ? stored.tags : [],
    ingredients: Array.isArray(stored.ingredients) ? stored.ingredients : [],
    steps: Array.isArray(stored.steps) ? stored.steps : [],
    basePersons: Number(stored.basePersons) || undefined,
    basedOn: typeof stored.basedOn === 'number' ? stored.basedOn : undefined,
    custom: true,
  };
}

export function MealsProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [customMeals, setCustomMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  const remember = useCallback((next: Meal[]) => {
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  useEffect(() => {
    // Viser lagrede middager med en gang, og henter ferske fra databasen i bakgrunnen.
    (async () => {
      try {
        const [[, savedToken], [, cached]] = await AsyncStorage.multiGet([TOKEN_KEY, CACHE_KEY]);
        if (cached) setCustomMeals(JSON.parse(cached));
        if (savedToken) {
          setToken(savedToken);
          const fresh = (await cloud.listMeals(savedToken)).map(toMeal);
          setCustomMeals(fresh);
          remember(fresh);
        }
        setSyncError(null);
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Kunne ikke hente egne middager');
      } finally {
        setLoading(false);
      }
    })();
  }, [remember]);

  const ensureToken = useCallback(async () => {
    if (token) return token;
    const created = await cloud.createHousehold();
    await AsyncStorage.setItem(TOKEN_KEY, created);
    setToken(created);
    return created;
  }, [token]);

  const saveMeal = useCallback(
    async (draft: MealDraft) => {
      const householdToken = await ensureToken();
      const saved = toMeal(await cloud.saveMeal(householdToken, draft));
      setCustomMeals(current => {
        const exists = current.some(meal => meal.id === saved.id);
        const next = exists ? current.map(meal => (meal.id === saved.id ? saved : meal)) : [...current, saved];
        remember(next);
        return next;
      });
      setSyncError(null);
      return saved;
    },
    [ensureToken, remember],
  );

  const deleteMeal = useCallback(
    async (id: string) => {
      if (token) await cloud.deleteMeal(token, id);
      setCustomMeals(current => {
        const next = current.filter(meal => meal.id !== id);
        remember(next);
        return next;
      });
    },
    [token, remember],
  );

  // En egen versjon av en fast rett erstatter originalen i lista.
  const meals = useMemo(() => {
    const replaced = new Set(customMeals.map(meal => meal.basedOn).filter(id => id !== undefined));
    return [...customMeals, ...MEALS.filter(meal => !replaced.has(meal.id as number))];
  }, [customMeals]);

  const findMeal = useCallback(
    (id: string | number | undefined) => {
      if (id === undefined) return undefined;
      return customMeals.find(meal => String(meal.id) === String(id)) ?? MEALS.find(meal => String(meal.id) === String(id));
    },
    [customMeals],
  );

  const value = useMemo(
    () => ({ meals, customMeals, findMeal, saveMeal, deleteMeal, loading, syncError }),
    [meals, customMeals, findMeal, saveMeal, deleteMeal, loading, syncError],
  );

  return <MealsContext.Provider value={value}>{children}</MealsContext.Provider>;
}

export function useMeals(): MealsState {
  const context = useContext(MealsContext);
  if (!context) throw new Error('useMeals må brukes inne i MealsProvider');
  return context;
}
