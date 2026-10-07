import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { DEFAULT_STORES, type Store } from '@/data/stores';
import { ALL_STOP_IDS, type StopId } from '@/lib/stops';

const PERSONS_KEY = 'handleklar.persons';
const CHECKED_KEY = 'handleklar.checked';
const STORES_KEY = 'handleklar.stores';
const ACTIVE_KEY = 'handleklar.activeList';

export type ActiveList = { mealId: number; storeId: string };

type AppState = {
  activeList: ActiveList | null;
  setActiveList: (next: ActiveList | null) => void;
  persons: number;
  setPersons: (next: number) => void;
  checked: Record<string, boolean>;
  toggleChecked: (key: string) => void;
  clearChecked: (prefix: string) => void;
  stores: Store[];
  moveStop: (storeId: string, from: number, to: number) => void;
  renameStore: (storeId: string, name: string) => void;
  addStore: (name: string) => string;
  removeStore: (storeId: string) => void;
  resetStore: (storeId: string) => void;
  ready: boolean;
};

const AppContext = createContext<AppState | null>(null);

// Lagrede butikker kan være fra en eldre versjon av appen. Ukjente stopp
// fjernes og nye stopp legges sist, så rettingene brukeren har gjort beholdes.
function normalizeStops(stops: StopId[]): StopId[] {
  const known = stops.filter(stop => ALL_STOP_IDS.includes(stop));
  const unique = [...new Set(known)];
  const missing = ALL_STOP_IDS.filter(stop => !unique.includes(stop));
  return [...unique, ...missing];
}

function mergeWithDefaults(saved: Store[]): Store[] {
  const normalized = saved.map(store => ({ ...store, stops: normalizeStops(store.stops) }));
  const missingDefaults = DEFAULT_STORES.filter(def => !normalized.some(store => store.id === def.id));
  return [...normalized, ...missingDefaults];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [persons, setPersonsState] = useState(2);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [stores, setStores] = useState<Store[]>(DEFAULT_STORES);
  const [activeList, setActiveListState] = useState<ActiveList | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Leser lagrede valg én gang ved oppstart. Feiler dette bruker vi standardverdiene.
    (async () => {
      try {
        const [storedPersons, storedChecked, storedStores, storedActive] = await AsyncStorage.multiGet([
          PERSONS_KEY,
          CHECKED_KEY,
          STORES_KEY,
          ACTIVE_KEY,
        ]);
        const parsedPersons = Number(storedPersons[1]);
        if (Number.isFinite(parsedPersons) && parsedPersons >= 1) setPersonsState(parsedPersons);
        if (storedChecked[1]) setChecked(JSON.parse(storedChecked[1]));
        if (storedStores[1]) setStores(mergeWithDefaults(JSON.parse(storedStores[1])));
        if (storedActive[1]) setActiveListState(JSON.parse(storedActive[1]));
      } catch {
        // Ingen lagrede valg ennå — standardverdiene gjelder.
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setActiveList = useCallback((next: ActiveList | null) => {
    setActiveListState(next);
    if (next) AsyncStorage.setItem(ACTIVE_KEY, JSON.stringify(next)).catch(() => {});
    else AsyncStorage.removeItem(ACTIVE_KEY).catch(() => {});
  }, []);

  const setPersons = useCallback((next: number) => {
    const clamped = Math.min(12, Math.max(1, next));
    setPersonsState(clamped);
    AsyncStorage.setItem(PERSONS_KEY, String(clamped)).catch(() => {});
  }, []);

  const toggleChecked = useCallback((key: string) => {
    setChecked(current => {
      const next = { ...current, [key]: !current[key] };
      AsyncStorage.setItem(CHECKED_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const clearChecked = useCallback((prefix: string) => {
    setChecked(current => {
      const next = Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(prefix)));
      AsyncStorage.setItem(CHECKED_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const updateStores = useCallback((change: (current: Store[]) => Store[]) => {
    setStores(current => {
      const next = change(current);
      AsyncStorage.setItem(STORES_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const moveStop = useCallback(
    (storeId: string, from: number, to: number) => {
      updateStores(current =>
        current.map(store => {
          if (store.id !== storeId || to < 0 || to >= store.stops.length) return store;
          const stops = [...store.stops];
          const [moved] = stops.splice(from, 1);
          stops.splice(to, 0, moved);
          return { ...store, stops };
        }),
      );
    },
    [updateStores],
  );

  const renameStore = useCallback(
    (storeId: string, name: string) => {
      updateStores(current => current.map(store => (store.id === storeId ? { ...store, name } : store)));
    },
    [updateStores],
  );

  const addStore = useCallback(
    (name: string) => {
      const id = `butikk-${Date.now()}`;
      // En ny butikk starter med Rema-rekkefølgen; den rettes når man er i butikken.
      updateStores(current => [...current, { id, name, stops: [...DEFAULT_STORES[0].stops], custom: true }]);
      return id;
    },
    [updateStores],
  );

  const removeStore = useCallback(
    (storeId: string) => {
      updateStores(current => current.filter(store => store.id !== storeId || !store.custom));
    },
    [updateStores],
  );

  const resetStore = useCallback(
    (storeId: string) => {
      const original = DEFAULT_STORES.find(store => store.id === storeId);
      updateStores(current =>
        current.map(store =>
          store.id === storeId
            ? { ...store, stops: [...(original ?? DEFAULT_STORES[0]).stops], name: original?.name ?? store.name }
            : store,
        ),
      );
    },
    [updateStores],
  );

  const value = useMemo(
    () => ({
      activeList,
      setActiveList,
      persons,
      setPersons,
      checked,
      toggleChecked,
      clearChecked,
      stores,
      moveStop,
      renameStore,
      addStore,
      removeStore,
      resetStore,
      ready,
    }),
    [
      activeList,
      setActiveList,
      persons,
      setPersons,
      checked,
      toggleChecked,
      clearChecked,
      stores,
      moveStop,
      renameStore,
      addStore,
      removeStore,
      resetStore,
      ready,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp må brukes inne i AppProvider');
  return context;
}
