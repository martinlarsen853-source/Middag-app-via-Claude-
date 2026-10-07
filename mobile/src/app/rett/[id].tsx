import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackLink, Body, Button, Eyebrow, Meta, Page, PersonStepper, Title } from '@/components/ui';
import { categoryTints, colors, defaultTint, fonts, radius, spacing } from '@/constants/theme';
import { MEALS } from '@/data/meals';
import { useLayout } from '@/lib/layout';
import { estimateMealPrice, formatQuantity, scaleQuantity } from '@/lib/meals';
import { photoFor } from '@/lib/photos';
import { useApp } from '@/lib/store';

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { persons, setPersons, stores, setActiveList, ready } = useApp();
  const { width } = useLayout();
  const twoColumns = width >= 900;

  const meal = MEALS.find(m => String(m.id) === String(id));

  if (!meal) {
    return (
      <Page maxWidth={720}>
        <BackLink label="Alle middager" href="/" />
        <Title size="md" style={{ marginTop: spacing.lg }}>Fant ikke retten</Title>
        <Body style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}>Den kan ha blitt fjernet fra lista.</Body>
        <Button label="Til middagene" onPress={() => router.replace('/')} style={{ alignSelf: 'flex-start' }} />
      </Page>
    );
  }

  function startShopping(storeId: string) {
    if (!meal) return;
    setActiveList({ mealId: meal.id, storeId });
    router.navigate('/handleliste');
  }

  const image = (
    <View
      style={[
        styles.image,
        { backgroundColor: categoryTints[meal.category] ?? defaultTint },
        width >= 600 && !twoColumns && { aspectRatio: 16 / 9 },
        twoColumns && styles.imageWide,
      ]}>
      <Image source={{ uri: photoFor(meal) }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} accessibilityLabel={meal.name} />
    </View>
  );

  const info = (
    <View style={[styles.infoCard, twoColumns && styles.infoCardWide]}>
      <View style={styles.tag}>
        <Text style={styles.tagText}>{meal.category}</Text>
      </View>
      <Title size="lg">{meal.name}</Title>
      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Meta icon="time-outline">{meal.timeMinutes} min</Meta>
        </View>
        <View style={styles.metaChip}>
          <Meta icon="wallet-outline">ca. {estimateMealPrice(meal, persons)} kr</Meta>
        </View>
      </View>
      <Body>{meal.description}</Body>
      <View style={styles.personRow}>
        <PersonStepper value={persons} onChange={setPersons} />
      </View>

      <View style={styles.shopSection}>
        <Eyebrow>Lag handleliste i</Eyebrow>
        <View style={styles.storeTiles}>
          {ready &&
            stores.map(store => (
              <Pressable
                key={store.id}
                accessibilityRole="button"
                accessibilityLabel={`Lag handleliste i ${store.name}`}
                onPress={() => startShopping(store.id)}
                style={({ hovered, pressed }: { pressed: boolean; hovered?: boolean }) => [
                  styles.storeTile,
                  (hovered || pressed) && styles.storeTileActive,
                ]}>
                <Ionicons name="storefront-outline" size={20} color={colors.ink} />
                <Text style={styles.storeTileText}>{store.name}</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.ink} />
              </Pressable>
            ))}
        </View>
      </View>
    </View>
  );

  const ingredients = (
    <View style={[styles.ingredientsCard, twoColumns && styles.ingredientsWide]}>
      <Title size="md">Ingredienser</Title>
      <Text style={styles.forPersons}>
        for {persons} {persons === 1 ? 'person' : 'personer'}
      </Text>
      <View style={styles.ingredientList}>
        {meal.ingredients.map((ingredient, index) => (
          <View key={`${ingredient.name}-${index}`} style={[styles.ingredientRow, index > 0 && styles.divider]}>
            <Text style={styles.ingredientAmount}>
              {formatQuantity(scaleQuantity(ingredient.quantity, persons), ingredient.unit)}
            </Text>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const steps = (
    <View style={styles.steps}>
      <Title size="md">Slik gjør du</Title>
      {meal.steps.map((step, index) => (
        <View key={index} style={styles.stepRow}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <Body style={styles.stepText}>{step}</Body>
        </View>
      ))}
    </View>
  );

  return (
    <Page>
      <BackLink label="Alle middager" href="/" />
      {twoColumns ? (
        <>
          <View style={styles.row}>
            {info}
            {image}
          </View>
          <View style={[styles.row, styles.rowTop]}>
            {ingredients}
            {steps}
          </View>
        </>
      ) : (
        <View style={styles.stack}>
          {image}
          {info}
          {ingredients}
          {steps}
        </View>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xxl,
    marginTop: spacing.lg,
    alignItems: 'stretch',
  },
  rowTop: {
    alignItems: 'flex-start',
    marginTop: spacing.xxxl,
  },
  stack: {
    gap: spacing.xl,
    marginTop: spacing.sm,
  },
  image: {
    aspectRatio: 4 / 3,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  imageWide: {
    flex: 1.15,
    aspectRatio: undefined,
    minHeight: 440,
  },
  infoCard: {
    backgroundColor: colors.lime,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  infoCardWide: {
    flex: 1,
    padding: spacing.xxl,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.limeStrong,
    borderRadius: radius.round,
    paddingVertical: 5,
    paddingHorizontal: spacing.md,
  },
  tagText: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.ink,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaChip: {
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
  },
  personRow: {
    marginTop: spacing.xs,
  },
  shopSection: {
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.limeStrong,
  },
  storeTiles: {
    gap: spacing.sm,
  },
  storeTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: colors.bg,
  },
  storeTileActive: {
    borderColor: colors.ink,
  },
  storeTileText: {
    flex: 1,
    fontFamily: fonts.bodySemi,
    fontSize: 16,
    color: colors.ink,
  },
  ingredientsCard: {
    backgroundColor: colors.beige,
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  ingredientsWide: {
    width: 380,
    padding: spacing.xxl,
  },
  forPersons: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  ingredientList: {
    borderTopWidth: 1,
    borderTopColor: colors.beigeDark,
  },
  ingredientRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: colors.beigeDark,
  },
  ingredientAmount: {
    width: 88,
    fontFamily: fonts.monoMedium,
    fontSize: 14,
    lineHeight: 22,
    color: colors.ink,
  },
  ingredientName: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
    color: colors.ink,
  },
  steps: {
    flex: 1,
    gap: spacing.lg,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: radius.round,
    backgroundColor: colors.limeStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.ink,
  },
  stepText: {
    flex: 1,
    paddingTop: 5,
    fontSize: 17,
    lineHeight: 26,
    color: colors.ink,
  },
});
