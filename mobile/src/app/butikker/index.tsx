import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/constants/theme';
import { useApp } from '@/lib/store';

export default function StoresScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    <ScrollView
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.intro}>
        Hver butikk har en rute fra inngangen til kassa. Trykk på en butikk for å rette rekkefølgen når du står der.
      </Text>

      {stores.map(store => (
        <Pressable
          key={store.id}
          onPress={() => router.push(`/butikker/${store.id}`)}
          style={({ pressed }) => [styles.storeCard, pressed && styles.pressed]}>
          <Text style={styles.storeName}>{store.name}</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}

      <View style={styles.addCard}>
        <Text style={styles.addLabel}>Ny butikk</Text>
        <TextInput
          value={newName}
          onChangeText={setNewName}
          placeholder="F.eks. Kiwi Spydeberg"
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <Pressable
          onPress={handleAdd}
          disabled={!newName.trim()}
          style={[styles.addButton, !newName.trim() && styles.addButtonDisabled]}>
          <Text style={styles.addButtonText}>Legg til</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecond,
    marginBottom: spacing.xs,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    minHeight: 64,
  },
  pressed: {
    opacity: 0.85,
  },
  storeName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  chevron: {
    fontSize: 26,
    color: colors.textTertiary,
  },
  addCard: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  addLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textTertiary,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});
