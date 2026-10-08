import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import * as cloud from '@/lib/cloud';
import { useMeals } from '@/lib/meals-store';

// Handleturer lagres, så appen vet hva dere har spist og når. Det brukes til
// «ikke spist på lenge» og blir grunnlaget for statistikk og forslag senere.

export type TripMeal = { mealId: string | number; name: string; persons: number };
export type TripItem = { name: string; amount: string; ean?: string | null; skipped?: boolean };

export type Trip = {
  id: string;
  at: number;
  storeId: string;
  storeName: string;
  total: number;
  exact: boolean;
  meals: TripMeal[];
  items: TripItem[];
  by?: string | null;
  // Ikke lastet opp ennå (ingen husstand eller uten nett).
  pending?: boolean;
};

const CACHE_KEY = 'handleklar.trips';

type HistoryContext = {
  trips: Trip[];
  recordTrip: (trip: Omit<Trip, 'id' | 'at' | 'pending'>) => void;
  lastEaten: (mealId: string | number) => number | null;
};

const Context = createContext<HistoryContext | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const { householdToken } = useMeals();
  const [trips, setTrips] = useState<Trip[]>([]);

  const save = useCallback((next: Trip[]) => {
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(next.slice(0, 300))).catch(() => {});
  }, []);

  const update = useCallback(
    (change: (current: Trip[]) => Trip[]) => {
      setTrips(current => {
        const next = change(current).sort((a, b) => b.at - a.at);
        save(next);
        return next;
      });
    },
    [save],
  );

  const upload = useCallback(
    async (token: string, trip: Trip) => {
      const { id: _id, pending: _pending, ...data } = trip;
      const id = await cloud.addTrip(token, data);
      update(current => current.map(item => (item.id === trip.id ? { ...item, id, pending: false } : item)));
    },
    [update],
  );

  // Viser lagret historikk med en gang, henter felles historikk og laster opp det som venter.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let local: Trip[] = [];
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) local = JSON.parse(cached);
      } catch {
        local = [];
      }
      if (cancelled) return;
      setTrips(local);
      if (!householdToken) return;
      try {
        const remote = await cloud.listTrips<Trip>(householdToken);
        const pending = local.filter(trip => trip.pending);
        if (cancelled) return;
        update(() => [...remote.map(trip => ({ ...trip, pending: false })), ...pending]);
        for (const trip of pending) await upload(householdToken, trip).catch(() => {});
      } catch {
        // Uten nett vises det som er lagret på telefonen.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [householdToken, update, upload]);

  const recordTrip = useCallback(
    (data: Omit<Trip, 'id' | 'at' | 'pending'>) => {
      const trip: Trip = { ...data, id: `lokal-${Date.now().toString(36)}`, at: Date.now(), pending: true };
      update(current => [trip, ...current]);
      if (householdToken) upload(householdToken, trip).catch(() => {});
    },
    [householdToken, update, upload],
  );

  const lastEatenMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const trip of trips) {
      for (const meal of trip.meals) {
        const key = String(meal.mealId);
        map.set(key, Math.max(map.get(key) ?? 0, trip.at));
      }
    }
    return map;
  }, [trips]);

  const lastEaten = useCallback((mealId: string | number) => lastEatenMap.get(String(mealId)) ?? null, [lastEatenMap]);

  const value = useMemo(() => ({ trips, recordTrip, lastEaten }), [trips, recordTrip, lastEaten]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useHistory(): HistoryContext {
  const context = useContext(Context);
  if (!context) throw new Error('useHistory må brukes inne i HistoryProvider');
  return context;
}

export function daysAgo(at: number): string {
  const days = Math.floor((Date.now() - at) / 86400000);
  if (days <= 0) return 'i dag';
  if (days === 1) return 'i går';
  if (days < 7) return `for ${days} dager siden`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `for ${weeks} ${weeks === 1 ? 'uke' : 'uker'} siden`;
  const months = Math.floor(days / 30);
  return `for ${months} ${months === 1 ? 'måned' : 'måneder'} siden`;
}
