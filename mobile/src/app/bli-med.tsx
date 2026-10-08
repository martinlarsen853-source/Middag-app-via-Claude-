import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Body, Button, Eyebrow, Page, Title } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { useMeals } from '@/lib/meals-store';
import { tokenFromText } from '@/lib/share';

// Nøkkelen fra lenken legges i fanens midlertidige lagring, og siden lastes på
// nytt uten nøkkelen i adressen. Da blir den ikke liggende i nettleserhistorikken.
const PENDING_KEY = 'handleklar.pendingJoin';

function readPending(): string | null {
  try {
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(PENDING_KEY) : null;
  } catch {
    return null;
  }
}

// Åpnes fra lenken samboer deler. Nøkkelen står etter # i adressen.
export default function JoinScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ k?: string }>();
  const { joinHousehold, householdToken } = useMeals();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const fromHash = tokenFromText(window.location.hash);
      if (fromHash) {
        try {
          sessionStorage.setItem(PENDING_KEY, fromHash);
          window.location.replace(window.location.pathname);
          return;
        } catch {
          // Uten lagring bruker vi nøkkelen direkte.
        }
      }
      setToken(fromHash ?? readPending());
      return;
    }
    setToken(params.k ? tokenFromText(`k=${params.k}`) : null);
  }, [params.k]);

  async function join() {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      await joinHousehold(token);
      try {
        sessionStorage.removeItem(PENDING_KEY);
      } catch {
        // Ingen midlertidig lagring å rydde.
      }
      router.replace('/uka');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke bli med');
      setBusy(false);
    }
  }

  const already = token && householdToken === token;

  return (
    <Page maxWidth={620}>
      <View style={styles.card}>
        <Ionicons name="people" size={36} color={colors.ink} />
        <Eyebrow>Samboer</Eyebrow>
        {!token ? (
          <>
            <Title size="md">Lenken mangler nøkkel</Title>
            <Body>Be om en ny lenke, eller lim den inn under Mer → Del med samboer.</Body>
            <Button label="Til Del med samboer" onPress={() => router.replace('/samboer')} />
          </>
        ) : already ? (
          <>
            <Title size="md">Du er allerede med</Title>
            <Button label="Til ukeplanen" onPress={() => router.replace('/uka')} />
          </>
        ) : (
          <>
            <Title size="md">Bli med i handlelista?</Title>
            <Body>
              Dere får samme ukeplan, samme handleliste og de samme egne middagene. Har du en ukeplan på denne
              telefonen fra før, byttes den ut med den felles.
            </Body>
            <Button label={busy ? 'Vent …' : 'Bli med'} icon="log-in-outline" onPress={join} disabled={busy} />
            {error && <Text style={styles.error}>{error}</Text>}
          </>
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lime,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  error: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.danger },
});
