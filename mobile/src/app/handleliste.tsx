import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Body, Button, Chip, Eyebrow, Meta, Page, Title } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { buildShoppingList, displayAmount, mealBase } from '@/lib/meals';
import { useMeals } from '@/lib/meals-store';
import { chainFor, formatPrice, isPantry, mealEans, mealPrice, usePrices } from '@/lib/prices';
import type { StopId } from '@/lib/stops';
import { useApp } from '@/lib/store';

export default function ShoppingListScreen() {
  const router = useRouter();
  const { activeList, setActiveList, persons, checked, toggleChecked, clearChecked, stores, ready } = useApp();
  const [expanded, setExpanded] = useState<Set<StopId>>(new Set());
  const { findMeal, loading } = useMeals();

  const meal = findMeal(activeList?.mealId);
  // Er butikken slettet siden lista ble laget, bruker vi den første butikken.
  const store = stores.find(s => s.id === activeList?.storeId) ?? stores[0];

  const stops = useMemo(() => (meal && store ? buildShoppingList(meal, store.stops) : []), [meal, store]);
  const { book } = usePrices(meal ? mealEans([meal]) : []);

  // En egen middag kan fortsatt være på vei fra databasen.
  if (!ready || (!meal && activeList && loading)) return null;

  if (!meal || !store) {
    return (
      <Page maxWidth={760}>
        <View style={styles.emptyCard}>
          <Ionicons name="basket-outline" size={40} color={colors.ink} />
          <Eyebrow>Handleliste</Eyebrow>
          <Title size="md">Ingen handleliste ennå</Title>
          <Body style={styles.center}>Velg en middag, så lager vi lista i den rekkefølgen du går gjennom butikken.</Body>
          <Button label="Velg middag" icon="restaurant-outline" onPress={() => router.navigate('/')} />
        </View>
      </Page>
    );
  }

  // Avhuking følger retten, ikke butikken — bytter du butikk underveis beholdes det du har.
  const prefix = `${meal.id}:`;
  const isChecked = (index: number) => Boolean(checked[`${prefix}${index}`]);
  const total = meal.ingredients.length;
  const done = meal.ingredients.filter((_, index) => isChecked(index)).length;
  const allDone = total > 0 && done === total;
  const currentStop = stops.find(stop => stop.items.some(item => !isChecked(item.index)))?.stop;
  const base = mealBase(meal);
  const price = mealPrice(meal, persons, chainFor(store), book);

  function finish() {
    clearChecked(prefix);
    setActiveList(null);
    router.navigate('/');
  }

  return (
    <Page maxWidth={760}>
      <View style={styles.header}>
        <Eyebrow>Handleliste</Eyebrow>
        <Title size="lg">{meal.name}</Title>
        <View style={styles.metaRow}>
          <Meta icon="storefront-outline">{store.name}</Meta>
          <Meta icon="people-outline">
            {persons} {persons === 1 ? 'person' : 'personer'}
          </Meta>
          <Meta icon="basket-outline">
            {done} av {total} i kurven
          </Meta>
          <Meta icon="wallet-outline">{formatPrice(price)}</Meta>
        </View>
        <View style={styles.progressTrack} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: done }}>
          <View style={[styles.progressFill, { width: `${total ? (done / total) * 100 : 0}%` }]} />
        </View>
        <View style={styles.storeChips}>
          {stores.map(s => (
            <Chip
              key={s.id}
              label={s.name}
              selected={s.id === store.id}
              onPress={() => setActiveList({ mealId: meal.id, storeId: s.id })}
            />
          ))}
        </View>
      </View>

      {allDone && (
        <View style={styles.doneCard}>
          <Title size="md">Alt er i kurven</Title>
          <Body>God middag! Trykk ferdig, så er lista klar til neste gang.</Body>
          <Button label="Ferdig handlet" icon="checkmark" onPress={finish} style={styles.doneButton} />
        </View>
      )}

      <View style={styles.stops}>
        {stops.map(stop => {
          const stopDone = stop.items.every(item => isChecked(item.index));
          const isCurrent = stop.stop === currentStop;
          const collapsed = stopDone && !expanded.has(stop.stop);

          if (collapsed) {
            return (
              <Pressable
                key={stop.stop}
                accessibilityRole="button"
                accessibilityLabel={`${stop.label}, ferdig. Trykk for å vise`}
                onPress={() => setExpanded(current => new Set(current).add(stop.stop))}
                style={styles.collapsed}>
                <Ionicons name="checkmark-circle" size={20} color={colors.green} />
                <Text style={styles.collapsedLabel}>{stop.label}</Text>
                <Text style={styles.collapsedCount}>{stop.items.length}</Text>
              </Pressable>
            );
          }

          return (
            <View key={stop.stop} style={[styles.stop, isCurrent && styles.stopCurrent]}>
              <View style={styles.stopHeader}>
                <Text style={styles.stopLabel}>{stop.label}</Text>
                {isCurrent ? (
                  <View style={styles.nextPill}>
                    <Text style={styles.nextPillText}>Neste</Text>
                  </View>
                ) : (
                  <Text style={styles.stopCount}>
                    {stop.items.filter(item => isChecked(item.index)).length}/{stop.items.length}
                  </Text>
                )}
              </View>
              {stop.items.map(item => {
                const itemChecked = isChecked(item.index);
                return (
                  <Pressable
                    key={item.index}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: itemChecked }}
                    accessibilityLabel={item.ingredient.name}
                    onPress={() => toggleChecked(`${prefix}${item.index}`)}
                    style={styles.item}>
                    <View style={[styles.checkbox, itemChecked && styles.checkboxChecked]}>
                      {itemChecked && <Ionicons name="checkmark" size={18} color={colors.limeStrong} />}
                    </View>
                    <View style={styles.itemText}>
                      <Text style={[styles.itemName, itemChecked && styles.itemDone]}>{item.ingredient.name}</Text>
                      {isPantry(item.ingredient) && !itemChecked && (
                        <Text style={styles.itemHint}>Sjekk om du har hjemme</Text>
                      )}
                    </View>
                    <Text style={[styles.itemAmount, itemChecked && styles.itemDone]}>
                      {displayAmount(item.ingredient, persons, base)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Pressable accessibilityRole="link" onPress={() => router.push(`/butikker/${store.id}`)} style={styles.footerLink}>
          <Ionicons name="swap-vertical" size={16} color={colors.green} />
          <Text style={styles.footerLinkText}>Stemmer ikke rekkefølgen? Endre den for {store.name}</Text>
        </Pressable>
        <View style={styles.footerButtons}>
          {done > 0 && !allDone && (
            <Button label="Nullstill huking" variant="secondary" onPress={() => clearChecked(prefix)} />
          )}
          <Button label="Bytt middag" variant="outline" onPress={() => router.navigate('/')} />
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: 'center',
  },
  emptyCard: {
    backgroundColor: colors.lime,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  progressTrack: {
    height: 8,
    borderRadius: radius.round,
    backgroundColor: colors.beige,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.round,
    backgroundColor: colors.ink,
  },
  storeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  doneCard: {
    backgroundColor: colors.lime,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  doneButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  stops: {
    gap: spacing.md,
  },
  collapsed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.beige,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
  collapsedLabel: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.inkSoft,
  },
  collapsedCount: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.muted,
  },
  stop: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  stopCurrent: {
    backgroundColor: colors.lime,
    borderColor: colors.limeStrong,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  stopLabel: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.ink,
  },
  stopCount: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.muted,
  },
  nextPill: {
    backgroundColor: colors.ink,
    borderRadius: radius.round,
    paddingVertical: 4,
    paddingHorizontal: spacing.md,
  },
  nextPillText: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.limeStrong,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 60,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: radius.round,
    borderWidth: 2,
    borderColor: colors.inkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  checkboxChecked: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  itemText: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  itemHint: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  itemName: {
    fontFamily: fonts.bodyMedium,
    fontSize: 17,
    color: colors.ink,
  },
  itemAmount: {
    fontFamily: fonts.monoMedium,
    fontSize: 15,
    color: colors.ink,
  },
  itemDone: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  footer: {
    marginTop: spacing.xxl,
    gap: spacing.lg,
  },
  footerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  footerLinkText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.green,
    textDecorationLine: 'underline',
    flexShrink: 1,
  },
  footerButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});
