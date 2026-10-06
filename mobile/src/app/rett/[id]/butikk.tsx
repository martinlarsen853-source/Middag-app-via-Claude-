import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/constants/theme';
import { STOPS } from '@/lib/stops';
import { useApp } from '@/lib/store';

export default function StorePickerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stores, ready } = useApp();

  if (!ready) return null;

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
      <Text style={styles.intro}>
        Hvilken butikk står du i? Handlelista følger ruten gjennom akkurat den butikken.
      </Text>

      {stores.map(store => (
        <Pressable
          key={store.id}
          onPress={() => router.push(`/rett/${id}/handleliste/${store.id}`)}
          style={({ pressed }) => [styles.storeCard, pressed && styles.storeCardPressed]}>
          <View style={styles.storeText}>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeRoute} numberOfLines={1}>
              Starter med {STOPS[store.stops[0]].toLowerCase()}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}

      <Pressable onPress={() => router.push('/butikker')} style={styles.manageLink}>
        <Text style={styles.manageLinkText}>Legg til eller endre butikker</Text>
      </Pressable>
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
    minHeight: 72,
  },
  storeCardPressed: {
    opacity: 0.85,
  },
  storeText: {
    flex: 1,
    gap: 2,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  storeRoute: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  chevron: {
    fontSize: 26,
    color: colors.textTertiary,
    marginLeft: spacing.md,
  },
  manageLink: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  manageLinkText: {
    fontSize: 14,
    color: colors.accentDark,
    textDecorationLine: 'underline',
  },
});
