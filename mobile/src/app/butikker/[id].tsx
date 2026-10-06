import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/constants/theme';
import { STOPS } from '@/lib/stops';
import { useApp } from '@/lib/store';

export default function StoreEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>Fant ikke butikken</Text>
        <Pressable onPress={() => router.replace('/butikker')} style={styles.dangerButton}>
          <Text style={styles.dangerButtonText}>Til butikkene</Text>
        </Pressable>
      </View>
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
    router.back();
  }

  return (
    <>
      <Stack.Screen options={{ title: store.name }} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
        keyboardShouldPersistTaps="handled">
        <TextInput
          value={name}
          onChangeText={setName}
          onEndEditing={commitName}
          onBlur={commitName}
          style={styles.nameInput}
          accessibilityLabel="Navn på butikken"
          returnKeyType="done"
        />

        <Text style={styles.intro}>
          Gå gjennom butikken fra inngangen til kassa, og flytt stoppene så de kommer i den rekkefølgen du møter dem.
          Endringene lagres med en gang.
        </Text>

        <View style={styles.list}>
          {store.stops.map((stop, index) => (
            <View key={stop} style={[styles.stopRow, index > 0 && styles.rowDivider]}>
              <Text style={styles.stopNumber}>{index + 1}</Text>
              <Text style={styles.stopLabel}>{STOPS[stop]}</Text>
              <Pressable
                accessibilityLabel={`Flytt ${STOPS[stop]} opp`}
                disabled={index === 0}
                onPress={() => moveStop(store.id, index, index - 1)}
                style={[styles.arrow, index === 0 && styles.arrowDisabled]}>
                <Text style={styles.arrowText}>↑</Text>
              </Pressable>
              <Pressable
                accessibilityLabel={`Flytt ${STOPS[stop]} ned`}
                disabled={index === store.stops.length - 1}
                onPress={() => moveStop(store.id, index, index + 1)}
                style={[styles.arrow, index === store.stops.length - 1 && styles.arrowDisabled]}>
                <Text style={styles.arrowText}>↓</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {store.custom ? (
          <Pressable onPress={handleDelete} style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>
              {confirming === 'delete' ? 'Trykk igjen for å slette' : 'Slett butikken'}
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={handleReset} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              {confirming === 'reset' ? 'Trykk igjen for å tilbakestille' : 'Tilbakestill rekkefølgen'}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecond,
  },
  list: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 56,
  },
  stopNumber: {
    width: 26,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textTertiary,
    textAlign: 'center',
  },
  stopLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  arrowText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  secondaryButton: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecond,
  },
  dangerButton: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accentDark,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  missingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
});
