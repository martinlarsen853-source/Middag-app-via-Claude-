import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/constants/theme';
import { STORES } from '@/data/meals';

export default function StorePickerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
      <Text style={styles.intro}>
        Hvilken butikk står du i? Handlelista sorteres etter hvor varene ligger i akkurat den butikken.
      </Text>

      {STORES.map(store => (
        <Pressable
          key={store.id}
          onPress={() => router.push(`/rett/${id}/handleliste/${store.id}`)}
          style={({ pressed }) => [styles.storeCard, pressed && styles.storeCardPressed]}>
          <View style={styles.storeText}>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeSections} numberOfLines={1}>
              Starter i {store.sectionOrder[0]?.toLowerCase()}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}
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
  },
  storeCardPressed: {
    opacity: 0.85,
  },
  storeText: {
    flex: 1,
    gap: 2,
  },
  storeName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  storeSections: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  chevron: {
    fontSize: 26,
    color: colors.textTertiary,
    marginLeft: spacing.md,
  },
});
