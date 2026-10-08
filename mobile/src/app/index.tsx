import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Body, Button, Eyebrow, Meta, Page, PersonStepper, Title } from '@/components/ui';
import { categoryTints, colors, defaultTint, fonts, radius, spacing } from '@/constants/theme';
import type { Meal } from '@/data/meals';
import { useLayout } from '@/lib/layout';
import { useMeals } from '@/lib/meals-store';
import { formatPrice, mealEans, pricesByStore, usePrices, type PriceBook } from '@/lib/prices';
import { useShopping } from '@/lib/shopping';
import { photoFor } from '@/lib/photos';
import { useApp } from '@/lib/store';

export default function MealListScreen() {
  const router = useRouter();
  const { persons, setPersons, stores } = useApp();
  const { entryFor, addMeal, removeEntry } = useShopping();
  const { meals: allMeals } = useMeals();
  const { contentWidth, columns, wide } = useLayout();
  const [query, setQuery] = useState('');
  const { book } = usePrices(mealEans(allMeals));

  const meals = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return allMeals;
    return allMeals.filter(
      meal =>
        meal.name.toLowerCase().includes(needle) ||
        meal.category.toLowerCase().includes(needle) ||
        meal.tags.some(tag => tag.toLowerCase().includes(needle)) ||
        meal.ingredients.some(ing => ing.name.toLowerCase().includes(needle)),
    );
  }, [query, allMeals]);

  const gap = wide ? spacing.xl : spacing.lg;
  const cardWidth = Math.floor((contentWidth - gap * (columns - 1)) / columns);

  return (
    <Page>
      <View style={[styles.hero, wide && styles.heroWide]}>
        <View style={styles.heroText}>
          <Eyebrow>Deres faste middager</Eyebrow>
          <Title size="xl">Hva blir det til middag?</Title>
          <Body style={styles.heroBody}>
            Trykk + for å legge middager i uka, eller velg én og handle med en gang. Lista følger alltid butikkens rute.
          </Body>
        </View>
        <View style={[styles.controls, wide && styles.controlsWide]}>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.inkSoft} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Søk i middagene"
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
              autoCorrect={false}
              accessibilityLabel="Søk i middagene"
            />
            {query.length > 0 && (
              <Pressable accessibilityLabel="Tøm søket" onPress={() => setQuery('')} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.muted} />
              </Pressable>
            )}
          </View>
          <View style={styles.controlRow}>
            <PersonStepper value={persons} onChange={setPersons} />
            <Button label="Ny middag" icon="add" variant="lime" onPress={() => router.push('/ny-middag')} />
          </View>
        </View>
      </View>

      {meals.length === 0 ? (
        <View style={styles.empty}>
          <Title size="sm">Ingen treff på «{query}»</Title>
          <Body>Prøv et annet ord, eller tøm søket for å se alle middagene.</Body>
        </View>
      ) : (
        <View style={[styles.grid, { gap }]}>
          {meals.map(meal => (
            <MealCard
              key={meal.id}
              meal={meal}
              width={cardWidth}
              persons={persons}
              stores={stores}
              book={book}
              inWeek={Boolean(entryFor(meal.id))}
              onToggleWeek={() => {
                const entry = entryFor(meal.id);
                if (entry) removeEntry(entry.id);
                else addMeal(meal.id, persons);
              }}
              onPress={() => router.push(`/rett/${meal.id}`)}
            />
          ))}
        </View>
      )}
    </Page>
  );
}

function MealCard({
  meal,
  width,
  persons,
  stores,
  book,
  inWeek,
  onToggleWeek,
  onPress,
}: {
  meal: Meal;
  width: number;
  persons: number;
  stores: ReturnType<typeof useApp>['stores'];
  book: PriceBook;
  inWeek: boolean;
  onToggleWeek: () => void;
  onPress: () => void;
}) {
  const tint = categoryTints[meal.category] ?? defaultTint;
  // Kortet viser prisen i den billigste av butikkene dine.
  const best = pricesByStore(meal, persons, stores, book)[0];
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={meal.name}
      onPress={onPress}
      style={{ width }}>
      {({ hovered, pressed }: { pressed: boolean; hovered?: boolean }) => (
        <View style={pressed && { opacity: 0.85 }}>
          <View style={[styles.cardImage, { backgroundColor: tint }]}>
            <Image
              source={{ uri: photoFor(meal) }}
              style={[StyleSheet.absoluteFill, hovered && styles.cardImageHover]}
              contentFit="cover"
              transition={200}
              accessibilityLabel={meal.name}
            />
            <View style={styles.tags}>
              {inWeek && (
                <View style={styles.onListTag}>
                  <Ionicons name="calendar" size={13} color={colors.ink} />
                  <Text style={styles.onListText}>I uka</Text>
                </View>
              )}
              {meal.custom && (
                <View style={[styles.onListTag, styles.customTag]}>
                  <Ionicons name="person" size={12} color={colors.ink} />
                  <Text style={styles.onListText}>Egen</Text>
                </View>
              )}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={inWeek ? `Fjern ${meal.name} fra uka` : `Legg ${meal.name} i uka`}
              onPress={onToggleWeek}
              hitSlop={6}
              style={[styles.weekButton, inWeek && styles.weekButtonOn]}>
              <Ionicons name={inWeek ? 'checkmark' : 'add'} size={24} color={inWeek ? colors.limeStrong : colors.ink} />
            </Pressable>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.metaRow}>
              {meal.timeMinutes > 0 && <Meta icon="time-outline">{meal.timeMinutes} min</Meta>}
              {best && (
                <Meta icon="wallet-outline">
                  {formatPrice(best.price)}
                  {best.price.exact ? ` · ${best.store.name}` : ''}
                </Meta>
              )}
            </View>
            <Text style={[styles.cardTitle, hovered && styles.cardTitleHover]}>{meal.name}</Text>
            {meal.description ? (
              <Body style={styles.cardDescription} numberOfLines={2}>
                {meal.description}
              </Body>
            ) : null}
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing.xl,
    marginBottom: spacing.xxl,
  },
  heroWide: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.xxl,
  },
  heroText: {
    gap: spacing.sm,
    flexShrink: 1,
    maxWidth: 640,
  },
  heroBody: {
    marginTop: spacing.xs,
  },
  controls: {
    gap: spacing.md,
  },
  controlRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.md,
  },
  controlsWide: {
    alignItems: 'flex-end',
    minWidth: 320,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.beige,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    alignSelf: 'stretch',
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: spacing.md,
    outlineStyle: 'none',
  } as object,
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardImage: {
    aspectRatio: 4 / 3,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  cardImageHover: {
    transform: [{ scale: 1.03 }],
  },
  tags: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  weekButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: radius.round,
    backgroundColor: colors.limeStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekButtonOn: {
    backgroundColor: colors.ink,
  },
  customTag: {
    backgroundColor: colors.lavender,
  },
  onListTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.limeStrong,
    borderRadius: radius.sm,
    paddingVertical: 5,
    paddingHorizontal: spacing.sm,
  },
  onListText: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    color: colors.ink,
  },
  cardBody: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: 6,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 30,
    color: colors.ink,
  },
  cardTitleHover: {
    textDecorationLine: 'underline',
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  empty: {
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
});
