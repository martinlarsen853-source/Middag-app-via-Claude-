import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const PERSONS_KEY = 'handleklar.persons';
const CHECKED_KEY = 'handleklar.checked';

type AppState = {
  persons: number;
  setPersons: (next: number) => void;
  checked: Record<string, boolean>;
  toggleChecked: (key: string) => void;
  clearChecked: (prefix: string) => void;
  ready: boolean;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [persons, setPersonsState] = useState(2);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Leser lagrede valg én gang ved oppstart. Feiler dette bruker vi standardverdiene.
    (async () => {
      try {
        const [storedPersons, storedChecked] = await AsyncStorage.multiGet([PERSONS_KEY, CHECKED_KEY]);
        const parsedPersons = Number(storedPersons[1]);
        if (Number.isFinite(parsedPersons) && parsedPersons >= 1) setPersonsState(parsedPersons);
        if (storedChecked[1]) setChecked(JSON.parse(storedChecked[1]));
      } catch {
        // Ingen lagrede valg ennå — standardverdiene gjelder.
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const setPersons = useCallback((next: number) => {
    const clamped = Math.min(12, Math.max(1, next));
    setPersonsState(clamped);
    AsyncStorage.setItem(PERSONS_KEY, String(clamped)).catch(() => {});
  }, []);

  const toggleChecked = useCallback(
    (key: string) => {
      setChecked(current => {
        const next = { ...current, [key]: !current[key] };
        AsyncStorage.setItem(CHECKED_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    [],
  );

  const clearChecked = useCallback(
    (prefix: string) => {
      setChecked(current => {
        const next = Object.fromEntries(Object.entries(current).filter(([key]) => !key.startsWith(prefix)));
        AsyncStorage.setItem(CHECKED_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ persons, setPersons, checked, toggleChecked, clearChecked, ready }),
    [persons, setPersons, checked, toggleChecked, clearChecked, ready],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp må brukes inne i AppProvider');
  return context;
}
