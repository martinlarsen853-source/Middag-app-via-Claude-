import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/constants/theme';
import { MEALS } from '@/data/meals';
import { buildShoppingList, formatQuantity, scaleQuantity } from '@/lib/meals';
import type { StopId } from '@/lib/stops';
import { useApp } from '@/lib/store';

export default function ShoppingListScreen() {
  const { id, butikk } = useLocalSearchParams<{ id: string; butikk: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { persons, checked, toggleChecked, clearChecked, stores, ready } = useApp();
  const [expanded, setExpanded] = useState<Set<StopId>>(new Set());

  const meal = MEALS.find(m => String(m.id) === String(id));
  const store = stores.find(s => s.id === String(butikk));

  const stops = useMemo(
    () => (meal && store ? buildShoppingList(meal, store.stops) : []),
    [meal, store],
  );

  if (!ready) return null;

  if (!meal || !store) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>Fant ikke handlelista</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Tilbake til middagene</Text>
        </Pressable>
      </View>
    );
  }

  // Avhuking følger retten, ikke butikken — bytter du butikk underveis beholdes det du har.
  const prefix = `${meal.id}:`;
  const isChecked = (index: number) => Boolean(checked[`${prefix}${index}`]);
  const total = meal.ingredients.length;
  const done = meal.ingredients.filter((_, index) => isChecked(index)).length;
  const allDone = total > 0 && done === total;
  const currentStop = stops.find(stop => stop.items.some(item => !isChecked(item.index)))?.stop;

  function finish() {
    clearChecked(prefix);
    router.dismissTo('/');
  }

  return (
    <>
      <Stack.Screen options={{ title: store.name }} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>{meal.name}</Text>
          <Text style={styles.summaryMeta}>
            {persons} {persons === 1 ? 'person' : 'personer'} · {done} av {total} i kurven
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${total ? (done / total) * 100 : 0}%` }]} />
          </View>
        </View>

        {allDone && (
          <View style={styles.donePanel}>
            <Text style={styles.doneTitle}>Alt er i kurven</Text>
            <Text style={styles.doneText}>God middag!</Text>
            <Pressable onPress={finish} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Ferdig handlet</Text>
            </Pressable>
          </View>
        )}

        {stops.map(stop => {
          const stopDone = stop.items.every(item => isChecked(item.index));
          const isCurrent = stop.stop === currentStop;
          const collapsed = stopDone && !expanded.has(stop.stop);

          if (collapsed) {
            return (
              <Pressable
                key={stop.stop}
                onPress={() => setExpanded(current => new Set(current).add(stop.stop))}
                style={styles.collapsedStop}>
                <Text style={styles.collapsedCheck}>✓</Text>
                <Text style={styles.collapsedLabel}>{stop.label}</Text>
                <Text style={styles.collapsedCount}>{stop.items.length}</Text>
              </Pressable>
            );
          }

          return (
            <View key={stop.stop} style={[styles.stop, isCurrent && styles.stopCurrent]}>
              <View style={styles.stopHeader}>
                <Text style={[styles.stopLabel, isCurrent && styles.stopLabelCurrent]}>{stop.label}</Text>
                {isCurrent && <Text style={styles.nextBadge}>Neste</Text>}
              </View>
              {stop.items.map((item, position) => {
                const itemChecked = isChecked(item.index);
                return (
                  <Pressable
                    key={item.index}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: itemChecked }}
                    onPress={() => toggleChecked(`${prefix}${item.index}`)}
                    style={[styles.itemRow, position > 0 && styles.rowDivider]}>
                    <View style={[styles.checkbox, itemChecked && styles.checkboxChecked]}>
                      {itemChecked && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={[styles.itemName, itemChecked && styles.itemChecked]}>{item.ingredient.name}</Text>
                    <Text style={[styles.itemAmount, itemChecked && styles.itemChecked]}>
                      {formatQuantity(scaleQuantity(item.ingredient.quantity, persons), item.ingredient.unit)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          );
        })}

        <Pressable onPress={() => router.push(`/butikker/${store.id}`)} style={styles.editLink}>
          <Text style={styles.editLinkText}>Stemmer ikke rekkefølgen? Endre den for {store.name}</Text>
        </Pressable>

        {done > 0 && !allDone && (
          <Pressable onPress={() => clearChecked(prefix)} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Nullstill huking</Text>
          </Pressable>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  summary: {
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  summaryMeta: {
    fontSize: 15,
    color: colors.textSecond,
  },
  progressTrack: {
    height: 6,
    borderRadius: radius.round,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  donePanel: {
    backgroundColor: colors.accentTint,
    borderRadius: radius.md,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  doneTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  doneText: {
    fontSize: 15,
    color: colors.textSecond,
    marginBottom: spacing.sm,
  },
  collapsedStop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  collapsedCheck: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.success,
  },
  collapsedLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textTertiary,
  },
  collapsedCount: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  stop: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  stopCurrent: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
  },
  stopLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textTertiary,
  },
  stopLabelCurrent: {
    color: colors.accent,
  },
  nextBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.surface,
    backgroundColor: colors.accent,
    borderRadius: radius.round,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    minHeight: 56,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkmark: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  itemName: {
    flex: 1,
    fontSize: 17,
    color: colors.text,
  },
  itemChecked: {
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  editLink: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  editLinkText: {
    fontSize: 14,
    color: colors.accentDark,
    textDecorationLine: 'underline',
    textAlign: 'center',
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
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
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
