import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { categoryTints, colors, defaultTint, radius, spacing } from '@/constants/theme';
import { MEALS } from '@/data/meals';
import { estimateMealPrice, formatQuantity, scaleQuantity } from '@/lib/meals';
import { photoFor } from '@/lib/photos';
import { useApp } from '@/lib/store';

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { persons, setPersons } = useApp();

  const meal = MEALS.find(m => String(m.id) === String(id));

  if (!meal) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingTitle}>Fant ikke retten</Text>
        <Pressable onPress={() => router.replace('/')} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Tilbake til middagene</Text>
        </Pressable>
      </View>
    );
  }

  const tint = categoryTints[meal.category] ?? defaultTint;

  return (
    <>
      <Stack.Screen options={{ title: meal.name }} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
        <View style={[styles.hero, { backgroundColor: tint }]}>
          <Image source={{ uri: photoFor(meal) }} style={styles.heroImage} contentFit="cover" transition={200} />
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{meal.name}</Text>
          <Text style={styles.description}>{meal.description}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{meal.timeMinutes} min</Text>
            <Text style={styles.metaDivider}>·</Text>
            <Text style={styles.meta}>{meal.category}</Text>
            <Text style={styles.metaDivider}>·</Text>
            <Text style={[styles.meta, styles.metaPrice]}>ca. {estimateMealPrice(meal, persons)} kr</Text>
          </View>
        </View>

        <View style={styles.personCard}>
          <View>
            <Text style={styles.personLabel}>Antall personer</Text>
            <Text style={styles.personHint}>Mengdene justeres automatisk</Text>
          </View>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredienser</Text>
          <View style={styles.card}>
            {meal.ingredients.map((ingredient, index) => (
              <View
                key={`${ingredient.name}-${index}`}
                style={[styles.ingredientRow, index > 0 && styles.rowDivider]}>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                <Text style={styles.ingredientAmount}>
                  {formatQuantity(scaleQuantity(ingredient.quantity, persons), ingredient.unit)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Slik lager du den</Text>
          <View style={styles.card}>
            {meal.steps.map((step, index) => (
              <View key={index} style={[styles.stepRow, index > 0 && styles.rowDivider]}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable onPress={() => router.push(`/rett/${meal.id}/butikk`)} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Lag handleliste</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  hero: {
    height: 220,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  heroImage: {
    flex: 1,
  },
  titleBlock: {
    gap: spacing.sm,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecond,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  meta: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecond,
  },
  metaPrice: {
    color: colors.accentDark,
  },
  metaDivider: {
    color: colors.textTertiary,
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  personLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  personHint: {
    fontSize: 13,
    color: colors.textTertiary,
    marginTop: 2,
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
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
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
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  ingredientName: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  ingredientAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: radius.round,
    backgroundColor: colors.accentTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accentDark,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecond,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
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
