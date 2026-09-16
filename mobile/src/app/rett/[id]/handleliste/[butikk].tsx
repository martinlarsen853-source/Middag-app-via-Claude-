import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/constants/theme';
import { MEALS, STORES } from '@/data/meals';
import { buildShoppingList, formatQuantity, scaleQuantity } from '@/lib/meals';
import { useApp } from '@/lib/store';

export default function ShoppingListScreen() {
  const { id, butikk } = useLocalSearchParams<{ id: string; butikk: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { persons, checked, toggleChecked, clearChecked } = useApp();

  const meal = MEALS.find(m => String(m.id) === String(id));
  const store = STORES.find(s => String(s.id) === String(butikk));

  const sections = useMemo(
    () => (meal && store ? buildShoppingList(meal, store.sectionOrder) : []),
    [meal, store],
  );

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

  const prefix = `${meal.id}:${store.id}:`;
  const total = meal.ingredients.length;
  const done = meal.ingredients.filter((ing, index) => checked[`${prefix}${index}`]).length;

  let itemIndex = -1;

  return (
    <>
      <Stack.Screen options={{ title: store.name }} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>{meal.name}</Text>
          <Text style={styles.summaryMeta}>
            {persons} {persons === 1 ? 'person' : 'personer'} · {done} av {total} i kurven
          </Text>
        </View>

        {sections.map(section => (
          <View key={section.section} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.card}>
              {section.items.map((item, indexInSection) => {
                itemIndex += 1;
                const key = `${prefix}${itemIndex}`;
                const isChecked = Boolean(checked[key]);
                return (
                  <Pressable
                    key={key}
                    onPress={() => toggleChecked(key)}
                    style={[styles.itemRow, indexInSection > 0 && styles.rowDivider]}>
                    <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                      {isChecked && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={[styles.itemName, isChecked && styles.itemNameChecked]}>{item.name}</Text>
                    <Text style={[styles.itemAmount, isChecked && styles.itemNameChecked]}>
                      {formatQuantity(scaleQuantity(item.quantity, persons), item.unit)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        {done > 0 && (
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
    gap: spacing.lg,
  },
  summary: {
    gap: spacing.xs,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  summaryMeta: {
    fontSize: 14,
    color: colors.textSecond,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textTertiary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.hairline,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 1.5,
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
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  itemNameChecked: {
    color: colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  itemAmount: {
    fontSize: 15,
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
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
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
