import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Title } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import type { Meal } from '@/data/meals';
import { mealNutrition, weekBalance } from '@/lib/nutrition';

// Ukas balanse etter Helsedirektoratets kostråd, med et konkret forslag når det
// er for lite fisk i uka.
export function WeekBalance({
  meals,
  candidates,
  onAdd,
  onOpen,
}: {
  meals: Meal[];
  candidates: Meal[]; // middager som kan foreslås, de du har selv først
  onAdd: (meal: Meal) => void;
  onOpen: (meal: Meal) => void;
}) {
  if (meals.length === 0) return null;
  const { tips, fishCount, avgProtein } = weekBalance(meals);
  const planned = new Set(meals.map(meal => String(meal.id)));
  const fishIdea = fishCount < 2 ? candidates.find(meal => !planned.has(String(meal.id)) && mealNutrition(meal).fish) : undefined;

  return (
    <View style={styles.card} accessibilityLabel="Ukas balanse">
      <Title size="sm">Ukas balanse</Title>
      <Text style={styles.sub}>Etter Helsedirektoratets kostråd · ca. {avgProtein} g protein per porsjon</Text>
      {tips.map(tip => (
        <View key={tip.key} style={styles.tip}>
          <Ionicons
            name={tip.tone === 'good' ? 'checkmark-circle' : 'bulb-outline'}
            size={18}
            color={tip.tone === 'good' ? colors.green : colors.ink}
            style={styles.tipIcon}
          />
          <Text style={styles.tipText}>{tip.text}</Text>
        </View>
      ))}
      {fishIdea && (
        <View style={styles.idea}>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={`Se ${fishIdea.name}`}
            onPress={() => onOpen(fishIdea)}
            style={styles.ideaText}>
            <Text style={styles.ideaLabel}>Forslag til fiskemiddag</Text>
            <Text style={styles.ideaName}>{fishIdea.name}</Text>
          </Pressable>
          <Button
            label="Legg i uka"
            icon="add"
            variant="lime"
            onPress={() => onAdd(fishIdea)}
            accessibilityLabel={`Legg ${fishIdea.name} i uka`}
          />
        </View>
      )}
      <Text style={styles.note}>Grove anslag ut fra råvarene, ikke medisinske råd.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  sub: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.inkSoft,
    marginBottom: spacing.xs,
  },
  tip: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
  },
  idea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  ideaText: {
    flex: 1,
    minWidth: 160,
  },
  ideaLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.inkSoft,
  },
  ideaName: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 24,
    color: colors.ink,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.xs,
  },
});
