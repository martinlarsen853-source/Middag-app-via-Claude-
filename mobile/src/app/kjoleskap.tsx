import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackLink, Body, Button, Chip, Eyebrow, Page, Title } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { useMeals } from '@/lib/meals-store';
import { photoFor } from '@/lib/photos';
import { daysUntil, expiryText, saveMeals, useShopping, type FridgeItem } from '@/lib/shopping';
import { useApp } from '@/lib/store';

const EXPIRY_CHOICES: { label: string; days: number | null }[] = [
  { label: 'I dag', days: 0 },
  { label: 'I morgen', days: 1 },
  { label: '3 dager', days: 3 },
  { label: '1 uke', days: 7 },
  { label: 'Holder seg', days: null },
];

function dateIn(days: number | null): string | null {
  if (days === null) return null;
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
}

// Kjøleskapet: det dere har hjemme, og middager som bruker det opp før det går ut.
export default function FridgeScreen() {
  const router = useRouter();
  const { persons } = useApp();
  const { meals, memberName } = useMeals();
  const { state, addFridge, removeFridge, addMeal, entryFor } = useShopping();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [expiryDays, setExpiryDays] = useState<number | null>(3);

  const items = Object.values(state.fridge).sort(
    (a, b) => (daysUntil(a.expires) ?? 999) - (daysUntil(b.expires) ?? 999) || a.addedAt - b.addedAt,
  );
  const suggestions = saveMeals(meals, items).slice(0, 4);

  function add() {
    const trimmed = name.trim();
    if (!trimmed) return;
    addFridge({
      name: trimmed[0].toUpperCase() + trimmed.slice(1),
      amount: amount.trim(),
      expires: dateIn(expiryDays),
      addedBy: memberName.trim() || null,
    });
    setName('');
    setAmount('');
  }

  return (
    <Page maxWidth={760}>
      <BackLink label="Mer" href="/mer" />
      <View style={styles.header}>
        <Eyebrow>Kjøleskap</Eyebrow>
        <Title size="lg">Det dere har hjemme</Title>
        <Body>Legg inn rester og åpnede varer. Da foreslår appen middager som bruker dem opp, og handlelista sier fra om det du har.</Body>
      </View>

      <View style={styles.addCard}>
        <View style={styles.addRow}>
          <TextInput
            value={name}
            onChangeText={setName}
            onSubmitEditing={add}
            placeholder="Vare, f.eks. rømme"
            placeholderTextColor={colors.muted}
            style={[styles.input, styles.nameInput]}
            accessibilityLabel="Vare i kjøleskapet"
          />
          <TextInput
            value={amount}
            onChangeText={setAmount}
            onSubmitEditing={add}
            placeholder="Mengde"
            placeholderTextColor={colors.muted}
            style={[styles.input, styles.amountInput]}
            accessibilityLabel="Mengde"
          />
        </View>
        <Text style={styles.label}>Går ut</Text>
        <View style={styles.chips}>
          {EXPIRY_CHOICES.map(choice => (
            <Chip
              key={choice.label}
              label={choice.label}
              selected={expiryDays === choice.days}
              onPress={() => setExpiryDays(choice.days)}
            />
          ))}
        </View>
        <Button label="Legg i kjøleskapet" icon="add" onPress={add} disabled={!name.trim()} style={styles.addButton} />
      </View>

      {suggestions.length > 0 && (
        <View style={styles.section}>
          <Title size="md">Sparemiddag</Title>
          <Body>Middager som bruker opp det dere har, det som går ut først øverst.</Body>
          {suggestions.map(({ meal, uses, soonest }) => {
            const inWeek = Boolean(entryFor(meal.id));
            return (
              <View key={meal.id} style={styles.saveCard}>
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel={meal.name}
                  onPress={() => router.push(`/rett/${meal.id}`)}
                  style={styles.saveLink}>
                  <View style={styles.thumb}>
                    <Image source={{ uri: photoFor(meal) }} style={StyleSheet.absoluteFill} contentFit="cover" />
                  </View>
                  <View style={styles.saveText}>
                    <Text style={styles.saveName}>{meal.name}</Text>
                    <Text style={styles.saveUses} numberOfLines={2}>
                      Bruker opp {uses.map(item => item.name.toLowerCase()).join(', ')}
                    </Text>
                    {soonest !== null && soonest <= 2 && <Text style={styles.urgent}>{expiryText(dateIn(soonest))}</Text>}
                  </View>
                </Pressable>
                <Button
                  label={inWeek ? 'I uka' : 'Legg i uka'}
                  icon={inWeek ? 'checkmark' : 'calendar-outline'}
                  variant={inWeek ? 'secondary' : 'lime'}
                  onPress={() => !inWeek && addMeal(meal.id, persons)}
                  accessibilityLabel={inWeek ? `${meal.name} er i uka` : `Legg ${meal.name} i uka`}
                />
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.section}>
        <Title size="md">I kjøleskapet ({items.length})</Title>
        {items.length === 0 ? (
          <Body>Tomt. Når du trykker «Ferdig handlet», foreslår appen å legge restene her.</Body>
        ) : (
          <View style={styles.list}>
            {items.map(item => (
              <FridgeRow key={item.id} item={item} onRemove={() => removeFridge(item.id)} />
            ))}
          </View>
        )}
      </View>
    </Page>
  );
}

function FridgeRow({ item, onRemove }: { item: FridgeItem; onRemove: () => void }) {
  const days = daysUntil(item.expires);
  const urgent = days !== null && days <= 1;
  return (
    <View style={styles.row}>
      <View style={[styles.dot, urgent && styles.dotUrgent]} />
      <View style={styles.rowText}>
        <Text style={styles.rowName}>
          {item.name}
          {item.amount ? <Text style={styles.rowAmount}>  {item.amount}</Text> : null}
        </Text>
        <Text style={[styles.rowMeta, urgent && styles.urgent]}>
          {[expiryText(item.expires) ?? 'holder seg', item.addedBy ? `lagt inn av ${item.addedBy}` : null]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={`Brukt opp: ${item.name}`} onPress={onRemove} style={styles.used}>
        <Ionicons name="checkmark" size={16} color={colors.ink} />
        <Text style={styles.usedText}>Brukt</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.xl },
  addCard: { backgroundColor: colors.lime, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm },
  addRow: { flexDirection: 'row', gap: spacing.sm },
  input: {
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
    minHeight: 48,
    outlineStyle: 'none',
  } as object,
  nameInput: { flex: 2, minWidth: 0 },
  amountInput: { flex: 1, minWidth: 0 },
  label: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.inkSoft,
    marginTop: spacing.sm,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  addButton: { alignSelf: 'flex-start', marginTop: spacing.sm },
  section: { marginTop: spacing.xxl, gap: spacing.md },
  saveCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: spacing.md,
    gap: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  saveLink: { flex: 1, minWidth: 220, flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  thumb: { width: 64, height: 64, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.beige },
  saveText: { flex: 1, gap: 2 },
  saveName: { fontFamily: fonts.display, fontSize: 22, lineHeight: 24, color: colors.ink },
  saveUses: { fontFamily: fonts.body, fontSize: 14, color: colors.inkSoft },
  urgent: { fontFamily: fonts.monoMedium, fontSize: 12, color: colors.danger },
  list: { borderTopWidth: 1, borderTopColor: colors.line },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  dot: { width: 10, height: 10, borderRadius: radius.round, backgroundColor: colors.limeStrong },
  dotUrgent: { backgroundColor: colors.danger },
  rowText: { flex: 1, paddingVertical: spacing.sm, gap: 2 },
  rowName: { fontFamily: fonts.bodyMedium, fontSize: 16, color: colors.ink },
  rowAmount: { fontFamily: fonts.mono, fontSize: 14, color: colors.inkSoft },
  rowMeta: { fontFamily: fonts.mono, fontSize: 12, color: colors.muted },
  used: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    minHeight: 36,
    borderRadius: radius.round,
    backgroundColor: colors.beige,
  },
  usedText: { fontFamily: fonts.monoMedium, fontSize: 12, color: colors.ink },
});
