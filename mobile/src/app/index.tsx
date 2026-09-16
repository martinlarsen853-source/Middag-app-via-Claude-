import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { categoryTints, colors, defaultTint, radius, spacing } from '@/constants/theme';
import { MEALS, type Meal } from '@/data/meals';
import { estimateMealPrice } from '@/lib/meals';
import { photoFor } from '@/lib/photos';
import { useApp } from '@/lib/store';

export default function MealListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { persons, setPersons } = useApp();
  const [query, setQuery] = useState('');

  const meals = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return MEALS;
    return MEALS.filter(
      meal =>
        meal.name.toLowerCase().includes(needle) ||
        meal.category.toLowerCase().includes(needle) ||
        meal.tags.some(tag => tag.toLowerCase().includes(needle)),
    );
  }, [query]);

  return (
    <FlatList
      data={meals}
      keyExtractor={meal => String(meal.id)}
      contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + spacing.xl }]}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.tagline}>Hva skal dere ha til middag?</Text>

          <View style={styles.personRow}>
            <Text style={styles.personLabel}>Antall personer</Text>
            <View style={styles.personControls}>
              <Pressable
                accessibilityLabel="Færre personer"
                onPress={() => setPersons(persons - 1)}
                style={styles.personButton}>
                <Text style={styles.personButtonText}>−</Text>
              </Pressable>
              <Text style={styles.personCount}>{persons}</Text>
              <Pressable
                accessibilityLabel="Flere personer"
                onPress={() => setPersons(persons + 1)}
                style={styles.personButton}>
                <Text style={styles.personButtonText}>+</Text>
              </Pressable>
            </View>
          </View>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Søk etter rett, type eller kategori"
            placeholderTextColor={colors.textTertiary}
            style={styles.search}
            autoCorrect={false}
          />
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Ingen treff</Text>
          <Text style={styles.emptyText}>Prøv et annet søkeord, eller tøm søkefeltet for å se alle rettene.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <MealCard meal={item} persons={persons} onPress={() => router.push(`/rett/${item.id}`)} />
      )}
    />
  );
}

function MealCard({ meal, persons, onPress }: { meal: Meal; persons: number; onPress: () => void }) {
  const tint = categoryTints[meal.category] ?? defaultTint;
  const price = estimateMealPrice(meal, persons);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={[styles.cardHero, { backgroundColor: tint }]}>
        <Image source={{ uri: photoFor(meal) }} style={styles.cardImage} contentFit="cover" transition={200} />
        <View style={styles.emojiBubble}>
          <Text style={styles.emoji}>{meal.emoji}</Text>
        </View>
        <View style={styles.timePill}>
          <Text style={styles.timePillText}>{meal.timeMinutes} min</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{meal.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {meal.description}
        </Text>
        <View style={styles.chipRow}>
          {meal.tags.slice(0, 2).map(tag => (
            <View key={tag} style={styles.chip}>
              <Text style={styles.chipText}>{tag}</Text>
            </View>
          ))}
          <View style={[styles.chip, styles.priceChip]}>
            <Text style={[styles.chipText, styles.priceChipText]}>ca. {price} kr</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  tagline: {
    fontSize: 15,
    color: colors.textSecond,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  personLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  personControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  personButton: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  personButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 22,
  },
  personCount: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    minWidth: 22,
    textAlign: 'center',
  },
  search: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: 15,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardHero: {
    height: 180,
    justifyContent: 'flex-end',
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emojiBubble: {
    position: 'absolute',
    left: spacing.md,
    bottom: spacing.md,
    width: 40,
    height: 40,
    borderRadius: radius.round,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  timePill: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.round,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  timePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  cardBody: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecond,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  chip: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  priceChip: {
    backgroundColor: colors.accentTint,
  },
  priceChipText: {
    color: colors.accentDark,
  },
  empty: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecond,
    textAlign: 'center',
  },
});
