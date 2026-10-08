import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackLink, Body, Button, Eyebrow, Page, Title } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { useMeals } from '@/lib/meals-store';
import { householdLink, shareText, tokenFromText } from '@/lib/share';
import { useSync } from '@/lib/sync';

export default function PartnerScreen() {
  const router = useRouter();
  const { householdToken, ensureHousehold, joinHousehold, leaveHousehold, memberName, setMemberName } = useMeals();
  const { status } = useSync();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joinText, setJoinText] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  async function share() {
    setError(null);
    setBusy(true);
    try {
      const token = await ensureHousehold();
      const result = await shareText(
        'Handleklar',
        'Bli med i handlelista vår i Handleklar:',
        householdLink(token),
      );
      setMessage(
        result === 'shared'
          ? 'Lenken er delt. Når samboer åpner den, ser dere samme uke og liste.'
          : result === 'copied'
            ? 'Lenken er kopiert. Lim den inn i en melding til samboer.'
            : 'Fikk ikke delt. Prøv «Kopier lenken».',
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt');
    } finally {
      setBusy(false);
    }
  }

  async function join() {
    const token = tokenFromText(joinText);
    if (!token) {
      setError('Fant ingen gyldig lenke. Lim inn hele lenken du fikk.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await joinHousehold(token);
      setJoinText('');
      setMessage('Du er med! Ukeplanen og handlelista er nå felles.');
      router.navigate('/uka');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke bli med');
    } finally {
      setBusy(false);
    }
  }

  async function leave() {
    if (!confirmLeave) {
      setConfirmLeave(true);
      return;
    }
    await leaveHousehold();
    setConfirmLeave(false);
    setMessage('Denne telefonen er ikke lenger med i husstanden.');
  }

  return (
    <Page maxWidth={720}>
      <BackLink label="Mer" href="/mer" />
      <View style={styles.header}>
        <Eyebrow>Samboer</Eyebrow>
        <Title size="lg">Del handlelista</Title>
        <Body>
          Dere ser samme ukeplan og samme handleliste, og det oppdateres mens dere bruker appen. Står du i butikken,
          får samboer se det og kan legge til varer med en gang.
        </Body>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Ditt navn</Text>
        <TextInput
          value={memberName}
          onChangeText={setMemberName}
          placeholder="F.eks. Martin"
          placeholderTextColor={colors.muted}
          style={styles.input}
          maxLength={40}
          accessibilityLabel="Ditt navn"
        />
        <Text style={styles.hint}>Vises som «Martin handler nå» og «Lagt til av Martin».</Text>
      </View>

      <View style={[styles.card, styles.cardLime]}>
        <View style={styles.statusRow}>
          <Ionicons
            name={householdToken ? (status === 'offline' ? 'cloud-offline-outline' : 'cloud-done-outline') : 'people-outline'}
            size={22}
            color={colors.ink}
          />
          <Text style={styles.status}>
            {householdToken
              ? status === 'offline'
                ? 'Delt, men uten nett nå. Endringer sendes når nettet er tilbake.'
                : 'Delt. Alt du gjør i uka og lista synkes.'
              : 'Ikke delt ennå.'}
          </Text>
        </View>
        <Button label={busy ? 'Vent …' : 'Del lenke med samboer'} icon="share-outline" onPress={share} disabled={busy} style={styles.button} />
        {householdToken && (
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              const result = await shareText('Handleklar', '', householdLink(householdToken)).catch(() => 'failed');
              setMessage(result === 'failed' ? 'Fikk ikke kopiert.' : 'Lenken er klar til å limes inn.');
            }}>
            <Text style={styles.link}>Kopier lenken</Text>
          </Pressable>
        )}
        <Text style={styles.hint}>Send lenken bare til de i husstanden. Den som har den, ser og kan endre lista.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Har du fått en lenke?</Text>
        <Text style={styles.hint}>
          Har du appen på hjemskjermen, åpner lenken seg i Safari. Lim den inn her i stedet, så blir appen din med.
        </Text>
        <TextInput
          value={joinText}
          onChangeText={setJoinText}
          placeholder="Lim inn lenken"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          accessibilityLabel="Lim inn lenke fra samboer"
        />
        <Button label="Bli med" icon="log-in-outline" variant="outline" onPress={join} disabled={busy || !joinText.trim()} style={styles.button} />
        {householdToken && (
          <Text style={styles.hint}>Blir du med i en annen husstand, byttes ukeplanen din ut med deres.</Text>
        )}
      </View>

      {message && <Text style={styles.message}>{message}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      {householdToken && (
        <Pressable accessibilityRole="button" onPress={leave} style={styles.leave}>
          <Text style={styles.leaveText}>
            {confirmLeave ? 'Trykk igjen for å forlate husstanden' : 'Forlat husstanden på denne telefonen'}
          </Text>
        </Pressable>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.xl },
  card: {
    backgroundColor: colors.beige,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  cardLime: { backgroundColor: colors.lime },
  label: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  input: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    minHeight: 48,
    outlineStyle: 'none',
  } as object,
  hint: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: colors.inkSoft },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  status: { flex: 1, fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.ink },
  button: { alignSelf: 'flex-start', marginTop: spacing.xs },
  link: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.green, textDecorationLine: 'underline' },
  message: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.green, marginBottom: spacing.md },
  error: { fontFamily: fonts.bodyMedium, fontSize: 15, color: colors.danger, marginBottom: spacing.md },
  leave: { paddingVertical: spacing.md },
  leaveText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.danger },
});
