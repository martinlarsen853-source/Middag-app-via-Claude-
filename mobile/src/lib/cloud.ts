import { SUPABASE_KEY, SUPABASE_URL } from '@/constants/config';
import type { Meal } from '@/data/meals';

// Egne middager lagres i Supabase. Alt går gjennom hk_*-funksjonene i databasen,
// som bare slipper til den som har husstandsnøkkelen.

export class CloudError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });
  } catch {
    throw new CloudError('Fikk ikke kontakt. Sjekk nettet og prøv igjen.', 0);
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new CloudError(body?.message ?? `Noe gikk galt (${response.status})`, response.status);
  }
  return (await response.json()) as T;
}

export type StoredMeal = Omit<Meal, 'id' | 'custom'> & { id?: string; updatedAt?: string };

export function createHousehold(): Promise<string> {
  return rpc<string>('hk_create_household', {});
}

export function listMeals(token: string): Promise<StoredMeal[]> {
  return rpc<StoredMeal[]>('hk_list_meals', { p_token: token });
}

export function saveMeal(token: string, meal: StoredMeal): Promise<StoredMeal> {
  return rpc<StoredMeal>('hk_save_meal', { p_token: token, p_meal: meal });
}

export function deleteMeal(token: string, id: string): Promise<boolean> {
  return rpc<boolean>('hk_delete_meal', { p_token: token, p_id: id });
}

// Butikkenes rekkefølge er felles. Alle kan lese, bare eieren kan endre.
export type SharedStore = { id: string; name: string; stops: string[]; custom?: boolean };

export function listStores(): Promise<SharedStore[]> {
  return rpc<SharedStore[]>('hk_list_stores', {});
}

export function checkOwner(key: string): Promise<boolean> {
  return rpc<boolean>('hk_check_owner', { p_key: key });
}

export function saveStore(key: string, store: SharedStore): Promise<SharedStore> {
  return rpc<SharedStore>('hk_save_store', { p_key: key, p_store: store });
}

export function hideStore(key: string, id: string): Promise<boolean> {
  return rpc<boolean>('hk_hide_store', { p_key: key, p_id: id });
}

export function ownerClaimOpen(): Promise<boolean> {
  return rpc<boolean>('hk_owner_claim_open', {});
}

// Gjør denne telefonen til eier. Virker bare én gang; databasen lager nøkkelen.
export function claimOwner(): Promise<string> {
  return rpc<string>('hk_claim_owner', {});
}

// ---- Felles ukeplan og handleliste ----

export type RemoteList = { state: Record<string, unknown>; version: number };

export function getList(token: string): Promise<RemoteList> {
  return rpc<RemoteList>('hk_get_list', { p_token: token });
}

export function patchList(token: string, patch: Record<string, unknown>): Promise<RemoteList> {
  return rpc<RemoteList>('hk_patch_list', { p_token: token, p_patch: patch });
}

// ---- Handlehistorikk ----

export function addTrip(token: string, trip: Record<string, unknown>): Promise<string> {
  return rpc<string>('hk_add_trip', { p_token: token, p_trip: trip });
}

export function listTrips<T>(token: string): Promise<T[]> {
  return rpc<T[]>('hk_list_trips', { p_token: token, p_limit: 200 });
}
