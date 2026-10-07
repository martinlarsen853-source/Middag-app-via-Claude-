import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackLink, Body, Button, Eyebrow, Page, Title } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { STOPS } from '@/lib/stops';
import { useApp } from '@/lib/store';

export default function StoreEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { stores, moveStop, renameStore, removeStore, resetStore, ready } = useApp();
  const store = stores.find(s => s.id === String(id));

  const [name, setName] = useState(store?.name ?? '');
  // Tilbakestilling og sletting kan ikke angres, så de krever et ekstra trykk.
  const [confirming, setConfirming] = useState<'reset' | 'delete' | null>(null);

  useEffect(() => {
    if (store) setName(store.name);
  }, [store?.id]);

  if (!ready) return null;

  if (!store) {
    return (
      <Page maxWidth={760}>
        <BackLink label="Alle butikker" href="/butikker" />
        <Title size="md" style={{ marginTop: spacing.lg }}>Fant ikke butikken</Title>
        <Button label="Til butikkene" onPress={() => router.replace('/butikker')} style={{ alignSelf: 'flex-start', marginTop: spacing.xl }} />
      </Page>
    );
  }

  function commitName() {
    const trimmed = name.trim();
    if (store && trimmed && trimmed !== store.name) renameStore(store.id, trimmed);
    else if (store) setName(store.name);
  }

  function handleReset() {
    if (!store) return;
    if (confirming !== 'reset') return setConfirming('reset');
    resetStore(store.id);
    setConfirming(null);
  }

  function handleDelete() {
    if (!store) return;
    if (confirming !== 'delete') return setConfirming('delete');
    removeStore(store.id);
    router.replace('/butikker');
  }

  return (
    <Page maxWidth={760}>
      <BackLink label="Alle butikker" href="/butikker" />
      <View style={styles.header}>
        <Eyebrow>Rekkefølge i butikken</Eyebrow>
        <View style={styles.nameRow}>
          <TextInput
            value={name}
            onChangeText={setName}
            onEndEditing={commitName}
            onBlur={commitName}
            style={styles.nameInput}
            accessibilityLabel="Navn på butikken"
            returnKeyType="done"
          />
          <Ionicons name="pencil" size={18} color={colors.inkSoft} />
        </View>
        <Body>
          Gå gjennom butikken fra inngangen til kassa, og flytt stoppene så de kommer i den rekkefølgen du møter dem.
          Endringene lagres med en gang.
        </Body>
      </View>

      <View style={styles.list}>
        {store.stops.map((stop, index) => {
          const first = index === 0;
          const last = index === store.stops.length - 1;
          return (
            <View key={stop} style={[styles.row, index > 0 && styles.divider]}>
              <View style={styles.number}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <Text style={styles.label}>{STOPS[stop]}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Flytt ${STOPS[stop]} opp`}
                disabled={first}
                onPress={() => moveStop(store.id, index, index - 1)}
                style={({ hovered }: { pressed: boolean; hovered?: boolean }) => [
                  styles.arrow,
                  hovered && !first && styles.arrowHover,
                  first && styles.arrowDisabled,
                ]}>
                <Ionicons name="arrow-up" size={20} color={colors.ink} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Flytt ${STOPS[stop]} ned`}
                disabled={last}
                onPress={() => moveStop(store.id, index, index + 1)}
                style={({ hovered }: { pressed: boolean; hovered?: boolean }) => [
                  styles.arrow,
                  hovered && !last && styles.arrowHover,
                  last && styles.arrowDisabled,
                ]}>
                <Ionicons name="arrow-down" size={20} color={colors.ink} />
              </Pressable>
            </View>
          );
        })}
      </View>

      <View style={styles.actions}>
        {store.custom ? (
          <Button
            label={confirming === 'delete' ? 'Trykk igjen for å slette' : 'Slett butikken'}
            icon="trash-outline"
            variant="outline"
            onPress={handleDelete}
          />
        ) : (
          <Button
            label={confirming === 'reset' ? 'Trykk igjen for å tilbakestille' : 'Tilbakestill rekkefølgen'}
            icon="refresh"
            variant="secondary"
            onPress={handleReset}
          />
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.line,
  },
  nameInput: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 40,
    color: colors.ink,
    paddingVertical: spacing.xs,
    outlineStyle: 'none',
  } as object,
  list: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 64,
    paddingVertical: spacing.sm,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  number: {
    width: 32,
    height: 32,
    borderRadius: radius.round,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontFamily: fonts.monoMedium,
    fontSize: 13,
    color: colors.ink,
  },
  label: {
    flex: 1,
    fontFamily: fonts.bodyMedium,
    fontSize: 17,
    color: colors.ink,
  },
  arrow: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowHover: {
    backgroundColor: colors.limeStrong,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  actions: {
    marginTop: spacing.xl,
    flexDirection: 'row',
  },
});
