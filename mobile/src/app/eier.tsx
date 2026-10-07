import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Body, Button, Eyebrow, Page, Title } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { useApp } from '@/lib/store';

// Låser opp eiermodus på denne telefonen. Eieren åpner en lenke med nøkkelen
// én gang; etter det kan bare denne telefonen endre butikkenes rekkefølge.
export default function OwnerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ nokkel?: string }>();
  const { isOwner, unlockOwner, lockOwner, ready } = useApp();
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'wrong' | 'error'>('idle');
  const tried = useRef(false);

  async function unlock(value: string) {
    if (!value.trim()) return;
    setStatus('checking');
    try {
      const ok = await unlockOwner(value);
      setStatus(ok ? 'idle' : 'wrong');
      setKey('');
    } catch {
      setStatus('error');
    }
    // Fjerner nøkkelen fra adresselinja så den ikke blir liggende synlig.
    if (params.nokkel) router.setParams({ nokkel: undefined });
  }

  useEffect(() => {
    if (!ready || tried.current || !params.nokkel) return;
    tried.current = true;
    unlock(String(params.nokkel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, params.nokkel]);

  if (!ready) return null;

  return (
    <Page maxWidth={620}>
      <View style={[styles.card, isOwner && styles.cardOwner]}>
        <Ionicons name={isOwner ? 'lock-open' : 'lock-closed'} size={32} color={colors.ink} />
        <Eyebrow>Eier</Eyebrow>
        {isOwner ? (
          <>
            <Title size="md">Du kan endre butikkene</Title>
            <Body>
              Denne telefonen kan endre rekkefølgen i butikkene og legge til nye. Endringene gjelder for alle som
              bruker appen. Ingen andre ser knappene for å endre.
            </Body>
            <View style={styles.actions}>
              <Button label="Til butikkene" icon="storefront-outline" onPress={() => router.navigate('/butikker')} />
              <Button label="Lås denne telefonen" variant="outline" onPress={lockOwner} />
            </View>
          </>
        ) : (
          <>
            <Title size="md">Bare eieren kan endre butikkene</Title>
            <Body>Butikkenes rekkefølge er felles for alle og settes opp av eieren.</Body>
            <TextInput
              value={key}
              onChangeText={setKey}
              placeholder="Eiernøkkel"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              style={styles.input}
              onSubmitEditing={() => unlock(key)}
              accessibilityLabel="Eiernøkkel"
            />
            {status === 'wrong' && <Text style={styles.error}>Feil nøkkel.</Text>}
            {status === 'error' && <Text style={styles.error}>Fikk ikke kontakt. Prøv igjen.</Text>}
            <Button
              label={status === 'checking' ? 'Sjekker …' : 'Lås opp'}
              icon="key-outline"
              onPress={() => unlock(key)}
              disabled={status === 'checking' || !key.trim()}
              style={styles.button}
            />
          </>
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.beige,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    gap: spacing.md,
  },
  cardOwner: {
    backgroundColor: colors.lime,
  },
  input: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fonts.mono,
    fontSize: 15,
    color: colors.ink,
    minHeight: 48,
    outlineStyle: 'none',
  } as object,
  error: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.danger,
  },
  button: {
    alignSelf: 'flex-start',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
});
