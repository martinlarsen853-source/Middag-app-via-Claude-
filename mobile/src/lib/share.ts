import { Platform } from 'react-native';

import { API_ORIGIN } from '@/constants/config';

// Lenken samboer åpner for å bli med i husstanden. Nøkkelen ligger etter #,
// så den sendes aldri til serveren eller havner i loggene der.
export function householdLink(token: string): string {
  const origin = Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.origin : API_ORIGIN;
  return `${origin}/bli-med#k=${token}`;
}

// Godtar hele lenken eller bare nøkkelen.
export function tokenFromText(text: string): string | null {
  const trimmed = text.trim();
  const match = trimmed.match(/[#?&]k=([A-Za-z0-9]+)/);
  const token = match ? match[1] : trimmed;
  return /^[A-Za-z0-9]{32,128}$/.test(token) ? token : null;
}

export async function shareText(title: string, text: string, url: string): Promise<'shared' | 'copied' | 'failed'> {
  if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return 'shared';
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') return 'failed';
    }
    try {
      await navigator.clipboard.writeText(url);
      return 'copied';
    } catch {
      return 'failed';
    }
  }
  try {
    const { Share } = await import('react-native');
    await Share.share({ message: `${text} ${url}` });
    return 'shared';
  } catch {
    return 'failed';
  }
}
