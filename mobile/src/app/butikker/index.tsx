import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Body, Button, Eyebrow, Page, Title } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { STOPS } from '@/lib/stops';
import { useApp } from '@/lib/store';

export default function StoresScreen() {
  const router = useRouter();
  const { stores, addStore, ready } = useApp();
  const [newName, setNewName] = useState('');

  if (!ready) return null;

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    const id = addStore(name);
    setNewName('');
    router.push(`/butikker/${id}`);
  }

  return (
    <Page maxWidth={760}>
      <View style={styles.header}>
        <Eyebrow>Butikker</Eyebrow>
        <Title size="lg">Rekkefølgen i butikkene</Title>
        <Body>
          Hver butikk har en rute fra inngangen til kassa. Stemmer den ikke, åpner du butikken og flytter stoppene
          mens du står der.
        </Body>
      </View>

      <View style={styles.list}>
        {stores.map(store => (
          <Pressable
            key={store.id}
            accessibilityRole="link"
            accessibilityLabel={store.name}
            onPress={() => router.push(`/butikker/${store.id}`)}
            style={({ hovered, pressed }: { pressed: boolean; hovered?: boolean }) => [
              styles.storeCard,
              (hovered || pressed) && styles.storeCardHover,
            ]}>
            <View style={styles.storeIcon}>
              <Ionicons name="storefront-outline" size={22} color={colors.ink} />
            </View>
            <View style={styles.storeText}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeMeta} numberOfLines={1}>
                Starter med {STOPS[store.stops[0]].toLowerCase()}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.ink} />
          </Pressable>
        ))}
      </View>

      <View style={styles.addCard}>
        <Eyebrow>Ny butikk</Eyebrow>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder="F.eks. Kiwi Spydeberg"
          placeholderTextColor={colors.muted}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
          accessibilityLabel="Navn på ny butikk"
        />
        <Button label="Legg til" icon="add" onPress={handleAdd} disabled={!newName.trim()} style={styles.addButton} />
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  list: {
    gap: spacing.md,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.line,
    padding: spacing.lg,
    minHeight: 76,
  },
  storeCardHover: {
    borderColor: colors.ink,
  },
  storeIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.round,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeText: {
    flex: 1,
    gap: 2,
  },
  storeName: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 28,
    color: colors.ink,
  },
  storeMeta: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.inkSoft,
  },
  addCard: {
    marginTop: spacing.xxl,
    backgroundColor: colors.beige,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.ink,
  },
  addButton: {
    alignSelf: 'flex-start',
  },
});
