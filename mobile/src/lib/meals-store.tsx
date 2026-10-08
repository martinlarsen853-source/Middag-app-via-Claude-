import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { INSPO } from '@/data/inspo';
import { MEALS, type Meal } from '@/data/meals';
import * as cloud from '@/lib/cloud';

const TOKEN_KEY = 'handleklar.household';
const CACHE_KEY = 'handleklar.customMeals';
const NAME_KEY = 'handleklar.memberName';
const DEVICE_KEY = 'handleklar.deviceId';

export type MealDraft = Omit<Meal, 'id' | 'custom'> & { id?: string };

type MealsState = {
  meals: Meal[];
  customMeals: Meal[];
  findMeal: (id: string | number | undefined) => Meal | undefined;
  saveMeal: (draft: MealDraft) => Promise<Meal>;
  deleteMeal: (id: string) => Promise<void>;
  loading: boolean;
  syncError: string | null;
  // Husstanden: en hemmelig nøkkel som deles med samboer. Den som har nøkkelen
  // ser de samme egne middagene, den samme ukeplanen og den samme handlelista.
  householdToken: string | null;
  ensureHousehold: () => Promise<string>;
  joinHousehold: (token: string) => Promise<void>;
  leaveHousehold: () => Promise<void>;
  refreshMeals: () => Promise<void>;
  // Navnet som vises når du handler eller legger til varer, og en id for denne telefonen.
  memberName: string;
  setMemberName: (name: string) => void;
  deviceId: string;
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
  const [memberName, setMemberNameState] = useState('');
  const [deviceId, setDeviceId] = useState('');

  const remember = useCallback((next: Meal[]) => {
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  useEffect(() => {
    // Viser lagrede middager med en gang, og henter ferske fra databasen i bakgrunnen.
    (async () => {
      try {
        const [[, savedToken], [, cached], [, savedName], [, savedDevice]] = await AsyncStorage.multiGet([
          TOKEN_KEY,
          CACHE_KEY,
          NAME_KEY,
          DEVICE_KEY,
        ]);
        if (cached) setCustomMeals(JSON.parse(cached));
        if (savedName) setMemberNameState(savedName);
        const device = savedDevice || `d-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        setDeviceId(device);
        if (!savedDevice) AsyncStorage.setItem(DEVICE_KEY, device).catch(() => {});
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

  const refreshMeals = useCallback(async () => {
    if (!token) return;
    try {
      const fresh = (await cloud.listMeals(token)).map(toMeal);
      setCustomMeals(fresh);
      remember(fresh);
      setSyncError(null);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Kunne ikke hente egne middager');
    }
  }, [token, remember]);

  // Samboer kan ha lagt inn en ny middag. Henter på nytt jevnlig mens appen er åpen.
  useEffect(() => {
    if (!token) return;
    const timer = setInterval(() => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') refreshMeals();
    }, 60000);
    return () => clearInterval(timer);
  }, [token, refreshMeals]);

  const joinHousehold = useCallback(
    async (next: string) => {
      const trimmed = next.trim();
      // Sjekker nøkkelen før vi bytter; en ukjent nøkkel gir en feil her.
      const meals = (await cloud.listMeals(trimmed)).map(toMeal);
      await AsyncStorage.setItem(TOKEN_KEY, trimmed);
      setToken(trimmed);
      setCustomMeals(meals);
      remember(meals);
    },
    [remember],
  );

  const leaveHousehold = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCustomMeals([]);
    remember([]);
  }, [remember]);

  const setMemberName = useCallback((name: string) => {
    const trimmed = name.slice(0, 40);
    setMemberNameState(trimmed);
    AsyncStorage.setItem(NAME_KEY, trimmed).catch(() => {});
  }, []);

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
      const key = String(id);
      return (
        customMeals.find(meal => String(meal.id) === key) ??
        MEALS.find(meal => String(meal.id) === key) ??
        INSPO.find(meal => String(meal.id) === key)
      );
    },
    [customMeals],
  );

  const value = useMemo(
    () => ({
      meals,
      customMeals,
      findMeal,
      saveMeal,
      deleteMeal,
      loading,
      syncError,
      householdToken: token,
      ensureHousehold: ensureToken,
      joinHousehold,
      leaveHousehold,
      refreshMeals,
      memberName,
      setMemberName,
      deviceId,
    }),
    [
      meals,
      customMeals,
      findMeal,
      saveMeal,
      deleteMeal,
      loading,
      syncError,
      token,
      ensureToken,
      joinHousehold,
      leaveHousehold,
      refreshMeals,
      memberName,
      setMemberName,
      deviceId,
    ],
  );

  return <MealsContext.Provider value={value}>{children}</MealsContext.Provider>;
}

export function useMeals(): MealsState {
  const context = useContext(MealsContext);
  if (!context) throw new Error('useMeals må brukes inne i MealsProvider');
  return context;
}
