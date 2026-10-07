import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { DEFAULT_STORES, type Store } from '@/data/stores';
import * as cloud from '@/lib/cloud';
import { ALL_STOP_IDS, type StopId } from '@/lib/stops';

const PERSONS_KEY = 'handleklar.persons';
const CHECKED_KEY = 'handleklar.checked';
// Gamle, lokale butikkrekkefølger fra før rekkefølgen ble felles. Lastes opp
// én gang når eieren låser opp, og slettes så.
const LEGACY_STORES_KEY = 'handleklar.stores';
const SHARED_STORES_KEY = 'handleklar.sharedStores';
const OWNER_KEY = 'handleklar.ownerKey';
const ACTIVE_KEY = 'handleklar.activeList';

export type ActiveList = { mealId: number | string; storeId: string };

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
  // Bare eieren kan endre butikkene. Rekkefølgen er felles for alle.
  isOwner: boolean;
  unlockOwner: (key: string) => Promise<boolean>;
  claimOwner: () => Promise<void>;
  lockOwner: () => void;
  storeSyncError: string | null;
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

function normalizeStores(saved: { id: string; name: string; stops: string[]; custom?: boolean }[]): Store[] {
  return saved.map(store => ({
    id: store.id,
    name: store.name,
    stops: normalizeStops(store.stops as StopId[]),
    custom: Boolean(store.custom),
  }));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [persons, setPersonsState] = useState(2);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [stores, setStores] = useState<Store[]>(DEFAULT_STORES);
  const [activeList, setActiveListState] = useState<ActiveList | null>(null);
  const [ownerKey, setOwnerKey] = useState<string | null>(null);
  const [storeSyncError, setStoreSyncError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const storesRef = useRef<Store[]>(DEFAULT_STORES);
  const ownerKeyRef = useRef<string | null>(null);
  const pendingSaves = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const applyStores = useCallback((next: Store[]) => {
    storesRef.current = next;
    setStores(next);
    AsyncStorage.setItem(SHARED_STORES_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  useEffect(() => {
    // Leser lagrede valg én gang ved oppstart. Feiler dette bruker vi standardverdiene.
    (async () => {
      try {
        const [storedPersons, storedChecked, storedShared, storedActive, storedOwner] = await AsyncStorage.multiGet([
          PERSONS_KEY,
          CHECKED_KEY,
          SHARED_STORES_KEY,
          ACTIVE_KEY,
          OWNER_KEY,
        ]);
        const parsedPersons = Number(storedPersons[1]);
        if (Number.isFinite(parsedPersons) && parsedPersons >= 1) setPersonsState(parsedPersons);
        if (storedChecked[1]) setChecked(JSON.parse(storedChecked[1]));
        if (storedShared[1]) applyStores(normalizeStores(JSON.parse(storedShared[1])));
        if (storedActive[1]) setActiveListState(JSON.parse(storedActive[1]));
        if (storedOwner[1]) {
          ownerKeyRef.current = storedOwner[1];
          setOwnerKey(storedOwner[1]);
        }
      } catch {
        // Ingen lagrede valg ennå — standardverdiene gjelder.
      } finally {
        setReady(true);
      }
      // Henter den felles rekkefølgen. Uten nett brukes den sist lagrede.
      try {
        const shared = await cloud.listStores();
        if (shared.length) applyStores(normalizeStores(shared));
      } catch {
        // Beholder lagret eller innebygd rekkefølge.
      }
    })();
  }, [applyStores]);

  // Lagrer en butikk til databasen litt etter siste trykk, så mange flytt blir ett kall.
  const scheduleSave = useCallback((storeId: string) => {
    const key = ownerKeyRef.current;
    if (!key) return;
    const timers = pendingSaves.current;
    clearTimeout(timers.get(storeId));
    timers.set(
      storeId,
      setTimeout(async () => {
        timers.delete(storeId);
        const store = storesRef.current.find(s => s.id === storeId);
        if (!store) return;
        try {
          await cloud.saveStore(key, { id: store.id, name: store.name, stops: store.stops });
          setStoreSyncError(null);
        } catch (error) {
          setStoreSyncError(error instanceof Error ? error.message : 'Kunne ikke lagre butikken');
        }
      }, 600),
    );
  }, []);

  const becomeOwner = useCallback(
    async (key: string) => {
      ownerKeyRef.current = key;
      setOwnerKey(key);
      await AsyncStorage.setItem(OWNER_KEY, key);
      // Har eieren rettet rekkefølgen lokalt før den ble felles, tas det med opp.
      const legacy = await AsyncStorage.getItem(LEGACY_STORES_KEY);
      if (legacy) {
        const local = normalizeStores(JSON.parse(legacy));
        for (const store of local) await cloud.saveStore(key, { id: store.id, name: store.name, stops: store.stops });
        await AsyncStorage.removeItem(LEGACY_STORES_KEY);
        applyStores(normalizeStores(await cloud.listStores()));
      }
    },
    [applyStores],
  );

  const unlockOwner = useCallback(
    async (key: string) => {
      const trimmed = key.trim();
      if (!(await cloud.checkOwner(trimmed))) return false;
      await becomeOwner(trimmed);
      return true;
    },
    [becomeOwner],
  );

  const claimOwner = useCallback(async () => {
    await becomeOwner(await cloud.claimOwner());
  }, [becomeOwner]);

  const lockOwner = useCallback(() => {
    ownerKeyRef.current = null;
    setOwnerKey(null);
    AsyncStorage.removeItem(OWNER_KEY).catch(() => {});
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

  // Endringer gjelder bare for eieren; for alle andre er butikkene skrivebeskyttet.
  const updateStores = useCallback(
    (change: (current: Store[]) => Store[], storeId: string) => {
      if (!ownerKeyRef.current) return;
      applyStores(change(storesRef.current));
      scheduleSave(storeId);
    },
    [applyStores, scheduleSave],
  );

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
        storeId,
      );
    },
    [updateStores],
  );

  const renameStore = useCallback(
    (storeId: string, name: string) => {
      updateStores(current => current.map(store => (store.id === storeId ? { ...store, name } : store)), storeId);
    },
    [updateStores],
  );

  const addStore = useCallback(
    (name: string) => {
      const id = `butikk-${Date.now()}`;
      // En ny butikk starter med Rema-rekkefølgen; den rettes når man er i butikken.
      updateStores(current => [...current, { id, name, stops: [...DEFAULT_STORES[0].stops], custom: true }], id);
      return id;
    },
    [updateStores],
  );

  const removeStore = useCallback(
    (storeId: string) => {
      const key = ownerKeyRef.current;
      if (!key) return;
      applyStores(storesRef.current.filter(store => store.id !== storeId || !store.custom));
      cloud.hideStore(key, storeId).catch(error =>
        setStoreSyncError(error instanceof Error ? error.message : 'Kunne ikke fjerne butikken'),
      );
    },
    [applyStores],
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
        storeId,
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
      isOwner: Boolean(ownerKey),
      unlockOwner,
      claimOwner,
      lockOwner,
      storeSyncError,
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
      ownerKey,
      unlockOwner,
      claimOwner,
      lockOwner,
      storeSyncError,
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
