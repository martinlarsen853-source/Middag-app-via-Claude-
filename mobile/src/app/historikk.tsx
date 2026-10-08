import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BackLink, Body, Eyebrow, Page, Title } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { useHistory } from '@/lib/history';

const DATE = new Intl.DateTimeFormat('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' });

export default function HistoryScreen() {
  const { trips } = useHistory();
  const [open, setOpen] = useState<string | null>(null);
  const monthTotal = trips
    .filter(trip => Date.now() - trip.at < 30 * 86400000)
    .reduce((sum, trip) => sum + trip.total, 0);

  return (
    <Page maxWidth={760}>
      <BackLink label="Mer" href="/mer" />
      <View style={styles.header}>
        <Eyebrow>Historikk</Eyebrow>
        <Title size="lg">Handleturer</Title>
        {trips.length > 0 && <Body>Siste 30 dager: ca. {Math.round(monthTotal)} kr på middager og varer fra lista.</Body>}
      </View>

      {trips.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={32} color={colors.ink} />
          <Body>Når du trykker «Ferdig handlet», lagres handleturen her.</Body>
        </View>
      ) : (
        <View style={styles.list}>
          {trips.map(trip => {
            const expanded = open === trip.id;
            return (
              <Pressable
                key={trip.id}
                accessibilityRole="button"
                accessibilityLabel={`Handletur ${DATE.format(trip.at)}`}
                onPress={() => setOpen(expanded ? null : trip.id)}
                style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.cardText}>
                    <Text style={styles.date}>{DATE.format(trip.at)}</Text>
                    <Text style={styles.title} numberOfLines={2}>
                      {trip.meals.length ? trip.meals.map(meal => meal.name).join(', ') : 'Egne varer'}
                    </Text>
                    <Text style={styles.meta}>
                      {trip.storeName} · {trip.exact ? '' : 'ca. '}
                      {trip.total} kr{trip.by ? ` · ${trip.by}` : ''}
                    </Text>
                  </View>
                  <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.ink} />
                </View>
                {expanded && (
                  <View style={styles.items}>
                    {trip.items.map((item, index) => (
                      <View key={`${item.name}-${index}`} style={styles.item}>
                        <Text style={[styles.itemName, item.skipped && styles.skipped]}>{item.name}</Text>
                        <Text style={styles.itemAmount}>{item.skipped ? 'hoppet over' : item.amount}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.xl },
  empty: { backgroundColor: colors.beige, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.md, alignItems: 'flex-start' },
  list: { gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardText: { flex: 1, gap: 2 },
  date: { fontFamily: fonts.monoMedium, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: colors.inkSoft },
  title: { fontFamily: fonts.display, fontSize: 22, lineHeight: 24, color: colors.ink },
  meta: { fontFamily: fonts.mono, fontSize: 12, color: colors.inkSoft },
  items: { borderTopWidth: 1, borderTopColor: colors.line },
  item: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.line },
  itemName: { flex: 1, fontFamily: fonts.body, fontSize: 15, color: colors.ink },
  skipped: { color: colors.muted, textDecorationLine: 'line-through' },
  itemAmount: { fontFamily: fonts.mono, fontSize: 13, color: colors.inkSoft },
});
