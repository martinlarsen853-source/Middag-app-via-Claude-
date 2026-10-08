import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Title } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import type { Meal } from '@/data/meals';
import { buildRequest, facts, fetchSuggestions, GOALS, type Goal, type Suggestions } from '@/lib/forslag';
import type { PriceBook } from '@/lib/prices';
import type { PlanEntry } from '@/lib/shopping';

type Planned = { entry: PlanEntry; meal: Meal };

// «Forbedre uka»: velg et mål, få forslag til bytter og gjør byttet med ett trykk.
export function WeekSuggestions({
  planned,
  candidates,
  mine,
  chain,
  storeName,
  book,
  findMeal,
  onSwap,
  onOpen,
}: {
  planned: Planned[];
  candidates: Meal[];
  mine: Set<string>;
  chain: string | null;
  storeName: string | null;
  book: PriceBook;
  findMeal: (id: string) => Meal | undefined;
  onSwap: (entryId: string, mealId: string) => void;
  onOpen: (mealId: string) => void;
}) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Suggestions | null>(null);
  const [done, setDone] = useState<Record<string, string>>({});
  // Middagene slik de var da vi spurte, så kortet viser «fra → til» også etter byttet.
  const [before, setBefore] = useState<Record<string, Meal>>({});

  if (planned.length === 0) return null;

  async function ask(next: Goal) {
    setGoal(next);
    setLoading(true);
    setResult(null);
    setDone({});
    setBefore(Object.fromEntries(planned.map(item => [item.entry.id, item.meal])));
    const request = buildRequest(next, planned, candidates, mine, chain, storeName, book);
    setResult(await fetchSuggestions(request));
    setLoading(false);
  }

  return (
    <View style={styles.card} accessibilityLabel="Forbedre uka">
      <Title size="sm">Forbedre uka</Title>
      <Text style={styles.sub}>Velg hva du vil oppnå, så får du forslag til bytter du kan gjøre med ett trykk.</Text>
      <View style={styles.goals}>
        {GOALS.map(option => (
          <Pressable
            key={option.key}
            accessibilityRole="button"
            aria-selected={goal === option.key}
            disabled={loading}
            onPress={() => ask(option.key)}
            style={[styles.goal, goal === option.key && styles.goalOn]}>
            <Ionicons name={option.icon} size={16} color={colors.ink} />
            <Text style={styles.goalText}>{option.label}</Text>
          </Pressable>
        ))}
      </View>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.ink} />
          <Text style={styles.loadingText}>Ser på uka …</Text>
        </View>
      )}

      {result && !loading && (
        <View style={styles.result}>
          {result.summary ? <Text style={styles.summary}>{result.summary}</Text> : null}
          {result.swaps.map(swap => {
            const entry = planned.find(p => p.entry.id === swap.entryId)?.entry;
            const from = before[swap.entryId];
            const to = findMeal(swap.mealId);
            if (!entry || !from || !to) return null;
            const persons = entry.persons;
            const old = facts(from, persons, chain, book);
            const next = facts(to, persons, chain, book);
            const saving = (old.pricePerPortion - next.pricePerPortion) * persons;
            const protein = next.protein - old.protein;
            const changed = done[swap.entryId] === swap.mealId;
            return (
              <View key={swap.entryId} style={styles.swap}>
                <Pressable accessibilityRole="link" accessibilityLabel={`Se ${to.name}`} onPress={() => onOpen(String(to.id))}>
                  <Text style={styles.swapTitle}>
                    {from.name} <Text style={styles.arrow}>→</Text> {to.name}
                  </Text>
                </Pressable>
                <Text style={styles.swapNumbers}>
                  {[
                    saving >= 5 ? `Spar ca. ${saving} kr` : saving <= -5 ? `Ca. ${-saving} kr dyrere` : 'Omtrent samme pris',
                    protein >= 3 ? `+${protein} g protein` : protein <= -3 ? `${protein} g protein` : null,
                    next.fish && !old.fish ? 'fisk' : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </Text>
                {swap.reason ? <Text style={styles.reason}>{swap.reason}</Text> : null}
                {changed ? (
                  <View style={styles.doneRow}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.green} />
                    <Text style={styles.doneText}>Byttet</Text>
                  </View>
                ) : (
                  <Button
                    label="Bytt"
                    icon="swap-horizontal"
                    variant="lime"
                    onPress={() => {
                      onSwap(swap.entryId, String(to.id));
                      setDone(current => ({ ...current, [swap.entryId]: swap.mealId }));
                    }}
                    accessibilityLabel={`Bytt ${from.name} med ${to.name}`}
                    style={styles.swapButton}
                  />
                )}
              </View>
            );
          })}
          {result.tips.map((tip, index) => (
            <View key={index} style={styles.tip}>
              <Ionicons name="bulb-outline" size={16} color={colors.ink} style={styles.tipIcon} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
          <Text style={styles.note}>
            {result.note ?? 'Forslag fra AI (Claude). Prisene og næringen er regnet ut i appen.'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  goals: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  goal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.round,
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.bg,
  },
  goalOn: {
    borderColor: colors.ink,
  },
  goalText: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.ink,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.inkSoft,
  },
  result: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  summary: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
  },
  swap: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 4,
  },
  swapTitle: {
    fontFamily: fonts.display,
    fontSize: 21,
    lineHeight: 24,
    color: colors.ink,
  },
  arrow: {
    color: colors.green,
  },
  swapNumbers: {
    fontFamily: fonts.monoMedium,
    fontSize: 13,
    color: colors.green,
  },
  reason: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.inkSoft,
  },
  swapButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
  },
  doneText: {
    fontFamily: fonts.bodySemi,
    fontSize: 14,
    color: colors.green,
  },
  tip: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  tipIcon: {
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.inkSoft,
  },
});
