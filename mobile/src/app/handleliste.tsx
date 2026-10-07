import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Body, Button, Chip, Eyebrow, Page, Title } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import type { Ingredient } from '@/data/meals';
import { buildShoppingList, displayAmount, mealBase } from '@/lib/meals';
import { useMeals } from '@/lib/meals-store';
import { chainFor, formatPrice, isPantry, mealEans, mealPrice, usePrices } from '@/lib/prices';
import { useApp } from '@/lib/store';

// Lista er snudd opp ned i forhold til en vanlig liste: det du skal hente neste
// står alltid øverst, og det du har tatt samles nederst i «I kurven», der du
// kan legge det tilbake med ett trykk. Slik slipper du å scrolle i butikken.
export default function ShoppingListScreen() {
  const router = useRouter();
  const { activeList, setActiveList, persons, checked, toggleChecked, clearChecked, stores, ready } = useApp();
  const { findMeal, loading } = useMeals();
  const [lastChecked, setLastChecked] = useState<number | null>(null);

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
  const base = mealBase(meal);
  const price = mealPrice(meal, persons, chainFor(store), book);
  const amount = (ingredient: Ingredient) => displayAmount(ingredient, persons, base, { shopping: true });

  // Stoppene med noe igjen, i gå-rekkefølge. Det første er «Neste».
  const remaining = stops
    .map(stop => ({ ...stop, items: stop.items.filter(item => !isChecked(item.index)) }))
    .filter(stop => stop.items.length > 0);
  // Det som er i kurven, i samme rekkefølge som du plukket det i butikken.
  const inBasket = stops.flatMap(stop => stop.items.filter(item => isChecked(item.index)));
  const undoItem = lastChecked !== null && isChecked(lastChecked) ? meal.ingredients[lastChecked] : undefined;

  function check(index: number) {
    toggleChecked(`${prefix}${index}`);
    setLastChecked(index);
  }

  function putBack(index: number) {
    toggleChecked(`${prefix}${index}`);
    setLastChecked(null);
  }

  function finish() {
    clearChecked(prefix);
    setActiveList(null);
    router.navigate('/');
  }

  return (
    <Page maxWidth={760}>
      <View style={styles.header}>
        <Text style={styles.eyebrowLine} numberOfLines={1}>
          Handleliste · {store.name} · {persons} {persons === 1 ? 'person' : 'personer'}
        </Text>
        <View style={styles.titleRow}>
          <Title size="sm" style={styles.title}>
            {meal.name}
          </Title>
          <Text style={styles.price}>{formatPrice(price)}</Text>
        </View>
        <View style={styles.progressRow}>
          <View
            style={styles.progressTrack}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: total, now: done }}>
            <View style={[styles.progressFill, { width: `${total ? (done / total) * 100 : 0}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {done} av {total} i kurven
          </Text>
        </View>
      </View>

      {undoItem && (
        <View style={styles.undoBar}>
          <Ionicons name="checkmark-circle" size={18} color={colors.green} />
          <Text style={styles.undoText} numberOfLines={1}>
            {undoItem.name} er i kurven
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Angre ${undoItem.name}`}
            onPress={() => lastChecked !== null && putBack(lastChecked)}
            hitSlop={8}>
            <Text style={styles.undoAction}>Angre</Text>
          </Pressable>
        </View>
      )}

      {allDone && (
        <View style={styles.doneCard}>
          <Title size="md">Alt er i kurven</Title>
          <Body>God middag! Trykk ferdig, så er lista klar til neste gang.</Body>
          <Button label="Ferdig handlet" icon="checkmark" onPress={finish} style={styles.doneButton} />
        </View>
      )}

      <View style={styles.stops}>
        {remaining.map((stop, position) => {
          const isNext = position === 0;
          return (
            <View key={stop.stop} style={[styles.stop, isNext && styles.stopNext]}>
              <View style={styles.stopHeader}>
                <Text style={[styles.stopLabel, !isNext && styles.stopLabelLater]}>{stop.label}</Text>
                {isNext ? (
                  <View style={styles.nextPill}>
                    <Text style={styles.nextPillText}>Neste</Text>
                  </View>
                ) : (
                  <Text style={styles.stopCount}>{stop.items.length} igjen</Text>
                )}
              </View>
              {stop.items.map(item => (
                <Pressable
                  key={item.index}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: false }}
                  accessibilityLabel={item.ingredient.name}
                  onPress={() => check(item.index)}
                  style={[styles.item, !isNext && styles.itemLater]}>
                  <View style={[styles.checkbox, !isNext && styles.checkboxLater]} />
                  <View style={styles.itemText}>
                    <Text style={[styles.itemName, !isNext && styles.itemNameLater]}>{item.ingredient.name}</Text>
                    {isPantry(item.ingredient) && <Text style={styles.itemHint}>Sjekk om du har hjemme</Text>}
                  </View>
                  <Text style={[styles.itemAmount, !isNext && styles.itemAmountLater]}>{amount(item.ingredient)}</Text>
                </Pressable>
              ))}
            </View>
          );
        })}
      </View>

      {inBasket.length > 0 && (
        <View style={styles.basket}>
          <View style={styles.basketHeader}>
            <Text style={styles.basketTitle}>I kurven ({inBasket.length})</Text>
            <Text style={styles.basketHint}>Trykk for å legge tilbake</Text>
          </View>
          {inBasket.map(item => (
            <Pressable
              key={item.index}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: true }}
              accessibilityLabel={item.ingredient.name}
              onPress={() => putBack(item.index)}
              style={styles.basketItem}>
              <View style={[styles.checkbox, styles.checkboxChecked]}>
                <Ionicons name="checkmark" size={16} color={colors.limeStrong} />
              </View>
              <Text style={styles.basketName}>{item.ingredient.name}</Text>
              <Text style={styles.basketAmount}>{amount(item.ingredient)}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Eyebrow>Butikk</Eyebrow>
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
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  eyebrowLine: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.inkSoft,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    flexShrink: 1,
  },
  price: {
    fontFamily: fonts.monoMedium,
    fontSize: 15,
    color: colors.ink,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: radius.round,
    backgroundColor: colors.beige,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.round,
    backgroundColor: colors.ink,
  },
  progressText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.inkSoft,
  },
  undoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.beige,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    marginBottom: spacing.md,
  },
  undoText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.inkSoft,
  },
  undoAction: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    color: colors.green,
    textDecorationLine: 'underline',
  },
  doneCard: {
    backgroundColor: colors.lime,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  doneButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  stops: {
    gap: spacing.md,
  },
  stop: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  stopNext: {
    backgroundColor: colors.lime,
    borderColor: colors.limeStrong,
    paddingTop: spacing.lg,
  },
  stopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  stopLabel: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.ink,
  },
  stopLabelLater: {
    fontSize: 20,
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
    minHeight: 64,
    borderTopWidth: 1,
    borderTopColor: colors.limeStrong,
  },
  itemLater: {
    minHeight: 52,
    borderTopColor: colors.line,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: radius.round,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  checkboxLater: {
    width: 26,
    height: 26,
    borderColor: colors.inkSoft,
  },
  checkboxChecked: {
    width: 26,
    height: 26,
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  itemText: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  itemName: {
    fontFamily: fonts.bodyMedium,
    fontSize: 18,
    color: colors.ink,
  },
  itemNameLater: {
    fontSize: 16,
  },
  itemHint: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  itemAmount: {
    fontFamily: fonts.monoMedium,
    fontSize: 16,
    color: colors.ink,
  },
  itemAmountLater: {
    fontSize: 14,
  },
  basket: {
    marginTop: spacing.xl,
    backgroundColor: colors.beige,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  basketHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  basketTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.ink,
  },
  basketHint: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.muted,
  },
  basketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 48,
    borderTopWidth: 1,
    borderTopColor: colors.beigeDark,
  },
  basketName: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  basketAmount: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  footer: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  storeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
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
